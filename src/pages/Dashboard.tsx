
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, Plus, Gift, TrendingUp, MapPin, Clock, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Dashboard = () => {
  const [recentLogs] = useState([
    {
      id: 1,
      product: "Jollof Rice",
      category: "Rice Dishes",
      time: "2 hours ago",
      location: "Lagos, Victoria Island",
      points: 15,
      hasMedia: true,
      companions: "With friends"
    },
    {
      id: 2,
      product: "Suya",
      category: "Grilled Meat",
      time: "Yesterday",
      location: "Abuja, Wuse Market",
      points: 10,
      hasMedia: false,
      companions: "Alone"
    },
    {
      id: 3,
      product: "Pounded Yam & Egusi",
      category: "Traditional",
      time: "2 days ago",
      location: "Ibadan, Home",
      points: 20,
      hasMedia: true,
      companions: "With family"
    }
  ]);

  return (
    <div className="min-h-screen gradient-secondary">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Welcome back, Adunni! 👋</h1>
          <p className="text-muted-foreground">Ready to log another delicious Naija meal?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Points</p>
                  <p className="text-2xl font-bold text-primary">1,247</p>
                </div>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">This Week</p>
                  <p className="text-2xl font-bold text-blue-600">12 logs</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Streak</p>
                  <p className="text-2xl font-bold text-blue-600">7 days</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Rank</p>
                  <p className="text-2xl font-bold text-purple-600">#24</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/log" className="lg:col-span-2">
            <Card className="gradient-primary text-white hover-glow hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Log New Naija Meal</h3>
                    <p className="opacity-90">Capture your latest Nigerian food experience</p>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Camera className="h-5 w-5" />
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Plus className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/rewards">
            <Card className="glass-card hover-glow hover:-translate-y-1 cursor-pointer transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">View Rewards</h3>
                  <p className="text-sm text-muted-foreground">Check available Nigerian rewards and redeem points</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Weekly Progress */}
        <Card className="glass-card hover-glow mb-8">
          <CardHeader>
            <CardTitle className="text-gradient">Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Daily Goal Progress</span>
                  <span>12/14 logs this week</span>
                </div>
                <Progress value={85} className="h-3" />
              </div>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      index < 5 ? 'bg-green-500 text-white' : index === 5 ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      {index < 6 ? '✓' : ''}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{day}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card hover-glow">
          <CardHeader>
            <CardTitle className="text-gradient">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 glass-effect rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                      {log.hasMedia ? <Camera className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{log.product}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {log.location}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {log.companions}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {log.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-2">
                      {log.category}
                    </Badge>
                    <p className="text-sm font-semibold text-primary">+{log.points} points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
