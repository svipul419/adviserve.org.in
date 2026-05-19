import { Loader2, Check } from 'lucide-react';

interface SaveButtonProps {
  saving: boolean;
  saved?: boolean;
  label?: string;
  savingLabel?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export default function SaveButton({
  saving,
  saved = false,
  label = 'Save Changes',
  savingLabel = 'Saving...',
  className = '',
  onClick,
  type = 'submit',
}: SaveButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={saving}
      className={`inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
 saved
 ? 'bg-emerald-500 text-white'
 : 'bg-oxblood-primary text-[#0f2333] hover:bg-oxblood-hover/90'
 } ${className}`}
    >
      {saving ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {savingLabel}
        </>
      ) : saved ? (
        <>
          <Check size={16} />
          Saved
        </>
      ) : (
        label
      )}
    </button>
  );
}
