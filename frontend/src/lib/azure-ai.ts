import { buildUrl } from './local-db';

export interface AzureAIAnalysis {
  transcription?: string;
  detectedProducts?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral' | 'mixed';
  confidence?: number;
  emotions?: string[];
  brands?: string[];
  categories?: string[];
  estimatedSpend?: string;
  location?: string;
}

export class AzureAIService {
  constructor() {
    // Browser-compatible AI service for food consumption analysis
  }

  async transcribeAudio(
    audioBlob: Blob,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const response = await fetch(buildUrl('/transcribe'), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let msg = 'Transcription failed';
      try {
        const err = await response.json();
        msg = err.message || msg;
      } catch {
        // ignore JSON parse errors
      }
      throw new Error(msg);
    }

    const data: { text: string } = await response.json();
    onProgress?.(100);
    return data.text;
  }

  async analyzeConsumption(
    transcription: string,
    mediaType: 'audio' | 'video',
    onProgress?: (progress: number) => void
  ): Promise<AzureAIAnalysis> {
    const response = await fetch(buildUrl('/analyze'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: transcription })
    });

    if (!response.ok) {
      let msg = 'Analysis failed';
      try {
        const err = await response.json();
        msg = err.message || msg;
      } catch {
        // ignore parse errors
      }
      throw new Error(msg);
    }

    const data: { sentiment: string; confidence?: number; categories?: string[] } = await response.json();
    onProgress?.(100);
    return {
      transcription,
      sentiment: data.sentiment as 'positive' | 'negative' | 'neutral' | 'mixed',
      confidence: data.confidence,
      categories: data.categories
    };
  }

  async analyzeImage(imageBlob: Blob): Promise<AzureAIAnalysis> {
    // In a real implementation, use Azure Computer Vision API
    // For now, simulate analysis
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          detectedProducts: ['Coca-Cola', 'French Fries'],
          brands: ['Coca-Cola', 'McDonald\'s'],
          categories: ['Beverages', 'Fast Food'],
          confidence: 0.85,
          estimatedSpend: '$12.50',
          location: 'Restaurant/Fast Food Chain'
        });
      }, 2000);
    });
  }
}

export const azureAI = new AzureAIService();
