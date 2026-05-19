/**
 * MethodologySections — shared between Home (teaser) and About (full content).
 *
 * FrameworkSection: 3 flipping cards (Problem / Shift / Result).
 * KickoffSection:   4 step nodes + CTA.
 *
 * CMS keys (all stored under page_id = 'home'):
 *   home_framework_cards
 *   home_kickoff_heading, home_kickoff_subtitle, home_kickoff_nodes,
 *   home_kickoff_cta_text, home_kickoff_cta_href
 */

import { FlippingCard } from './ui/flipping-card';
import Pill from './designer/Pill';
import Btn from './designer/Btn';
import SectionNum from './designer/SectionNum';
import ProblemIllustration from './designer/ProblemIllustration';
import ShiftIllustration from './designer/ShiftIllustration';
import ResultIllustration from './designer/ResultIllustration';

/* ─── Types ─── */

export interface FrameworkCard {
  label: string;
  heading: string;
  body: string;
  backHeading: string;
  backBody: string;
}

export interface KickoffNode {
  pill: string;
  heading: string;
  body: string;
}

/* ─── Defaults ─── */

export const DEFAULT_FRAMEWORK_CARDS: FrameworkCard[] = [
  {
    label: '01 — THE PROBLEM',
    heading: 'A back office stitched together from six vendors.',
    body: 'Hiring sits with one agency. Payroll with another. Training, compliance, legal, IT — each in a different inbox, each with its own SLA. The work between them — the part where things actually break — has no owner.',
    backHeading: 'What it costs you',
    backBody: 'Audit findings nobody saw coming. Hires that ghost between offer and onboarding. POSH, EDLI, and DPDP gaps that surface during diligence. A Head of People spending half their week chasing vendors instead of running people ops.',
  },
  {
    label: '02 — THE SHIFT',
    heading: 'One operator-grade pod, six disciplines, one engagement.',
    body: 'Recruiters, HR ops leads, trainers, advisors, legal counsel, and build engineers — working under a single contract with a single accountable lead. The disciplines you used to coordinate, we coordinate. The gaps between them disappear into one team.',
    backHeading: 'How it runs',
    backBody: "A named operator owns each workstream. SLAs sit on outcomes, not activity. You see one weekly cadence with one engagement lead. When something breaks across disciplines — a hire that needs a quick legal review, an HR ops change that triggers an IT update — it’s already inside the same team.",
  },
  {
    label: '03 — THE RESULT',
    heading: 'A back office that scales with the company.',
    body: "Hiring you can forecast. Compliance that’s audit-ready by default. Contracts that close in days. Internal tools that replace spreadsheets. Training your managers actually use. All under one engagement, accountable to one outcome — yours.",
    backHeading: 'What changes for you',
    backBody: "Your Head of People runs people ops, not vendor relationships. Your founder isn’t on the hook for compliance edge cases. Your board hears about HR as a function that works, not as a recurring agenda risk. The back office stops being where growth gets stuck.",
  },
];

export const DEFAULT_KICKOFF_HEADING = "Day zero is when work starts.\nNot when paperwork ends.";
export const DEFAULT_KICKOFF_SUBTITLE = "Most engagements stall in scoping. Ours starts moving on day one. Here’s how a typical kickoff with an Adviserve pod takes shape.";
export const DEFAULT_KICKOFF_NODES: KickoffNode[] = [
  { pill: '/ 01', heading: 'Scoping', body: 'A 30-minute call to map your gaps across hiring, HR ops, training, advisory, legal, and IT. You leave with a one-page engagement plan. No discovery decks, no scoping fees.' },
  { pill: '/ 02', heading: 'Pod assembly', body: 'Your operator pod takes shape — recruiter, HR ops lead, legal counsel, build engineer. Every name has a face, a phone number, and a Slack handle.' },
  { pill: '/ 03', heading: 'Playbooks', body: 'The pod gets oriented inside your tools and processes. ATS access, HRMS context, compliance calendar, commercial contracts. The shape of the work becomes visible.' },
  { pill: '/ 04', heading: 'Engagement live', body: "Workstreams move from setup into delivery. You see momentum across every track you scoped, with regular cadence on what’s progressing and what’s blocked." },
];
export const DEFAULT_KICKOFF_CTA_TEXT = 'Book a 30-min scoping call →';
export const DEFAULT_KICKOFF_CTA_HREF = '/book';

/* ─── Illustrations ─── */

const CARD_ILLUSTRATIONS = [
  <ProblemIllustration key="problem" className="w-full h-full" />,
  <ShiftIllustration   key="shift"   className="w-full h-full" />,
  <ResultIllustration  key="result"  className="w-full h-full" />,
];

/* ─── FrameworkSection ─── */

export function FrameworkSection({ cards }: { cards: FrameworkCard[] }) {
  return (
    <section className="py-24 border-t hairline bg-ink-base">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="reveal mb-10">
          <div className="flex items-center gap-3">
            <SectionNum n="00.02.A" />
            <span className="h-px w-10 bg-white/10" />
            <span className="font-mono text-[11px] tracking-[0.14em] text-accent-blue">THE FRAMEWORK</span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <FlippingCard
                height={500}
                width={undefined as unknown as number}
                className="!w-full bg-ink-raised border-[color:#E5E2DA]"
                frontContent={
                  <div className="flex flex-col h-full p-6">
                    {CARD_ILLUSTRATIONS[i] && (
                      <div className="h-[180px] w-full overflow-hidden rounded-lg mb-4 flex-shrink-0">
                        {CARD_ILLUSTRATIONS[i]}
                      </div>
                    )}
                    <div className="font-mono text-[10px] tracking-[0.14em] text-accent-blue mb-2">{c.label}</div>
                    <h3 className="font-display text-[18px] leading-snug text-white mb-3">{c.heading}</h3>
                    <p className="text-[15px] text-white/75 leading-relaxed">{c.body}</p>
                  </div>
                }
                backContent={
                  <div className="flex flex-col justify-center h-full p-6">
                    <h3 className="font-display text-[20px] text-white mb-4">{c.backHeading}</h3>
                    <p className="text-[15px] text-white/75 leading-relaxed">{c.backBody}</p>
                  </div>
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── KickoffSection ─── */

interface KickoffProps {
  heading: string;
  subtitle: string;
  nodes: KickoffNode[];
  ctaText: string;
  ctaHref: string;
}

export function KickoffSection({ heading, subtitle, nodes, ctaText, ctaHref }: KickoffProps) {
  const [kickHead1, kickHead2] = heading.split('\n');
  return (
    <section className="border-t hairline bg-ink-base py-32">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="font-mono text-xs uppercase tracking-wider text-accent-blue mb-6 reveal">KICKOFF</p>
          <h2 className="font-display text-[clamp(32px,4.5vw,60px)] leading-[1.1] tracking-tight text-white reveal">
            {kickHead1}{kickHead2 && <>{' '}<span className="hero-accent-inline">{kickHead2}</span></>}
          </h2>
          <p className="mt-8 text-lg text-white/70 reveal">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {nodes.map((n, i) => (
            <div key={n.pill} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <Pill className="!bg-accent-blue/5 !border !border-accent-blue/30 !text-accent-blue font-mono text-xs mb-4 inline-flex">{n.pill}</Pill>
              <h3 className="font-display text-xl text-white mb-3">{n.heading}</h3>
              <p className="text-base text-white/70 leading-relaxed">{n.body}</p>
            </div>
          ))}
        </div>
        <div className="text-center reveal">
          <Btn size="lg" href={ctaHref}>{ctaText}</Btn>
          <p className="mt-4 text-sm text-white/50">30 minutes. No pitch decks.</p>
        </div>
      </div>
    </section>
  );
}
