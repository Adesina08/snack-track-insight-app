
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Gift, TrendingUp, Users, MapPin, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen gradient-secondary">
      {/* Header */}
      <header className="glass-effect border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 nigeria-accent rounded-full"></div>
            <h1 className="text-2xl font-bold text-gradient">SnacksTrack</h1>
          </div>
          <div className="flex space-x-3">
            <Link to="/login">
              <Button variant="outline" className="border-border text-primary hover:bg-secondary/50 glass-effect">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="gradient-primary hover-glow text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Track Your <span className="text-gradient">SNACKS</span> Consumption
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Capture your snacking moments with audio and video. Get rewarded for sharing your  snacking experiences and gain valuable insights into your consumption patterns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="gradient-primary hover-glow text-white px-8 py-3 text-lg">
                Start Tracking Now
              </Button>
            </Link>
            {/* <Button variant="outline" size="lg" className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 glass-effect px-8 py-3 text-lg">
              Watch Demo
            </Button> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-foreground mb-12">Features</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover-glow">
            <CardHeader>
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-foreground">AI-Powered Media Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Record audio or video of your meals. Our AI automatically extracts consumption details and context from your snacking experiences.</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover-glow">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-primary rounded-lg flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-foreground">Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Earn points for every log entry. Redeem for MTN/Airtel airtime, Jumia vouchers, and other Nigerian rewards.</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover-glow">
            <CardHeader>
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-foreground">Local Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Get detailed insights into your consumption patterns, spending habits, and favorite Nigerian brands and foods.</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover-glow">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-primary rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-foreground">Social Context</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Track who you ate with, what combinations you enjoyed, and your social dining experiences across Nigeria.</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover-glow">
            <CardHeader>
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-foreground">Location Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Automatically capture location data to understand your consumption patterns across different Nigerian cities and states.</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover-glow">
            <CardHeader>
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-foreground">Mobile First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Designed for mobile with offline support and push notifications to keep you engaged wherever you are in Nigeria.</p>
            </CardContent>
          </Card>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 nigeria-accent rounded-full"></div>
            <span className="text-xl font-bold">SnacksTrack</span>
          </div>
          <p className="text-primary/80">© 2025 Inicio Insights Tech Team.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
