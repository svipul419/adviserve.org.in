// Shared toggle used by SEO admin sub-sections (SEOAeoSection,
// SEOGeoSection, etc.) to keep one styling source of truth.

interface ToggleProps {
  enabled: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

export default function SettingsToggle({ enabled, onChange, label }: ToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30 focus:ring-offset-2 ${enabled ? 'bg-oxblood-primary' : 'bg-gray-200'}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}
