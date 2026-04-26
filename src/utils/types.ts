export type SugarLevel = 'low' | 'medium' | 'high';

export interface AnalysisResult {
  id: string;
  sugarGrams: number;
  sugarLevel: SugarLevel;
  ingredients: string[];
  hiddenSugars: string[];
  insight: string;
  imageDataUrl: string;
  timestamp: number;
}

export interface ParsedLabel {
  sugarGrams: number;
  ingredients: string[];
}
