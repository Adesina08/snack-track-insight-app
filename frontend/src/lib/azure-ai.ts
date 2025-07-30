
export interface AzureAIAnalysis {
  transcription?: string;
  detectedProducts?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
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

    const response = await fetch('/api/transcribe', {
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
    // Simulate AI analysis based on transcription
    // In a real implementation, you would use Azure Text Analytics, Custom Vision, etc.

    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        onProgress?.(Math.min(progress, 100));
        if (progress >= 100) {
          clearInterval(interval);

          const productKeywords = [
            'coca-cola',
            'pepsi',
            'burger',
            'pizza',
            'coffee',
            'tea',
            'sandwich',
            'chips'
          ];
          const brandKeywords = ['mcdonald', 'kfc', 'starbucks', 'subway', 'dominos'];
          const categoryKeywords = ['beverage', 'snack', 'fast food', 'coffee', 'dessert'];

          const detectedProducts = productKeywords.filter((keyword) =>
            transcription.toLowerCase().includes(keyword)
          );

          const brands = brandKeywords.filter((keyword) =>
            transcription.toLowerCase().includes(keyword)
          );

          const categories = categoryKeywords.filter((keyword) =>
            transcription.toLowerCase().includes(keyword)
          );

          // Simple sentiment analysis
          const positiveWords = ['good', 'great', 'delicious', 'amazing', 'love', 'excellent'];
          const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'disgusting'];

          const positiveCount = positiveWords.filter((word) =>
            transcription.toLowerCase().includes(word)
          ).length;

          const negativeCount = negativeWords.filter((word) =>
            transcription.toLowerCase().includes(word)
          ).length;

          let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
          if (positiveCount > negativeCount) sentiment = 'positive';
          else if (negativeCount > positiveCount) sentiment = 'negative';

          resolve({
            transcription,
            detectedProducts,
            sentiment,
            confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
            emotions:
              sentiment === 'positive'
                ? ['happy', 'satisfied']
                : sentiment === 'negative'
                ? ['disappointed']
                : ['neutral'],
            brands,
            categories,
            estimatedSpend: '$' + (Math.random() * 20 + 5).toFixed(2),
            location: 'Detected from audio context'
          });
        }
      }, 400);
    });
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
