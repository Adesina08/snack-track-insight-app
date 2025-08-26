
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
      
      // Generate mock chart data for the simple dashboard
      const chartData = generateMockChartData();
      setTimeSeriesData(chartData.timeSeries);
      setCategoryData(chartData.categories);
      setBrandData(chartData.brands);
      
    } catch (error) {
      console.error('Error loading admin data:', error);
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
      { name: "Kellogg's", value: 35 },
      { name: "Dangote", value: 28 },
      { name: "Nestle", value: 22 },
      { name: "Burger King", value: 15 },
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
