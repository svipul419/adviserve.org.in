import { Trash2, Plus } from 'lucide-react';

interface FAQItem { q: string; a: string; }

type Props = {
  inp: string; inpSm: string;
  faqSectionTitle: string; setFaqSectionTitle: (v: string) => void;
  faqItems: FAQItem[]; setFaqItems: (v: FAQItem[]) => void;
  setDirty: (v: boolean) => void;
};

export function HomeFAQSection({
  inp, inpSm,
  faqSectionTitle, setFaqSectionTitle,
  faqItems, setFaqItems,
  setDirty,
}: Props) {
  return (
    <>
      {/* ═══ FAQ ═══ */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">FAQ Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input type="text" value={faqSectionTitle} onChange={e => { setFaqSectionTitle(e.target.value); setDirty(true); }} placeholder="e.g. The questions operators actually ask." className={inp} />
          </div>
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">FAQ Items</label>
            {faqItems.map((item, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg mb-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Q.0{i + 1}</span>
                  <button type="button" onClick={() => { setFaqItems(faqItems.filter((_, idx) => idx !== i)); setDirty(true); }} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                </div>
                <input type="text" value={item.q} onChange={e => { const u = [...faqItems]; u[i] = { ...u[i], q: e.target.value }; setFaqItems(u); setDirty(true); }} placeholder="Question" className={inpSm} />
                <textarea rows={2} value={item.a} onChange={e => { const u = [...faqItems]; u[i] = { ...u[i], a: e.target.value }; setFaqItems(u); setDirty(true); }} placeholder="Answer" className={inpSm} />
              </div>
            ))}
            <button type="button" onClick={() => { setFaqItems([...faqItems, { q: '', a: '' }]); setDirty(true); }} className="text-sm text-oxblood-primary hover:underline flex items-center gap-1"><Plus size={14} /> Add FAQ</button>
          </div>
        </div>
      </div>
    </>
  );
}
