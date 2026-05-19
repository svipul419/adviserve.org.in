// src/pages/admin/sections/AnalyticsTrafficSection.tsx
import {
  BarChart3, TrendingUp, Eye, Users, Globe, Monitor, Smartphone, Tablet,
  ArrowUpRight, ArrowDownRight, FileText,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface DailyCount {
  date: string;
  views: number;
  visitors: number;
}

interface PageStat {
  path: string;
  views: number;
  uniqueVisitors: number;
}

interface DeviceBreakdown {
  name: string;
  value: number;
  color: string;
}

interface ReferrerStat {
  source: string;
  visits: number;
}

type Props = {
  dailyData: DailyCount[];
  topPages: PageStat[];
  deviceBreakdown: DeviceBreakdown[];
  referrerStats: ReferrerStat[];
  totalViews: number;
  uniqueVisitors: number;
  avgSessionPages: number;
  bounceRate: number;
  viewsChange: number;
  visitorsChange: number;
  formatPagePath: (path: string) => string;
};

// -- Shared sub-components (used in Traffic, Marketing, and SEO sections) --

export function StatCard({
  title, value, change, icon, bgColor, subtitle, invertChange,
}: {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  bgColor: string;
  subtitle?: string;
  invertChange?: boolean;
}) {
  const isPositive = invertChange ? (change || 0) <= 0 : (change || 0) >= 0;
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{Math.abs(change)}% vs prev period</span>
        </div>
      )}
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <BarChart3 className="text-gray-300 mb-3" size={48} />
      <p className="text-gray-500 text-sm max-w-xs">{message}</p>
    </div>
  );
}

export function AnalyticsTrafficSection({
  dailyData, topPages, deviceBreakdown, referrerStats,
  totalViews, uniqueVisitors, avgSessionPages, bounceRate,
  viewsChange, visitorsChange, formatPagePath,
}: Props) {
  return (
    <>
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Page Views"
          value={totalViews.toLocaleString()}
          change={viewsChange}
          icon={<Eye className="text-oxblood-primary" size={24} />}
          bgColor="bg-oxblood-primary/10"
        />
        <StatCard
          title="Unique Visitors"
          value={uniqueVisitors.toLocaleString()}
          change={visitorsChange}
          icon={<Users className="text-green-600" size={24} />}
          bgColor="bg-green-50"
        />
        <StatCard
          title="Avg Pages/Session"
          value={avgSessionPages.toString()}
          icon={<FileText className="text-purple-600" size={24} />}
          bgColor="bg-purple-50"
        />
        <StatCard
          title="Bounce Rate"
          value={`${bounceRate}%`}
          icon={<TrendingUp className="text-orange-600" size={24} />}
          bgColor="bg-orange-50"
          invertChange
        />
      </div>

      {/* Traffic Overview Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Traffic Overview</h2>
        <p className="text-sm text-gray-500 mb-6">Page views and unique visitors over time</p>
        {dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7F1D1D" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7F1D1D" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="views" stroke="#7F1D1D" strokeWidth={2} fill="url(#viewsGradient)" name="Page Views" />
              <Area type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={2} fill="url(#visitorsGradient)" name="Visitors" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState message="No traffic data yet. Page views will appear here once visitors start browsing your site." />
        )}
      </div>

      {/* Middle Row: Top Pages + Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Top Pages</h2>
          <p className="text-sm text-gray-500 mb-4">Most visited pages on your website</p>
          {topPages.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Page</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase pb-3">Views</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase pb-3">Visitors</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase pb-3 hidden sm:table-cell">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topPages.map((page) => (
                    <tr key={page.path} className="hover:bg-gray-50">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <Globe size={14} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[250px]">
                            {formatPagePath(page.path)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 ml-5">{page.path}</span>
                      </td>
                      <td className="py-3 text-right text-sm font-semibold text-gray-900">{page.views}</td>
                      <td className="py-3 text-right text-sm text-gray-600">{page.uniqueVisitors}</td>
                      <td className="py-3 text-right text-sm text-gray-500 hidden sm:table-cell">
                        {totalViews > 0 ? Math.round((page.views / totalViews) * 100) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState message="No page data yet." />
          )}
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Devices</h2>
          <p className="text-sm text-gray-500 mb-4">Visitor device breakdown</p>
          {deviceBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={deviceBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 mt-4">
                {deviceBreakdown.map((device) => {
                  const Icon = device.name === 'Desktop' ? Monitor : device.name === 'Mobile' ? Smartphone : Tablet;
                  const percent = totalViews > 0 ? Math.round((device.value / totalViews) * 100) : 0;
                  return (
                    <div key={device.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }}></div>
                        <Icon size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-700">{device.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{percent}%</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <EmptyState message="No device data yet." />
          )}
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Traffic Sources</h2>
        <p className="text-sm text-gray-500 mb-4">Where your visitors are coming from</p>
        {referrerStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={referrerStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis dataKey="source" type="category" width={150} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Bar dataKey="visits" fill="#7F1D1D" radius={[0, 6, 6, 0]} name="Visits" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState message="No referrer data yet. Traffic source data will appear as visitors arrive from search engines and other sites." />
        )}
      </div>
    </>
  );
}
