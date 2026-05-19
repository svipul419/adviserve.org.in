type Props = {
  inp: string;
  testimonialsSectionHeading: string; setTestimonialsSectionHeading: (v: string) => void;
  setDirty: (v: boolean) => void;
};

export function HomeWhySection({
  inp,
  testimonialsSectionHeading, setTestimonialsSectionHeading,
  setDirty,
}: Props) {
  return (
    <>
      {/* ═══ TESTIMONIALS ═══ */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Testimonials Section</h2>
        <p className="text-xs text-gray-400 mb-3">Stored in DB. Testimonials use placeholder archetypes until real client quotes are approved.</p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
          <input type="text" value={testimonialsSectionHeading} onChange={e => { setTestimonialsSectionHeading(e.target.value); setDirty(true); }} placeholder="e.g. The people we work for." className={inp} />
        </div>
      </div>
    </>
  );
}
