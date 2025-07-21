
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Camera, TrendingUp, Download, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const AdminDashboard = () => {
  const [submissions] = useState([
    {
      id: 1,
      user: "Sarah Wilson",
      product: "Coca-Cola",
      category: "Beverages",
      time: "2 hours ago",
      status: "approved",
      hasMedia: true,
      aiConfidence: 94,
      location: "Mall Food Court"
    },
    {
      id: 2,
      user: "Mike Johnson",
      product: "Lay's Chips",
      category: "Snacks",
      time: "4 hours ago",
      status: "pending",
      hasMedia: false,
      aiConfidence: null,
      location: "Office"
    },
    {
      id: 3,
      user: "Alex Kumar",
      product: "Maggi Noodles",
      category: "Noodles",
      time: "1 day ago",
      status: "flagged",
      hasMedia: true,
      aiConfidence: 67,
      location: "Home"
    }
  ]);

  const dailySubmissions = [
    { date: '2024-01-15', submissions: 45 },
    { date: '2024-01-16', submissions: 52 },
    { date: '2024-01-17', submissions: 38 },
    { date: '2024-01-18', submissions: 67 },
    { date: '2024-01-19', submissions: 58 },
    { date: '2024-01-20', submissions: 72 },
    { date: '2024-01-21', submissions: 84 }
  ];

  const categoryData = [
    { name: 'Beverages', value: 35, color: '#f97316' },
    { name: 'Snacks', value: 28, color: '#22c55e' },
    { name: 'Noodles', value: 20, color: '#3b82f6' },
    { name: 'Dairy', value: 12, color: '#a855f7' },
    { name: 'Others', value: 5, color: '#6b7280' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'flagged':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Flagged</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-orange-100">
      {/* Admin Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-green-500 rounded-full"></div>
              <h1 className="text-2xl font-bold text-gray-800">SnackTrack Admin</h1>
            </div>
            <Badge className="bg-purple-500">Admin Panel</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor user activity and manage the platform</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-orange-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-blue-600">2,847</p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Today's Submissions</p>
                  <p className="text-2xl font-bold text-green-600">84</p>
                  <p className="text-xs text-green-600">+8% from yesterday</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Media Uploads</p>
                  <p className="text-2xl font-bold text-purple-600">1,234</p>
                  <p className="text-xs text-green-600">68% with media</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600">23</p>
                  <p className="text-xs text-orange-600">Needs attention</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
            <TabsTrigger value="export">Export Data</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Submissions Chart */}
              <Card className="bg-white/80 backdrop-blur-sm border-orange-200/50">
                <CardHeader>
                  <CardTitle>Daily Submissions (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailySubmissions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="submissions" stroke="#f97316" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card className="bg-white/80 backdrop-blur-sm border-orange-200/50">
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="submissions">
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200/50">
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-green-400 rounded-lg flex items-center justify-center">
                          {submission.hasMedia ? <Camera className="h-5 w-5 text-white" /> : <Eye className="h-5 w-5 text-white" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{submission.product}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>by {submission.user}</span>
                            <span>{submission.location}</span>
                            <span>{submission.time}</span>
                            {submission.aiConfidence && (
                              <span className="text-blue-600">AI: {submission.aiConfidence}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(submission.status)}
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-orange-200/50">
                <CardHeader>
                  <CardTitle>User Data Export</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">Export user consumption data and analytics</p>
                  <div className="space-y-2">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-green-500">
                      <Download className="h-4 w-4 mr-2" />
                      Export All Users (CSV)
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Last 30 Days (Excel)
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Analytics (PDF)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-orange-200/50">
                <CardHeader>
                  <CardTitle>Media Archive</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">Download user-submitted media files</p>
                  <div className="space-y-2">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500">
                      <Download className="h-4 w-4 mr-2" />
                      Download All Media (ZIP)
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Photos Only (ZIP)
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Videos Only (ZIP)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
