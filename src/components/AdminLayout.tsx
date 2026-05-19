import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  LayoutGrid,
  Menu as MenuIcon,
  Mail,
  Users,
  FileType as TemplateIcon,
  Send,
  FileEdit,
  Search,
  Scale,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Home,
  Info,
  Phone,
  PanelBottom,
  BarChart3,
  Globe,
  Activity,
  Calendar,
  HelpCircle,
  UserCheck,
  Layers,
  Shield,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
      { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={18} /> },
      { label: 'Inquiries', path: '/admin/inquiries', icon: <MessageSquare size={18} /> },
      { label: 'Bookings', path: '/admin/bookings', icon: <Calendar size={18} /> },
      { label: 'Applications', path: '/admin/applications', icon: <UserCheck size={18} /> },
      { label: 'DPDP Assessments', path: '/admin/dpdp-assessments', icon: <Shield size={18} /> },
    ],
  },
  {
    title: 'Pages',
    items: [
      { label: 'Home', path: '/admin/edit-home', icon: <Home size={18} /> },
      { label: 'About', path: '/admin/edit-about', icon: <Info size={18} /> },
      { label: 'Contact', path: '/admin/edit-contact', icon: <Phone size={18} /> },
      { label: 'Footer', path: '/admin/edit-footer', icon: <PanelBottom size={18} /> },
      { label: 'FAQ', path: '/admin/edit-faq', icon: <HelpCircle size={18} /> },
      { label: 'Team', path: '/admin/edit-team', icon: <Users size={18} /> },
      { label: 'Content Blocks', path: '/admin/website', icon: <LayoutGrid size={18} /> },
      { label: 'Page Manager', path: '/admin/pages', icon: <FileEdit size={18} /> },
      { label: 'Careers', path: '/admin/edit-careers', icon: <Briefcase size={18} /> },
      { label: 'Navigation', path: '/admin/menu', icon: <MenuIcon size={18} /> },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Products', path: '/admin/products', icon: <LayoutGrid size={18} /> },
      { label: 'Services', path: '/admin/services', icon: <Briefcase size={18} /> },
      { label: 'Case Studies', path: '/admin/case-studies', icon: <FileText size={18} /> },
      { label: 'Blog', path: '/admin/blog', icon: <FileText size={18} /> },
      { label: 'Legal Docs', path: '/admin/legal', icon: <Scale size={18} /> },
    ],
  },
  {
    title: 'Email',
    items: [
      { label: 'Subscribers', path: '/admin/email-subscribers', icon: <Mail size={18} /> },
      { label: 'Lists', path: '/admin/email-lists', icon: <Users size={18} /> },
      { label: 'Templates', path: '/admin/email-templates', icon: <TemplateIcon size={18} /> },
      { label: 'Campaigns', path: '/admin/email-campaigns', icon: <Send size={18} /> },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Visibility Manager', path: '/admin/visibility', icon: <Layers size={18} /> },
      { label: 'SEO', path: '/admin/seo-optimization', icon: <Globe size={18} /> },
      { label: 'SEO Status', path: '/admin/seo', icon: <Search size={18} /> },
      { label: 'Site Settings', path: '/admin/settings', icon: <Settings size={18} /> },
      { label: 'Activity Log', path: '/admin/activity-log', icon: <Activity size={18} /> },
    ],
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login', { replace: true });
    }
  }, [user, loading, isAdmin, navigate]);


  if (loading) {
    return (
      <div className="admin-layout min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-blue/20 border-t-accent-blue" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname === path;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-black font-bold text-[14px]">A</span>
          </div>
          {!sidebarCollapsed && (
            <span className="text-[15px] font-bold tracking-[-0.01em] text-gray-900">Adviserve</span>
          )}
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-gray-400 hover:text-gray-600"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5" data-lenis-prevent>
        {navSections.map((section) => (
          <div key={section.title}>
            {!sidebarCollapsed && (
              <h3 className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                {section.title}
              </h3>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 text-[13px] rounded-lg transition-all duration-150 ${
 isActive(item.path)
 ? 'bg-accent-blue/10 text-accent-blue font-medium'
 : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
 }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-200 p-4">
        {!sidebarCollapsed && (
          <div className="text-[11px] text-gray-400 truncate mb-2 px-1">{user?.email}</div>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-150"
          title="Sign Out"
        >
          <LogOut size={16} />
          {!sidebarCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-layout min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-200 transition-all duration-300 ${
 sidebarCollapsed ? 'w-[72px]' : 'w-64'
 }`}
      >
        <SidebarContent />
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-ink-raised border border-gray-200 rounded-full shadow-sm flex items-center justify-center text-gray-400 hover:text-accent-blueHover hover:border-accent-blueHover/40 transition-all"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
        </button>
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-xl transform transition-transform duration-300 ${
 mobileOpen ? 'translate-x-0' : '-translate-x-full'
 }`}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
 sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
 }`}
      >
        {/* Top header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200 h-14 flex items-center px-4 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden mr-4 text-gray-400 hover:text-gray-600"
            aria-label="Open sidebar"
          >
            <MenuIcon size={20} />
          </button>

          <div className="flex-1">
            <nav className="text-sm text-gray-400">
              <Link to="/admin" className="hover:text-accent-blueHover transition-colors">
                Admin
              </Link>
              {location.pathname !== '/admin' && location.pathname !== '/admin/dashboard' && (
                <>
                  <span className="mx-2 text-gray-300">/</span>
                  <span className="text-gray-600 font-medium">
                    {navSections
                      .flatMap((s) => s.items)
                      .find((item) => isActive(item.path))?.label || 'Page'}
                  </span>
                </>
              )}
            </nav>
          </div>

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent-blue/70 hover:text-accent-blueHover font-medium transition-colors hidden sm:block"
          >
            Visit Site &rarr;
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
