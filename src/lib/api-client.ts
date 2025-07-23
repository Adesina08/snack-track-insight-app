// Frontend API Client - Clean separation from backend
import { AuthResponse, User, ConsumptionLog, Reward, CreateConsumptionLogRequest, MediaUploadResponse, AIAnalysisResponse } from '@/types/api';

export class ApiClient {
  private baseUrl: string;
  
  constructor() {
    // This will be your Supabase Edge Functions URL
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://your-supabase-project.supabase.co/functions/v1';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User endpoints
  async getUserProfile(userId: string): Promise<User> {
    return this.request<User>(`/users/${userId}`);
  }

  async updateUserProfile(userId: string, profileData: any): Promise<User> {
    return this.request<User>(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  async updateUserPoints(userId: string, points: number): Promise<User> {
    return this.request<User>(`/users/${userId}/points`, {
      method: 'PATCH',
      body: JSON.stringify({ points }),
    });
  }

  // Consumption logs endpoints
  async createConsumptionLog(logData: CreateConsumptionLogRequest): Promise<ConsumptionLog> {
    return this.request<ConsumptionLog>('/consumption-logs', {
      method: 'POST',
      body: JSON.stringify(logData),
  });
  }

  async getUserConsumptionLogs(userId: string): Promise<ConsumptionLog[]> {
    return this.request<ConsumptionLog[]>(`/consumption-logs/user/${userId}`);
  }

  async getAllConsumptionLogs(): Promise<ConsumptionLog[]> {
    return this.request<ConsumptionLog[]>('/consumption-logs');
  }

  // Media endpoints (Azure Blob Storage)
  async uploadMedia(file: File, type: 'photo' | 'audio' | 'video'): Promise<MediaUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/media/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set boundary for FormData
    });
  }

  async deleteMedia(mediaUrl: string) {
    return this.request('/media/delete', {
      method: 'DELETE',
      body: JSON.stringify({ mediaUrl }),
    });
  }

  // AI Services endpoints (Azure Speech/AI)
  async analyzeAudio(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    return this.request('/ai/analyze-audio', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  async analyzeImage(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this.request('/ai/analyze-image', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  async textToSpeech(text: string) {
    return this.request('/ai/text-to-speech', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // Analytics endpoints
  async getConsumptionAnalytics(): Promise<any[]> {
    return this.request<any[]>('/analytics/consumption');
  }

  // Rewards endpoints
  async getRewards(): Promise<Reward[]> {
    return this.request('/rewards');
  }

  async redeemReward(userId: string, rewardId: string) {
    return this.request('/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ userId, rewardId }),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();