
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Bell, Camera, Star, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: "Adunni",
    lastName: "Okafor",
    email: "adunni.okafor@email.com",
    phone: "+234 803 123 4567",
    location: "Lagos, Nigeria"
  });

  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailUpdates: true,
    weeklyReport: false,
    rewardAlerts: true
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated successfully!",
      description: "Your profile information has been saved.",
    });
  };

  const userStats = [
    { label: "Total Points", value: "1,247", icon: Star, color: "text-primary" },
    { label: "Total Logs", value: "89", icon: TrendingUp, color: "text-blue-600" },
    { label: "Current Streak", value: "7 days", icon: TrendingUp, color: "text-blue-600" },
    { label: "Rank", value: "#24", icon: Star, color: "text-purple-600" }
  ];

  const recentActivity = [
    { action: "Logged Jollof Rice", time: "2 hours ago", points: "+15" },
    { action: "Redeemed ₦1,000 Airtime", time: "1 day ago", points: "-500" },
    { action: "Logged Suya", time: "2 days ago", points: "+10" },
    { action: "Achieved 'Naija Foodie'", time: "3 days ago", points: "+50" }
  ];

  return (
    <div className="min-h-screen gradient-secondary pb-20 lg:pb-0">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="glass-card hover-glow">
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/placeholder.svg" alt="Profile" />
                      <AvatarFallback className="gradient-primary text-white text-2xl">
                        AO
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white hover-glow">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {profileData.firstName} {profileData.lastName}
                  </h3>
                  <p className="text-muted-foreground mb-4">{profileData.email}</p>
                  <Badge className="gradient-primary text-white">
                    Active Naija Foodie
                  </Badge>
                </CardContent>
              </Card>

              {/* User Stats */}
              <Card className="glass-card hover-glow">
                <CardHeader>
                  <CardTitle className="text-gradient">Your Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userStats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 glass-effect rounded-lg flex items-center justify-center">
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                          </div>
                          <span className="text-muted-foreground">{stat.label}</span>
                        </div>
                        <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Settings */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center text-gradient">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        className="glass-effect"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        className="glass-effect"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="glass-effect pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="glass-effect pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location in Nigeria</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="glass-effect pl-10"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} className="gradient-primary hover-glow text-white">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="glass-card hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center text-gradient">
                    <Bell className="h-5 w-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive reminders and updates</p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Email Updates</p>
                      <p className="text-sm text-muted-foreground">Get news and feature updates via email</p>
                    </div>
                    <Switch
                      checked={notifications.emailUpdates}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailUpdates: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Weekly Report</p>
                      <p className="text-sm text-muted-foreground">Receive weekly consumption insights</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) => setNotifications({...notifications, weeklyReport: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Reward Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified about new Nigerian rewards and achievements</p>
                    </div>
                    <Switch
                      checked={notifications.rewardAlerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, rewardAlerts: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="glass-card hover-glow">
                <CardHeader>
                  <CardTitle className="text-gradient">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 glass-effect rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                        <Badge variant={activity.points.startsWith('+') ? "default" : "secondary"}>
                          {activity.points} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
