import { motion } from 'framer-motion';
import type { SugarLevel } from '../utils/types';

const LEVEL_COLORS: Record<SugarLevel, string> = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-rose-500',
};

interface SugarMeterProps {
  grams: number;
  level: SugarLevel;
}

export default function SugarMeter({ grams, level }: SugarMeterProps) {
  const max = 50;
  const pct = Math.min((grams / max) * 100, 100);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-end justify-between">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Sugar per serving</span>
        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {grams}g
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <motion.div
          className={`h-full rounded-full ${LEVEL_COLORS[level]}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
      <div className="mt-1 flex justify-between text-xs text-slate-400 dark:text-slate-500">
        <span>0g</span>
        <span>25g</span>
        <span>50g+</span>
      </div>
    </div>
  );
}
