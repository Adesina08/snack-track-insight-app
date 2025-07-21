
import jwt from 'jsonwebtoken';
import { dbOperations, User } from './database';

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'your-jwt-secret-key';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  exp: number;
}

export const authUtils = {
  generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      },
      JWT_SECRET
    );
  },

  verifyToken(token: string): AuthTokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    } catch (error) {
      return null;
    }
  },

  async hashPassword(password: string): Promise<string> {
    // In a real app, use bcrypt. For demo purposes, we'll use a simple hash
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const hashedInput = await this.hashPassword(password);
    return hashedInput === hashedPassword;
  },

  setAuthToken(token: string) {
    localStorage.setItem('authToken', token);
  },

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  },

  removeAuthToken() {
    localStorage.removeItem('authToken');
  },

  async getCurrentUser(): Promise<User | null> {
    const token = this.getAuthToken();
    if (!token) return null;

    const payload = this.verifyToken(token);
    if (!payload) {
      this.removeAuthToken();
      return null;
    }

    try {
      return await dbOperations.getUserByEmail(payload.email);
    } catch (error) {
      this.removeAuthToken();
      return null;
    }
  }
};
