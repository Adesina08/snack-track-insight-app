export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  passwordHash?: string;
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

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

export const localDbOperations = {
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'points'>): Promise<User> {
    return request<User>('/users', { method: 'POST', body: JSON.stringify(userData) });
  },

  async getUserByEmail(email: string): Promise<User | null> {
    return request<User | null>(`/users/email/${encodeURIComponent(email)}`);
  },

  async getUserById(id: string): Promise<User | null> {
    return request<User | null>(`/users/${id}`);
  },

  async getUserById(id: string): Promise<User | null> {
    const users = load<User>(STORAGE_KEYS.users);
    return users.find(u => u.id === id) || null;
  },

  async updateUserPoints(userId: string, points: number): Promise<User> {
    return request<User>(`/users/${userId}/points`, {
      method: 'PATCH',
      body: JSON.stringify({ points })
    });
  },

  async createConsumptionLog(logData: Omit<ConsumptionLog, 'id' | 'createdAt'>): Promise<ConsumptionLog> {
    return request<ConsumptionLog>('/logs', {
      method: 'POST',
      body: JSON.stringify(logData)
    });
  },

  async getUserConsumptionLogs(userId: string): Promise<ConsumptionLog[]> {
    return request<ConsumptionLog[]>(`/logs/user/${userId}`);
  },

  async getAllConsumptionLogs(): Promise<ConsumptionLog[]> {
    return request<ConsumptionLog[]>('/logs');
  },

  async getConsumptionAnalytics(): Promise<Array<{ category: string; createdAt: string; points: number }>> {
    return request('/analytics/logs');
  },

  async getRewards(): Promise<Reward[]> {
    return request('/rewards');
  },

  async getLeaderboard(): Promise<Array<{ id: string; name: string; points: number }>> {
    return request('/leaderboard');
  }
};
