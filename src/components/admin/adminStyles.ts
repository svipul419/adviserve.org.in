/**
 * Standardized admin panel design tokens.
 * Import these classes instead of writing inline styles.
 * Ensures visual consistency across all admin pages.
 * Supports light + dark mode.
 */

// ─── Inputs ───
export const inputCls = 'w-full px-4 py-2.5 min-h-[44px] text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary transition-colors';

export const textareaCls = `${inputCls} resize-y`;

export const selectCls = `${inputCls} appearance-none`;

export const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';

// ─── Buttons ───
export const btnPrimary = 'inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-sm font-medium rounded-lg bg-oxblood-primary text-[#0f2333] hover:bg-oxblood-hover/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

export const btnSecondary = 'inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors';

export const btnDanger = 'inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors';

export const btnIcon = 'w-9 h-9 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors';

// ─── Cards ───
export const cardCls = 'bg-white border border-gray-200 rounded-xl';

export const cardPadding = 'p-6';

// ─── Tables ───
export const tableHeaderCls = 'bg-gray-50 border-b border-gray-200';

export const tableThCls = 'px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';

export const tableTdCls = 'px-5 py-4 text-sm text-gray-700';

export const tableRowCls = 'border-b border-gray-100 hover:bg-gray-50/50 transition-colors';

// ─── Status Badges ───
export const badgeStyles: Record<string, string> = {
  published: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  draft: 'bg-amber-50 text-amber-700 border border-amber-200',
  archived: 'bg-gray-100 text-gray-600 border border-gray-200',
  new: 'bg-blue-50 text-blue-700 border border-blue-200',
  in_progress: 'bg-amber-50 text-amber-700 border border-amber-200',
  resolved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  unsubscribed: 'bg-gray-100 text-gray-600 border border-gray-200',
  bounced: 'bg-red-50 text-red-600 border border-red-200',
  scheduled: 'bg-blue-50 text-blue-700 border border-blue-200',
  sending: 'bg-amber-50 text-amber-700 border border-amber-200',
  sent: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  failed: 'bg-red-50 text-red-600 border border-red-200',
};

export const badgeCls = 'inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full';

// ─── Page Layout ───
export const pageHeading = 'text-2xl font-bold text-gray-900';

export const pageSubtext = 'text-sm text-gray-500 mt-1';

// ─── Section Headings (editor panels) ───
export const sectionHeading = 'text-lg font-semibold text-gray-900';

// ─── Form Layout ───
export const formSection = 'space-y-4';

export const formGrid2 = 'grid grid-cols-1 sm:grid-cols-2 gap-4';
