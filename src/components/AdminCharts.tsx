import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

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

const brands = [
  { name: "Kellogg's", category: "breakfast", icon: "🥣" },
  { name: "Dangote", category: "lunch", icon: "🍜" },
  { name: "Suya Bistro", category: "dinner", icon: "🍽️" },
  { name: "Burger King", category: "snack", icon: "🍔" },
];

const products = [
  "Milk Chocolate", "Nestle Milk", "Dangote Spaghetti", "Bread Soft Bimbo", 
  "Rice Basmati", "Tea Herbal Twinings", "Dangote Chicken", "Five alive", 
  "Quaker Syrup", "Kellogg's Cornflakes"
];

const AdminCharts = ({ timeSeriesData }: AdminChartsProps) => {
  // Generate mock brand share data
  const brandShareData = products.map((product, index) => ({
    name: product,
    value: Math.random() * 30 + 5, // Random percentage between 5-35%
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">
            Brand share: {payload[0]?.value?.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header with tabs */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-8">
          <button className="text-sm text-muted-foreground hover:text-foreground">Product Share</button>
          <button className="text-sm font-medium text-primary border-b-2 border-primary pb-1">Brand share</button>
          <button className="text-sm text-muted-foreground hover:text-foreground">Product mix</button>
          <button className="text-sm text-muted-foreground hover:text-foreground">Product source</button>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            10 Mar - 18 Jul
          </Button>
          <Button size="sm" className="text-xs">
            Download
          </Button>
        </div>
      </div>

      {/* Popular brand cards */}
      <div className="grid grid-cols-4 gap-6">
        {brands.map((brand) => (
          <div key={brand.name} className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-lg">
                {brand.icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Popular {brand.category} brand</p>
                <p className="font-medium text-foreground">{brand.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Brand share chart */}
      <div className="bg-background rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-foreground">Brand share %</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Button variant="outline" size="sm" className="text-xs">
              Weekly
            </Button>
          </div>
        </div>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={brandShareData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <defs>
                <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
                label={{ value: '%', angle: 0, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8B5CF6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#brandGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;