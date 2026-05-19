// src/pages/admin/sections/AnalyticsMarketingSection.tsx
import { Mail, MessageSquare, FileText, Search } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { StatCard, EmptyState } from './AnalyticsTrafficSection';

type Props = {
  totalInquiries: number;
  totalSubscribers: number;
  publishedPosts: number;
  totalBlogPosts: number;
  seoScore: number;
  seoHealth: { complete: number; partial: number; missing: number };
  inquiryTrend: { date: string; count: number }[];
  subscriberTrend: { date: string; count: number }[];
};

export function AnalyticsMarketingSection({
  totalInquiries, totalSubscribers, publishedPosts, totalBlogPosts,
  seoScore, seoHealth, inquiryTrend, subscriberTrend,
}: Props) {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Mail size={22} className="text-oxblood-primary" />
        Marketing & Engagement
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="New Inquiries"
          value={totalInquiries.toString()}
          icon={<MessageSquare className="text-teal-600" size={24} />}
          bgColor="bg-teal-50"
        />
        <StatCard
          title="New Subscribers"
          value={totalSubscribers.toString()}
          icon={<Mail className="text-indigo-600" size={24} />}
          bgColor="bg-indigo-50"
        />
        <StatCard
          title="Blog Posts"
          value={`${publishedPosts}/${totalBlogPosts}`}
          subtitle="Published / Total"
          icon={<FileText className="text-pink-600" size={24} />}
          bgColor="bg-pink-50"
        />
        <StatCard
          title="SEO Score"
          value={`${seoScore}%`}
          subtitle={`${seoHealth.complete} complete, ${seoHealth.partial} partial, ${seoHealth.missing} missing`}
          icon={<Search className="text-amber-600" size={24} />}
          bgColor="bg-amber-50"
        />
      </div>

      {/* Inquiry & Subscriber Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Inquiry Trends</h3>
          <p className="text-sm text-gray-500 mb-4">Contact form submissions over time</p>
          {inquiryTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={inquiryTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="count" fill="#7F1D1D" radius={[6, 6, 0, 0]} name="Inquiries" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No inquiries in this period." />
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Subscriber Growth</h3>
          <p className="text-sm text-gray-500 mb-4">New email subscribers over time</p>
          {subscriberTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={subscriberTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} name="Subscribers" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No new subscribers in this period." />
          )}
        </div>
      </div>
    </div>
  );
}
