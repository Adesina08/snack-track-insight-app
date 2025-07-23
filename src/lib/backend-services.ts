// Backend Service Configurations - This will be used in Supabase Edge Functions
// This file shows the structure for your backend services

export interface AzureConfig {
  // PostgreSQL Database
  database: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl: boolean;
  };
  
  // Blob Storage
  storage: {
    accountName: string;
    containerName: string;
    sasToken: string;
    connectionString?: string;
  };
  
  // Speech/AI Services
  cognitive: {
    speechKey: string;
    speechRegion: string;
    endpoint: string;
  };
}

// SQL Queries for Azure PostgreSQL (to be used in Edge Functions)
export const SQL_QUERIES = {
  // Users
  CREATE_USER: `
    INSERT INTO users (email, "firstName", "lastName", phone, "passwordHash", points, "createdAt") 
    VALUES ($1, $2, $3, $4, $5, 0, NOW()) 
    RETURNING id, email, "firstName", "lastName", phone, points, "createdAt"
  `,
  
  GET_USER_BY_EMAIL: `
    SELECT id, email, "firstName", "lastName", phone, points, "passwordHash", "createdAt"
    FROM users 
    WHERE email = $1
  `,
  
  UPDATE_USER_POINTS: `
    UPDATE users 
    SET points = points + $1 
    WHERE id = $2 
    RETURNING id, email, "firstName", "lastName", phone, points, "createdAt"
  `,
  
  UPDATE_USER_PROFILE: `
    UPDATE users 
    SET "firstName" = COALESCE($1, "firstName"), 
        "lastName" = COALESCE($2, "lastName"), 
        phone = COALESCE($3, phone)
    WHERE id = $4 
    RETURNING id, email, "firstName", "lastName", phone, points, "createdAt"
  `,

  // Consumption Logs
  CREATE_CONSUMPTION_LOG: `
    INSERT INTO consumption_logs (
      "userId", product, brand, category, spend, companions, location, 
      notes, "mediaUrl", "mediaType", "captureMethod", "aiAnalysis", 
      points, "createdAt"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW()) 
    RETURNING *
  `,
  
  GET_USER_CONSUMPTION_LOGS: `
    SELECT * FROM consumption_logs 
    WHERE "userId" = $1 
    ORDER BY "createdAt" DESC
  `,
  
  GET_ALL_CONSUMPTION_LOGS: `
    SELECT 
      cl.*,
      json_build_object(
        'firstName', u."firstName",
        'lastName', u."lastName",
        'email', u.email
      ) as user_info
    FROM consumption_logs cl
    JOIN users u ON cl."userId" = u.id
    ORDER BY cl."createdAt" DESC
  `,

  // Analytics
  GET_CONSUMPTION_ANALYTICS: `
    SELECT category, "createdAt", points, spend
    FROM consumption_logs 
    ORDER BY "createdAt" DESC
  `,

  // Rewards
  GET_REWARDS: `
    SELECT * FROM rewards 
    WHERE "isActive" = true 
    ORDER BY "pointsRequired" ASC
  `,
};

// Database Schema for Azure PostgreSQL
export const DATABASE_SCHEMA = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  "firstName" VARCHAR(100) NOT NULL,
  "lastName" VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  "passwordHash" VARCHAR(255) NOT NULL,
  points INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consumption logs table
CREATE TABLE IF NOT EXISTS consumption_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  spend DECIMAL(10,2),
  companions TEXT,
  location TEXT,
  notes TEXT,
  "mediaUrl" TEXT,
  "mediaType" VARCHAR(10) CHECK ("mediaType" IN ('photo', 'audio', 'video')),
  "captureMethod" VARCHAR(10) NOT NULL CHECK ("captureMethod" IN ('manual', 'ai')),
  "aiAnalysis" JSONB,
  points INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  "pointsRequired" INTEGER NOT NULL,
  category VARCHAR(100) NOT NULL,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_consumption_logs_user_id ON consumption_logs("userId");
CREATE INDEX IF NOT EXISTS idx_consumption_logs_created_at ON consumption_logs("createdAt");
CREATE INDEX IF NOT EXISTS idx_rewards_active ON rewards("isActive");
`;

// Azure Blob Storage helper functions (for Edge Functions)
export const AZURE_STORAGE_HELPERS = {
  generateBlobName: (originalName: string, type: string) => {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    return `${type}/${timestamp}-${Math.random().toString(36).substr(2, 9)}.${extension}`;
  },
  
  generateSasUrl: (accountName: string, containerName: string, blobName: string, sasToken: string) => {
    return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
  }
};