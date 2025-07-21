import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Mic, Video, MapPin, Users, DollarSign, Sparkles, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { dbOperations } from "@/lib/database";
import { authUtils } from "@/lib/auth";
import { azureAI, AzureAIAnalysis } from "@/lib/azure-ai";

const LogConsumption = () => {
  const navigate = useNavigate();
  const [captureMethod, setCaptureMethod] = useState<'manual' | 'ai' | null>(null);
  const [formData, setFormData] = useState({
    product: "",
    brand: "",
    category: "",
    spend: "",
    companions: "",
    location: "",
    notes: "",
    combinedWith: []
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AzureAIAnalysis | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const categories = ["Snacks", "Beverages", "Noodles", "Dairy", "Confectionery", "Other"];
  const companionOptions = ["Alone", "With friends", "With family", "With colleagues", "With partner"];

  const handleCaptureMethodSelect = (method: 'manual' | 'ai') => {
    setCaptureMethod(method);
    setSelectedFile(null);
    setAiAnalysis(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (captureMethod === 'manual') {
        // For manual capture, analyze the image
        if (file.type.startsWith('image/')) {
          await analyzeImage(file);
        }
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: captureMethod === 'ai' 
      });
      
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { 
          type: captureMethod === 'ai' ? 'video/webm' : 'audio/webm' 
        });
        const file = new File([blob], `recording.${captureMethod === 'ai' ? 'webm' : 'wav'}`, {
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
        description: `Recording ${captureMethod === 'ai' ? 'video' : 'audio'}...`,
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

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const analysis = await azureAI.analyzeImage(file);
      setAiAnalysis(analysis);
      
      // Auto-fill form with AI analysis
      if (analysis.detectedProducts && analysis.detectedProducts.length > 0) {
        setFormData(prev => ({
          ...prev,
          product: analysis.detectedProducts?.[0] || '',
          brand: analysis.brands?.[0] || '',
          category: analysis.categories?.[0] || '',
          spend: analysis.estimatedSpend || '',
          location: analysis.location || ''
        }));
      }

      toast({
        title: "Image analysis complete!",
        description: `Detected ${analysis.detectedProducts?.length || 0} products`,
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Unable to analyze the image.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
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
        spend: analysis.estimatedSpend || '',
        location: analysis.location || '',
        notes: analysis.transcription || ''
      }));

      toast({
        title: "AI Analysis Complete!",
        description: `Analyzed consumption with ${Math.round((analysis.confidence || 0) * 100)}% confidence`,
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

      // Calculate points based on submission
      let points = 10; // Base points
      if (selectedFile) {
        points += captureMethod === 'ai' ? 20 : 15; // AI capture bonus
      }
      if (formData.notes.length > 50) points += 5; // Detailed description bonus

      // Create consumption log
      const logData = {
        userId: currentUser.id,
        product: formData.product,
        brand: formData.brand,
        category: formData.category,
        spend: formData.spend ? parseFloat(formData.spend) : undefined,
        companions: formData.companions,
        location: formData.location,
        notes: formData.notes,
        mediaUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
        mediaType: selectedFile?.type.startsWith('image/') ? 'photo' as const : 
                  selectedFile?.type.startsWith('video/') ? 'video' as const : 
                  selectedFile?.type.startsWith('audio/') ? 'audio' as const : undefined,
        captureMethod: captureMethod!,
        aiAnalysis,
        points
      };

      await dbOperations.createConsumptionLog(logData);
      await dbOperations.updateUserPoints(currentUser.id, points);

      toast({
        title: "Consumption logged successfully! 🎉",
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

  return (
    <div className="min-h-screen gradient-secondary pb-20 lg:pb-0">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-2">Log Your Consumption</h1>
            <p className="text-muted-foreground">Capture your snacking moment and earn points!</p>
          </div>

          {!captureMethod ? (
            <Card className="glass-card hover-glow">
              <CardHeader>
                <CardTitle className="text-center text-gradient">Choose Capture Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleCaptureMethodSelect('manual')}
                    className="h-32 flex flex-col items-center justify-center gradient-primary hover-glow text-white"
                  >
                    <Camera className="h-8 w-8 mb-2" />
                    <span className="text-lg font-semibold">Manual Capture</span>
                    <span className="text-sm opacity-90">Upload photos manually</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleCaptureMethodSelect('ai')}
                    className="h-32 flex flex-col items-center justify-center animated-gradient hover-glow text-white"
                  >
                    <Zap className="h-8 w-8 mb-2" />
                    <span className="text-lg font-semibold">AI Capture</span>
                    <span className="text-sm opacity-90">Record audio/video for AI analysis</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Media Capture Section */}
              <Card className="glass-card hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                    {captureMethod === 'manual' ? 'Manual Photo Upload' : 'AI-Powered Media Capture'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedFile ? (
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
                      {captureMethod === 'manual' ? (
                        <>
                          <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                              <Camera className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">Upload a photo of your consumption</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="photo-upload"
                          />
                          <label htmlFor="photo-upload">
                            <Button type="button" className="gradient-primary hover-glow text-white" asChild>
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                Choose Photo
                              </span>
                            </Button>
                          </label>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                              <Mic className="h-6 w-6 text-white" />
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <Video className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            Record yourself consuming the product for AI analysis
                          </p>
                          {!isRecording ? (
                            <Button
                              type="button"
                              onClick={startRecording}
                              className="animated-gradient hover-glow text-white"
                            >
                              <Video className="h-4 w-4 mr-2" />
                              Start Recording
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
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <Camera className="h-5 w-5 text-white" />
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
                            <span>
                              {captureMethod === 'ai' ? 'Azure AI is analyzing your media...' : 'Analyzing your photo...'}
                            </span>
                          </div>
                        </div>
                      )}

                      {aiAnalysis && (
                        <div className="glass-effect border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-800 mb-3">
                            {captureMethod === 'ai' ? 'Azure AI Analysis Results' : 'Photo Analysis Results'}
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {aiAnalysis.detectedProducts && (
                              <div>
                                <span className="text-blue-600 font-medium">Products:</span>
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
                                <span className="text-blue-600 font-medium">Sentiment:</span>
                                <span className="ml-2 text-blue-800">{aiAnalysis.sentiment}</span>
                              </div>
                            )}
                            {aiAnalysis.estimatedSpend && (
                              <div>
                                <span className="text-blue-600 font-medium">Est. Spend:</span>
                                <span className="ml-2 text-blue-800">{aiAnalysis.estimatedSpend}</span>
                              </div>
                            )}
                          </div>
                          {aiAnalysis.transcription && (
                            <div className="mt-3">
                              <span className="text-blue-600 font-medium text-sm">Transcription:</span>
                              <p className="text-blue-800 text-sm mt-1">{aiAnalysis.transcription}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Manual Entry Section */}
              <Card className="glass-card hover-glow">
                <CardHeader>
                  <CardTitle>Consumption Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product">Product Name *</Label>
                      <Input
                        id="product"
                        value={formData.product}
                        onChange={(e) => setFormData({...formData, product: e.target.value})}
                        required
                        className="border-blue-200 focus:border-blue-400 glass-effect"
                        placeholder="e.g., Coca-Cola"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        className="border-blue-200 focus:border-blue-400 glass-effect"
                        placeholder="e.g., Coca-Cola"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger className="border-blue-200 focus:border-blue-400 glass-effect">
                          <SelectValue placeholder="Select category" />
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
                      <Label htmlFor="spend">Amount Spent</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="spend"
                          value={formData.spend}
                          onChange={(e) => setFormData({...formData, spend: e.target.value})}
                          className="border-blue-200 focus:border-blue-400 glass-effect pl-10"
                          placeholder="50"
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
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="border-blue-200 focus:border-blue-400 glass-effect pl-10"
                        placeholder="e.g., Mall Food Court"
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
                      placeholder="Describe your experience, mood, or any other details..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="flex-1 gradient-primary hover-glow text-white shadow-lg"
                  disabled={isSubmitting || !formData.product || !formData.category}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Log Consumption
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCaptureMethod(null)}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 glass-effect"
                >
                  Back
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogConsumption;
