// DEPRECATED: This file is being replaced by the new API client architecture
// Use src/lib/api-client.ts for frontend API calls
// Use src/lib/backend-services.ts for backend service configurations

import { apiClient } from './api-client';

// Re-export types for backward compatibility
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

// DEPRECATED: Use apiClient instead
// This wrapper maintains backward compatibility while migrating to the new API client
export const azureDbOperations = {
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'points'>) {
    return apiClient.register({
      email: userData.email,
      password: userData.passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
    });
  },

  async getUserByEmail(email: string) {
    // This would need to be handled differently in the new architecture
    // You might want to use getUserProfile with user ID instead
    throw new Error('Use apiClient.login() instead');
  },

  async updateUserPoints(userId: string, points: number) {
    return apiClient.updateUserPoints(userId, points);
  },

  async updateUserProfile(userId: string, profileData: Partial<User>) {
    return apiClient.updateUserProfile(userId, profileData);
  },

  async createConsumptionLog(logData: Omit<ConsumptionLog, 'id' | 'createdAt'>) {
    return apiClient.createConsumptionLog(logData);
  },

  async getUserConsumptionLogs(userId: string) {
    return apiClient.getUserConsumptionLogs(userId);
  },

  async getAllConsumptionLogs() {
    return apiClient.getAllConsumptionLogs();
  },

  async getConsumptionAnalytics() {
    return apiClient.getConsumptionAnalytics();
  },

  async getRewards() {
    return apiClient.getRewards();
  }
};