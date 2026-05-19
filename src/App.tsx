import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { useSiteAssets } from './hooks/useSiteAssets';
import Header from './components/Header';
import Footer from './components/Footer';
import SVGFollowerCursor from './components/SVGFollowerCursor';
import { ScrollEngineProvider } from './lib/ScrollEngine';
import CookieConsent from './components/CookieConsent';
import WhatsAppWidget from './components/WhatsAppWidget';
import BackToTop from './components/BackToTop';
import { usePageTracking } from './hooks/usePageTracking';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollProgress from './components/ScrollProgress';
import LaunchIntro from './components/LaunchIntro';

// Eager-load Home for fast first paint
import Home from './pages/Home';

// Lazy-load all other public pages for better bundle splitting
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const ServiceCategory = lazy(() => import('./pages/ServiceCategory'));
const About = lazy(() => import('./pages/About'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const LegalDocument = lazy(() => import('./pages/LegalDocument'));
const NotFound = lazy(() => import('./pages/NotFound'));
const DynamicPage = lazy(() => import('./pages/DynamicPage'));
const Careers = lazy(() => import('./pages/Careers'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail'));
const Unsubscribe = lazy(() => import('./pages/Unsubscribe'));
const BookConsultation = lazy(() => import('./pages/BookConsultation'));
const Team = lazy(() => import('./pages/Team'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const DPDPAssessment = lazy(() => import('./pages/DPDPAssessment'));
const Trust = lazy(() => import('./pages/Trust'));
const Insights = lazy(() => import('./pages/Insights'));
const Industries = lazy(() => import('./pages/Industries'));
const Partnerships = lazy(() => import('./pages/Partnerships'));

// Lazy load admin pages
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ServicesManagement = lazy(() => import('./pages/admin/ServicesManagement'));
const ProductsManagement = lazy(() => import('./pages/admin/ProductsManagement'));
const CaseStudiesManagement = lazy(() => import('./pages/admin/CaseStudiesManagement'));
const CareersEditor = lazy(() => import('./pages/admin/CareersEditor'));
const BlogManagement = lazy(() => import('./pages/admin/BlogManagement'));
const Inquiries = lazy(() => import('./pages/admin/Inquiries'));
const WebsiteManagement = lazy(() => import('./pages/admin/WebsiteManagement'));
const MenuManagement = lazy(() => import('./pages/admin/MenuManagement'));
const EmailSubscribers = lazy(() => import('./pages/admin/EmailSubscribers'));
const EmailLists = lazy(() => import('./pages/admin/EmailLists'));
const EmailTemplates = lazy(() => import('./pages/admin/EmailTemplates'));
const EmailCampaigns = lazy(() => import('./pages/admin/EmailCampaigns'));
const PageManagement = lazy(() => import('./pages/admin/PageManagement'));
const SEOManagement = lazy(() => import('./pages/admin/SEOManagement'));
const SEOOptimization = lazy(() => import('./pages/admin/SEOOptimization'));
const LegalDocuments = lazy(() => import('./pages/admin/LegalDocuments'));
const SiteSettings = lazy(() => import('./pages/admin/SiteSettings'));
const HomePageEditor = lazy(() => import('./pages/admin/HomePageEditor'));
const AboutPageEditor = lazy(() => import('./pages/admin/AboutPageEditor'));
const ContactPageEditor = lazy(() => import('./pages/admin/ContactPageEditor'));
const FooterEditor = lazy(() => import('./pages/admin/FooterEditor'));
const FAQEditor = lazy(() => import('./pages/admin/FAQEditor'));
const TeamEditor = lazy(() => import('./pages/admin/TeamEditor'));
const BlogPageEditor = lazy(() => import('./pages/admin/BlogPageEditor'));
const CaseStudiesEditor = lazy(() => import('./pages/admin/CaseStudiesEditor'));
const AnalyticsDashboard = lazy(() => import('./pages/admin/AnalyticsDashboard'));
const ActivityLog = lazy(() => import('./pages/admin/ActivityLog'));
const Bookings = lazy(() => import('./pages/admin/Bookings'));
const Applications = lazy(() => import('./pages/admin/Applications'));
const DPDPAssessments = lazy(() => import('./pages/admin/DPDPAssessments'));
const VisibilityManager = lazy(() => import('./pages/admin/VisibilityManager'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));

function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-raised">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-blue/20 border-t-accent-blue"></div>
    </div>
  );
}

function AdminAccessDenied() {
  const { signOut } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-raised">
      <div className="text-center max-w-md px-6">
        <h1 className="text-2xl font-bold text-black mb-3">Access Denied</h1>
        <p className="text-black text-sm mb-6">Your account does not have admin privileges.</p>
        <button onClick={() => signOut()} className="text-accent-blue text-sm hover:underline">Sign Out</button>
      </div>
    </div>
  );
}

/**
 * Auth gate for admin routes.
 * Renders NOTHING until auth state is resolved.
 * Then either redirects to login or renders children.
 */
function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      setAuthChecked(true);
    }
  }, [loading]);

  // Phase 1: Still checking auth — show blank loading screen, NO admin content
  if (!authChecked) {
    return <AdminLoading />;
  }

  // Phase 2: Auth resolved, no user — redirect to login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Phase 3: User exists but is NOT admin — deny access
  if (!isAdmin) {
    return <AdminAccessDenied />;
  }

  // Phase 4: Authenticated admin — render admin
  return <>{children}</>;
}



function App() {
  useSiteAssets();
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const [introDone, setIntroDone] = useState(() => {
    const skip = isAdminRoute || LaunchIntro.alreadySeen();
    if (skip && typeof window !== 'undefined') {
      // If we are skipping the intro, mark the global flag immediately so Hero
      // does not wait on the 3.5s `adviserve:intro-done` fallback timeout.
      (window as unknown as Record<string, unknown>).__adviserveIntroDone = true;
    }
    return skip;
  });


  return (
    <AuthProvider>
      {!introDone && <LaunchIntro onDone={() => setIntroDone(true)} />}
        <ScrollEngineProvider>
        <SVGFollowerCursor />
        <Routes>
          {/* Admin login — no auth required, no layout */}
          <Route path="/admin/login" element={
            <Suspense fallback={<AdminLoading />}>
              <Login />
            </Suspense>
          } />

          {/* Admin routes — AUTH GATE runs FIRST, blocks everything until verified */}
          <Route path="/admin/*" element={
            <AdminAuthGate>
              <ErrorBoundary>
              <Suspense fallback={<AdminLoading />}>
                <AdminLayout>
                  <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="website" element={<WebsiteManagement />} />
                    <Route path="menu" element={<MenuManagement />} />
                    <Route path="services" element={<ServicesManagement />} />
                    <Route path="products" element={<ProductsManagement />} />
                    <Route path="case-studies" element={<CaseStudiesManagement />} />
                    <Route path="edit-careers" element={<CareersEditor />} />
                    <Route path="blog" element={<BlogManagement />} />
                    <Route path="inquiries" element={<Inquiries />} />
                    <Route path="email-subscribers" element={<EmailSubscribers />} />
                    <Route path="email-lists" element={<EmailLists />} />
                    <Route path="email-templates" element={<EmailTemplates />} />
                    <Route path="email-campaigns" element={<EmailCampaigns />} />
                    <Route path="pages" element={<PageManagement />} />
                    <Route path="seo" element={<SEOManagement />} />
                    <Route path="seo-optimization" element={<SEOOptimization />} />
                    <Route path="legal" element={<LegalDocuments />} />
                    <Route path="settings" element={<SiteSettings />} />
                    <Route path="edit-home" element={<HomePageEditor />} />
                    <Route path="edit-about" element={<AboutPageEditor />} />
                    <Route path="edit-contact" element={<ContactPageEditor />} />
                    <Route path="edit-footer" element={<FooterEditor />} />
                    <Route path="edit-faq" element={<FAQEditor />} />
                    <Route path="edit-team" element={<TeamEditor />} />
                    <Route path="edit-blog" element={<BlogPageEditor />} />
                    <Route path="edit-case-studies" element={<CaseStudiesEditor />} />
                    <Route path="analytics" element={<AnalyticsDashboard />} />
                    <Route path="bookings" element={<Bookings />} />
                    <Route path="applications" element={<Applications />} />
                    <Route path="dpdp-assessments" element={<DPDPAssessments />} />
                    <Route path="activity-log" element={<ActivityLog />} />
                    <Route path="visibility" element={<VisibilityManager />} />
                  </Routes>
                </AdminLayout>
              </Suspense>
              </ErrorBoundary>
            </AdminAuthGate>
          } />

          {/* Public routes */}
          <Route path="*" element={<PublicLayout />} />
        </Routes>
        </ScrollEngineProvider>
      </AuthProvider>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PublicLayout() {
  usePageTracking();
  const location = useLocation();
  // Hide global footer on pages that render their own cinematic footer
  const hideGlobalFooter = location.pathname === '/products/dpdp-compliance';


  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <ScrollProgress />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-accent-blue focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-blue/20 border-t-accent-blue" /></div>}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
          <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Navigate to="/" replace />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:slug" element={<ServiceCategory />} />
                    <Route path="/services/:category/:slug" element={<ServiceDetail />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:slug" element={<ProductDetail />} />
                    <Route path="/dpdp-assessment" element={<DPDPAssessment />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    {/* `/insights/:slug` shares the BlogPost view — Home cards link here. */}
                    <Route path="/insights/:slug" element={<BlogPost />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/unsubscribe" element={<Unsubscribe />} />
                    <Route path="/legal/:slug" element={<LegalDocument />} />
                    <Route path="/privacy" element={<LegalDocument />} />
                    <Route path="/terms" element={<LegalDocument />} />
                    <Route path="/book" element={<BookConsultation />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/case-studies" element={<CaseStudies />} />
                    <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/insights" element={<Insights />} />
                    <Route path="/trust" element={<Trust />} />
                    <Route path="/industries" element={<Industries />} />
                    <Route path="/partnerships" element={<Partnerships />} />
                    <Route path="/consultation" element={<BookConsultation />} />
            <Route path="/:slug" element={<DynamicPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
            </motion.div>
          </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </main>
      {!hideGlobalFooter && <Footer />}
      <CookieConsent />
      <WhatsAppWidget />
      <BackToTop />
    </div>
  );
}

export default App;
