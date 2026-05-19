import { RefreshCw } from 'lucide-react';

type DateRange = '7d' | '30d' | '90d';

interface AnalyticsDashboardHeaderProps {
  dateRange: DateRange;
  refreshing: boolean;
  onDateRangeChange: (range: DateRange) => void;
  onRefresh: () => void;
}

export function AnalyticsDashboardHeader({ dateRange, refreshing, onDateRangeChange, onRefresh }: AnalyticsDashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Website performance, marketing & SEO insights</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['7d', '30d', '90d'] as DateRange[]).map((range) => (
            <button
              key={range}
              onClick={() => onDateRangeChange(range)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                dateRange === range ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
    </div>
  );
}
