import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Briefcase, MessageSquare, Mail, Users, Send, TrendingUp, Clock, AlertCircle, Edit3 } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';

interface RecentInquiry {
  id: string;
  name: string;
  email: string;
  service_interest: string | null;
  status: string;
  created_at: string;
}

interface RecentPost {
  id: string;
  title: string;
  status: string;
  updated_at: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    services: 0,
    posts: 0,
    inquiries: 0,
    subscribers: 0,
    newInquiries: 0,
    draftPosts: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const [servicesRes, postsRes, inquiriesRes, subscribersRes, newInqRes, draftRes, recentInqRes, recentPostRes] = await Promise.all([
        adminDb.from('services').select('id', { count: 'exact', head: true }),
        adminDb.from('blog_posts').select('id', { count: 'exact', head: true }),
        adminDb.from('contact_inquiries').select('id', { count: 'exact', head: true }),
        adminDb.from('email_subscribers').select('id', { count: 'exact', head: true }),
        adminDb.from('contact_inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        adminDb.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
        adminDb.from('contact_inquiries').select('id, name, email, service_interest, status, created_at').order('created_at', { ascending: false }).limit(5),
        adminDb.from('blog_posts').select('id, title, status, updated_at').order('updated_at', { ascending: false }).limit(5),
      ]);

      setStats({
        services: servicesRes.count || 0,
        posts: postsRes.count || 0,
        inquiries: inquiriesRes.count || 0,
        subscribers: subscribersRes.count || 0,
        newInquiries: newInqRes.count || 0,
        draftPosts: draftRes.count || 0,
      });

      if (recentInqRes.data) setRecentInquiries(recentInqRes.data);
      if (recentPostRes.data) setRecentPosts(recentPostRes.data);
      setLoading(false);
    }

    fetchAll();
  }, []);

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const statCards = [
    { label: 'Services', value: stats.services, icon: Briefcase, color: 'bg-oxblood-primary/10 text-oxblood-primary', link: '/admin/services' },
    { label: 'Blog Posts', value: stats.posts, icon: FileText, color: 'bg-emerald-50 text-emerald-600', link: '/admin/blog' },
    { label: 'Inquiries', value: stats.inquiries, icon: MessageSquare, color: 'bg-purple-50 text-purple-600', link: '/admin/inquiries' },
    { label: 'Subscribers', value: stats.subscribers, icon: Users, color: 'bg-amber-50 text-amber-600', link: '/admin/email-subscribers' },
  ];

  const quickLinks = [
    { label: 'New Blog Post', path: '/admin/blog', icon: FileText, desc: 'Write and publish content' },
    { label: 'View Inquiries', path: '/admin/inquiries', icon: MessageSquare, desc: 'Respond to messages' },
    { label: 'Email Campaign', path: '/admin/email-campaigns', icon: Send, desc: 'Create a new campaign' },
    { label: 'Manage Subscribers', path: '/admin/email-subscribers', icon: Mail, desc: 'View your audience' },
  ];

  const statusColor: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700',
    in_progress: 'bg-amber-50 text-amber-700',
    resolved: 'bg-emerald-50 text-emerald-700',
    archived: 'bg-gray-100 text-gray-600',
    draft: 'bg-amber-50 text-amber-700',
    published: 'bg-emerald-50 text-emerald-700',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here's an overview of your site.</p>
      </div>

      {/* Action Required Banner */}
      {(stats.newInquiries > 0 || stats.draftPosts > 0) && (
        <div className="bg-oxblood-primary/5 border border-oxblood-primary/20 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle size={18} className="text-oxblood-primary flex-shrink-0" />
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {stats.newInquiries > 0 && (
              <Link to="/admin/inquiries" className="text-oxblood-primary font-medium hover:underline">
                {stats.newInquiries} unread {stats.newInquiries === 1 ? 'inquiry' : 'inquiries'}
              </Link>
            )}
            {stats.draftPosts > 0 && (
              <Link to="/admin/blog" className="text-oxblood-primary font-medium hover:underline">
                {stats.draftPosts} draft {stats.draftPosts === 1 ? 'post' : 'posts'}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gray-200" />
                <div className="w-4 h-4 rounded bg-gray-100" />
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
          ))
        ) : (
          statCards.map((card) => (
            <Link
              key={card.label}
              to={card.link}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                  <card.icon size={20} />
                </div>
                <TrendingUp size={16} className="text-gray-300" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </Link>
          ))
        )}
      </div>

      {/* Two-column: Recent Inquiries + Recent Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare size={18} className="text-gray-400" />
              Recent Inquiries
            </h2>
            <Link to="/admin/inquiries" className="text-xs font-medium text-oxblood-primary hover:underline">View all</Link>
          </div>
          {recentInquiries.length > 0 ? (
            <div className="space-y-3">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{inq.name}</p>
                    <p className="text-xs text-gray-500 truncate">{inq.email}{inq.service_interest ? ` — ${inq.service_interest}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[inq.status] || 'bg-gray-100 text-gray-600'}`}>
                      {inq.status}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock size={10} />
                      {formatDate(inq.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">No inquiries yet</p>
          )}
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Edit3 size={18} className="text-gray-400" />
              Recent Content
            </h2>
            <Link to="/admin/blog" className="text-xs font-medium text-oxblood-primary hover:underline">View all</Link>
          </div>
          {recentPosts.length > 0 ? (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <p className="text-sm font-medium text-gray-900 truncate min-w-0 flex-1">{post.title}</p>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[post.status] || 'bg-gray-100 text-gray-600'}`}>
                      {post.status}
                    </span>
                    <span className="text-[11px] text-gray-400">{formatDate(post.updated_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">No posts yet</p>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-oxblood-hover hover:bg-oxblood-hover/5 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-oxblood-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon size={18} className="text-oxblood-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.label}</p>
                <p className="text-xs text-gray-500 truncate">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
