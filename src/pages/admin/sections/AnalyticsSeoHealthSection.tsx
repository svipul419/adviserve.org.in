// src/pages/admin/sections/AnalyticsSeoHealthSection.tsx
import { Search } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { EmptyState } from './AnalyticsTrafficSection';

type Props = {
  seoHealth: { complete: number; partial: number; missing: number };
  seoScore: number;
  seoTotal: number;
  totalBlogPosts: number;
  publishedPosts: number;
};

function RecommendationItem({
  type, title, description, link,
}: {
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  link: string;
}) {
  const colors = {
    error: { bg: 'bg-red-50', dot: 'bg-red-500', text: 'text-red-800', desc: 'text-red-600' },
    warning: { bg: 'bg-amber-50', dot: 'bg-amber-500', text: 'text-amber-800', desc: 'text-amber-600' },
    info: { bg: 'bg-oxblood-primary/10', dot: 'bg-oxblood-primary', text: 'text-oxblood-primary', desc: 'text-oxblood-primary/80' },
  };
  const c = colors[type];
  return (
    <a href={link} className={`flex items-start gap-3 p-3 ${c.bg} rounded-lg hover:opacity-90 transition-opacity`}>
      <div className={`w-2 h-2 rounded-full ${c.dot} mt-1.5 flex-shrink-0`}></div>
      <div>
        <p className={`text-sm font-medium ${c.text}`}>{title}</p>
        <p className={`text-xs ${c.desc}`}>{description}</p>
      </div>
    </a>
  );
}

export function AnalyticsSeoHealthSection({
  seoHealth, seoScore, seoTotal, totalBlogPosts, publishedPosts,
}: Props) {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Search size={22} className="text-green-600" />
        SEO Health Overview
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Score Gauge */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Meta Tag Coverage</h3>
          {seoTotal > 0 ? (
            <div className="flex items-center gap-8">
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Complete', value: seoHealth.complete, fill: '#22c55e' },
                        { name: 'Partial', value: seoHealth.partial, fill: '#f59e0b' },
                        { name: 'Missing', value: seoHealth.missing, fill: '#ef4444' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {[
                        { fill: '#22c55e' },
                        { fill: '#f59e0b' },
                        { fill: '#ef4444' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{seoScore}%</span>
                </div>
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-700">Complete</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{seoHealth.complete}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-gray-700">Partial</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{seoHealth.partial}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-gray-700">Missing</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{seoHealth.missing}</span>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState message="No content items to analyze." />
          )}
        </div>

        {/* SEO Recommendations */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Recommendations</h3>
          <div className="space-y-3">
            {seoHealth.missing > 0 && (
              <RecommendationItem
                type="error"
                title={`${seoHealth.missing} items missing meta tags`}
                description="Add meta titles and descriptions to improve search visibility"
                link="/admin/seo"
              />
            )}
            {seoHealth.partial > 0 && (
              <RecommendationItem
                type="warning"
                title={`${seoHealth.partial} items have partial SEO`}
                description="Complete both meta title and description for best results"
                link="/admin/seo"
              />
            )}
            {totalBlogPosts > 0 && publishedPosts < totalBlogPosts && (
              <RecommendationItem
                type="info"
                title={`${totalBlogPosts - publishedPosts} unpublished blog posts`}
                description="Publishing content regularly helps improve search rankings"
                link="/admin/blog"
              />
            )}
            {seoHealth.complete === seoTotal && seoTotal > 0 && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">All meta tags are complete!</p>
                  <p className="text-xs text-green-600">Your SEO metadata is in great shape.</p>
                </div>
              </div>
            )}
            <RecommendationItem
              type="info"
              title="Keep content fresh"
              description="Regularly update pages and publish blog posts for better SEO"
              link="/admin/blog"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
