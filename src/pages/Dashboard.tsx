
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
      product: "Coca-Cola",
      category: "Beverages",
      time: "2 hours ago",
      location: "Mall Food Court",
      points: 15,
      hasMedia: true,
      companions: "With friends"
    },
    {
      id: 2,
      product: "Lay's Chips",
      category: "Snacks",
      time: "Yesterday",
      location: "Office Cafeteria",
      points: 10,
      hasMedia: false,
      companions: "Alone"
    },
    {
      id: 3,
      product: "Maggi Noodles",
      category: "Noodles",
      time: "2 days ago",
      location: "Home",
      points: 20,
      hasMedia: true,
      companions: "With family"
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-orange-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, Sarah! 👋</h1>
          <p className="text-gray-600">Ready to log another delicious moment?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-orange-200/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Points</p>
                  <p className="text-2xl font-bold text-orange-600">1,247</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">This Week</p>
                  <p className="text-2xl font-bold text-green-600">12 logs</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Streak</p>
                  <p className="text-2xl font-bold text-blue-600">7 days</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Rank</p>
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
            <Card className="bg-gradient-to-r from-orange-500 to-green-500 text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Log New Consumption</h3>
                    <p className="opacity-90">Capture your latest snacking moment</p>
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
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">View Rewards</h3>
                  <p className="text-sm text-gray-600">Check available rewards and redeem points</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Weekly Progress */}
        <Card className="bg-white/80 backdrop-blur-sm border-orange-200/50 mb-8">
          <CardHeader>
            <CardTitle className="text-gray-800">Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Daily Goal Progress</span>
                  <span>12/14 logs this week</span>
                </div>
                <Progress value={85} className="h-3" />
              </div>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      index < 5 ? 'bg-green-500 text-white' : index === 5 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index < 6 ? '✓' : ''}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{day}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border-orange-200/50">
          <CardHeader>
            <CardTitle className="text-gray-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-green-400 rounded-lg flex items-center justify-center">
                      {log.hasMedia ? <Camera className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{log.product}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
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
                    <p className="text-sm font-semibold text-orange-600">+{log.points} points</p>
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
