
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Gift, TrendingUp, Users, MapPin, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-orange-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-green-500 rounded-full"></div>
            <h1 className="text-2xl font-bold text-gray-800">SnackTrack</h1>
          </div>
          <div className="flex space-x-3">
            <Link to="/login">
              <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">Out-of-Home</span> Consumption
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Capture your food moments with photos, audio, or video. Get rewarded for sharing your snacking experiences and gain valuable insights into your consumption patterns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white px-8 py-3 text-lg">
                Start Tracking Now
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Powerful Features</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white/70 backdrop-blur-sm border-orange-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">AI-Powered Media Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Upload photos, audio, or video of your meals. Our AI automatically extracts consumption details and context.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-orange-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Reward System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Earn points for every log entry. Redeem rewards, climb leaderboards, and unlock achievements.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-orange-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Insights & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Get detailed insights into your consumption patterns, spending habits, and favorite brands.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-orange-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Social Context</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Track who you ate with, what combinations you enjoyed, and your social dining experiences.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-orange-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Location Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Automatically capture location data to understand your consumption patterns across different places.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-orange-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Mobile First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Designed for mobile with offline support and push notifications to keep you engaged.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-green-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h3>
          <p className="text-xl mb-8 opacity-90">Join thousands of users already tracking their consumption and earning rewards.</p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Sign Up Free Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-green-500 rounded-full"></div>
            <span className="text-xl font-bold">SnackTrack</span>
          </div>
          <p className="text-gray-400">© 2024 SnackTrack. Empowering better consumption insights.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
