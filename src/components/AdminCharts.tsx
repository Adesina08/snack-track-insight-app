import { Line, LineChart, Area, AreaChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, Users, BarChart3 } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  growth?: number;
  secondary?: number;
}

interface AdminChartsProps {
  timeSeriesData: ChartData[];
  categoryData: ChartData[];
  brandData: ChartData[];
}

const AdminCharts = ({ timeSeriesData, categoryData, brandData }: AdminChartsProps) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-muted-foreground">
              <span style={{ color: entry.color }}>●</span> {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Consumption Trends */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Consumption Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent-foreground))" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="hsl(var(--accent-foreground))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs text-muted-foreground"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs text-muted-foreground"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#consumptionGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="secondary"
                  stroke="hsl(var(--accent-foreground))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#growthGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">+23.5%</p>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">847</p>
              <p className="text-xs text-muted-foreground">daily average</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">1.2k</p>
              <p className="text-xs text-muted-foreground">peak day</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Category Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs text-muted-foreground"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs text-muted-foreground"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Brand Performance */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Brand Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={brandData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs text-muted-foreground"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs text-muted-foreground"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="growth"
                    stroke="hsl(var(--accent-foreground))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: 'hsl(var(--accent-foreground))', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Engagement Heatmap */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Daily User Engagement</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent-foreground))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--accent-foreground))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="secondary"
                  stroke="hsl(var(--accent-foreground))"
                  strokeWidth={1}
                  fillOpacity={1}
                  fill="url(#engagementGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCharts;