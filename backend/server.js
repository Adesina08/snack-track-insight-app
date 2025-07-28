import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { BlobServiceClient } from '@azure/storage-blob';
import { pool, initDb } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const blobServiceClient = process.env.AZURE_STORAGE_CONNECTION_STRING
  ? BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
    )
  : null;
const audioContainer =
  blobServiceClient?.getContainerClient(
    process.env.AZURE_AUDIO_CONTAINER || 'audio-logs',
  );
const mediaContainer =
  blobServiceClient?.getContainerClient(
    process.env.AZURE_MEDIA_CONTAINER || 'media-logs',
  );

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

try {
  await initDb();
} catch (err) {
  console.error(
    'Failed to connect to the database. Ensure PostgreSQL is running and DB_* variables are correct.',
  );
  console.error(err);
  process.exit(1);
}

app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
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
    const scriptPath = path.join(process.cwd(), 'transcribe.py');
    let pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    const venvPython =
      process.platform === 'win32'
        ? path.join(__dirname, '.venv', 'Scripts', 'python.exe')
        : path.join(__dirname, '.venv', 'bin', 'python');
    if (fs.existsSync(venvPython)) {
      pythonCmd = venvPython;
    }
    const python = spawn(pythonCmd, [scriptPath, req.file.path]);
    let output = '';
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    python.stderr.on('data', (data) => {
      console.error('Whisper error:', data.toString());
    });
    python.on('close', (code) => {
      fs.unlink(req.file.path, () => {});
      if (code === 0) {
        res.json({ text: output.trim() });
      } else {
        res.status(500).json({ message: 'Transcription failed' });
      }
    });
  } catch (err) {
    console.error('Transcription failed', err);
    fs.unlink(req.file.path, () => {});
    res.status(500).json({ message: 'Transcription failed' });
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
