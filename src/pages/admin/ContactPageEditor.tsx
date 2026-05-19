import { useEffect, useRef, useState } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';
import { useUnsavedChanges } from '../../components/admin';

interface BusinessHour {
  day: string;
  hours: string;
}

interface ServiceOption {
  value: string;
  label: string;
}

export default function ContactPageEditor() {
  const [pageId, setPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Header
  const [contactTitle, setContactTitle] = useState("Let's have a proper conversation.");
  const [contactIntro, setContactIntro] = useState('Not a discovery call. Not a demo. Just a straightforward conversation about your business, what you\'re trying to solve, and whether we\'re the right fit to help. Fill out the form and someone from our team will get back to you within 24 hours.');
  // Contact info
  const [contactEmail, setContactEmail] = useState('hello@adviserve.org.in');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [contactAddress, setContactAddress] = useState('Mumbai, Maharashtra, India');

  // Visibility
  const [headerVisible, setHeaderVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(true);
  const [hoursVisible, setHoursVisible] = useState(true);
  const [contactInfoVisible, setContactInfoVisible] = useState(true);

  // Form section
  const [formTitle, setFormTitle] = useState('Send us a Message');
  const [successMessage, setSuccessMessage] = useState("Thank you for your message! We'll get back to you soon.");

  // Service interest options
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([
    { value: 'hr', label: 'HR' },
    { value: 'recruitment', label: 'Recruitment' },
    { value: 'business-consulting', label: 'Business Consulting' },
    { value: 'legal', label: 'Legal' },
    { value: 'it', label: 'IT' },
    { value: 'development', label: 'Development' },
    { value: 'not-sure', label: 'Not sure yet' },
  ]);

  // Business hours
  const [businessHoursTitle, setBusinessHoursTitle] = useState('Business Hours');
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM IST' },
    { day: 'Saturday', hours: '10:00 AM - 2:00 PM IST' },
    { day: 'Sunday & Holidays', hours: 'Closed' },
  ]);

  // Contact sidebar
  const [contactSidebarTitle, setContactSidebarTitle] = useState('Get in Touch');

  // Form labels / placeholders / buttons
  const [formLabels, setFormLabels] = useState({ name: 'Full Name', email: 'Email', phone: 'Phone', company: 'Company', message: 'Message' });
  const [formPlaceholders, setFormPlaceholders] = useState({ name: 'Your name', email: 'you@company.com', phone: '+91 00000 00000', company: 'Acme Inc.', message: 'Your message here' });
  const [formBtnSubmit, setFormBtnSubmit] = useState('Get In Touch');
  const [formBtnReset, setFormBtnReset] = useState('Send another message');
  const [formDisclaimer, setFormDisclaimer] = useState('No spam. No automated sales sequences. Just a real person reading your message and getting back to you.');
  const [scheduleTitle, setScheduleTitle] = useState('Schedule Directly');
  const [scheduleBtn, setScheduleBtn] = useState('Book a Time Slot');

  // FAQs
  const [faqs, setFaqs] = useState<{question: string; answer: string;}[]>([
    { question: 'How fast can you start?', answer: 'Most engagements kick off within 48 hours of signing. For urgent recruitment needs, we can present pre-vetted candidates from our pipeline within 5 business days.' },
    { question: 'Is the initial consultation really free?', answer: 'Yes — no strings attached. We use the first 30-minute call to understand your challenges, share relevant case studies, and outline a potential approach.' },
    { question: 'Can you handle multiple services simultaneously?', answer: 'Absolutely. That\'s our core differentiator. Many clients start with one service and expand as they see results. Our cross-functional teams coordinate internally.' },
    { question: 'Do you work with startups or only large enterprises?', answer: 'Both. We serve 20-person startups and 5,000-person enterprises. Our engagement models scale from project-based work to full embedded partnerships.' },
    { question: 'What makes Adviserve different from specialised firms?', answer: 'We integrate five practices under one roof — recruitment, HR, legal, business consulting, and IT — so every recommendation accounts for the full picture.' },
  ]);
  const [faqsVisible, setFaqsVisible] = useState(true);

  const [headerFv, setHeaderFv] = useState<Record<string, boolean>>({});
  const [formFv, setFormFv] = useState<Record<string, boolean>>({});
  const [sidebarFv, setSidebarFv] = useState<Record<string, boolean>>({});

  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);

  const handleSaveRef = useRef<() => void>(() => {});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data: pageData } = await adminDb.from('website_pages').select('id').eq('slug', 'contact').maybeSingle();

    if (!pageData) {
      const { data: newPage } = await adminDb.from('website_pages').insert({ slug: 'contact', title: 'Contact', is_visible: true }).select('id').single();
      if (newPage) setPageId(newPage.id);
      setLoading(false);
      return;
    }

    setPageId(pageData.id);

    const { data: contents } = await adminDb.from('website_content').select('*').eq('page_id', pageData.id).order('display_order');

    if (contents) {
      contents.forEach((c: any) => {
        switch (c.section_key) {
          case 'contact_title': setContactTitle(c.content_value || ''); setHeaderVisible(c.is_visible); break;
          case 'contact_intro': setContactIntro(c.content_value || ''); break;
          case 'contact_email': setContactEmail(c.content_value || ''); break;
          case 'contact_phone': setContactPhone(c.content_value || ''); break;
          case 'contact_address': setContactAddress(c.content_value || ''); break;
          case 'form_title': setFormTitle(c.content_value || ''); setFormVisible(c.is_visible); break;
          case 'success_message': setSuccessMessage(c.content_value || ''); break;
          case 'service_options':
            try { setServiceOptions(JSON.parse(c.content_value || '[]')); } catch {}
            break;
          case 'business_hours_title': setBusinessHoursTitle(c.content_value || ''); break;
          case 'business_hours':
            try { setBusinessHours(JSON.parse(c.content_value || '[]')); } catch {}
            setHoursVisible(c.is_visible);
            break;
          case 'contact_sidebar_title': setContactSidebarTitle(c.content_value || ''); setContactInfoVisible(c.is_visible); break;
          case 'contact_form_labels':
            try { setFormLabels(JSON.parse(c.content_value || '{}')); } catch {}
            break;
          case 'contact_form_placeholders':
            try { setFormPlaceholders(JSON.parse(c.content_value || '{}')); } catch {}
            break;
          case 'contact_form_btn_submit': setFormBtnSubmit(c.content_value || ''); break;
          case 'contact_form_btn_reset': setFormBtnReset(c.content_value || ''); break;
          case 'contact_form_disclaimer': setFormDisclaimer(c.content_value || ''); break;
          case 'contact_schedule_title': setScheduleTitle(c.content_value || ''); break;
          case 'contact_schedule_btn': setScheduleBtn(c.content_value || ''); break;
          case 'faqs':
            try { setFaqs(JSON.parse(c.content_value || '[]')); } catch {}
            setFaqsVisible(c.is_visible);
            break;
          case 'contact_header_field_visibility': try { setHeaderFv(JSON.parse(c.content_value || '{}')); } catch {} break;
          case 'contact_form_field_visibility': try { setFormFv(JSON.parse(c.content_value || '{}')); } catch {} break;
          case 'contact_sidebar_field_visibility': try { setSidebarFv(JSON.parse(c.content_value || '{}')); } catch {} break;
        }
      });
    }
    setLoading(false);
  };

  const upsertContent = async (key: string, label: string, type: string, value: string, visible: boolean, order: number) => {
    if (!pageId) return;
    const { data: existing, error: selectError } = await adminDb.from('website_content').select('id').eq('page_id', pageId).eq('section_key', key).maybeSingle();
    if (selectError) { console.error('Fetch error:', selectError); throw selectError; }
    if (existing) {
      const { error: writeError } = await adminDb.from('website_content').update({ section_label: label, content_type: type, content_value: value, is_visible: visible, display_order: order, updated_at: new Date().toISOString() }).eq('id', existing.id);
      if (writeError) { console.error('Write error:', writeError); throw writeError; }
    } else {
      const { error: writeError } = await adminDb.from('website_content').insert({ page_id: pageId, section_key: key, section_label: label, content_type: type, content_value: value, is_visible: visible, display_order: order });
      if (writeError) { console.error('Write error:', writeError); throw writeError; }
    }
  };

  const handleSave = async () => {
    if (!pageId) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await Promise.all([
        upsertContent('contact_title', 'Contact Title', 'text', contactTitle, headerVisible, 1),
        upsertContent('contact_intro', 'Contact Intro', 'text', contactIntro, headerVisible, 2),
        upsertContent('contact_email', 'Contact Email', 'text', contactEmail, contactInfoVisible, 31),
        upsertContent('contact_phone', 'Contact Phone', 'text', contactPhone, contactInfoVisible, 32),
        upsertContent('contact_address', 'Contact Address', 'text', contactAddress, contactInfoVisible, 33),
        upsertContent('form_title', 'Form Title', 'text', formTitle, formVisible, 10),
        upsertContent('success_message', 'Success Message', 'text', successMessage, formVisible, 11),
        upsertContent('service_options', 'Service Options', 'json', JSON.stringify(serviceOptions), formVisible, 12),
        upsertContent('business_hours_title', 'Business Hours Title', 'text', businessHoursTitle, hoursVisible, 20),
        upsertContent('business_hours', 'Business Hours', 'json', JSON.stringify(businessHours), hoursVisible, 21),
        upsertContent('contact_sidebar_title', 'Contact Sidebar Title', 'text', contactSidebarTitle, contactInfoVisible, 30),
        upsertContent('contact_form_labels', 'Form Field Labels', 'json', JSON.stringify(formLabels), formVisible, 13),
        upsertContent('contact_form_placeholders', 'Form Placeholders', 'json', JSON.stringify(formPlaceholders), formVisible, 14),
        upsertContent('contact_form_btn_submit', 'Submit Button Text', 'text', formBtnSubmit, formVisible, 15),
        upsertContent('contact_form_btn_reset', 'Reset Button Text', 'text', formBtnReset, formVisible, 16),
        upsertContent('contact_form_disclaimer', 'Form Disclaimer', 'text', formDisclaimer, formVisible, 17),
        upsertContent('contact_schedule_title', 'Schedule Card Title', 'text', scheduleTitle, true, 35),
        upsertContent('contact_schedule_btn', 'Schedule Button Text', 'text', scheduleBtn, true, 36),
        upsertContent('faqs', 'FAQs', 'json', JSON.stringify(faqs), faqsVisible, 40),
        upsertContent('contact_header_field_visibility', 'Header Field Visibility', 'json', JSON.stringify(headerFv), true, 3),
        upsertContent('contact_form_field_visibility', 'Form Field Visibility', 'json', JSON.stringify(formFv), true, 18),
        upsertContent('contact_sidebar_field_visibility', 'Sidebar Field Visibility', 'json', JSON.stringify(sidebarFv), true, 37),
      ]);
      setDirty(false);
      setSuccess('Contact page content saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to save content.');
    }
    setSaving(false);
  };
  handleSaveRef.current = handleSave;

  const toggleHeaderFv = (key: string) => { setHeaderFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const toggleFormFv = (key: string) => { setFormFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const toggleSidebarFv = (key: string) => { setSidebarFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const fvIcon = (fv: Record<string, boolean>, key: string) => fv[key] === false ? <EyeOff size={14}/> : <Eye size={14}/>;

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-oxblood-primary/20 border-t-oxblood-primary rounded-full animate-spin" />
      <span className="ml-3 text-sm text-gray-400">Loading...</span>
    </div>
  );

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Page Editor</h1>
          <p className="mt-1 text-gray-600">Edit all sections of the contact page</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-oxblood-primary text-black rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">{error}</div>}
      {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">{success}</div>}

      <div className="space-y-6" onChangeCapture={() => setDirty(true)}>
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Page Header</h2>
            <button onClick={() => setHeaderVisible(!headerVisible)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${headerVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {headerVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              {headerVisible ? 'Visible' : 'Hidden'}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <button type="button" onClick={() => toggleHeaderFv('title')} className="text-slate-400 hover:text-slate-600">{fvIcon(headerFv, 'title')}</button>
              </div>
              <input type="text" value={contactTitle} onChange={(e) => setContactTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Intro Text</label>
                <button type="button" onClick={() => toggleHeaderFv('intro')} className="text-slate-400 hover:text-slate-600">{fvIcon(headerFv, 'intro')}</button>
              </div>
              <input type="text" value={contactIntro} onChange={(e) => setContactIntro(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
          </div>
        </div>

        {/* Form Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Contact Form</h2>
            <button onClick={() => setFormVisible(!formVisible)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${formVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {formVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              {formVisible ? 'Visible' : 'Hidden'}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Form Title</label>
                <button type="button" onClick={() => toggleFormFv('form_title')} className="text-slate-400 hover:text-slate-600">{fvIcon(formFv, 'form_title')}</button>
              </div>
              <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Success Message</label>
                <button type="button" onClick={() => toggleFormFv('success_message')} className="text-slate-400 hover:text-slate-600">{fvIcon(formFv, 'success_message')}</button>
              </div>
              <input type="text" value={successMessage} onChange={(e) => setSuccessMessage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Interest Options</label>
              {serviceOptions.map((opt, i) => (
                <div key={i} className="flex gap-3 mb-2">
                  <input type="text" value={opt.value} onChange={(e) => { const u = [...serviceOptions]; u[i] = { ...u[i], value: e.target.value }; setServiceOptions(u); }} className="w-40 px-3 py-1.5 border border-gray-300 rounded-lg text-sm" placeholder="value" />
                  <input type="text" value={opt.label} onChange={(e) => { const u = [...serviceOptions]; u[i] = { ...u[i], label: e.target.value }; setServiceOptions(u); }} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm" placeholder="Label" />
                  <button onClick={() => setServiceOptions(serviceOptions.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={() => setServiceOptions([...serviceOptions, { value: '', label: '' }])} className="flex items-center gap-2 text-sm text-oxblood-primary hover:text-oxblood-hover/80"><Plus size={16} /> Add Option</button>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Form Field Labels</p>
              <div className="grid grid-cols-2 gap-3">
                {(['name', 'email', 'phone', 'company', 'message'] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{field} label</label>
                    <input type="text" value={formLabels[field]} onChange={(e) => setFormLabels({ ...formLabels, [field]: e.target.value })} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-700 mt-4 mb-3">Form Placeholders</p>
              <div className="grid grid-cols-2 gap-3">
                {(['name', 'email', 'phone', 'company', 'message'] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{field} placeholder</label>
                    <input type="text" value={formPlaceholders[field]} onChange={(e) => setFormPlaceholders({ ...formPlaceholders, [field]: e.target.value })} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Submit button text</label>
                  <input type="text" value={formBtnSubmit} onChange={(e) => setFormBtnSubmit(e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Reset button text</label>
                  <input type="text" value={formBtnReset} onChange={(e) => setFormBtnReset(e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-500">Disclaimer text</label>
                  <button type="button" onClick={() => toggleFormFv('disclaimer')} className="text-slate-400 hover:text-slate-600">{fvIcon(formFv, 'disclaimer')}</button>
                </div>
                <input type="text" value={formDisclaimer} onChange={(e) => setFormDisclaimer(e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Sidebar */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Contact Info Sidebar</h2>
            <button onClick={() => setContactInfoVisible(!contactInfoVisible)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${contactInfoVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {contactInfoVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              {contactInfoVisible ? 'Visible' : 'Hidden'}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Sidebar Title</label>
                <button type="button" onClick={() => toggleSidebarFv('sidebar_title')} className="text-slate-400 hover:text-slate-600">{fvIcon(sidebarFv, 'sidebar_title')}</button>
              </div>
              <input type="text" value={contactSidebarTitle} onChange={(e) => setContactSidebarTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <button type="button" onClick={() => toggleSidebarFv('email')} className="text-slate-400 hover:text-slate-600">{fvIcon(sidebarFv, 'email')}</button>
              </div>
              <input type="text" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <button type="button" onClick={() => toggleSidebarFv('phone')} className="text-slate-400 hover:text-slate-600">{fvIcon(sidebarFv, 'phone')}</button>
              </div>
              <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <button type="button" onClick={() => toggleSidebarFv('address')} className="text-slate-400 hover:text-slate-600">{fvIcon(sidebarFv, 'address')}</button>
              </div>
              <textarea value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30 resize-none" />
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">Schedule Card</p>
                <button type="button" onClick={() => toggleSidebarFv('schedule')} className="text-slate-400 hover:text-slate-600">{fvIcon(sidebarFv, 'schedule')}</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Card title</label>
                  <input type="text" value={scheduleTitle} onChange={(e) => setScheduleTitle(e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Button text</label>
                  <input type="text" value={scheduleBtn} onChange={(e) => setScheduleBtn(e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Business Hours</h2>
            <button onClick={() => setHoursVisible(!hoursVisible)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${hoursVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {hoursVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              {hoursVisible ? 'Visible' : 'Hidden'}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input type="text" value={businessHoursTitle} onChange={(e) => setBusinessHoursTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
              {businessHours.map((bh, i) => (
                <div key={i} className="flex gap-3 mb-2">
                  <input type="text" value={bh.day} onChange={(e) => { const u = [...businessHours]; u[i] = { ...u[i], day: e.target.value }; setBusinessHours(u); }} className="w-48 px-3 py-1.5 border border-gray-300 rounded-lg text-sm" placeholder="Day" />
                  <input type="text" value={bh.hours} onChange={(e) => { const u = [...businessHours]; u[i] = { ...u[i], hours: e.target.value }; setBusinessHours(u); }} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm" placeholder="Hours" />
                  <button onClick={() => setBusinessHours(businessHours.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={() => setBusinessHours([...businessHours, { day: '', hours: '' }])} className="flex items-center gap-2 text-sm text-oxblood-primary hover:text-oxblood-hover/80"><Plus size={16} /> Add Hours</button>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">FAQs</h2>
            <button type="button" onClick={() => setFaqsVisible(!faqsVisible)} className="text-gray-400 hover:text-gray-600">
              {faqsVisible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <input type="text" value={faq.question} onChange={(e) => { const arr = [...faqs]; arr[i] = {...arr[i], question: e.target.value}; setFaqs(arr); setDirty(true); }} className="w-full px-4 py-2.5 min-h-[44px] text-sm border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <textarea value={faq.answer} onChange={(e) => { const arr = [...faqs]; arr[i] = {...arr[i], answer: e.target.value}; setFaqs(arr); setDirty(true); }} rows={3} className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg resize-y focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30" />
              </div>
              <button type="button" onClick={() => { setFaqs(faqs.filter((_, j) => j !== i)); setDirty(true); }} className="mt-2 text-sm text-red-500 hover:text-red-700">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => { setFaqs([...faqs, { question: '', answer: '' }]); setDirty(true); }} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-oxblood-primary border border-oxblood-primary/30 rounded-lg hover:bg-oxblood-hover/5">
            + Add FAQ
          </button>
        </div>

        <div className="flex justify-end pb-8">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-oxblood-primary text-black rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400">
            <Save size={18} />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
