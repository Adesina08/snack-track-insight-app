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
    // ✅ Use your own backend server's /api/transcribe route
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav'); // field name must be 'audio' to match server

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Transcription failed:', data.message || response.statusText);
      throw new Error(data.message || 'Transcription failed');
    }

    onProgress?.(100);
    return data.text?.trim() || '';
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
      console.error('Detailed analysis error:', msg);
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
    // Simulated analysis result (you can replace with real Azure Computer Vision API logic)
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
