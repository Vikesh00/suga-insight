import { Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { SugarLevel } from '../utils/types';

interface InsightBoxProps {
  insight: string;
  level: SugarLevel;
}

const ICONS: Record<SugarLevel, React.ReactNode> = {
  low: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
  medium: <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
  high: <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
};

const BG: Record<SugarLevel, string> = {
  low: 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900',
  medium: 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900',
  high: 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900',
};

export default function InsightBox({ insight, level }: InsightBoxProps) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 ${BG[level]}`}>
      <div className="mt-0.5 shrink-0">{ICONS[level]}</div>
      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{insight}</p>
    </div>
  );
}
