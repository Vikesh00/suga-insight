import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Upload, Scale, History, Trash2 } from 'lucide-react';
import type { AnalysisResult } from './utils/types';
import { analyzeImage } from './utils/ocrParser';
import { useLocalStorage } from './hooks/useLocalStorage';
import UploadCard from './components/UploadCard';
import Loader from './components/Loader';
import ResultCard from './components/ResultCard';
import CompareView from './components/CompareView';

type Screen = 'upload' | 'loading' | 'result';
type Mode = 'single' | 'compare';

function App() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });
  const [screen, setScreen] = useState<Screen>('upload');
  const [mode, setMode] = useState<Mode>('single');
  const [images, setImages] = useState<string[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [lastResult, setLastResult] = useLocalStorage<AnalysisResult | null>('sugar-insight:last', null);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  const handleAnalyze = useCallback(async () => {
    setScreen('loading');
    const res = await Promise.all(images.map((img) => analyzeImage(img)));
    setResults(res);
    if (mode === 'single') {
      setLastResult(res[0]);
    }
    setScreen('result');
  }, [images, mode, setLastResult]);

  const handleReset = useCallback(() => {
    setScreen('upload');
    setImages([]);
    setResults([]);
  }, []);

  const handleLastResult = useCallback(() => {
    if (!lastResult) return;
    setResults([lastResult]);
    setScreen('result');
  }, [lastResult]);

  return (
    <div className="min-h-svh bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Upload className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight">Sugar Insight</span>
          </div>

          <div className="flex items-center gap-2">
            {screen === 'upload' && (
              <>
                <button
                  onClick={() => setMode('single')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    mode === 'single'
                      ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:ring-brand-800'
                      : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  Single
                </button>
                <button
                  onClick={() => setMode('compare')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    mode === 'compare'
                      ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:ring-brand-800'
                      : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  <Scale className="h-4 w-4" />
                  Compare
                </button>
              </>
            )}
            <button
              onClick={() => setDark((d) => !d)}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <AnimatePresence mode="wait">
          {screen === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center"
            >
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                  Understand your food labels
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Upload a nutrition label to instantly analyze sugar content and hidden sweeteners.
                </p>
              </div>

              <UploadCard
                images={images}
                onImagesChange={setImages}
                onAnalyze={handleAnalyze}
                mode={mode}
              />

              {lastResult && (
                <button
                  onClick={handleLastResult}
                  className="mt-8 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <History className="h-4 w-4" />
                  View last result
                </button>
              )}
            </motion.div>
          )}

          {screen === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <Loader />
            </motion.div>
          )}

          {screen === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center"
            >
              {mode === 'compare' && results.length === 2 && (
                <CompareView results={[results[0], results[1]]} onReset={handleReset} />
              )}

              {mode === 'single' && results.length === 1 && (
                <div className="w-full max-w-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Analysis Result</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Clear
                      </button>
                      <button
                        onClick={handleReset}
                        className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-700"
                      >
                        Analyze another
                      </button>
                    </div>
                  </div>
                  <ResultCard result={results[0]} onClose={handleReset} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-400 dark:text-slate-500">
          Sugar Insight is a demo app for educational purposes. Sugar estimates are simulated based on image content.
        </div>
      </footer>
    </div>
  );
}

export default App;

