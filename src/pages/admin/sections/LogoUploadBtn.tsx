import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

const MAX_LOGO_BYTES = 500 * 1024; // 500 KB

export function LogoUploadBtn({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = (file: File) => {
    setUploadError(null);
    if (file.size > MAX_LOGO_BYTES) {
      setUploadError('Logo too large — max 500 KB. Compress at tinypng.com or similar.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { onUploaded(reader.result as string); };
    reader.onerror = () => { setUploadError('Could not read file.'); };
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
      <button type="button" onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium">
        <Upload size={12} />
        Upload Image
      </button>
      {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
    </div>
  );
}
