import Tesseract from 'tesseract.js';
import type { AnalysisResult, SugarLevel } from './types';

const SUGAR_KEYWORDS = [
  'sugar', 'glucose', 'fructose', 'syrup', 'maltose', 'dextrose',
  'sucrose', 'lactose', 'honey', 'agave', 'molasses', 'caramel',
  'corn syrup', 'high fructose corn syrup', 'brown sugar', 'powdered sugar',
  'invert sugar', 'rice syrup', 'barley malt', 'beet sugar', 'cane sugar',
];

function getSugarLevel(grams: number): SugarLevel {
  if (grams <= 5) return 'low';
  if (grams <= 15) return 'medium';
  return 'high';
}

function generateInsight(grams: number, hiddenCount: number): string {
  const level = getSugarLevel(grams);
  if (level === 'low') {
    if (hiddenCount > 0) return 'Low total sugar, but watch for hidden sweeteners in the ingredients.';
    return 'Great choice! Low sugar with no hidden sweeteners detected.';
  }
  if (level === 'medium') {
    if (hiddenCount > 1) return 'Moderate sugar with multiple hidden sources — consider limiting portion size.';
    return 'Moderate sugar content. Enjoy occasionally as part of a balanced diet.';
  }
  if (hiddenCount > 2) return 'High added sugar with multiple hidden sources. Best consumed rarely.';
  if (hiddenCount > 0) return 'High sugar detected — consider a lower-sugar alternative.';
  return 'This product contains high sugar. Best enjoyed as an occasional treat.';
}

function generateMockIngredients(seed: number): string[] {
  const allIngredients = [
    'Whole Wheat Flour', 'Water', 'Vegetable Oil', 'Salt', 'Yeast',
    'Milk Powder', 'Butter', 'Eggs', 'Baking Soda', 'Cocoa Powder',
    'Palm Oil', 'Soy Lecithin', 'Natural Flavor', 'Vanilla Extract',
    'Rice Flour', 'Oats', 'Corn Starch', 'Citric Acid', 'Ascorbic Acid',
    'Whey Protein', 'Skim Milk', 'Cream', 'Chocolate', 'Caramel Color',
    'Modified Food Starch', 'Xanthan Gum', 'Guar Gum', 'Sodium Benzoate',
    'Potassium Sorbate', 'Niacin', 'Iron', 'Thiamin Mononitrate',
    'Riboflavin', 'Folic Acid', 'Maltodextrin', 'Cellulose Gum',
  ];
  const sugars = ['Sugar', 'Glucose', 'Fructose', 'Corn Syrup', 'Maltose', 'Dextrose', 'Sucrose'];

  const count = 6 + (seed % 8);
  const shuffled = [...allIngredients].sort(() => (seed * 31 + 17) % 5 - 2);
  const selected = shuffled.slice(0, count);

  const sugarCount = Math.min(3, seed % 4);
  const sugarSelection = [...sugars].sort(() => (seed * 13 + 7) % 3 - 1).slice(0, sugarCount);

  const combined = [...sugarSelection, ...selected];
  return combined.slice(0, Math.min(combined.length, 12));
}

function parseSugarFromText(text: string): number | null {
  // Less aggressive cleaning to preserve important characters
  const cleanText = text
    .replace(/O/g, '0') // Replace letter O with number 0
    .replace(/o/g, '0') // Replace letter o with number 0  
    .replace(/l/g, '1') // Replace letter l with number 1
    .replace(/I/g, '1') // Replace letter I with number 1
    .replace(/,/g, '.') // Replace commas with decimal points
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();

  console.log('Cleaned OCR Text:', cleanText);

  // More comprehensive patterns for nutrition labels
  const patterns = [
    // Standard "Sugars 20g" format
    /sugars?\s*(\d+(?:\.\d+)?)\s*g/i,
    // "Sugars: 20g" format  
    /sugars?\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*g/i,
    // "Total Sugars 20g" format
    /total\s+sugars?\s*(\d+(?:\.\d+)?)\s*g/i,
    /total\s+sugars?\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*g/i,
    // "Added Sugars 20g" format
    /added\s+sugars?\s*(\d+(?:\.\d+)?)\s*g/i,
    /added\s+sugars?\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*g/i,
    // "20g Sugars" format
    /(\d+(?:\.\d+)?)\s*g\s+sugars?/i,
    // "20g Total Sugars" format
    /(\d+(?:\.\d+)?)\s*g\s+total\s+sugars?/i,
    // "20g Added Sugars" format
    /(\d+(?:\.\d+)?)\s*g\s+added\s+sugars?/i,
    // Just number followed by g near sugar
    /(\d+(?:\.\d+)?)\s*g.*sugar/i,
    // Sugar with grams spelled out
    /sugars?\s*(\d+(?:\.\d+)?)\s*grams?/i,
    // Handle line breaks and spacing issues
    /sugars?\s*\n\s*(\d+(?:\.\d+)?)\s*g/i,
    /sugars?\s*(\d+(?:\.\d+)?)\s*\n\s*g/i,
    // More flexible patterns for decimals
    /sugars?\s*(\d+\.?\d*)\s*g/i,
    /(\d+\.?\d*)\s*g\s+sugars?/i,
    /sugars?\s*[:\-]?\s*(\d+\.?\d*)\s*g/i,
    // Handle spaces in decimals like "1 . 8g"
    /sugars?\s*(\d+)\s*\.\s*(\d+)\s*g/i,
    /(\d+)\s*\.\s*(\d+)\s*g\s+sugars?/i,
    // Handle "1 8g" (missing decimal)
    /sugars?\s*(\d)\s*(\d)\s*g/i,
    /(\d)\s*(\d)\s*g\s+sugars?/i,
  ];

  // Try each pattern
  for (const pattern of patterns) {
    const match = cleanText.match(pattern);
    if (match) {
      let val: number;
      
      // Handle patterns with multiple capture groups (like spaced decimals)
      if (match[2] !== undefined) {
        // For patterns like /sugars?\s*(\d+)\s*\.\s*(\d+)\s*g/i
        val = parseFloat(`${match[1]}.${match[2]}`);
      } else {
        // For normal patterns
        val = parseFloat(match[1]);
      }
      
      console.log('Pattern matched:', pattern, 'Raw matches:', match, 'Parsed value:', val);
      if (!isNaN(val) && val >= 0 && val < 200) return val;
    }
  }

  // Fallback: look for any number followed by 'g' near the word 'sugar'
  const fallbackPattern = /(\d+(?:\.\d+)?)\s*g.*sugar|sugar.*(\d+(?:\.\d+)?)\s*g/i;
  const fallbackMatch = cleanText.match(fallbackPattern);
  if (fallbackMatch) {
    const val = parseFloat(fallbackMatch[1] || fallbackMatch[2]);
    console.log('Fallback pattern matched:', fallbackPattern, 'Value:', val);
    if (!isNaN(val) && val >= 0 && val < 200) return val;
  }
  
  console.log('No sugar pattern matched in text:', cleanText);
  return null;
}

function parseIngredientsFromText(text: string): string[] {
  const lines = text.split(/\n|\r/).map((l) => l.trim()).filter(Boolean);
  for (let i = 0; i < lines.length; i++) {
    if (/ingredients?/i.test(lines[i])) {
      const raw = lines.slice(i).join(' ').replace(/ingredients?[:\-]?\s*/i, '');
      return raw
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1 && s.length < 60)
        .slice(0, 15);
    }
  }
  return [];
}

// Enhanced image preprocessing for better OCR
function preprocessImage(imageDataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Scale up more for better OCR
      const scale = 4;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      // Draw original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Enhanced preprocessing
      for (let i = 0; i < data.length; i += 4) {
        // Convert to grayscale
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        
        // Apply adaptive thresholding for better text contrast
        const threshold = 120;
        const binary = gray > threshold ? 255 : 0;
        
        // Add slight sharpening
        const sharpened = gray > threshold ? Math.min(255, gray + 80) : Math.max(0, gray - 40);
        
        data[i] = sharpened;
        data[i + 1] = sharpened;
        data[i + 2] = sharpened;
        data[i + 3] = 255; // Full opacity
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Apply additional sharpening filter
      ctx.filter = 'contrast(1.4) brightness(1.1)';
      ctx.drawImage(canvas, 0, 0);
      
      resolve(canvas.toDataURL('image/png', 1.0));
    };
    img.src = imageDataUrl;
  });
}

export async function analyzeImage(imageDataUrl: string): Promise<AnalysisResult> {
  console.log('Starting OCR analysis...');
  
  // Try multiple preprocessing approaches
  const processedImage = await preprocessImage(imageDataUrl);
  
  // First OCR attempt with enhanced preprocessing
  const { data: { text } } = await Tesseract.recognize(processedImage, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        console.log('OCR Progress:', Math.round(m.progress * 100) + '%');
      }
    },
  });

  console.log('OCR completed. Raw text:', text);

  // If first attempt fails, try with original image
  let finalText = text;
  if (!parseSugarFromText(text)) {
    console.log('First OCR attempt failed, trying with original image...');
    const { data: { text: fallbackText } } = await Tesseract.recognize(imageDataUrl, 'eng', {
      logger: () => {},
    });
    console.log('Fallback OCR text:', fallbackText);
    finalText = fallbackText;
  }

  const detectedGrams = parseSugarFromText(finalText);
  const detectedIngredients = parseIngredientsFromText(finalText);

  console.log('Detected grams:', detectedGrams);
  console.log('Detected ingredients:', detectedIngredients);

  // If OCR fails to detect sugar, return a clear error result
  if (detectedGrams === null) {
    const result: AnalysisResult = {
      id: `analysis-${Date.now()}`,
      sugarGrams: 0,
      sugarLevel: 'low',
      ingredients: detectedIngredients.length > 0 ? detectedIngredients : ['Could not detect ingredients'],
      hiddenSugars: [],
      insight: 'Could not detect sugar content from this image. Please ensure the nutrition facts panel is clearly visible and try again.',
      imageDataUrl,
      timestamp: Date.now(),
    };
    return result;
  }

  const hiddenSugars = detectedIngredients.filter((ing) =>
    SUGAR_KEYWORDS.some((kw) => ing.toLowerCase().includes(kw))
  );

  const result: AnalysisResult = {
    id: `analysis-${Date.now()}`,
    sugarGrams: Math.round(detectedGrams * 10) / 10,
    sugarLevel: getSugarLevel(detectedGrams),
    ingredients: detectedIngredients,
    hiddenSugars,
    insight: generateInsight(detectedGrams, hiddenSugars.length),
    imageDataUrl,
    timestamp: Date.now(),
  };

  console.log('Final result:', result);
  return result;
}
