import { X } from 'lucide-react';

interface ImagePreviewProps {
  src: string;
  onRemove: () => void;
  label?: string;
}

export default function ImagePreview({ src, onRemove, label }: ImagePreviewProps) {
  return (
    <div className="relative group">
      {label && (
        <span className="absolute top-2 left-2 z-10 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          {label}
        </span>
      )}
      <img
        src={src}
        alt="Preview"
        className="h-40 w-full rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
      />
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-600 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-rose-500 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
