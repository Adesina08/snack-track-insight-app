
import { useState, useEffect } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import AdminCharts from "@/components/AdminCharts";
import {
  googleSheetsService,
  buildConsumptionAnalytics,
  type ChartData,
} from "@/lib/googleSheets";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [timeSeriesData, setTimeSeriesData] = useState<ChartData[]>([]);
  const [categoryData, setCategoryData] = useState<ChartData[]>([]);
  const [brandData, setBrandData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "all", timePeriod: "30d" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const records = await googleSheetsService.fetchConsumptionRecords();
      const analytics = buildConsumptionAnalytics(records);

      if (!analytics.timeSeries.length && !analytics.categories.length && !analytics.brands.length) {
        setError("No Google Sheets data found for the configured range.");
      }

      setTimeSeriesData(analytics.timeSeries);
      setCategoryData(analytics.categories);
      setBrandData(analytics.brands);

    } catch (error) {
      console.error('Error loading admin data:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to load data from Google Sheets.'
      );

      const chartData = generateMockChartData();
      setTimeSeriesData(chartData.timeSeries);
      setCategoryData(chartData.categories);
      setBrandData(chartData.brands);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockChartData = () => {
    // Simple mock data for the dashboard
    const timeSeries: ChartData[] = [
      { name: "Week 1", value: 20 },
      { name: "Week 2", value: 15 },
      { name: "Week 3", value: 32 },
      { name: "Week 4", value: 25 },
      { name: "Week 5", value: 18 },
      { name: "Week 6", value: 28 },
    ];

    const categories: ChartData[] = [
      { name: "Breakfast", value: 25 },
      { name: "Lunch", value: 30 },
      { name: "Dinner", value: 20 },
      { name: "Snacks", value: 25 },
    ];

    const brands: ChartData[] = [
      { name: "Kellogg's", value: 35, secondary: 35 },
      { name: "Dangote", value: 28, secondary: 28 },
      { name: "Nestle", value: 22, secondary: 22 },
      { name: "Burger King", value: 15, secondary: 15 },
    ];

    return { timeSeries, categories, brands };
  };

  const exportData = async () => {
    // Mock export functionality
    console.log('Exporting data...');
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    console.log('Filters changed:', newFilters);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-foreground">Occasion Tracker</h1>
          </div>
        </div>
      </div>
      
      <div className="flex w-full">
        {/* Sidebar */}
        <AdminSidebar 
          onExportData={exportData}
          onFiltersChange={handleFiltersChange}
        />
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          {error && (
            <div className="mb-6 flex items-start space-x-3 rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm text-yellow-900 dark:text-yellow-100">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium">Google Sheets data notice</p>
                <p>{error}</p>
              </div>
            </div>
          )}
          <AdminCharts
            timeSeriesData={timeSeriesData}
            categoryData={categoryData}
            brandData={brandData}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
