import express from 'express';
import admin from 'firebase-admin';
import fs from 'fs';
import cron from 'node-cron';
import multer from 'multer';
import OpenAI from 'openai';

const app = express();
const PORT = process.env.PORT || 4000;

const upload = multer({ dest: 'uploads/' });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TOKENS_FILE = new URL('./push-tokens.json', import.meta.url).pathname;
let pushTokens = [];

function loadTokens() {
  try {
    const data = fs.readFileSync(TOKENS_FILE, 'utf8');
    pushTokens = JSON.parse(data);
  } catch {
    pushTokens = [];
  }
}

function saveTokens() {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(pushTokens, null, 2));
}

loadTokens();

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  const credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({ credential: admin.credential.cert(credentials) });
}

app.use(express.json());

app.post('/api/push/register', (req, res) => {
  const { userId, token } = req.body;
  if (!userId || !token) {
    return res.status(400).json({ message: 'Missing parameters' });
  }
  if (!pushTokens.find(t => t.token === token)) {
    pushTokens.push({ userId, token });
    saveTokens();
  }
  res.json({ status: 'registered' });
});

app.post('/api/push/unregister', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Missing parameters' });
  }
  pushTokens = pushTokens.filter(t => t.token !== token);
  saveTokens();
  res.json({ status: 'unregistered' });
});

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file uploaded' });
  }
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: 'whisper-1',
    });
    fs.unlink(req.file.path, () => {});
    res.json({ text: transcription.text });
  } catch (err) {
    console.error('Transcription failed', err);
    res.status(500).json({ message: 'Transcription failed' });
  }
});

async function sendPushNotification(token, payload) {
  if (!admin.apps.length) return;
  try {
    await admin.messaging().send({ token, notification: payload });
  } catch (err) {
    console.error('Failed to send push notification', err);
  }
}

async function sendDailyReminders() {
  const notification = {
    title: 'Log Your Meals! \u{1F37D}',
    body: "Don't forget to track your daily consumption!",
  };
  for (const { token } of pushTokens) {
    await sendPushNotification(token, notification);
  }
}

cron.schedule('0 19 * * *', () => {
  sendDailyReminders();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
