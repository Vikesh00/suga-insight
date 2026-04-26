import { motion } from 'framer-motion';

const SUGAR_KEYWORDS = [
  'sugar', 'glucose', 'fructose', 'syrup', 'maltose', 'dextrose',
  'sucrose', 'lactose', 'honey', 'agave', 'molasses', 'caramel',
  'corn syrup', 'high fructose corn syrup', 'brown sugar', 'powdered sugar',
  'invert sugar', 'rice syrup', 'barley malt', 'beet sugar', 'cane sugar',
];

interface IngredientsHighlighterProps {
  ingredients: string[];
}

export default function IngredientsHighlighter({ ingredients }: IngredientsHighlighterProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ingredients</h3>
      <div className="flex flex-wrap gap-2">
        {ingredients.map((ing, i) => {
          const isSugar = SUGAR_KEYWORDS.some((kw) =>
            ing.toLowerCase().includes(kw)
          );
          return (
            <motion.span
              key={`${ing}-${i}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-medium ${
                isSugar
                  ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-800'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {ing}
            </motion.span>
          );
        })}
      </div>
      {ingredients.some((ing) =>
        SUGAR_KEYWORDS.some((kw) => ing.toLowerCase().includes(kw))
      ) && (
        <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-500" />
          Sugar-related ingredients highlighted
        </p>
      )}
    </div>
  );
}
