import SEOHead from '../components/SEOHead';
import { useSiteContent, parseJsonContent } from '../hooks/useSiteContent';
import type { Testimonial } from '../lib/defaults';
import { DEFAULT_TESTIMONIALS } from '../lib/defaults';

export default function TestimonialsPage() {
  const { content } = useSiteContent('home');

  const sectionHeading: string = content.testimonials_section_heading || 'What our clients say';
  const testimonials = parseJsonContent<Testimonial[]>(content.testimonials_data, DEFAULT_TESTIMONIALS);

  return (
    <>
      <SEOHead title="Testimonials | Adviserve" description="Read what our clients say about working with Adviserve." />

      <main id="main" className="pt-28 pb-24 min-h-screen bg-ink-raised">
        <div className="max-w-[1280px] mx-auto px-6">

          {/* Header */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[11px] tracking-[0.14em] text-white/75">CLIENTS</span>
            </div>
            <h1 className="font-display text-[clamp(32px,4vw,56px)] leading-[1.05] max-w-3xl">
              {sectionHeading}
            </h1>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex flex-col gap-6 bg-ink-base border hairline rounded-2xl p-8"
              >
                <blockquote className="font-display text-[18px] leading-snug text-white flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="border-t hairline pt-5">
                  <div className="font-semibold text-[15px] text-white">{t.name}</div>
                  <div className="text-[13px] text-white/75 mt-0.5">
                    {t.role}{t.company ? `, ${t.company}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}
