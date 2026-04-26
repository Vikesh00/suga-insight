import { motion } from 'framer-motion';
import type { AnalysisResult } from '../utils/types';
import SugarBadge from './SugarBadge';
import SugarMeter from './SugarMeter';
import InsightBox from './InsightBox';
import IngredientsHighlighter from './IngredientsHighlighter';
import { Copy, Share2, X } from 'lucide-react';
import { useCallback } from 'react';

interface ResultCardProps {
  result: AnalysisResult;
  onClose?: () => void;
  compact?: boolean;
}

export default function ResultCard({ result, onClose, compact }: ResultCardProps) {
  const handleCopy = useCallback(() => {
    const text = `Sugar Insight Result\nSugar: ${result.sugarGrams}g (${result.sugarLevel.toUpperCase()})\nHidden sugars: ${result.hiddenSugars.length > 0 ? result.hiddenSugars.join(', ') : 'None'}\n${result.insight}`;
    navigator.clipboard.writeText(text).catch(() => {});
  }, [result]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 ${compact ? '' : 'max-w-2xl'}`}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {!compact && (
        <div className="mb-5 flex items-start gap-4">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
            <img src={result.imageDataUrl} alt="Label" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1">
            <SugarBadge level={result.sugarLevel} />
            <div className="mt-3">
              <SugarMeter grams={result.sugarGrams} level={result.sugarLevel} />
            </div>
          </div>
        </div>
      )}

      {compact && (
        <div className="mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <SugarBadge level={result.sugarLevel} />
          </div>
          <SugarMeter grams={result.sugarGrams} level={result.sugarLevel} />
        </div>
      )}

      <InsightBox insight={result.insight} level={result.sugarLevel} />

      <div className="mt-5">
        <IngredientsHighlighter ingredients={result.ingredients} />
      </div>

      {!compact && (
        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy result
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        </div>
      )}
    </motion.div>
  );
}
