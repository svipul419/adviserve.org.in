import { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { Upload, X, FileCheck, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
}

export default function FileUpload({
  onUpload,
  accept = '.pdf,.doc,.docx',
  maxSizeMB = 5,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be under ${maxSizeMB} MB`);
      return;
    }

    setUploading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onUpload(data.url as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setFileName(null);
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clear = () => {
    setFileName(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
    onUpload('');
  };

  return (
    <div>
      {!fileName ? (
        <div
          role="button"
          tabIndex={0}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
 dragOver
 ? 'border-accent-blue bg-accent-blue/5'
 : 'border-gray-300 hover:border-accent-blueHover/50'
 }`}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={onFileChange}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
              <span className="text-sm text-gray-500">Uploading…</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                <span className="font-medium text-accent-blue">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">PDF, DOC, DOCX up to {maxSizeMB} MB</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
          <FileCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-sm text-gray-700 flex-1 truncate">{fileName}</span>
          <button
            type="button"
            onClick={clear}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
