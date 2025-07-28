import pkg from 'pg';
const { Pool } = pkg;
import crypto from 'node:crypto';
import dotenv from 'dotenv';

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://snackstrack_user:Cjf3cvlisS0xzSIuQJlhJiwwFNk3sV6p@dpg-d23l1qe3jp1c73a1l160-a.oregon-postgres.render.com/snackstrack';

export const pool = new Pool({ connectionString });

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      points INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS consumption_logs (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      product TEXT NOT NULL,
      brand TEXT,
      category TEXT NOT NULL,
      spend REAL,
      companions TEXT,
      location TEXT,
      notes TEXT,
      media_url TEXT,
      media_type TEXT,
      capture_method TEXT NOT NULL,
      ai_analysis JSONB,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      points INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS rewards (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      points_required INTEGER NOT NULL,
      category TEXT,
      is_active BOOLEAN DEFAULT TRUE
    );
  `);

  const { rows } = await pool.query('SELECT COUNT(*) FROM rewards');
  if (rows[0].count === '0') {
    await pool.query(
      `INSERT INTO rewards (id, name, description, points_required, category, is_active)
       VALUES
       ($1, $2, $3, $4, $5, TRUE),
       ($6, $7, $8, $9, $10, TRUE)`,
      [
        crypto.randomUUID(),
        'Free Coffee',
        'Enjoy a cup on us',
        100,
        'misc',
        crypto.randomUUID(),
        'Movie Ticket',
        'Ticket for any movie',
        250,
        'entertainment'
      ]
    );
  }
}
