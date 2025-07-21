
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Mic, Video, MapPin, Clock, Users, DollarSign, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const LogConsumption = () => {
  const navigate = useNavigate();
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
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["Snacks", "Beverages", "Noodles", "Dairy", "Confectionery", "Other"];
  const companionOptions = ["Alone", "With friends", "With family", "With colleagues", "With partner"];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      simulateAIAnalysis(file);
    }
  };

  const simulateAIAnalysis = (file: File) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockAnalysis = {
        detectedProduct: "Coca-Cola",
        detectedBrand: "Coca-Cola",
        detectedCategory: "Beverages",
        confidence: 0.94,
        location: "Food Court, Shopping Mall",
        estimatedSpend: "₹50",
        additionalItems: ["French Fries", "Burger"],
        emotion: "Happy",
        timeOfDay: "Afternoon"
      };
      
      setAiAnalysis(mockAnalysis);
      setFormData({
        ...formData,
        product: mockAnalysis.detectedProduct,
        brand: mockAnalysis.detectedBrand,
        category: mockAnalysis.detectedCategory,
        spend: mockAnalysis.estimatedSpend,
        location: mockAnalysis.location,
        combinedWith: mockAnalysis.additionalItems
      });
      
      setIsAnalyzing(false);
      toast({
        title: "AI Analysis Complete!",
        description: `Detected ${mockAnalysis.detectedProduct} with ${Math.round(mockAnalysis.confidence * 100)}% confidence`,
      });
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Calculate points based on submission
    let points = 10; // Base points
    if (selectedFile) points += 10; // Media bonus
    if (formData.notes.length > 50) points += 5; // Detailed description bonus

    setTimeout(() => {
      toast({
        title: "Consumption logged successfully! 🎉",
        description: `You earned ${points} points for this entry.`,
      });
      setIsSubmitting(false);
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-orange-100 pb-20 lg:pb-0">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Log Your Consumption</h1>
            <p className="text-gray-600">Capture your snacking moment and earn points!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Media Upload Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
                  AI-Powered Media Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedFile ? (
                  <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
                    <div className="flex justify-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <Mic className="h-6 w-6 text-white" />
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Video className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">Upload a photo, audio, or video of your consumption</p>
                    <input
                      type="file"
                      accept="image/*,audio/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="media-upload"
                    />
                    <label htmlFor="media-upload">
                      <Button type="button" className="bg-gradient-to-r from-orange-500 to-green-500" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </span>
                      </Button>
                    </label>
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
                        <div className="inline-flex items-center space-x-2 text-orange-600">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                          <span>AI is analyzing your media...</span>
                        </div>
                      </div>
                    )}

                    {aiAnalysis && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-3">AI Analysis Results</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-blue-600 font-medium">Product:</span>
                            <span className="ml-2 text-blue-800">{aiAnalysis.detectedProduct}</span>
                          </div>
                          <div>
                            <span className="text-blue-600 font-medium">Confidence:</span>
                            <span className="ml-2 text-blue-800">{Math.round(aiAnalysis.confidence * 100)}%</span>
                          </div>
                          <div>
                            <span className="text-blue-600 font-medium">Location:</span>
                            <span className="ml-2 text-blue-800">{aiAnalysis.location}</span>
                          </div>
                          <div>
                            <span className="text-blue-600 font-medium">Emotion:</span>
                            <span className="ml-2 text-blue-800">{aiAnalysis.emotion}</span>
                          </div>
                        </div>
                        {aiAnalysis.additionalItems.length > 0 && (
                          <div className="mt-3">
                            <span className="text-blue-600 font-medium text-sm">Also detected:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {aiAnalysis.additionalItems.map((item: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Entry Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200/50">
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
                      className="border-orange-200 focus:border-orange-400"
                      placeholder="e.g., Coca-Cola"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="border-orange-200 focus:border-orange-400"
                      placeholder="e.g., Coca-Cola"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger className="border-orange-200 focus:border-orange-400">
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
                        className="border-orange-200 focus:border-orange-400 pl-10"
                        placeholder="50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="companions">Who were you with?</Label>
                  <Select value={formData.companions} onValueChange={(value) => setFormData({...formData, companions: value})}>
                    <SelectTrigger className="border-orange-200 focus:border-orange-400">
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
                      className="border-orange-200 focus:border-orange-400 pl-10"
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
                    className="border-orange-200 focus:border-orange-400"
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
                className="flex-1 bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600"
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
                onClick={() => navigate("/dashboard")}
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogConsumption;
