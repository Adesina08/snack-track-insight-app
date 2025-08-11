
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Star, Trophy, Crown, Zap, Smartphone, Coffee, ShoppingBag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const Rewards = () => {
  const [userPoints, setUserPoints] = useState(1247);
  
  const redeemReward = (cost: number, reward: string) => {
    if (userPoints >= cost) {
      setUserPoints(userPoints - cost);
      toast({
        title: "Reward Redeemed! 🎉",
        description: `You have successfully redeemed ${reward}`,
      });
    } else {
      toast({
        title: "Insufficient Points",
        description: `You need ${cost - userPoints} more points to redeem this reward.`,
        variant: "destructive",
      });
    }
  };

  const rewardItems = [
    {
      id: 1,
      name: "₦500 MTN Airtime",
      description: "Mobile recharge for MTN network",
      cost: 500,
      icon: Smartphone,
      category: "airtime",
      popular: false
    },
    {
      id: 2,
      name: "₦1000 Airtel Data",
      description: "1GB data bundle for Airtel",
      cost: 800,
      icon: Smartphone,
      category: "data",
      popular: true
    },
    {
      id: 3,
      name: "₦2000 9mobile Airtime",
      description: "Mobile recharge for 9mobile network",
      cost: 1000,
      icon: Smartphone,
      category: "airtime",
      popular: false
    },
    {
      id: 4,
      name: "Jumia Voucher",
      description: "₦5000 Jumia shopping voucher",
      cost: 2000,
      icon: ShoppingBag,
      category: "voucher",
      popular: true
    },
    {
      id: 5,
      name: "Dominos Pizza",
      description: "Free medium pizza from Dominos Nigeria",
      cost: 1500,
      icon: Gift,
      category: "food",
      popular: false
    },
    {
      id: 6,
      name: "Netflix Naija",
      description: "1 month Netflix Nigeria subscription",
      cost: 1200,
      icon: Zap,
      category: "entertainment",
      popular: true
    },
    {
      id: 7,
      name: "Konga Voucher",
      description: "₦3000 Konga shopping voucher",
      cost: 1300,
      icon: ShoppingBag,
      category: "voucher",
      popular: false
    },
    {
      id: 8,
      name: "Glo Data Bundle",
      description: "2GB data bundle for Glo network",
      cost: 900,
      icon: Smartphone,
      category: "data",
      popular: true
    }
  ];

  const leaderboard = [
    { rank: 1, name: "Adebayo Lagos", points: 3450, avatar: "👑" },
    { rank: 2, name: "Fatima Kano", points: 3200, avatar: "🥈" },
    { rank: 3, name: "Emeka Enugu", points: 2890, avatar: "🥉" },
    { rank: 4, name: "Aisha Abuja", points: 2650, avatar: "⭐" },
    { rank: 5, name: "Tunde Ibadan", points: 2400, avatar: "🌟" },
    { rank: 6, name: "You", points: userPoints, avatar: "😊", isUser: true }
  ];

  const achievements = [
    {
      id: 1,
      name: "First Taste",
      description: "Log your first Nigerian meal",
      icon: "🍲",
      unlocked: true,
      progress: 100
    },
    {
      id: 2,
      name: "Media Guru",
      description: "Upload 10 videos of your meals",
      icon: "📹",
      unlocked: true,
      progress: 100
    },
    {
      id: 3,
      name: "Naija Socialite",
      description: "Log 20 meals with friends",
      icon: "👥",
      unlocked: false,
      progress: 65
    },
    {
      id: 4,
      name: "Daily Tracker",
      description: "Maintain a 30-day logging streak",
      icon: "🔥",
      unlocked: false,
      progress: 23
    },
    {
      id: 5,
      name: "State Explorer",
      description: "Log meals in 5 different Nigerian states",
      icon: "🗺️",
      unlocked: false,
      progress: 40
    },
    {
      id: 6,
      name: "Point Master",
      description: "Earn 5000 total points",
      icon: "💎",
      unlocked: false,
      progress: 25
    }
  ];

  return (
    <div className="min-h-screen gradient-secondary pb-20 lg:pb-0">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Naija Rewards & Achievements</h1>
          <p className="text-muted-foreground">Redeem your points for Nigerian rewards and track your progress</p>
        </div>

        {/* Points Overview */}
        <Card className="gradient-hero text-white mb-8 hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Points</h2>
                <p className="text-3xl font-bold">{userPoints.toLocaleString()}</p>
                <p className="opacity-90 mt-2">Keep logging your Naija meals to earn more!</p>
              </div>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="h-10 w-10" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="redeem" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 glass-effect">
            <TabsTrigger value="redeem">Redeem Points</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="redeem">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewardItems.map((reward) => (
                <Card key={reward.id} className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover-glow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                        <reward.icon className="h-6 w-6 text-white" />
                      </div>
                      {reward.popular && (
                        <Badge className="bg-green-600 text-white">Popular</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{reward.name}</CardTitle>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-blue-600 font-bold">
                        <Star className="h-4 w-4 mr-1" />
                        {reward.cost} pts
                      </div>
                      <Button
                        onClick={() => redeemReward(reward.cost, reward.name)}
                        disabled={userPoints < reward.cost}
                        className={userPoints >= reward.cost 
                          ? "gradient-primary hover-glow text-white" 
                          : ""}
                        size="sm"
                      >
                        {userPoints >= reward.cost ? "Redeem" : "Need More"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Naija Points Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        user.isUser ? "gradient-accent border-2 border-blue-300" : "bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                          user.rank === 1 ? "bg-yellow-500 text-white" :
                          user.rank === 2 ? "bg-gray-400 text-white" :
                          user.rank === 3 ? "bg-orange-500 text-white" :
                          "bg-blue-200 text-blue-700"
                        }`}>
                          {user.rank <= 3 ? user.avatar : user.rank}
                        </div>
                        <div>
                          <p className={`font-semibold ${user.isUser ? "text-blue-700" : "text-gray-800"}`}>
                            {user.name}
                            {user.isUser && " (You)"}
                          </p>
                          <p className="text-sm text-gray-600">Rank #{user.rank}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${user.isUser ? "text-blue-600" : "text-gray-800"}`}>
                          {user.points.toLocaleString()} pts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`glass-card ${
                  achievement.unlocked ? "ring-2 ring-green-300" : ""
                } hover-glow`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`text-4xl ${achievement.unlocked ? "grayscale-0" : "grayscale opacity-50"}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-800">{achievement.name}</h3>
                          {achievement.unlocked && (
                            <Badge className="bg-green-500 text-white">
                              <Crown className="h-3 w-3 mr-1" />
                              Unlocked
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                        {!achievement.unlocked && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="text-blue-600 font-medium">{achievement.progress}%</span>
                            </div>
                            <Progress value={achievement.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Rewards;
