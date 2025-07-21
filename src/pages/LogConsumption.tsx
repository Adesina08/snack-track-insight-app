
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Video, MapPin, Users, DollarSign, Sparkles, Zap, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { dbOperations } from "@/lib/database";
import { authUtils } from "@/lib/auth";
import { azureAI, AzureAIAnalysis } from "@/lib/azure-ai";
import { getAzureStorage } from "@/lib/azure-storage";
import AzureStorageSetup from "@/components/AzureStorageSetup";

const LogConsumption = () => {
  const navigate = useNavigate();
  const [azureConfigured, setAzureConfigured] = useState(false);
  const [formData, setFormData] = useState({
    product: "",
    brand: "",
    category: "",
    spend: "",
    companions: "",
    location: "",
    notes: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AzureAIAnalysis | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingType, setRecordingType] = useState<'audio' | 'video'>('audio');

  const categories = ["Jollof Rice", "Suya", "Pounded Yam", "Egusi", "Pepper Soup", "Chin Chin", "Plantain", "Akara", "Moi Moi", "Other"];
  const companionOptions = ["Alone", "With friends", "With family", "With colleagues", "With partner"];

  useEffect(() => {
    // Check if Azure Storage is configured
    const savedConfig = localStorage.getItem('azureStorageConfig');
    if (savedConfig && getAzureStorage()) {
      setAzureConfigured(true);
    }
  }, []);

  const startRecording = async () => {
    try {
      const constraints = {
        audio: true,
        video: recordingType === 'video'
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { 
          type: recordingType === 'video' ? 'video/webm' : 'audio/webm' 
        });
        const file = new File([blob], `naija-meal-${Date.now()}.${recordingType === 'video' ? 'webm' : 'wav'}`, {
          type: blob.type
        });
        
        setSelectedFile(file);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Analyze with Azure AI
        await analyzeWithAzureAI(file);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);

      toast({
        title: "Recording started",
        description: `Recording ${recordingType}... Talk about your Nigerian meal experience!`,
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Unable to access camera/microphone.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const analyzeWithAzureAI = async (file: File) => {
    setIsAnalyzing(true);
    try {
      let transcription = '';
      
      // Transcribe audio/video
      if (file.type.includes('audio') || file.type.includes('video')) {
        transcription = await azureAI.transcribeAudio(file);
      }

      // Analyze consumption data
      const analysis = await azureAI.analyzeConsumption(
        transcription, 
        file.type.includes('video') ? 'video' : 'audio'
      );
      
      setAiAnalysis(analysis);
      
      // Auto-fill form with AI analysis
      setFormData(prev => ({
        ...prev,
        product: analysis.detectedProducts?.[0] || '',
        brand: analysis.brands?.[0] || '',
        category: analysis.categories?.[0] || '',
        spend: analysis.estimatedSpend?.replace('$', '₦') || '',
        location: analysis.location || '',
        notes: analysis.transcription || ''
      }));

      toast({
        title: "AI Analysis Complete! 🍲",
        description: `Analyzed your Naija meal with ${Math.round((analysis.confidence || 0) * 100)}% confidence`,
      });
    } catch (error) {
      console.error('AI Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "Unable to analyze the media.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const currentUser = await authUtils.getCurrentUser();
      if (!currentUser) {
        toast({
          title: "Authentication required",
          description: "Please log in to continue.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      let mediaUrl = '';
      
      // Upload to Azure Storage if file exists
      if (selectedFile && azureConfigured) {
        const azureStorage = getAzureStorage();
        if (azureStorage) {
          const uploadResult = await azureStorage.uploadFile(selectedFile);
          if (uploadResult.success) {
            mediaUrl = uploadResult.url;
          } else {
            toast({
              title: "Upload failed",
              description: "Failed to upload media to Azure Storage.",
              variant: "destructive",
            });
            return;
          }
        }
      }

      // Calculate points based on submission
      let points = 15; // Base points for AI capture
      if (selectedFile) {
        points += recordingType === 'video' ? 25 : 20; // Video bonus
      }
      if (formData.notes.length > 50) points += 10; // Detailed description bonus

      // Create consumption log
      const logData = {
        userId: currentUser.id,
        product: formData.product,
        brand: formData.brand,
        category: formData.category,
        spend: formData.spend ? parseFloat(formData.spend.replace('₦', '')) : undefined,
        companions: formData.companions,
        location: formData.location,
        notes: formData.notes,
        mediaUrl,
        mediaType: selectedFile?.type.startsWith('video/') ? 'video' as const : 'audio' as const,
        captureMethod: 'ai' as const,
        aiAnalysis,
        points
      };

      await dbOperations.createConsumptionLog(logData);
      await dbOperations.updateUserPoints(currentUser.id, points);

      toast({
        title: "Naija meal logged successfully! 🎉",
        description: `You earned ${points} points for this entry.`,
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Submission failed",
        description: "Unable to save your consumption log.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!azureConfigured) {
    return (
      <div className="min-h-screen gradient-secondary pb-20 lg:pb-0">
        <Navigation />
        
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gradient mb-2">Setup Required</h1>
            <p className="text-muted-foreground">Configure Azure Storage to upload your media files</p>
          </div>
          
          <AzureStorageSetup onConfigured={() => setAzureConfigured(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-secondary pb-20 lg:pb-0">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-2">Log Your Naija Meal</h1>
            <p className="text-muted-foreground">Record your Nigerian food experience and earn points!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* AI Media Capture Section */}
            <Card className="glass-card hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                  AI-Powered Media Capture
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedFile ? (
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-4 mb-6">
                      <Button
                        type="button"
                        variant={recordingType === 'audio' ? 'default' : 'outline'}
                        onClick={() => setRecordingType('audio')}
                        className={recordingType === 'audio' ? 'gradient-primary text-white' : 'border-blue-300 text-blue-600'}
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        Audio Only
                      </Button>
                      <Button
                        type="button"
                        variant={recordingType === 'video' ? 'default' : 'outline'}
                        onClick={() => setRecordingType('video')}
                        className={recordingType === 'video' ? 'gradient-primary text-white' : 'border-blue-300 text-blue-600'}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Audio + Video
                      </Button>
                    </div>

                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 animated-gradient rounded-lg flex items-center justify-center">
                          {recordingType === 'video' ? (
                            <Video className="h-8 w-8 text-white" />
                          ) : (
                            <Mic className="h-8 w-8 text-white" />
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-6">
                        Record yourself talking about your Nigerian meal experience. 
                        Mention what you're eating, where you are, who you're with, and how it tastes!
                      </p>
                      {!isRecording ? (
                        <Button
                          type="button"
                          onClick={startRecording}
                          className="animated-gradient hover-glow text-white"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Start {recordingType === 'video' ? 'Video' : 'Audio'} Recording
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={stopRecording}
                          variant="destructive"
                          className="hover-glow"
                        >
                          <Mic className="h-4 w-4 mr-2" />
                          Stop Recording
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          {recordingType === 'video' ? (
                            <Video className="h-5 w-5 text-white" />
                          ) : (
                            <Mic className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-green-800">{selectedFile.name}</p>
                          <p className="text-sm text-green-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setSelectedFile(null);
                          setAiAnalysis(null);
                        }}
                        className="text-green-600 hover:text-green-700"
                      >
                        Remove
                      </Button>
                    </div>

                    {isAnalyzing && (
                      <div className="text-center py-6">
                        <div className="inline-flex items-center space-x-2 text-blue-600">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span>Azure AI is analyzing your Naija meal...</span>
                        </div>
                      </div>
                    )}

                    {aiAnalysis && (
                      <div className="glass-effect border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-3">Azure AI Analysis Results</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {aiAnalysis.detectedProducts && (
                            <div>
                              <span className="text-blue-600 font-medium">Nigerian Foods:</span>
                              <span className="ml-2 text-blue-800">{aiAnalysis.detectedProducts.join(', ')}</span>
                            </div>
                          )}
                          {aiAnalysis.confidence && (
                            <div>
                              <span className="text-blue-600 font-medium">Confidence:</span>
                              <span className="ml-2 text-blue-800">{Math.round(aiAnalysis.confidence * 100)}%</span>
                            </div>
                          )}
                          {aiAnalysis.sentiment && (
                            <div>
                              <span className="text-blue-600 font-medium">Mood:</span>
                              <span className="ml-2 text-blue-800">{aiAnalysis.sentiment}</span>
                            </div>
                          )}
                          {aiAnalysis.estimatedSpend && (
                            <div>
                              <span className="text-blue-600 font-medium">Est. Spend:</span>
                              <span className="ml-2 text-blue-800">₦{aiAnalysis.estimatedSpend?.replace('$', '')}</span>
                            </div>
                          )}
                        </div>
                        {aiAnalysis.transcription && (
                          <div className="mt-3">
                            <span className="text-blue-600 font-medium text-sm">What you said:</span>
                            <p className="text-blue-800 text-sm mt-1">{aiAnalysis.transcription}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Entry Section - Only shown after AI analysis */}
            {aiAnalysis && (
              <Card className="glass-card hover-glow">
                <CardHeader>
                  <CardTitle>Review & Edit Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product">Nigerian Food *</Label>
                      <Input
                        id="product"
                        value={formData.product}
                        onChange={(e) => setFormData({...formData, product: e.target.value})}
                        required
                        className="border-blue-200 focus:border-blue-400 glass-effect"
                        placeholder="e.g., Jollof Rice"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand">Restaurant/Brand</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        className="border-blue-200 focus:border-blue-400 glass-effect"
                        placeholder="e.g., Mr. Biggs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger className="border-blue-200 focus:border-blue-400 glass-effect">
                          <SelectValue placeholder="Select Nigerian food category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="spend">Amount Spent (₦)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="spend"
                          value={formData.spend}
                          onChange={(e) => setFormData({...formData, spend: e.target.value})}
                          className="border-blue-200 focus:border-blue-400 glass-effect pl-10"
                          placeholder="500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="companions">Who were you with?</Label>
                    <Select value={formData.companions} onValueChange={(value) => setFormData({...formData, companions: value})}>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400 glass-effect">
                        <SelectValue placeholder="Select companions" />
                      </SelectTrigger>
                      <SelectContent>
                        {companionOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              {option}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location in Nigeria</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="border-blue-200 focus:border-blue-400 glass-effect pl-10"
                        placeholder="e.g., Lagos, Victoria Island"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="border-blue-200 focus:border-blue-400 glass-effect"
                      placeholder="Describe your experience, taste, mood, or any other details about this Nigerian meal..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button - Only shown after AI analysis */}
            {aiAnalysis && (
              <Button
                type="submit"
                className="w-full gradient-primary hover-glow text-white shadow-lg"
                disabled={isSubmitting || !formData.product || !formData.category}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading to Azure & Saving...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Log My Naija Meal
                  </>
                )}
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogConsumption;
