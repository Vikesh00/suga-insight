import { useCallback, useState } from 'react';
import { Upload, ImagePlus, ArrowRight } from 'lucide-react';
import ImagePreview from './ImagePreview';

interface UploadCardProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  onAnalyze: () => void;
  mode: 'single' | 'compare';
}

export default function UploadCard({ images, onImagesChange, onAnalyze, mode }: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (mode === 'compare') {
          if (images.length < 2) {
            onImagesChange([...images, result]);
          }
        } else {
          onImagesChange([result]);
        }
      };
      reader.readAsDataURL(file);
    },
    [images, onImagesChange, mode]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) handleFile(e.target.files[0]);
    },
    [handleFile]
  );

  const canAddMore = mode === 'single' ? images.length === 0 : images.length < 2;
  const readyToAnalyze = mode === 'single' ? images.length === 1 : images.length === 2;

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-6 flex items-center justify-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-600/20 dark:text-brand-400">
          <Upload className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Upload nutrition label</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {mode === 'compare'
              ? 'Add two product labels to compare sugar content'
              : 'Drag and drop or select a food label image'}
          </p>
        </div>
      </div>

      {canAddMore && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
            isDragging
              ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/20'
              : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-slate-600'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={onInputChange}
            className="absolute inset-0 z-10 cursor-pointer opacity-0"
          />
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm dark:bg-slate-700 dark:text-slate-400">
              <ImagePlus className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Drop image here or click to browse
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG, WEBP up to 10MB</p>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {images.map((img, idx) => (
            <ImagePreview
              key={idx}
              src={img}
              label={mode === 'compare' ? `Product ${idx + 1}` : undefined}
              onRemove={() => onImagesChange(images.filter((_, i) => i !== idx))}
            />
          ))}
        </div>
      )}

      {readyToAnalyze && (
        <button
          onClick={onAnalyze}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-700 active:scale-[0.98]"
        >
          Analyze Sugar
          <ArrowRight className="h-4 w-4" />
        </button>
      )}

      {mode === 'compare' && images.length === 1 && (
        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Add one more image to compare
        </p>
      )}
    </div>
  );
}
