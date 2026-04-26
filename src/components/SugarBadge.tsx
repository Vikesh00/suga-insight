import type { SugarLevel } from '../utils/types';

const LEVEL_CONFIG: Record<
  SugarLevel,
  { label: string; bg: string; text: string; border: string }
> = {
  low: {
    label: 'Low Sugar',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  medium: {
    label: 'Medium Sugar',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
  high: {
    label: 'High Sugar',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800',
  },
};

interface SugarBadgeProps {
  level: SugarLevel;
}

export default function SugarBadge({ level }: SugarBadgeProps) {
  const config = LEVEL_CONFIG[level];
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold shadow-sm ${config.bg} ${config.text} ${config.border}`}
    >
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${
          level === 'low'
            ? 'bg-emerald-500'
            : level === 'medium'
            ? 'bg-amber-500'
            : 'bg-rose-500'
        }`}
      />
      {config.label}
    </div>
  );
}
