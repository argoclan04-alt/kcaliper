import { WeightEntry } from '../types/weight-tracker';

// Calculate Exponential Moving Average (EMA)
function calculateEMA(values: number[], periods: number = 10): number[] {
  if (!values || values.length === 0) return [];
  
  const alpha = 2 / (periods + 1); // α = 2/(n+1)
  const emaValues: number[] = [];
  
  // First EMA value is the first data point
  emaValues[0] = values[0];
  
  // Calculate subsequent EMA values
  for (let i = 1; i < values.length; i++) {
    // EMA_today = (Weight_today × α) + (EMA_yesterday × (1 - α))
    emaValues[i] = (values[i] * alpha) + (emaValues[i - 1] * (1 - alpha));
  }
  
  return emaValues;
}

// Double Exponential Moving Average implementation using DEMA formula
export function calculateDoubleExponentialMovingAverage(entries: WeightEntry[], currentIndex: number): number {
  if (!entries || entries.length === 0) return 0;
  
  // Safety check for currentIndex
  if (currentIndex < 0 || currentIndex >= entries.length) return 0;
  
  const currentEntry = entries[currentIndex];
  if (!currentEntry) return 0;
  
  // Get entries from current point to the end (chronological order for calculation)
  // Filter out excluded entries
  const relevantEntries = entries.slice(currentIndex).reverse().filter(entry => !entry.excludeFromCalculations);
  
  if (relevantEntries.length < 2) {
    return currentEntry.weight; // Not enough data for DEMA
  }
  
  // Extract weights in chronological order
  const weights = relevantEntries.map(entry => entry.weight);
  
  // Step 1: Calculate EMA of weights
  const emaValues = calculateEMA(weights, 10); // Using 10 periods as default
  
  if (emaValues.length < 2) {
    return weights[weights.length - 1]; // Return last weight if not enough EMA data
  }
  
  // Step 2: Calculate EMA of the EMA values (EMA(EMA))
  const emaOfEma = calculateEMA(emaValues, 10);
  
  if (emaOfEma.length === 0) {
    return weights[weights.length - 1];
  }
  
  // Step 3: Calculate DEMA = (2 × EMA_n) - EMA(EMA_n)
  const lastEMA = emaValues[emaValues.length - 1];
  const lastEMAofEMA = emaOfEma[emaOfEma.length - 1];
  
  const dema = (2 * lastEMA) - lastEMAofEMA;
  
  return Math.round(dema * 10) / 10; // Round to 1 decimal place
}

// Calculate weekly rate using linear regression on DEMA trendline
export function calculateWeeklyRate(entries: WeightEntry[], currentIndex: number): number {
  if (!entries || entries.length < 3 || currentIndex >= entries.length || currentIndex < 0) return 0;

  // Get entries for trend calculation (from current entry to the oldest)
  // Filter out excluded entries
  const relevantEntries = entries.slice(currentIndex).filter(entry => !entry.excludeFromCalculations);
  
  if (relevantEntries.length < 3) return 0;

  // Calculate DEMA values and actual day differences
  const demaValues: number[] = [];
  const dayValues: number[] = [];
  
  // Use the current entry date as reference (day 0)
  const currentDate = new Date(relevantEntries[0].date + 'T12:00:00');
  
  for (let i = 0; i < relevantEntries.length; i++) {
    const entry = relevantEntries[i];
    const entryDate = new Date(entry.date + 'T12:00:00');
    
    // Calculate days difference from current entry (negative because going backwards)
    const daysDiff = Math.round((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const demaValue = calculateDoubleExponentialMovingAverage(entries, currentIndex + i);
    
    if (demaValue > 0) { // Only include valid DEMA values
      demaValues.push(demaValue);
      dayValues.push(daysDiff); // Use actual days as x-value
    }
  }
  
  if (demaValues.length < 3) return 0;

  // Linear regression to find slope (daily rate of change)
  // m = [N(∑xy) - (∑x)(∑y)] / [N(∑x²) - (∑x)²]
  const n = demaValues.length;
  const sumX = dayValues.reduce((sum, x) => sum + x, 0);
  const sumY = demaValues.reduce((sum, y) => sum + y, 0);
  const sumXY = dayValues.reduce((sum, x, i) => sum + (x * demaValues[i]), 0);
  const sumX2 = dayValues.reduce((sum, x) => sum + (x * x), 0);
  
  const denominator = (n * sumX2) - (sumX * sumX);
  
  if (denominator === 0) return 0;
  
  // Calculate slope (daily rate of change)
  // Note: slope will be negative if weight is decreasing over time (going from old to new)
  // Since dayValues go backwards (0, -1, -2...), we need to negate the slope
  const slope = -((n * sumXY) - (sumX * sumY)) / denominator;
  
  // Convert to weekly rate: Weekly Rate = m × 7
  const weeklyRate = slope * 7;
  
  return Math.round(weeklyRate * 100) / 100; // Round to 2 decimal places
}

// Calculate trend direction for visualization
export function calculateTrend(entries: WeightEntry[]): 'up' | 'down' | 'stable' {
  if (entries.length < 2) return 'stable';
  
  const recentEntries = entries.slice(0, Math.min(7, entries.length));
  const weights = recentEntries.map(entry => entry.weight);
  
  const firstHalf = weights.slice(0, Math.ceil(weights.length / 2));
  const secondHalf = weights.slice(Math.floor(weights.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, w) => sum + w, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, w) => sum + w, 0) / secondHalf.length;
  
  const diff = secondAvg - firstAvg;
  
  if (Math.abs(diff) < 0.1) return 'stable';
  return diff > 0 ? 'up' : 'down';
}

// Detect new lowest or highest weights
export function detectWeightExtremes(entries: WeightEntry[], newEntry: WeightEntry): {
  isNewLowest: boolean;
  isNewHighest: boolean;
} {
  if (!entries || entries.length === 0 || !newEntry) {
    return { isNewLowest: true, isNewHighest: true };
  }

  const weights = entries.map(entry => entry.weight);
  const currentLowest = Math.min(...weights);
  const currentHighest = Math.max(...weights);

  return {
    isNewLowest: newEntry.weight < currentLowest,
    isNewHighest: newEntry.weight > currentHighest
  };
}

// Simple moving average function for backward compatibility with old signature
export function calculateMovingAverage(entries: WeightEntry[], windowSizeOrIndex: number): number {
  if (!entries || entries.length === 0) return 0;
  
  // If windowSizeOrIndex is less than entries length, treat as index (new behavior)
  if (windowSizeOrIndex < entries.length) {
    return calculateDoubleExponentialMovingAverage(entries, windowSizeOrIndex);
  }
  
  // Otherwise treat as window size (old behavior)
  const windowSize = Math.min(windowSizeOrIndex, entries.length);
  const recentEntries = entries.slice(-windowSize);
  const sum = recentEntries.reduce((total, entry) => total + entry.weight, 0);
  return sum / recentEntries.length;
}

// Recalculate all weekly rates and moving averages for a set of entries
export function recalculateAllWeeklyRates(entries: WeightEntry[]): WeightEntry[] {
  if (!entries || entries.length === 0) return [];
  
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return sortedEntries.map((entry, index) => {
    // If entry is excluded, don't calculate moving average or weekly rate
    if (entry.excludeFromCalculations) {
      return {
        ...entry,
        movingAverage: 0,
        weeklyRate: 0
      };
    }
    
    return {
      ...entry,
      movingAverage: calculateDoubleExponentialMovingAverage(sortedEntries, index),
      weeklyRate: calculateWeeklyRate(sortedEntries, index)
    };
  });
}

// Find lowest and highest weights in a set of entries
export function findLowestAndHighestWeights(entries: WeightEntry[]): {
  lowest: WeightEntry | null;
  highest: WeightEntry | null;
} {
  if (!entries || entries.length === 0) {
    return { lowest: null, highest: null };
  }

  // Filter out excluded entries
  const includedEntries = entries.filter(entry => !entry.excludeFromCalculations);
  
  if (includedEntries.length === 0) {
    return { lowest: null, highest: null };
  }

  let lowest = includedEntries[0];
  let highest = includedEntries[0];

  for (const entry of includedEntries) {
    if (entry.weight < lowest.weight) {
      lowest = entry;
    }
    if (entry.weight > highest.weight) {
      highest = entry;
    }
  }

  return { lowest, highest };
}

// Check if the weekly rate deviates from target
export function checkRateDeviation(currentRate: number, targetRate: number, tolerance: number = 0.2): boolean {
  return Math.abs(currentRate - targetRate) > tolerance;
}