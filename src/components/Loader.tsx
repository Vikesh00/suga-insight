import { motion } from 'framer-motion';
import { ScanLine } from 'lucide-react';

export default function Loader() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 py-12">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-600/20 dark:text-brand-400"
      >
        <ScanLine className="h-8 w-8" />
      </motion.div>

      <div className="w-full space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-300">Analyzing label...</span>
          <span className="text-slate-400 dark:text-slate-500">Please wait</span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <motion.div
            className="h-full rounded-full bg-brand-500"
            initial={{ width: '0%' }}
            animate={{ width: ['0%', '60%', '80%', '100%'] }}
            transition={{ duration: 2.5, ease: 'easeInOut', times: [0, 0.4, 0.7, 1] }}
          />
        </div>
      </div>

      <div className="w-full space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse-skeleton flex items-center gap-3 rounded-xl bg-slate-100 p-4 dark:bg-slate-800"
          >
            <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-2 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
