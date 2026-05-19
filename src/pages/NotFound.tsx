import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, Compass } from 'lucide-react';
import { FadeUp } from '../components/animations';
import SEOHead from '../components/SEOHead';

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#F9F9F6] relative overflow-hidden">
      <SEOHead title="Page Not Found" robots="noindex, nofollow" />
      {/* Decorative backgrounds */}
      <div className="hidden sm:block absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/[0.03] rounded-full -mr-48 -mt-48 blur-[100px]" />
      <div className="hidden sm:block absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-blue/[0.02] rounded-full -ml-32 -mb-32 blur-[100px]" />

      <FadeUp className="text-center max-w-lg px-4 relative z-10">
        {/* Icon */}
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 bg-ink-raised border border-[#e5e5dd] rounded-3xl flex items-center justify-center mx-auto rotate-6">
            <Compass className="w-10 h-10 text-accent-blue/40 -rotate-6" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-blue/10 rounded-xl flex items-center justify-center -rotate-12">
            <Search className="w-4 h-4 text-[#7a7a8e]" />
          </div>
        </div>

        {/* Ghost 404 */}
        <div className="text-[60px] sm:text-[100px] md:text-[140px] font-black leading-none text-[#1a1a2e]/[0.06] select-none -mb-12 md:-mb-16">
          404
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a1a2e] mb-3 tracking-tight">This page doesn't exist. But we do.</h2>
        <p className="text-[#6b6b7e] mb-8 leading-relaxed text-[15px] max-w-sm mx-auto">
          Looks like something went wrong. Head back to the homepage or drop us a message — we're easier to find than this URL.
        </p>

        {/* Suggested links */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { label: 'Our Services', to: '/services' },
            { label: 'Insights & Blog', to: '/blog' },
            { label: 'About Us', to: '/about' },
            { label: 'Get in Touch', to: '/contact' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-2 text-xs font-medium text-[#6b6b7e] bg-ink-raised hover:bg-accent-blueHover/[0.08] hover:text-accent-blueHover rounded-full border border-[#e5e5dd] hover:border-accent-blueHover/20 transition-all duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-[#1a1a2e] text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-accent-blueHover transition-all duration-300 active:scale-[0.98]"
          >
            <Home className="mr-2" size={16} />
            Back to homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center border border-[#e5e5dd] text-[#1a1a2e] px-7 py-3.5 rounded-full font-semibold text-sm hover:border-accent-blueHover/30 hover:text-accent-blueHover transition-all duration-300 active:scale-[0.98]"
          >
            <ArrowLeft className="mr-2" size={16} />
            Go Back
          </button>
        </div>
      </FadeUp>
    </div>
  );
}
