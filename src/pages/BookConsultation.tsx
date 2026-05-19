import { useState, useCallback, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import EngineeringHero from '../components/sections/EngineeringHero';

const SERVICE_OPTIONS = [
  'Recruitment',
  'HR Services',
  'Corporate Training',
  'Business Consulting',
  'Legal Consulting',
  'IT & Development',
  'Other',
];

// Generate 30-min time slots from 9:00 AM to 6:00 PM IST
const TIME_SLOTS: string[] = [];
for (let h = 9; h < 18; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const min = m.toString().padStart(2, '0');
    TIME_SLOTS.push(`${hour12}:${min} ${ampm}`);
  }
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isPastDate(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateForApi(date: Date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateDisplay(date: Date) {
  return `${DAY_NAMES[date.getDay()]}, ${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

// Find the next business day on or after `from` (skips weekends).
function nextBusinessDay(from: Date): Date {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

export default function BookConsultation() {
  const today = new Date();
  // Default to today if it's a weekday, otherwise the next business day —
  // so the Time-slot panel renders immediately on mount instead of waiting
  // for the user to re-click the calendar.
  const initialDate = nextBusinessDay(today);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', service_interest: searchParams.get('service') || '', notes: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState<{ date: string; time: string; name: string } | null>(null);

  const prevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }, [viewMonth, viewYear]);

  const nextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }, [viewMonth, viewYear]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const handleDateClick = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    if (isWeekend(date) || isPastDate(date)) return;
    setSelectedDate(date);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time.');
      return;
    }
    if (!formData.name || !formData.email) {
      setError('Name and email are required.');
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: formatDateForApi(selectedDate),
          time: selectedTime,
          website: honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to book consultation');
      }
      setSuccess(true);
      setBookingResult({
        date: formatDateDisplay(selectedDate),
        time: selectedTime,
        name: formData.name,
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success && bookingResult) {
    return (
      <div className="min-h-screen bg-ink-base flex items-center justify-center px-4">
        <SEOHead title="Booking Confirmed" />
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-accent-blue" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl uppercase text-white mb-4 tracking-tight">Booking Confirmed</h1>
          <p className="text-white/75 text-base leading-relaxed mb-8">
            Thank you, <strong className="text-white">{bookingResult.name}</strong>. Your free consultation has been scheduled.
          </p>
          <div className="bg-ink-raised border border-white/10 rounded-2xl p-8 mb-8 text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-accent-blue" />
              </div>
              <div>
                <p className="text-[11px] font-mono uppercase tracking-widest text-white/55">Date & Time (IST)</p>
                <p className="text-white font-semibold">{bookingResult.date}</p>
                <p className="text-white">{bookingResult.time} IST</p>
              </div>
            </div>
          </div>
          <p className="text-white/55 text-sm">We will send a confirmation email with meeting details shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#FBFDFF' }}>
      <SEOHead
        title="Book a Free Consultation | Adviserve Business Advisory"
        description="Schedule a free 30-minute consultation with Adviserve. Discuss recruitment, HR, legal, IT, or strategy needs — no commitment required."
        canonical="https://adviserve.in/book"
      />

      <EngineeringHero
        eyebrow="Free Consultation"
        title="Book a free 30-minute consultation."
        gradientPhrase="consultation."
        subtitle="Pick a date and time that works. We will discuss your business, your challenges, and whether Adviserve is the right fit — with zero obligation."
        sheet="CSL"
        total="07"
        label="CONSULTATION · 30 MIN"
        mark="CSL"
      />

      {/* Progress stepper */}
      <section className="px-4 sm:px-6 pb-8" data-section-color="dark">
        <div className="max-w-md mx-auto flex items-center">
          {[
            { num: 1, label: 'Date', done: !!selectedDate },
            { num: 2, label: 'Time', done: !!selectedTime },
            { num: 3, label: 'Details', done: !!formData.name && !!formData.email },
          ].map((step, i) => (
            <div key={step.num} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
 step.done
 ? 'bg-accent-blue text-white'
 : 'border-2 border-white/10 text-white/55'
 }`}>
                  {step.done ? <CheckCircle size={18} /> : step.num}
                </div>
                <span className={`text-[10px] font-mono uppercase tracking-wider mt-1.5 ${step.done ? 'text-accent-blue' : 'text-white/55'}`}>{step.label}</span>
              </div>
              {i < 2 && (
                <div className={`flex-1 h-[2px] mx-3 mt-[-14px] rounded-full transition-all duration-500 ${
 step.done ? 'bg-accent-blue' : 'bg-[#e5e5dd]'
 }`} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form */}
      <section className="pb-24 px-4 sm:px-6" data-section-color="dark">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left: Calendar + Time */}
            <div className="space-y-6">
              {/* Calendar */}
              <div className="bg-ink-raised border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-lg uppercase tracking-wide text-white">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={prevMonth}
                      disabled={!canGoPrev}
                      className="w-9 h-9 flex items-center justify-center border border-white/10 rounded-lg hover:border-accent-blueHover hover:text-accent-blueHover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous month"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="w-9 h-9 flex items-center justify-center border border-white/10 rounded-lg hover:border-accent-blueHover hover:text-accent-blueHover transition-colors"
                      aria-label="Next month"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAY_NAMES.map((d) => (
                    <div key={d} className="text-center text-[10px] font-mono uppercase tracking-widest text-white/55 py-2">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for offset */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(viewYear, viewMonth, day);
                    const disabled = isWeekend(date) || isPastDate(date);
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, today);

                    return (
                      <button
                        type="button"
                        key={day}
                        disabled={disabled}
                        onClick={() => handleDateClick(day)}
                        className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
 ${disabled
 ? 'text-white/35 cursor-not-allowed line-through decoration-white/10'
 : isSelected
 ? 'bg-accent-blue text-white shadow-lg  ring-2 ring-accent-blue ring-offset-2 ring-offset-white scale-110 font-bold'
 : isToday
 ? 'bg-accent-blue/10 text-accent-blue hover:bg-accent-blueHover hover:text-white'
 : 'text-white hover:bg-accent-blueHover/10 hover:text-accent-blueHover'
 }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <p className="text-[10px] font-mono uppercase tracking-widest text-white/55 mt-4">
                  Weekends are unavailable. All times in IST.
                </p>
              </div>

              {/* Time slots — grouped by period */}
              <div className="bg-ink-raised border border-white/10 rounded-2xl p-6 md:p-8">
                <h2 className="font-display text-lg uppercase tracking-wide text-white mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-accent-blue" />
                  Select Time
                </h2>
                {!selectedDate ? (
                  <p className="text-white/55 text-sm">Please select a date first.</p>
                ) : (
                  <div className="space-y-5">
                    {[
                      { label: 'Morning', slots: TIME_SLOTS.filter(s => s.includes('AM')) },
                      { label: 'Afternoon', slots: TIME_SLOTS.filter(s => s.includes('PM') && parseInt(s) !== 12 && parseInt(s) < 4) },
                      { label: 'Evening', slots: TIME_SLOTS.filter(s => s.includes('PM') && (parseInt(s) >= 4 || parseInt(s) === 12)) },
                    ].filter(g => g.slots.length > 0).map((group) => (
                      <div key={group.label}>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-white/55 mb-2">{group.label}</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {group.slots.map((slot) => (
                            <button
                              type="button"
                              key={slot}
                              onClick={() => setSelectedTime(slot)}
                              className={`py-2.5 px-3 text-sm rounded-lg border font-medium transition-all duration-200
 ${selectedTime === slot
 ? 'bg-accent-blue/10 text-accent-blue border-accent-blue ring-2 ring-accent-blue/30 font-bold shadow-sm'
 : 'border-white/10 text-white/75 hover:border-accent-blueHover hover:text-accent-blueHover'
 }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selection summary */}
              {selectedDate && (
                <div className="bg-accent-blue/5 border border-accent-blue/20 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={20} className={selectedTime ? 'text-accent-blue' : 'text-white/55'} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/55 mb-0.5">Selected</p>
                    <p className="text-sm font-semibold text-white">
                      {formatDateDisplay(selectedDate)}
                      {selectedTime ? (
                        <span className="text-accent-blue"> at {selectedTime} IST</span>
                      ) : (
                        <span className="text-white/55"> — pick a time above</span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Form fields */}
            <div className="bg-ink-raised border border-white/10 rounded-2xl p-6 md:p-8 h-fit lg:sticky lg:top-24">
              <h2 className="font-display text-lg uppercase tracking-wide text-white mb-6">Your Details</h2>

              {/* Selected date/time summary */}
              {selectedDate && selectedTime && (
                <div className="bg-accent-blue/5 border border-accent-blue/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <Clock size={18} className="text-accent-blue flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">{formatDateDisplay(selectedDate)}</p>
                    <p className="text-sm text-accent-blue">{selectedTime} IST</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-[11px] font-mono uppercase tracking-widest text-white/55 mb-1.5">Name *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/55 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors bg-ink-base"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[11px] font-mono uppercase tracking-widest text-white/55 mb-1.5">Email *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/55 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors bg-ink-base"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[11px] font-mono uppercase tracking-widest text-white/55 mb-1.5">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/55 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors bg-ink-base"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-[11px] font-mono uppercase tracking-widest text-white/55 mb-1.5">Company</label>
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/55 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors bg-ink-base"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-[11px] font-mono uppercase tracking-widest text-white/55 mb-1.5">Service Interest</label>
                  <select
                    id="service"
                    value={formData.service_interest}
                    onChange={(e) => setFormData({ ...formData, service_interest: e.target.value })}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors bg-ink-base appearance-none"
                  >
                    <option value="">Select a service...</option>
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-[11px] font-mono uppercase tracking-widest text-white/55 mb-1.5">Notes</label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/55 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors bg-ink-base resize-none"
                    placeholder="Anything you'd like us to know beforehand..."
                  />
                </div>

                {/* Honeypot */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !selectedDate || !selectedTime}
                  className="w-full font-mono text-[12px] uppercase tracking-[0.16em] font-semibold bg-accent-blue text-white px-6 py-5 rounded-xl shadow-md hover:bg-accent-blueHover hover:shadow-lg active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
