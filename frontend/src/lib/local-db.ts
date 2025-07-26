// Local JSON-based data store replacing Supabase

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

// Storage helpers
const STORAGE_KEYS = {
  users: 'local_db_users',
  logs: 'local_db_consumption_logs',
  rewards: 'local_db_rewards'
};

function load<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function save<T>(key: string, value: T[]): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureRewards(): Reward[] {
  let rewards = load<Reward>(STORAGE_KEYS.rewards);
  if (rewards.length === 0) {
    // Minimal default rewards
    rewards = [
      { id: '1', name: 'Free Coffee', description: 'Enjoy a cup on us', pointsRequired: 100, category: 'misc', isActive: true },
      { id: '2', name: 'Movie Ticket', description: 'Ticket for any movie', pointsRequired: 250, category: 'entertainment', isActive: true }
    ];
    save(STORAGE_KEYS.rewards, rewards);
  }
  return rewards;
}

export const localDbOperations = {
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'points'>): Promise<User> {
    const users = load<User>(STORAGE_KEYS.users);
    if (users.some(u => u.email === userData.email)) {
      throw new Error('User already exists');
    }
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      points: 0
    };
    users.push(newUser);
    save(STORAGE_KEYS.users, users);
    return newUser;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const users = load<User>(STORAGE_KEYS.users);
    return users.find(u => u.email === email) || null;
  },

  async getUserById(id: string): Promise<User | null> {
    const users = load<User>(STORAGE_KEYS.users);
    return users.find(u => u.id === id) || null;
  },

  async updateUserPoints(userId: string, points: number): Promise<User> {
    const users = load<User>(STORAGE_KEYS.users);
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    user.points = (user.points || 0) + points;
    save(STORAGE_KEYS.users, users);
    return user;
  },

  async createConsumptionLog(logData: Omit<ConsumptionLog, 'id' | 'createdAt'>): Promise<ConsumptionLog> {
    const logs = load<ConsumptionLog>(STORAGE_KEYS.logs);
    const newLog: ConsumptionLog = { ...logData, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    logs.push(newLog);
    save(STORAGE_KEYS.logs, logs);
    return newLog;
  },

  async getUserConsumptionLogs(userId: string): Promise<ConsumptionLog[]> {
    const logs = load<ConsumptionLog>(STORAGE_KEYS.logs);
    return logs.filter(l => l.userId === userId).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getAllConsumptionLogs(): Promise<ConsumptionLog[]> {
    const logs = load<ConsumptionLog>(STORAGE_KEYS.logs);
    return logs.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getConsumptionAnalytics(): Promise<Array<{category: string; createdAt: string; points: number}>> {
    const logs = load<ConsumptionLog>(STORAGE_KEYS.logs);
    return logs.map(l => ({ category: l.category, createdAt: l.createdAt, points: l.points }));
  },

  async getRewards(): Promise<Reward[]> {
    const rewards = ensureRewards();
    return rewards.filter(r => r.isActive).sort((a,b) => a.pointsRequired - b.pointsRequired);
  },

  async getLeaderboard(): Promise<Array<{ id: string; name: string; points: number }>> {
    const users = load<User>(STORAGE_KEYS.users);
    const filtered = users.filter(u => u.email !== 'admin@inicio-insights.com');
    const sorted = filtered.sort((a,b) => (b.points || 0) - (a.points || 0));
    return sorted.map(u => ({ id: u.id, name: `${u.firstName} ${u.lastName}`, points: u.points || 0 }));
  }
};
