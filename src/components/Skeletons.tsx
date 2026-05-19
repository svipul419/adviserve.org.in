/**
 * Skeleton loaders for CMS-driven Home sections.
 * Shown while useSiteContent('home') is loading.
 * Heights match real section heights to prevent layout shift.
 */

function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg ${className}`} />;
}

export function HeroSkeleton() {
  return (
    <section className="relative min-h-screen bg-ink-base flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
      <Pulse className="h-4 w-56 bg-white/10 mb-8" />
      <Pulse className="h-14 w-[520px] max-w-full bg-white/10 mb-3" />
      <Pulse className="h-14 w-96 max-w-full bg-white/10 mb-10" />
      <Pulse className="h-5 w-80 max-w-full bg-white/10 mb-10" />
      <div className="flex gap-3 mb-10">
        <Pulse className="h-12 w-52 bg-white/15" />
        <Pulse className="h-12 w-40 bg-white/10" />
      </div>
      <div className="flex gap-5 flex-wrap justify-center">
        <Pulse className="h-4 w-28 bg-white/10" />
        <Pulse className="h-4 w-20 bg-white/10" />
        <Pulse className="h-4 w-36 bg-white/10" />
        <Pulse className="h-4 w-20 bg-white/10" />
      </div>
    </section>
  );
}

export function PracticesSkeleton() {
  return (
    <section className="bg-ink-base border-t hairline">
      <div className="max-w-[1280px] mx-auto px-6 py-24 pb-0">
        <Pulse className="h-8 w-72 bg-gray-300 mb-3" />
        <Pulse className="h-5 w-32 bg-gray-200 mt-2" />
      </div>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="min-h-[50vh] flex items-center max-w-[1280px] mx-auto px-6 py-16 gap-16">
          <div className="flex-1 space-y-4">
            <Pulse className="h-4 w-10 bg-gray-200" />
            <Pulse className="h-10 w-48 bg-gray-300" />
            <Pulse className="h-4 w-full bg-gray-200" />
            <Pulse className="h-4 w-4/5 bg-gray-200" />
            <div className="flex gap-2 pt-2">
              <Pulse className="h-7 w-32 bg-gray-200 rounded-full" />
              <Pulse className="h-7 w-28 bg-gray-200 rounded-full" />
            </div>
          </div>
          <Pulse className="w-80 h-80 bg-gray-300 rounded-2xl flex-shrink-0" />
        </div>
      ))}
    </section>
  );
}

export function WhyAdviserveSkeleton() {
  return (
    <section className="py-24 bg-ink-base">
      <div className="max-w-[1280px] mx-auto px-6">
        <Pulse className="h-4 w-48 bg-white/10 mb-4" />
        <Pulse className="h-12 w-72 bg-white/10 mb-12" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border border-white/10 rounded-2xl p-6 space-y-3">
              <Pulse className="h-14 w-24 bg-white/10" />
              <Pulse className="h-6 w-32 bg-white/10" />
              <Pulse className="h-4 w-40 bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSkeleton() {
  return (
    <section className="py-24 bg-ink-base border-t hairline">
      <div className="max-w-[1280px] mx-auto px-6 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-4">
          <Pulse className="h-4 w-16 bg-gray-200" />
          <Pulse className="h-10 w-56 bg-gray-300" />
          <Pulse className="h-10 w-48 bg-gray-300" />
          <Pulse className="h-4 w-36 bg-gray-200 mt-4" />
        </div>
        <div className="lg:col-span-8">
          <div className="bg-ink-raised border hairline rounded-2xl overflow-hidden divide-y divide-[rgba(11,18,32,0.08)]">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-6 flex items-start justify-between gap-6">
                <div className="flex-1 space-y-2">
                  <Pulse className="h-3 w-12 bg-gray-200" />
                  <Pulse className="h-6 w-full bg-gray-300" />
                  <Pulse className="h-6 w-4/5 bg-gray-200" />
                </div>
                <Pulse className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
