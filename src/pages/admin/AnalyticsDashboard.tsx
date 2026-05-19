import { useEffect, useState } from 'react';
import { adminDb } from '../../lib/adminDb';
import { AnalyticsTrafficSection } from './sections/AnalyticsTrafficSection';
import { AnalyticsMarketingSection } from './sections/AnalyticsMarketingSection';
import { AnalyticsSeoHealthSection } from './sections/AnalyticsSeoHealthSection';
import { AnalyticsDashboardHeader } from './sections/AnalyticsDashboardHeader';
import { AnalyticsLoadingSkeleton } from './sections/AnalyticsLoadingSkeleton';
import { type DailyCount, type PageStat, type DeviceBreakdown, type ReferrerStat, type DateRange } from './sections/analyticsTypes';

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  // Analytics data
  const [dailyData, setDailyData] = useState<DailyCount[]>([]);
  const [topPages, setTopPages] = useState<PageStat[]>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<DeviceBreakdown[]>([]);
  const [referrerStats, setReferrerStats] = useState<ReferrerStat[]>([]);

  // Summary stats
  const [totalViews, setTotalViews] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [avgSessionPages, setAvgSessionPages] = useState(0);
  const [bounceRate, setBounceRate] = useState(0);

  // Comparison stats
  const [prevTotalViews, setPrevTotalViews] = useState(0);
  const [prevUniqueVisitors, setPrevUniqueVisitors] = useState(0);

  // Marketing & SEO stats
  const [totalInquiries, setTotalInquiries] = useState(0);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [inquiryTrend, setInquiryTrend] = useState<{ date: string; count: number }[]>([]);
  const [subscriberTrend, setSubscriberTrend] = useState<{ date: string; count: number }[]>([]);
  const [seoHealth, setSeoHealth] = useState({ complete: 0, partial: 0, missing: 0 });
  const [totalBlogPosts, setTotalBlogPosts] = useState(0);
  const [publishedPosts, setPublishedPosts] = useState(0);

  useEffect(() => {
    fetchAllData();
  }, [dateRange]);

  const getDaysFromRange = (range: DateRange): number => {
    switch (range) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchPageAnalytics(),
      fetchMarketingData(),
      fetchSeoHealth(),
    ]);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  const fetchPageAnalytics = async () => {
    const days = getDaysFromRange(dateRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const prevStartDate = new Date();
    prevStartDate.setDate(prevStartDate.getDate() - days * 2);

    const { data: currentData } = await adminDb
      .from('page_analytics')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    const { data: prevData } = await adminDb
      .from('page_analytics')
      .select('session_id')
      .gte('created_at', prevStartDate.toISOString())
      .lt('created_at', startDate.toISOString());

    const views = currentData || [];
    setTotalViews(views.length);

    const uniqueSessions = new Set(views.map((v: { session_id: string }) => v.session_id));
    setUniqueVisitors(uniqueSessions.size);

    const prevViews = prevData || [];
    setPrevTotalViews(prevViews.length);
    const prevUnique = new Set(prevViews.map((v: { session_id: string }) => v.session_id));
    setPrevUniqueVisitors(prevUnique.size);

    if (uniqueSessions.size > 0) {
      setAvgSessionPages(Math.round((views.length / uniqueSessions.size) * 10) / 10);
    }

    const sessionCounts: Record<string, number> = {};
    views.forEach((v: { session_id: string }) => {
      sessionCounts[v.session_id] = (sessionCounts[v.session_id] || 0) + 1;
    });
    const singlePageSessions = Object.values(sessionCounts).filter((c) => c === 1).length;
    const totalSessions = Object.keys(sessionCounts).length;
    setBounceRate(totalSessions > 0 ? Math.round((singlePageSessions / totalSessions) * 100) : 0);

    const dailyMap: Record<string, { views: number; sessions: Set<string> }> = {};
    views.forEach((v: { created_at: string; session_id: string }) => {
      const date = new Date(v.created_at).toISOString().split('T')[0];
      if (!dailyMap[date]) dailyMap[date] = { views: 0, sessions: new Set() };
      dailyMap[date].views++;
      dailyMap[date].sessions.add(v.session_id);
    });

    const daily: DailyCount[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = dailyMap[dateStr];
      daily.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: entry?.views || 0,
        visitors: entry?.sessions.size || 0,
      });
    }
    setDailyData(daily);

    const pageMap: Record<string, { views: number; sessions: Set<string> }> = {};
    views.forEach((v: { page_path: string; session_id: string }) => {
      if (!pageMap[v.page_path]) pageMap[v.page_path] = { views: 0, sessions: new Set() };
      pageMap[v.page_path].views++;
      pageMap[v.page_path].sessions.add(v.session_id);
    });
    const sortedPages = Object.entries(pageMap)
      .map(([path, data]) => ({ path, views: data.views, uniqueVisitors: data.sessions.size }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
    setTopPages(sortedPages);

    let mobile = 0, tablet = 0, desktop = 0;
    views.forEach((v: { screen_width: number }) => {
      if (v.screen_width < 768) mobile++;
      else if (v.screen_width < 1024) tablet++;
      else desktop++;
    });
    setDeviceBreakdown([
      { name: 'Desktop', value: desktop, color: '#7F1D1D' },
      { name: 'Mobile', value: mobile, color: '#1a3a52' },
      { name: 'Tablet', value: tablet, color: '#f5d9c8' },
    ].filter((d) => d.value > 0));

    const refMap: Record<string, number> = {};
    views.forEach((v: { referrer?: string }) => {
      if (v.referrer) {
        try {
          const url = new URL(v.referrer);
          const source = url.hostname || 'Direct';
          refMap[source] = (refMap[source] || 0) + 1;
        } catch {
          refMap['Direct'] = (refMap['Direct'] || 0) + 1;
        }
      } else {
        refMap['Direct'] = (refMap['Direct'] || 0) + 1;
      }
    });
    const sortedRefs = Object.entries(refMap)
      .map(([source, visits]) => ({ source, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 8);
    setReferrerStats(sortedRefs);
  };

  const fetchMarketingData = async () => {
    const days = getDaysFromRange(dateRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: inquiries } = await adminDb
      .from('contact_inquiries')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    const inqData = inquiries || [];
    setTotalInquiries(inqData.length);

    const inqMap: Record<string, number> = {};
    inqData.forEach((i: { created_at: string }) => {
      const date = new Date(i.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      inqMap[date] = (inqMap[date] || 0) + 1;
    });
    setInquiryTrend(Object.entries(inqMap).map(([date, count]) => ({ date, count })));

    const { data: subs } = await adminDb
      .from('email_subscribers')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    const subData = subs || [];
    setTotalSubscribers(subData.length);

    const subMap: Record<string, number> = {};
    subData.forEach((s: { created_at: string }) => {
      const date = new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      subMap[date] = (subMap[date] || 0) + 1;
    });
    setSubscriberTrend(Object.entries(subMap).map(([date, count]) => ({ date, count })));

    const { data: posts } = await adminDb.from('blog_posts').select('status');
    if (posts) {
      setTotalBlogPosts(posts.length);
      setPublishedPosts(posts.filter((p: { status: string }) => p.status === 'published').length);
    }
  };

  const fetchSeoHealth = async () => {
    let complete = 0, partial = 0, missing = 0;

    const { data: services } = await adminDb.from('services').select('meta_title, meta_description');
    const { data: posts } = await adminDb.from('blog_posts').select('meta_title, meta_description');
    const { data: pages } = await adminDb.from('website_pages').select('meta_title, meta_description');

    const allItems = [...(services || []), ...(posts || []), ...(pages || [])];
    allItems.forEach((item: { meta_title?: string; meta_description?: string }) => {
      const hasTitle = !!item.meta_title;
      const hasDesc = !!item.meta_description;
      if (hasTitle && hasDesc) complete++;
      else if (hasTitle || hasDesc) partial++;
      else missing++;
    });

    setSeoHealth({ complete, partial, missing });
  };

  const getChangePercent = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const formatPagePath = (path: string): string => {
    if (path === '/') return 'Home';
    return path.replace(/^\//, '').replace(/-/g, ' ').replace(/\//g, ' > ')
      .split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const viewsChange = getChangePercent(totalViews, prevTotalViews);
  const visitorsChange = getChangePercent(uniqueVisitors, prevUniqueVisitors);
  const seoTotal = seoHealth.complete + seoHealth.partial + seoHealth.missing;
  const seoScore = seoTotal > 0 ? Math.round((seoHealth.complete / seoTotal) * 100) : 0;

  return (
    <div className="space-y-6">
      <AnalyticsDashboardHeader
        dateRange={dateRange}
        refreshing={refreshing}
        onDateRangeChange={setDateRange}
        onRefresh={handleRefresh}
      />

      {loading ? (
        <AnalyticsLoadingSkeleton />
      ) : (
        <>
          <AnalyticsTrafficSection
            dailyData={dailyData}
            topPages={topPages}
            deviceBreakdown={deviceBreakdown}
            referrerStats={referrerStats}
            totalViews={totalViews}
            uniqueVisitors={uniqueVisitors}
            avgSessionPages={avgSessionPages}
            bounceRate={bounceRate}
            viewsChange={viewsChange}
            visitorsChange={visitorsChange}
            formatPagePath={formatPagePath}
          />

          <AnalyticsMarketingSection
            totalInquiries={totalInquiries}
            totalSubscribers={totalSubscribers}
            publishedPosts={publishedPosts}
            totalBlogPosts={totalBlogPosts}
            seoScore={seoScore}
            seoHealth={seoHealth}
            inquiryTrend={inquiryTrend}
            subscriberTrend={subscriberTrend}
          />

          <AnalyticsSeoHealthSection
            seoHealth={seoHealth}
            seoScore={seoScore}
            seoTotal={seoTotal}
            totalBlogPosts={totalBlogPosts}
            publishedPosts={publishedPosts}
          />
        </>
      )}
    </div>
  );
}
