
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const AZURE_SPEECH_KEY = import.meta.env.VITE_AZURE_SPEECH_KEY || 'your-azure-speech-key';
const AZURE_SPEECH_REGION = import.meta.env.VITE_AZURE_SPEECH_REGION || 'eastus';

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
  private speechConfig: sdk.SpeechConfig;

  constructor() {
    this.speechConfig = sdk.SpeechConfig.fromSubscription(AZURE_SPEECH_KEY, AZURE_SPEECH_REGION);
    this.speechConfig.speechRecognitionLanguage = 'en-US';
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      // Convert blob to audio buffer for Azure Speech SDK
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const audioBuffer = reader.result as ArrayBuffer;
          // Convert ArrayBuffer to Buffer for Azure Speech SDK
          const buffer = Buffer.from(audioBuffer);
          const audioConfig = sdk.AudioConfig.fromWavFileInput(buffer);
          const recognizer = new sdk.SpeechRecognizer(this.speechConfig, audioConfig);

          recognizer.recognizeOnceAsync(
            (result) => {
              if (result.reason === sdk.ResultReason.RecognizedSpeech) {
                resolve(result.text);
              } else {
                reject(new Error('Speech recognition failed'));
              }
              recognizer.close();
            },
            (error) => {
              reject(error);
              recognizer.close();
            }
          );
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read audio file'));
      reader.readAsArrayBuffer(audioBlob);
    });
  }

  async analyzeConsumption(transcription: string, mediaType: 'audio' | 'video'): Promise<AzureAIAnalysis> {
    // Simulate AI analysis based on transcription
    // In a real implementation, you would use Azure Text Analytics, Custom Vision, etc.
    
    const productKeywords = ['coca-cola', 'pepsi', 'burger', 'pizza', 'coffee', 'tea', 'sandwich', 'chips'];
    const brandKeywords = ['mcdonald', 'kfc', 'starbucks', 'subway', 'dominos'];
    const categoryKeywords = ['beverage', 'snack', 'fast food', 'coffee', 'dessert'];
    
    const detectedProducts = productKeywords.filter(keyword => 
      transcription.toLowerCase().includes(keyword)
    );
    
    const brands = brandKeywords.filter(keyword => 
      transcription.toLowerCase().includes(keyword)
    );
    
    const categories = categoryKeywords.filter(keyword => 
      transcription.toLowerCase().includes(keyword)
    );

    // Simple sentiment analysis
    const positiveWords = ['good', 'great', 'delicious', 'amazing', 'love', 'excellent'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'disgusting'];
    
    const positiveCount = positiveWords.filter(word => 
      transcription.toLowerCase().includes(word)
    ).length;
    
    const negativeCount = negativeWords.filter(word => 
      transcription.toLowerCase().includes(word)
    ).length;
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';

    return {
      transcription,
      detectedProducts,
      sentiment,
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      emotions: sentiment === 'positive' ? ['happy', 'satisfied'] : 
                sentiment === 'negative' ? ['disappointed'] : ['neutral'],
      brands,
      categories,
      estimatedSpend: '$' + (Math.random() * 20 + 5).toFixed(2),
      location: 'Detected from audio context'
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
