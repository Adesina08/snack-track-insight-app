import { useState } from "react";
import { Calendar, Filter, BarChart3, TrendingUp, Package, Users, Download, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  onExportData: () => void;
  onFiltersChange: (filters: any) => void;
  className?: string;
}

const AdminSidebar = ({ onExportData, onFiltersChange, className }: AdminSidebarProps) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [timePeriod, setTimePeriod] = useState("30d");

  const categories = [
    { id: "all", name: "All Products", count: 247, color: "bg-primary" },
    { id: "breakfast", name: "Breakfast", count: 89, color: "bg-orange-500" },
    { id: "lunch", name: "Lunch", count: 92, color: "bg-green-500" },
    { id: "dinner", name: "Dinner", count: 78, color: "bg-blue-500" },
    { id: "snacks", name: "Snacks", count: 156, color: "bg-purple-500" },
    { id: "beverages", name: "Beverages", count: 203, color: "bg-cyan-500" },
  ];

  const topBrands = [
    { name: "Coca-Cola", percentage: 23, trend: "+5.2%" },
    { name: "Nestlé", percentage: 18, trend: "+3.1%" },
    { name: "Unilever", percentage: 15, trend: "-1.2%" },
    { name: "Danone", percentage: 12, trend: "+2.8%" },
    { name: "PepsiCo", percentage: 11, trend: "+1.5%" },
  ];

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    onFiltersChange({ category: categoryId, timePeriod });
  };

  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);
    onFiltersChange({ category: activeCategory, timePeriod: period });
  };

  return (
    <div className={cn("w-80 bg-card border-r border-border p-6 space-y-6", className)}>
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Analytics Dashboard</h2>
        <p className="text-sm text-muted-foreground">Monitor consumption patterns and trends</p>
      </div>

      {/* Export Action */}
      <Button onClick={onExportData} className="w-full gradient-primary hover-glow text-white">
        <Download className="h-4 w-4 mr-2" />
        Export Data
      </Button>

      {/* Time Period Filter */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-foreground">Time Period</h3>
        </div>
        <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-foreground">Categories</h3>
        </div>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={cn(
                "w-full p-3 rounded-lg border transition-all duration-200 text-left",
                activeCategory === category.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/50 hover:bg-accent/50"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn("w-3 h-3 rounded-full", category.color)} />
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Top Brands */}
      <Card className="border-border">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-foreground">Top Brands</h3>
          </div>
          <div className="space-y-3">
            {topBrands.map((brand, index) => (
              <div key={brand.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-primary rounded text-white text-xs flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{brand.name}</p>
                    <p className="text-xs text-muted-foreground">{brand.percentage}% share</p>
                  </div>
                </div>
                <Badge 
                  variant={brand.trend.startsWith('+') ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {brand.trend}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="border-border">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-foreground">Quick Stats</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Users</span>
              <span className="text-sm font-medium text-foreground">1,247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Daily Average</span>
              <span className="text-sm font-medium text-foreground">34.2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Growth Rate</span>
              <Badge className="text-xs">+12.5%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-border bg-gradient-accent/20">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-foreground">AI Insights</h3>
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>• Peak consumption: 2-4 PM daily</p>
            <p>• Weekend activity 23% higher</p>
            <p>• Breakfast items trending +18%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSidebar;