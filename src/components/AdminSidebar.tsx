import { ChevronRight } from "lucide-react";

interface AdminSidebarProps {
  onExportData: () => void;
  onFiltersChange: (filters: any) => void;
  className?: string;
}

const filterCategories = [
  "All brands",
  "LSM Level", 
  "Age group",
  "Meal-time",
  "Gender",
  "Household",
  "Country",
  "Region",
  "Marital status",
  "Income level"
];

const AdminSidebar = ({ onExportData, onFiltersChange, className }: AdminSidebarProps) => {
  return (
    <div className="w-64 bg-background border-r border-border p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-1">Filters</h2>
      </div>

      {/* Filter Categories */}
      <div className="space-y-1">
        {filterCategories.map((category) => (
          <div
            key={category}
            className="flex items-center justify-between py-3 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
            onClick={() => onFiltersChange({ category: category.toLowerCase() })}
          >
            <span>{category}</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;