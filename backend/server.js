import express from 'express';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import cron from 'node-cron';

const app = express();
const PORT = process.env.PORT || 4000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}-${random}${ext}`);
  }
});
const upload = multer({ storage });

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
app.use('/uploads', express.static(UPLOAD_DIR));

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

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const filename = req.file.filename;
  const url = `/uploads/${filename}`;
  res.json({ url, filename });
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
