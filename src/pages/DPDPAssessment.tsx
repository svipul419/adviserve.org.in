/**
 * DPDPAssessment — §DPDP. 15-question self-assessment quiz.
 *
 * Five categories (A–E) of three questions each. Single-select, scored 0/1/2/3.
 * Total /45 with maturity bands: 38–45 Mature, 27–37 Operationalising,
 * 15–26 Emerging, 0–14 Early-stage.
 *
 * Result screen renders score, band, 5-bar category chart, top action per
 * low category (score < 7), two CTAs. Email capture optional; submission posts
 * to /api/dpdp-assessment.
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { FadeUp } from '../components/animations';
import EngineeringHero from '../components/sections/EngineeringHero';
import AnimatedCTAButton from '../components/ui/AnimatedCTAButton';

interface Option { label: string; score: 0 | 1 | 2 | 3; }
interface Question { id: string; categoryCode: string; categoryLabel: string; prompt: string; options: Option[]; }

const QUESTIONS: Question[] = [
  // A. Data inventory & flows
  { id: 'A1', categoryCode: 'A', categoryLabel: 'Data inventory & flows', prompt: 'Do you maintain a documented inventory of personal data your organisation collects, processes, and stores?', options: [
    { label: 'Yes, comprehensive and updated regularly.', score: 3 },
    { label: 'Partial — major systems documented, smaller ones not.', score: 2 },
    { label: 'Informally documented or in scattered spreadsheets.', score: 1 },
    { label: 'No formal inventory.', score: 0 },
  ] },
  { id: 'A2', categoryCode: 'A', categoryLabel: 'Data inventory & flows', prompt: 'Do you know which third-party vendors and sub-processors have access to personal data?', options: [
    { label: 'Yes, with documented DPAs for each.', score: 3 },
    { label: "Yes, but DPAs aren't standardised.", score: 2 },
    { label: 'Partially — major vendors known.', score: 1 },
    { label: 'No structured visibility.', score: 0 },
  ] },
  { id: 'A3', categoryCode: 'A', categoryLabel: 'Data inventory & flows', prompt: 'Do you have a defined retention policy for each category of personal data?', options: [
    { label: 'Yes, documented and enforced via system controls.', score: 3 },
    { label: 'Documented but enforcement is manual.', score: 2 },
    { label: 'Informal — retention is per-team.', score: 1 },
    { label: 'No defined retention policy.', score: 0 },
  ] },
  // B. Consent & user rights
  { id: 'B1', categoryCode: 'B', categoryLabel: 'Consent & user rights', prompt: 'Do you capture explicit, granular consent at the point of data collection?', options: [
    { label: 'Yes, granular and revocable.', score: 3 },
    { label: 'Yes, but consent is bundled.', score: 2 },
    { label: 'Implicit consent via T&Cs only.', score: 1 },
    { label: 'Consent not captured separately.', score: 0 },
  ] },
  { id: 'B2', categoryCode: 'B', categoryLabel: 'Consent & user rights', prompt: 'Can data principals exercise their rights (access, correction, erasure) through a defined process?', options: [
    { label: 'Yes, documented process with SLA.', score: 3 },
    { label: "Process exists but isn't published.", score: 2 },
    { label: 'Handled ad-hoc by request.', score: 1 },
    { label: 'No defined process.', score: 0 },
  ] },
  { id: 'B3', categoryCode: 'B', categoryLabel: 'Consent & user rights', prompt: 'Do you have a Consent Manager integration or equivalent mechanism in place?', options: [
    { label: 'Yes, integrated and operational.', score: 3 },
    { label: 'In implementation.', score: 2 },
    { label: 'Planned but not started.', score: 1 },
    { label: 'Not on roadmap.', score: 0 },
  ] },
  // C. Breach & incident response
  { id: 'C1', categoryCode: 'C', categoryLabel: 'Breach & incident response', prompt: 'Do you have a documented breach response plan?', options: [
    { label: 'Yes, tested in the last 12 months.', score: 3 },
    { label: 'Documented but untested.', score: 2 },
    { label: 'Informal playbook.', score: 1 },
    { label: 'No documented plan.', score: 0 },
  ] },
  { id: 'C2', categoryCode: 'C', categoryLabel: 'Breach & incident response', prompt: 'Can you detect and respond to a personal-data breach within 72 hours?', options: [
    { label: 'Yes, with monitoring and defined escalation.', score: 3 },
    { label: 'Likely yes for major systems.', score: 2 },
    { label: 'Uncertain for some systems.', score: 1 },
    { label: 'No mechanism to detect in that window.', score: 0 },
  ] },
  { id: 'C3', categoryCode: 'C', categoryLabel: 'Breach & incident response', prompt: 'Do you know how to notify the Data Protection Board of India in the event of a breach?', options: [
    { label: 'Yes, process documented and template ready.', score: 3 },
    { label: 'Aware of obligation, no template.', score: 2 },
    { label: 'Generally aware.', score: 1 },
    { label: 'Not aware of the specific process.', score: 0 },
  ] },
  // D. Grievance & accountability
  { id: 'D1', categoryCode: 'D', categoryLabel: 'Grievance & accountability', prompt: 'Have you appointed a Data Protection Officer or equivalent function?', options: [
    { label: 'Yes, named DPO with documented responsibilities.', score: 3 },
    { label: 'Function exists, not formally named.', score: 2 },
    { label: 'Distributed across roles informally.', score: 1 },
    { label: 'Not appointed.', score: 0 },
  ] },
  { id: 'D2', categoryCode: 'D', categoryLabel: 'Grievance & accountability', prompt: 'Do data principals have a clear channel to raise grievances?', options: [
    { label: 'Yes, published with documented SLA.', score: 3 },
    { label: "Channel exists, SLA isn't formal.", score: 2 },
    { label: 'Handled via general support.', score: 1 },
    { label: 'No dedicated channel.', score: 0 },
  ] },
  { id: 'D3', categoryCode: 'D', categoryLabel: 'Grievance & accountability', prompt: 'Do you track and report grievance resolution metrics internally?', options: [
    { label: 'Yes, regular reporting to leadership.', score: 3 },
    { label: 'Tracked but not regularly reported.', score: 2 },
    { label: 'Anecdotal.', score: 1 },
    { label: 'Not tracked.', score: 0 },
  ] },
  // E. Security & technical controls
  { id: 'E1', categoryCode: 'E', categoryLabel: 'Security & technical controls', prompt: 'Is personal data encrypted at rest and in transit?', options: [
    { label: 'Yes, both, across all systems.', score: 3 },
    { label: 'Yes for major systems.', score: 2 },
    { label: 'Partial.', score: 1 },
    { label: 'No encryption.', score: 0 },
  ] },
  { id: 'E2', categoryCode: 'E', categoryLabel: 'Security & technical controls', prompt: 'Is access to personal data role-based with audit logging?', options: [
    { label: 'Yes, RBAC with audit trails everywhere.', score: 3 },
    { label: 'RBAC yes, audit trails partial.', score: 2 },
    { label: 'Informal access management.', score: 1 },
    { label: 'No structured access control.', score: 0 },
  ] },
  { id: 'E3', categoryCode: 'E', categoryLabel: 'Security & technical controls', prompt: 'Do you conduct regular security audits or penetration tests?', options: [
    { label: 'Yes, annually with documented findings.', score: 3 },
    { label: 'Conducted occasionally.', score: 2 },
    { label: 'One-off only.', score: 1 },
    { label: 'Never conducted.', score: 0 },
  ] },
];

const CATEGORY_CODES = ['A', 'B', 'C', 'D', 'E'] as const;
const CATEGORY_LABEL_MAP: Record<string, string> = QUESTIONS.reduce<Record<string, string>>((acc, q) => {
  acc[q.categoryCode] = q.categoryLabel;
  return acc;
}, {});

const TOP_ACTION_BY_CATEGORY: Record<string, string> = {
  A: 'Build a documented inventory of personal data and the systems that process it. Every other DPDP control downstream collapses without it.',
  B: "Implement granular, revocable consent at the point of collection. Bundled or implicit consent will not meet the Act's standard on inspection.",
  C: 'Document and test a breach response plan against the seventy-two-hour clock. Untested plans fail when the clock starts.',
  D: 'Appoint a Data Protection Officer or equivalent function. Publish a grievance channel with an SLA. Both are required by the Act.',
  E: 'Encrypt personal data at rest and in transit, and enforce role-based access with audit logging. Foundation security controls.',
};

interface MaturityBand { name: string; description: string; min: number; max: number; }
const BANDS: MaturityBand[] = [
  { name: 'Mature', description: 'Strong posture. Tactical improvements only.', min: 38, max: 45 },
  { name: 'Operationalising', description: 'Solid foundation. Specific gap areas to address.', min: 27, max: 37 },
  { name: 'Emerging', description: 'Awareness present, execution inconsistent. Structured remediation needed.', min: 15, max: 26 },
  { name: 'Early-stage', description: 'Significant exposure. Immediate action recommended.', min: 0, max: 14 },
];

type ScreenState = 'intro' | 'quiz' | 'result';

export default function DPDPAssessment() {
  const [screen, setScreen] = useState<ScreenState>('intro');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [questionIdx, setQuestionIdx] = useState(0);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const total = useMemo(() => Object.values(answers).reduce((sum, v) => sum + v, 0), [answers]);
  const categoryScores = useMemo(() => {
    const out: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    for (const q of QUESTIONS) {
      const a = answers[q.id];
      if (typeof a === 'number') out[q.categoryCode] += a;
    }
    return out;
  }, [answers]);

  const band = useMemo(() => BANDS.find((b) => total >= b.min && total <= b.max) ?? BANDS[BANDS.length - 1], [total]);

  function startQuiz() { setScreen('quiz'); setQuestionIdx(0); }
  function answer(score: number) {
    const q = QUESTIONS[questionIdx];
    setAnswers((prev) => ({ ...prev, [q.id]: score }));
    if (questionIdx < QUESTIONS.length - 1) {
      setQuestionIdx((i) => i + 1);
    } else {
      submitResult({ ...answers, [q.id]: score });
    }
  }
  function back() { if (questionIdx > 0) setQuestionIdx((i) => i - 1); }
  function reset() {
    setAnswers({});
    setQuestionIdx(0);
    setEmail('');
    setSubmitError(null);
    setScreen('intro');
  }

  async function submitResult(finalAnswers: Record<string, number>) {
    setScreen('result');
    setSubmitting(true);
    setSubmitError(null);
    try {
      await fetch('/api/dpdp-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers, total: Object.values(finalAnswers).reduce((s, v) => s + v, 0), email: email || null, submittedAt: new Date().toISOString() }),
      });
    } catch (e) {
      setSubmitError('Could not save your result, but the score below is correct.');
    } finally {
      setSubmitting(false);
    }
  }

  const progress = ((questionIdx + 1) / QUESTIONS.length) * 100;
  const currentQ = QUESTIONS[questionIdx];
  const currentAnswer = currentQ ? answers[currentQ.id] : undefined;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#FBFDFF' }}>
      <SEOHead title="Free DPDP Self-Assessment | Adviserve" description="Fifteen questions across five domains. Fifteen minutes. Structured output. No call required." canonical="https://adviserve.in/dpdp-assessment" />

      {/* Intro */}
      {screen === 'intro' && (
        <>
          <EngineeringHero
            eyebrow="Find your DPDP exposure in 15 minutes"
            title="Are you ready when the regulator calls?"
            gradientPhrase="the regulator calls?"
            subtitle="Fifteen questions, five domains, fifteen minutes. You will leave with a domain-by-domain score, a prioritised gap list, and a clear view of what to fix first. Anonymous. No sales call attached."
            sheet="DPD"
            total="07"
            label="DPDP · SELF-ASSESSMENT"
            mark="DPD"
          >
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[rgba(11,20,38,0.55)] mb-6">
              <span>Anonymous by default</span>
              <span className="w-1 h-1 rounded-full bg-[rgba(11,20,38,0.30)]" aria-hidden="true" />
              <span>Aligned with DPDP Act 2023</span>
              <span className="w-1 h-1 rounded-full bg-[rgba(11,20,38,0.30)]" aria-hidden="true" />
              <span>Run inside ISO/IEC 27001-aligned ISMS</span>
            </div>
            <button
              onClick={startQuiz}
              className="inline-flex items-center gap-3 px-9 py-4 min-h-[44px] rounded-[100px] bg-[#1e9df1] text-white font-mono text-[12px] tracking-[0.14em] uppercase hover:bg-[#1a82d4] transition-colors"
            >
              Start the assessment <ArrowRight size={14} />
            </button>
          </EngineeringHero>
        </>
      )}

      {/* Quiz */}
      {screen === 'quiz' && currentQ && (
        <section className="relative pt-[120px] pb-24 lg:pb-32 bg-ink-base flex-1 flex items-start">
          <div className="max-w-3xl w-full mx-auto px-6 sm:px-12">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[11px] tracking-[0.14em] text-white/75 uppercase">Question {questionIdx + 1} of {QUESTIONS.length}</span>
                <span className="font-mono text-[11px] tracking-[0.14em] text-white/75 uppercase">{currentQ.categoryCode}. {currentQ.categoryLabel}</span>
              </div>
              <div className="h-1 bg-ink-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent-blue transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <FadeUp key={currentQ.id}>
              <h2 className="font-display text-[clamp(26px,3.4vw,40px)] leading-[1.15] tracking-[-0.01em] text-white mb-8">
                {currentQ.prompt}
              </h2>

              <fieldset className="space-y-3" aria-label="Answer options">
                <legend className="sr-only">Pick the option closest to your current state.</legend>
                {currentQ.options.map((opt) => {
                  const isSelected = currentAnswer === opt.score;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => answer(opt.score)}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-colors min-h-[44px] ${
 isSelected
 ? 'border-accent-blue bg-accent-blue/[0.08] text-white'
 : 'border-white/10 bg-white hover:border-accent-blueHover/40 hover:bg-accent-blueHover/[0.03] text-white'
 }`}
                    >
                      <span className="flex items-center justify-between gap-4">
                        <span className="text-[15px] leading-[1.55]">{opt.label}</span>
                        <span className={`font-mono text-[10px] tracking-[0.14em] uppercase flex-shrink-0 ${isSelected ? 'text-accent-blue' : 'text-white/75'}`}>
                          {opt.score}/3
                        </span>
                      </span>
                    </button>
                  );
                })}
              </fieldset>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={back}
                  disabled={questionIdx === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] font-mono text-[11px] tracking-[0.14em] uppercase text-white/75 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <span className="font-mono text-[11px] tracking-[0.14em] text-white/75 uppercase">Auto-advances on selection</span>
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      {/* Result */}
      {screen === 'result' && (
        <section className="pt-[120px] pb-24 lg:pb-32 bg-ink-base flex-1">
          <div className="max-w-4xl mx-auto px-6 sm:px-12">
            <FadeUp>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 mb-3">// YOUR ASSESSMENT</p>
              <div className="flex flex-wrap items-end gap-x-6 gap-y-2 mb-8">
                <span className="font-display text-[clamp(64px,10vw,128px)] leading-[0.9] tracking-[-0.02em] text-white">{total}</span>
                <span className="font-display text-[clamp(20px,2.4vw,28px)] text-white/55 pb-2">/ 45</span>
              </div>
              <div className="inline-block rounded-2xl border border-accent-blue/40 bg-accent-blue/[0.06] px-5 py-3 mb-6">
                <p className="font-mono text-[10px] tracking-[0.14em] text-white/75 uppercase">Maturity band</p>
                <p className="font-display text-[22px] uppercase tracking-[0.04em] text-white mt-1">{band.name}</p>
              </div>
              <p className="text-[16px] leading-[1.75] text-white/80 max-w-2xl">{band.description}</p>
              {submitError && <p className="mt-4 text-[13px] text-white/75">{submitError}</p>}
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="mt-12">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/65 mb-7">// CATEGORY SCORES</p>
                <div className="space-y-4">
                  {CATEGORY_CODES.map((c) => {
                    const score = categoryScores[c] ?? 0;
                    const pct = (score / 9) * 100;
                    return (
                      <div key={c}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[12px] tracking-[0.1em] text-white">
                            <span className="text-accent-blue mr-2">{c}.</span>{CATEGORY_LABEL_MAP[c]}
                          </span>
                          <span className="font-mono text-[11px] tracking-[0.14em] text-white/75 uppercase">{score} / 9</span>
                        </div>
                        <div className="h-2 bg-ink-primary/10 rounded-full overflow-hidden">
                          <div className="h-full bg-accent-blue transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="mt-12">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/65 mb-7">// TOP ACTIONS</p>
                {CATEGORY_CODES.filter((c) => (categoryScores[c] ?? 0) < 7).length === 0 ? (
                  <p className="text-[15px] text-white/75">All five categories are above the action threshold. Schedule a quarterly review to maintain posture.</p>
                ) : (
                  <ul className="space-y-4">
                    {CATEGORY_CODES.filter((c) => (categoryScores[c] ?? 0) < 7).map((c) => (
                      <li key={c} className="rounded-xl border border-white/10 bg-ink-raised p-5">
                        <p className="font-mono text-[10px] tracking-[0.14em] text-white/75 uppercase mb-2">{c}. {CATEGORY_LABEL_MAP[c]}</p>
                        <p className="text-[14px] leading-[1.7] text-white/80">{TOP_ACTION_BY_CATEGORY[c]}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="mt-12 rounded-xl border border-white/10 bg-ink-raised p-5 max-w-xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/75 mb-3">// OPTIONAL</p>
                <label htmlFor="dpdp-email" className="block text-[14px] text-white mb-2">Send a copy of this result to your inbox.</label>
                <div className="flex gap-2">
                  <input
                    id="dpdp-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.in"
                    className="flex-1 px-4 py-3 min-h-[44px] rounded-lg border border-white/10 text-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                  />
                  <button
                    onClick={() => submitResult(answers)}
                    disabled={submitting || !email}
                    className="px-5 py-3 min-h-[44px] rounded-lg bg-accent-blue text-white font-mono text-[11px] tracking-[0.14em] uppercase hover:bg-accent-blueHover/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? 'Sending…' : 'Send'}
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-white/75">We will not add you to any list. The address is used to deliver the result.</p>
              </div>
            </FadeUp>

            <FadeUp delay={0.25}>
              <div className="mt-12 flex flex-wrap items-center gap-3">
                <AnimatedCTAButton href="/contact?practice=compliance" label="Talk to our DPDP practice" size="lg" />
                <Link
                  to="/products/dpdp-compliance"
                  className="inline-flex items-center gap-2 px-7 py-3 min-h-[44px] rounded-[100px] border border-white/12 text-white font-mono text-[12px] tracking-[0.14em] uppercase hover:bg-ink-base hover:text-white transition-colors"
                >
                  Apply for Adviserve Comply pilot <ArrowRight size={14} />
                </Link>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] font-mono text-[11px] tracking-[0.14em] uppercase text-white/75 hover:text-white transition-colors"
                >
                  <RotateCcw size={14} /> Take it again
                </button>
              </div>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p className="mt-12 text-[13px] text-white/55 flex items-start gap-2">
                <CheckCircle2 size={14} className="text-accent-blue mt-0.5 flex-shrink-0" />
                <span>Assessment aligned with DPDP Act 2023. Operated under ISO/IEC 27001-aligned ISMS.</span>
              </p>
            </FadeUp>
          </div>
        </section>
      )}
    </div>
  );
}
