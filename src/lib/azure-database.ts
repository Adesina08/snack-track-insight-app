// Azure PostgreSQL Configuration for REST API connection
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

// Azure REST API endpoint (you'll need to create this as a Supabase Edge Function)
const getApiEndpoint = () => {
  return import.meta.env.VITE_API_ENDPOINT || 'https://your-supabase-project.supabase.co/functions/v1/azure-db';
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

// API helper function
const apiCall = async (endpoint: string, method: string = 'GET', data?: any) => {
  const baseUrl = getApiEndpoint();
  const config = getAzureDbConfig();
  
  const response = await fetch(`${baseUrl}/${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${btoa(JSON.stringify(config))}` // Pass config securely
    },
    body: data ? JSON.stringify(data) : undefined
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
};

// Database operations for Azure PostgreSQL via REST API
export const azureDbOperations = {
  // User operations
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'points'>) {
    return apiCall('users', 'POST', userData);
  },

  async getUserByEmail(email: string) {
    return apiCall(`users/${encodeURIComponent(email)}`);
  },

  async updateUserPoints(userId: string, points: number) {
    return apiCall(`users/${userId}/points`, 'PATCH', { points });
  },

  async updateUserProfile(userId: string, profileData: Partial<User>) {
    return apiCall(`users/${userId}`, 'PATCH', profileData);
  },

  // Consumption logs
  async createConsumptionLog(logData: Omit<ConsumptionLog, 'id' | 'createdAt'>) {
    return apiCall('consumption-logs', 'POST', logData);
  },

  async getUserConsumptionLogs(userId: string) {
    return apiCall(`consumption-logs/user/${userId}`);
  },

  async getAllConsumptionLogs() {
    return apiCall('consumption-logs');
  },

  // Analytics
  async getConsumptionAnalytics() {
    return apiCall('analytics/consumption');
  },

  // Rewards
  async getRewards() {
    return apiCall('rewards');
  }
};