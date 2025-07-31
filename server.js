import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import crypto from 'node:crypto';
import os from 'os';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import { BlobServiceClient } from '@azure/storage-blob';
import { TextAnalyticsClient, AzureKeyCredential } from '@azure/ai-text-analytics';
import { pool, initDb } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load .env only when not running on Azure. When deployed on Azure Web Apps the
// environment variables are provided via App Settings and WEBSITE_INSTANCE_ID is
// defined.
if (!process.env.WEBSITE_INSTANCE_ID) {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    dotenv.config();
  }
}

const blobServiceClient = process.env.AZURE_STORAGE_CONNECTION_STRING
  ? BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
    )
  : null;
const audioContainer =
  blobServiceClient?.getContainerClient(
    process.env.AZURE_AUDIO_CONTAINER
  );
const mediaContainer =
  blobServiceClient?.getContainerClient(
    process.env.AZURE_MEDIA_CONTAINER
  );

const textAnalyticsClient =
  process.env.AZURE_TEXT_ANALYTICS_ENDPOINT && process.env.AZURE_TEXT_ANALYTICS_KEY
    ? new TextAnalyticsClient(
        process.env.AZURE_TEXT_ANALYTICS_ENDPOINT,
        new AzureKeyCredential(process.env.AZURE_TEXT_ANALYTICS_KEY)
      )
    : null;

const app = express();
const PORT = process.env.PORT || 4000;
const uploadsDir = path.join(process.cwd(), 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
const upload = multer({ dest: uploadsDir });

async function uploadToAzure(filePath, originalName, mimeType) {
  if (!blobServiceClient) {
    return { url: `/uploads/${path.basename(filePath)}`, filename: path.basename(filePath) };
  }
  const container = mimeType.startsWith('audio/') ? audioContainer : mediaContainer;
  const blobName = `${Date.now()}-${crypto.randomUUID()}${path.extname(originalName)}`;
  const blockBlobClient = container.getBlockBlobClient(blobName);
  const data = await fs.promises.readFile(filePath);
  await blockBlobClient.uploadData(data, {
    blobHTTPHeaders: { blobContentType: mimeType },
  });
  await fs.promises.unlink(filePath).catch(() => {});
  return { url: blockBlobClient.url, filename: blobName };
}

let dbReady = true;
try {
  await initDb();
} catch (err) {
  console.error(
    'Failed to connect to the database. Ensure PostgreSQL is running and DB_* variables are correct.',
  );
  console.error(err);
  dbReady = false;
}

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : '*';
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (_req, res) => {
  if (dbReady) {
    res.send('Backend running');
  } else {
    res.send('Backend running (DB disconnected)');
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api', (_req, res) => {
  res.send('Backend API is running 🎉');
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  try {
    const result = await uploadToAzure(
      req.file.path,
      req.file.originalname,
      req.file.mimetype,
    );
    res.json(result);
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});


app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file uploaded' });
  }

  try {
    const tempPath = path.join(
      os.tmpdir(),
      `${Date.now()}-${crypto.randomUUID()}.wav`,
    );

    await new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-i',
        req.file.path,
        '-ac',
        '1',
        '-ar',
        '16000',
        tempPath,
        '-y',
      ]);
      ffmpeg.on('error', reject);
      ffmpeg.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error('ffmpeg conversion failed'));
      });
    });

    const { AZURE_SPEECH_KEY, AZURE_SPEECH_REGION } = process.env;
    if (!AZURE_SPEECH_KEY || !AZURE_SPEECH_REGION) {
      throw new Error('Azure Speech credentials not provided');
    }

    const speechConfig = speechsdk.SpeechConfig.fromSubscription(
      AZURE_SPEECH_KEY,
      AZURE_SPEECH_REGION,
    );
    speechConfig.speechRecognitionLanguage = 'en-US';

    const audioBuffer = await fs.promises.readFile(tempPath);
    const audioConfig = speechsdk.AudioConfig.fromWavFileInput(audioBuffer);
    const recognizer = new speechsdk.SpeechRecognizer(
      speechConfig,
      audioConfig,
    );
    const text = await new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync((result) => {
        recognizer.close();
        if (result.reason === speechsdk.ResultReason.RecognizedSpeech) {
          resolve(result.text);
        } else {
          reject(new Error(result.errorDetails || 'Transcription failed'));
        }
      });
    });

    fs.unlink(tempPath, () => {});
    fs.unlink(req.file.path, () => {});
    res.json({ text: text.trim() });
  } catch (err) {
    console.error('Transcription failed', err);
    fs.unlink(req.file.path, () => {});
    const msg = err instanceof Error ? err.message : 'Transcription failed';
    res.status(500).json({ message: msg });
  }
});

app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'No text provided' });
  if (!textAnalyticsClient) {
    return res.status(500).json({ message: 'Text analytics not configured' });
  }
  try {
    const [sentimentResult] = await textAnalyticsClient.analyzeSentiment([text]);
    const [phrasesResult] = await textAnalyticsClient.extractKeyPhrases([text]);
    const { positive, neutral, negative } = sentimentResult.confidenceScores;
    const confidenceMap = {
      positive,
      neutral,
      negative,
    };
    const confidence =
      confidenceMap[sentimentResult.sentiment] ??
      Math.max(positive, neutral, negative);
    res.json({
      sentiment: sentimentResult.sentiment,
      confidence,
      categories: phrasesResult.keyPhrases,
    });
  } catch (err) {
    console.error('Text analysis failed', err);
    res.status(500).json({ message: 'Text analysis failed' });
  }
});

app.post('/api/users', async (req, res) => {
  const { firstName, lastName, email, phone, passwordHash } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO users(id,email,first_name,last_name,phone,password_hash) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [crypto.randomUUID(), email, firstName, lastName, phone || null, passwordHash]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.get('/api/users/email/:email', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [req.params.email]);
  res.json(rows[0] || null);
});

app.get('/api/users/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
  res.json(rows[0]);
});

app.patch('/api/users/:id/points', async (req, res) => {
  const { points } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE users SET points = points + $1 WHERE id=$2 RETURNING *',
      [points, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update points' });
  }
});

app.post('/api/logs', async (req, res) => {
  const {
    userId,
    product,
    brand,
    category,
    spend,
    companions,
    location,
    notes,
    mediaUrl,
    mediaType,
    captureMethod,
    aiAnalysis,
    points
  } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO consumption_logs(id,user_id,product,brand,category,spend,companions,location,notes,media_url,media_type,capture_method,ai_analysis,points)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [
        crypto.randomUUID(),
        userId,
        product,
        brand || null,
        category,
        spend,
        companions || null,
        location || null,
        notes || null,
        mediaUrl || null,
        mediaType || null,
        captureMethod,
        aiAnalysis ? JSON.stringify(aiAnalysis) : null,
        points
      ]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create log' });
  }
});

app.get('/api/logs/user/:userId', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM consumption_logs WHERE user_id=$1 ORDER BY created_at DESC',
    [req.params.userId]
  );
  res.json(rows);
});

app.get('/api/logs', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM consumption_logs ORDER BY created_at DESC');
  res.json(rows);
});

app.get('/api/analytics/logs', async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT category, created_at, points FROM consumption_logs ORDER BY created_at DESC'
  );
  res.json(rows);
});

app.get('/api/rewards', async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM rewards WHERE is_active = TRUE ORDER BY points_required'
  );
  res.json(rows);
});

app.get('/api/leaderboard', async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT id, first_name || ' ' || last_name AS name, points FROM users WHERE email <> 'admin@inicio-insights.com' ORDER BY points DESC"
  );
  res.json(rows);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
