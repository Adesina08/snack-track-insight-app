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
    const AZURE_SPEECH_KEY = import.meta.env.VITE_AZURE_SPEECH_KEY;
    const AZURE_SPEECH_REGION = import.meta.env.VITE_AZURE_SPEECH_REGION;

    if (!AZURE_SPEECH_KEY || !AZURE_SPEECH_REGION) {
      throw new Error('Azure Speech credentials not configured');
    }

    const url = `https://${AZURE_SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-NG`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
        'Content-Type': audioBlob.type,
        Accept: 'application/json'
      },
      body: audioBlob
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure Speech error:', errorText);
      throw new Error('Azure Speech-to-Text failed');
    }

    const data = await response.json();
    onProgress?.(100);
    return (data.DisplayText || data.NBest?.[0]?.Display || '').trim();
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
