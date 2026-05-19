import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-24 right-6 z-30 w-11 h-11 rounded-full bg-[#1e9df1] text-white flex items-center justify-center shadow-lg hover:bg-[#1a82d4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e9df1] transition-all duration-300 ${
 visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
 }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}
