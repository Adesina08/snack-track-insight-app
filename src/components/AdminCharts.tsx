import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calendar } from "lucide-react";
import type { ChartData } from "@/lib/googleSheets";

interface AdminChartsProps {
  timeSeriesData: ChartData[];
  categoryData: ChartData[];
  brandData: ChartData[];
}

const AdminCharts = ({ timeSeriesData, categoryData, brandData }: AdminChartsProps) => {
  const brandShareData = brandData.map((brand) => ({
    name: brand.name,
    value: brand.value,
  }));

  const brandLookup = new Map(brandData.map((brand) => [brand.name, brand.secondary ?? 0]));
  const topBrands = brandData.slice(0, 4);
  const topCategories = categoryData.slice(0, 6);

  const BrandTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = brandLookup.get(label) ?? 0;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">
            Share: {payload[0]?.value?.toFixed(1)}% ({total} logs)
          </p>
        </div>
      );
    }
    return null;
  };

  const TimeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">{payload[0]?.value ?? 0} logs</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="bg-background rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-foreground">Daily submissions</h3>
            <p className="text-sm text-muted-foreground">Entries pulled directly from Google Sheets</p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Showing {timeSeriesData.length} days</span>
          </div>
        </div>

        <div className="h-64">
          {timeSeriesData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  className="text-xs text-muted-foreground"
                  allowDecimals={false}
                />
                <Tooltip content={<TimeTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#timeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No dated submissions available.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-foreground">Brand share %</h3>
            <span className="text-xs text-muted-foreground">Calculated from Google Sheets brand column</span>
          </div>

          <div className="h-80">
            {brandShareData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={brandShareData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <defs>
                    <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
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
                    domain={[0, 100]}
                  />
                  <Tooltip content={<BrandTooltip />} />
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
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No brand information found in the sheet.
              </div>
            )}
          </div>
        </div>

        <div className="bg-background rounded-lg p-6">
          <h3 className="text-lg font-medium text-foreground">Top categories</h3>
          <p className="text-xs text-muted-foreground">Based on category entries from Google Sheets</p>
          <div className="mt-4 space-y-4">
            {topCategories.length ? (
              topCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">{category.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{category.value} logs</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No category information found.</p>
            )}
          </div>
        </div>
      </div>

      {topBrands.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topBrands.map((brand) => (
            <div key={brand.name} className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Brand</p>
                  <p className="font-medium text-foreground">{brand.name}</p>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {Number.isFinite(brand.value) ? brand.value.toFixed(1) : "0.0"}%
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{brand.secondary ?? 0} submissions logged</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default AdminCharts;