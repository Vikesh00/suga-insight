import { motion } from 'framer-motion';
import type { AnalysisResult } from '../utils/types';
import ResultCard from './ResultCard';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface CompareViewProps {
  results: [AnalysisResult, AnalysisResult];
  onReset: () => void;
}

function sugarScore(r: AnalysisResult): number {
  let score = r.sugarGrams;
  score += r.hiddenSugars.length * 3;
  return score;
}

export default function CompareView({ results, onReset }: CompareViewProps) {
  const [a, b] = results;
  const scoreA = sugarScore(a);
  const scoreB = sugarScore(b);

  let verdict: 'left' | 'right' | 'tie' = 'tie';
  if (scoreA < scoreB) verdict = 'left';
  if (scoreB < scoreA) verdict = 'right';

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Comparison Results</h2>
        <button
          onClick={onReset}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          New Comparison
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          {verdict === 'left' && (
            <div className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              <TrendingDown className="h-3 w-3" />
              Healthier Choice
            </div>
          )}
          {verdict === 'right' && (
            <div className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              <TrendingUp className="h-3 w-3" />
              Higher Sugar
            </div>
          )}
          {verdict === 'tie' && (
            <div className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-slate-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              <Minus className="h-3 w-3" />
              Similar
            </div>
          )}
          <ResultCard result={a} compact />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          {verdict === 'right' && (
            <div className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              <TrendingDown className="h-3 w-3" />
              Healthier Choice
            </div>
          )}
          {verdict === 'left' && (
            <div className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              <TrendingUp className="h-3 w-3" />
              Higher Sugar
            </div>
          )}
          {verdict === 'tie' && (
            <div className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-slate-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              <Minus className="h-3 w-3" />
              Similar
            </div>
          )}
          <ResultCard result={b} compact />
        </motion.div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Quick Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Sugar (g)</span>
            <div className="flex items-center gap-4">
              <span className={`font-semibold ${a.sugarGrams <= b.sugarGrams ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {a.sugarGrams}g
              </span>
              <span className="text-slate-300 dark:text-slate-600">vs</span>
              <span className={`font-semibold ${b.sugarGrams <= a.sugarGrams ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {b.sugarGrams}g
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Hidden sugars</span>
            <div className="flex items-center gap-4">
              <span className={`font-semibold ${a.hiddenSugars.length <= b.hiddenSugars.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {a.hiddenSugars.length}
              </span>
              <span className="text-slate-300 dark:text-slate-600">vs</span>
              <span className={`font-semibold ${b.hiddenSugars.length <= a.hiddenSugars.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {b.hiddenSugars.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
