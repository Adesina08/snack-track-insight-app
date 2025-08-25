
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Award, Database, Download, Calendar, BarChart3, Activity } from "lucide-react";
import Navigation from "@/components/Navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminCharts from "@/components/AdminCharts";
import { dbOperations } from "@/lib/database";

interface AdminStats {
  totalUsers: number;
  totalLogs: number;
  totalPoints: number;
  recentActivity: any[];
}

interface ChartData {
  name: string;
  value: number;
  growth?: number;
  secondary?: number;
}

interface ActivityData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalLogs: 0,
    totalPoints: 0,
    recentActivity: []
  });
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<ChartData[]>([]);
  const [categoryData, setCategoryData] = useState<ChartData[]>([]);
  const [brandData, setBrandData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "all", timePeriod: "30d" });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // Load consumption logs for analytics
      const logs = await dbOperations.getAllConsumptionLogs();
      const analytics = await dbOperations.getConsumptionAnalytics();
      
      // Calculate stats
      const totalLogs = logs.length;
      const totalPoints = logs.reduce((sum, log) => sum + (log.points || 0), 0);
      const uniqueUsers = new Set(logs.map(log => log.userId)).size;
      
      setStats({
        totalUsers: uniqueUsers,
        totalLogs,
        totalPoints,
        recentActivity: logs.slice(0, 10)
      });

      // Generate activity heatmap data (last 365 days)
      const heatmapData = generateActivityHeatmap(analytics);
      setActivityData(heatmapData);

      // Generate chart data
      const chartData = generateChartData(logs, analytics);
      setTimeSeriesData(chartData.timeSeries);
      setCategoryData(chartData.categories);
      setBrandData(chartData.brands);
      
    } catch (error) {
      console.error('Error loading admin data:', error);
      // Set fallback activity data to prevent empty array error
      setActivityData(generateFallbackActivityData());
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackActivityData = (): ActivityData[] => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 365);
    
    const data: ActivityData[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      data.push({
        date: dateStr,
        count: 0,
        level: 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };

  const generateActivityHeatmap = (analytics: any[]): ActivityData[] => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 365);
    
    const activityMap = new Map<string, number>();
    
    // Count activities per day
    analytics.forEach(log => {
      const date = new Date(log.createdAt).toISOString().split('T')[0];
      activityMap.set(date, (activityMap.get(date) || 0) + 1);
    });
    
    // Generate data for each day
    const data: ActivityData[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = activityMap.get(dateStr) || 0;
      
      // Convert count to level (0-4)
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0) level = 1;
      if (count > 2) level = 2;
      if (count > 5) level = 3;
      if (count > 10) level = 4;
      
      data.push({
        date: dateStr,
        count,
        level
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };

  const generateChartData = (logs: any[], analytics: any[]) => {
    // Time series data (last 30 days)
    const timeSeries: ChartData[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLogs = logs.filter(log => 
        new Date(log.createdAt).toISOString().split('T')[0] === dateStr
      );
      
      const dayUsers = new Set(dayLogs.map(log => log.userId)).size;
      
      timeSeries.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: dayLogs.length,
        secondary: dayUsers,
        growth: Math.floor(Math.random() * 20) + 5 // Mock growth data
      });
    }

    // Category data
    const categoryMap = new Map<string, number>();
    logs.forEach(log => {
      const count = categoryMap.get(log.category) || 0;
      categoryMap.set(log.category, count + 1);
    });

    const categories: ChartData[] = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      growth: Math.floor(Math.random() * 30) - 10 // Mock growth percentage
    }));

    // Brand data (top 10 brands over time)
    const brandMap = new Map<string, number>();
    logs.forEach(log => {
      if (log.brand) {
        const count = brandMap.get(log.brand) || 0;
        brandMap.set(log.brand, count + 1);
      }
    });

    const topBrands = Array.from(brandMap.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6);

    const brands: ChartData[] = topBrands.map(([name, value]) => ({
      name,
      value,
      growth: Math.floor(Math.random() * 40) + 10 // Mock growth data
    }));

    return { timeSeries, categories, brands };
  };

  const exportData = async () => {
    try {
      const logs = await dbOperations.getAllConsumptionLogs();
      const csvContent = [
        'Date,User,Product,Brand,Category,Spend,Method,Points',
        ...logs.map(log => [
          new Date(log.createdAt).toLocaleDateString(),
          `${log.users?.firstName} ${log.users?.lastName}`,
          log.product,
          log.brand || '',
          log.category,
          log.spend || 0,
          log.captureMethod,
          log.points
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consumption-logs-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    // In a real app, this would trigger data refetch with new filters
    console.log('Filters changed:', newFilters);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex">
          <div className="w-80 bg-card border-r border-border p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex w-full">
        {/* Sidebar */}
        <AdminSidebar 
          onExportData={exportData}
          onFiltersChange={handleFiltersChange}
        />
        
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Monitor consumption patterns and user engagement</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-border hover-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
                    <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalLogs}</p>
                    <p className="text-xs text-green-600 mt-1">+23.1% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalPoints}</p>
                    <p className="text-xs text-green-600 mt-1">+18.7% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg/User</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.totalUsers > 0 ? Math.round(stats.totalLogs / stats.totalUsers) : 0}
                    </p>
                    <p className="text-xs text-green-600 mt-1">+8.3% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <AdminCharts 
            timeSeriesData={timeSeriesData}
            categoryData={categoryData}
            brandData={brandData}
          />

          {/* Recent Activity */}
          <Card className="border-border hover-glow mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-primary" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.slice(0, 5).map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-accent/10 rounded-lg border border-border">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <Database className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{log.users?.firstName} {log.users?.lastName}</p>
                          <p className="text-sm text-muted-foreground">
                            Logged {log.product} • {log.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={log.captureMethod === 'ai' ? 'default' : 'secondary'}>
                          {log.captureMethod}
                        </Badge>
                        <span className="text-sm font-medium text-green-600">+{log.points} pts</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
