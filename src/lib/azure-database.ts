import { Pool } from 'pg';

// Azure PostgreSQL Configuration
export interface AzureDbConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}

// Configuration - these should be stored in Supabase Secrets
const getAzureDbConfig = (): AzureDbConfig => {
  // In production, these should come from Supabase Edge Function secrets
  // For development, you can use environment variables or local storage fallback
  return {
    host: import.meta.env.VITE_AZURE_DB_HOST || localStorage.getItem('azure_db_host') || 'your-server.postgres.database.azure.com',
    port: parseInt(import.meta.env.VITE_AZURE_DB_PORT || '5432'),
    database: import.meta.env.VITE_AZURE_DB_NAME || localStorage.getItem('azure_db_name') || 'your-database',
    username: import.meta.env.VITE_AZURE_DB_USER || localStorage.getItem('azure_db_user') || 'your-username@your-server',
    password: import.meta.env.VITE_AZURE_DB_PASSWORD || localStorage.getItem('azure_db_password') || 'your-password',
    ssl: true
  };
};

// Database connection pool
let pool: Pool | null = null;

export const getDbPool = (): Pool => {
  if (!pool) {
    const config = getAzureDbConfig();
    pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      max: 20
    });
  }
  return pool;
};

// Database types (same as before)
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  passwordHash: string;
  createdAt: string;
  points: number;
}

export interface ConsumptionLog {
  id: string;
  userId: string;
  product: string;
  brand?: string;
  category: string;
  spend?: number;
  companions?: string;
  location?: string;
  notes?: string;
  mediaUrl?: string;
  mediaType?: 'photo' | 'audio' | 'video';
  captureMethod: 'manual' | 'ai';
  aiAnalysis?: any;
  createdAt: string;
  points: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  category: string;
  isActive: boolean;
}

// Database operations for Azure PostgreSQL
export const azureDbOperations = {
  // User operations
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'points'>) {
    const pool = getDbPool();
    const client = await pool.connect();
    
    try {
      const query = `
        INSERT INTO users (email, "firstName", "lastName", phone, "passwordHash", points, "createdAt") 
        VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
        RETURNING *
      `;
      const values = [userData.email, userData.firstName, userData.lastName, userData.phone, userData.passwordHash, 0];
      
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async getUserByEmail(email: string) {
    const pool = getDbPool();
    const client = await pool.connect();
    
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await client.query(query, [email]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  },

  async updateUserPoints(userId: string, points: number) {
    const pool = getDbPool();
    const client = await pool.connect();
    
    try {
      const updateQuery = `
        UPDATE users 
        SET points = points + $1 
        WHERE id = $2 
        RETURNING *
      `;
      const result = await client.query(updateQuery, [points, userId]);
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async updateUserProfile(userId: string, profileData: Partial<User>) {
    const pool = getDbPool();
    const client = await pool.connect();
    
    try {
      const fields = Object.keys(profileData).filter(key => key !== 'id');
      const values = fields.map(field => profileData[field as keyof User]);
      const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');
      
      const query = `UPDATE users SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
      const result = await client.query(query, [...values, userId]);
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  // Consumption logs
  async createConsumptionLog(logData: Omit<ConsumptionLog, 'id' | 'createdAt'>) {
    const pool = getDbPool();
    const client = await pool.connect();
    
    try {
      const query = `
        INSERT INTO consumption_logs (
          "userId", product, brand, category, spend, companions, location, 
          notes, "mediaUrl", "mediaType", "captureMethod", "aiAnalysis", 
          points, "createdAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW()) 
        RETURNING *
      `;
      const values = [
        logData.userId, logData.product, logData.brand, logData.category,
        logData.spend, logData.companions, logData.location, logData.notes,
        logData.mediaUrl, logData.mediaType, logData.captureMethod,
        logData.aiAnalysis, logData.points
      ];
      
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async getUserConsumptionLogs(userId: string) {
    const pool = getDbPool();
    const client = await pool.connect();
    
    try {
      const query = `
        SELECT * FROM consumption_logs 
        WHERE "userId" = $1 
        ORDER BY "createdAt" DESC
      `;
      const result = await client.query(query, [userId]);
      return result.rows;
    } finally {
      client.release();
    }
  },

  async getAllConsumptionLogs() {
    const pool = getDbPool();
    const client = await pool.connect();
    
    try {
      const query = `
        SELECT 
          cl.*,
          json_build_object(
            'firstName', u."firstName",
            'lastName', u."lastName",
            'email', u.email
          ) as users
        FROM consumption_logs cl
        JOIN users u ON cl."userId" = u.id
        ORDER BY cl."createdAt" DESC
      `;
      const result = await client.query(query);
      return result.rows;
    } finally {
      client.release();
    }
  },

  // Analytics
  async getConsumptionAnalytics() {
    const pool = getDbPool();
    const client = await pool.connect();
    
    try {
      const query = `
        SELECT category, "createdAt", points 
        FROM consumption_logs 
        ORDER BY "createdAt" DESC
      `;
      const result = await client.query(query);
      return result.rows;
    } finally {
      client.release();
    }
  },

  // Rewards
  async getRewards() {
    const pool = getDbPool();
    const client = await pool.connect();
    
    try {
      const query = `
        SELECT * FROM rewards 
        WHERE "isActive" = true 
        ORDER BY "pointsRequired" ASC
      `;
      const result = await client.query(query);
      return result.rows;
    } finally {
      client.release();
    }
  }
};