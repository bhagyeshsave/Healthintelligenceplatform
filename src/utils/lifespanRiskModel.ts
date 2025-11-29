/**
 * Cox Proportional Hazards-inspired Lifestyle Risk Index
 * Based on epidemiological research and cohort studies (Harvard, Framingham)
 * Each factor has a risk multiplier based on current status
 */

export interface RiskFactor {
  id: string;
  name: string;
  currentStatus: number | string;
  targetGoal: number | string;
  unit: string;
  description: string;
  category: 'smoking' | 'exercise' | 'diet' | 'sleep' | 'stress' | 'alcohol' | 'sitting';
}

export interface RiskMultiplier {
  value: number | string;
  multiplier: number;
  label: string;
}

// Risk multipliers for each factor based on epidemiological data
export const riskMultipliers: Record<string, RiskMultiplier[]> = {
  smoking: [
    { value: 0, multiplier: 1.0, label: 'No' },
    { value: 1, multiplier: 2.0, label: 'Yes' }, // 2x risk vs non-smoking
  ],
  exercise: [
    { value: 0, multiplier: 1.3, label: '0 days/week' },
    { value: 1, multiplier: 1.15, label: '1 day/week' },
    { value: 2, multiplier: 1.05, label: '2 days/week' },
    { value: 3, multiplier: 0.95, label: '3 days/week' },
    { value: 4, multiplier: 0.85, label: '4 days/week' },
    { value: 5, multiplier: 0.75, label: '5+ days/week' },
  ],
  diet: [
    { value: 1, multiplier: 1.25, label: 'Poor' },
    { value: 2, multiplier: 1.0, label: 'Average' },
    { value: 3, multiplier: 0.80, label: 'Great' },
  ],
  sleep: [
    { value: 1, multiplier: 1.3, label: 'Poor (<6 hours)' },
    { value: 2, multiplier: 1.0, label: 'Good (7-9 hours)' },
    { value: 3, multiplier: 1.15, label: 'Too much (>10 hours)' },
  ],
  stress: [
    { value: 1, multiplier: 1.0, label: 'Low' },
    { value: 2, multiplier: 1.15, label: 'Medium' },
    { value: 3, multiplier: 1.35, label: 'High' },
  ],
  alcohol: [
    { value: 0, multiplier: 1.0, label: 'None' },
    { value: 1, multiplier: 0.95, label: '1 drink/week' },
    { value: 3, multiplier: 0.98, label: '3 drinks/week' },
    { value: 7, multiplier: 1.1, label: '7 drinks/week' },
    { value: 14, multiplier: 1.3, label: '14+ drinks/week' },
  ],
  sitting: [
    { value: 2, multiplier: 0.95, label: '2 hours/day' },
    { value: 4, multiplier: 1.0, label: '4 hours/day' },
    { value: 6, multiplier: 1.1, label: '6 hours/day' },
    { value: 8, multiplier: 1.25, label: '8+ hours/day' },
  ],
};

/**
 * Get risk multiplier for a given factor and value
 */
export function getRiskMultiplier(
  category: string,
  value: number | string
): number {
  const multipliers = riskMultipliers[category];
  if (!multipliers) return 1.0;

  // Find exact match
  const exact = multipliers.find((m) => m.value === value);
  if (exact) return exact.multiplier;

  // For numeric values, interpolate
  if (typeof value === 'number') {
    const sorted = [...multipliers].sort((a, b) => {
      const aNum = typeof a.value === 'number' ? a.value : 0;
      const bNum = typeof b.value === 'number' ? b.value : 0;
      return aNum - bNum;
    });

    for (let i = 0; i < sorted.length - 1; i++) {
      const curr = sorted[i];
      const next = sorted[i + 1];
      const currNum = typeof curr.value === 'number' ? curr.value : 0;
      const nextNum = typeof next.value === 'number' ? next.value : 0;

      if (value >= currNum && value <= nextNum) {
        const ratio = (value - currNum) / (nextNum - currNum);
        return curr.multiplier + ratio * (next.multiplier - curr.multiplier);
      }
    }
  }

  return 1.0;
}

/**
 * Calculate years gained/lost based on risk reduction
 * Formula: Years = -(TargetRisk / CurrentRisk - 1) * 10
 * Every 10% reduction in overall mortality risk ≈ 1 year life expectancy
 */
export function calculateYearsImpact(currentRisk: number, targetRisk: number): number {
  if (currentRisk === 0) return 0;
  return -(targetRisk / currentRisk - 1) * 10;
}

/**
 * Calculate total risk index (product of all factor multipliers)
 */
export function calculateTotalRiskIndex(
  factors: Record<string, number | string>
): number {
  let totalRisk = 1.0;
  for (const [category, value] of Object.entries(factors)) {
    totalRisk *= getRiskMultiplier(category, value);
  }
  return totalRisk;
}
