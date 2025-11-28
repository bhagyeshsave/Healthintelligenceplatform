import { useState } from 'react';
import { X, Sparkles, TrendingDown, TrendingUp, Activity, Utensils, Brain, Moon, Cigarette, Wine, Footprints, HeartPulse, Info, Zap, Target, BarChart3 } from 'lucide-react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface LifestyleFactor {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  // Impact is calculated based on slider position (0-100)
  // We define key positions but interpolate between them
  impactCurve: {
    low: { position: 0; impact: number; label: string; description: string };
    current: { position: 33; impact: number; label: string; description: string };
    optimal: { position: 66; impact: number; label: string; description: string };
    advanced: { position: 100; impact: number; label: string; description: string };
  };
  currentPosition: number; // Where user actually is (can be anywhere 0-100)
}

const lifestyleFactors: LifestyleFactor[] = [
  {
    id: 'exercise',
    label: 'Exercise Frequency',
    description: 'Cardio + strength training',
    icon: Activity,
    currentPosition: 25, // User's actual baseline
    impactCurve: {
      low: { position: 0, impact: 2.8, label: '<1x/week', description: '0-30 min/week - Sedentary lifestyle' },
      current: { position: 33, impact: 0, label: '2x/week', description: '60-90 min/week - Light exercise' },
      optimal: { position: 66, impact: -2.6, label: '5x/week', description: '150+ min/week - WHO guidelines met' },
      advanced: { position: 100, impact: -3.2, label: 'Daily', description: '300+ min/week - Athlete level training' }
    }
  },
  {
    id: 'diet',
    label: 'Diet Quality',
    description: 'Nutrition & eating patterns',
    icon: Utensils,
    currentPosition: 40, // User's actual baseline
    impactCurve: {
      low: { position: 0, impact: 2.0, label: 'Processed', description: '80%+ ultra-processed foods, fast food daily' },
      current: { position: 33, impact: 0, label: 'Mixed', description: '50/50 healthy & processed, occasional junk' },
      optimal: { position: 66, impact: -2.2, label: 'Whole Foods', description: '80%+ whole foods, Mediterranean-style' },
      advanced: { position: 100, impact: -2.8, label: 'Optimized', description: 'Personalized macro tracking, nutrient-dense' }
    }
  },
  {
    id: 'sleep',
    label: 'Sleep Quality',
    description: 'Duration & consistency',
    icon: Moon,
    currentPosition: 30, // User's actual baseline
    impactCurve: {
      low: { position: 0, impact: 2.2, label: '<5 hours', description: '4-5 hours/night - Chronic deprivation' },
      current: { position: 33, impact: 0, label: '6 hours', description: '5.5-6.5 hours - Inconsistent schedule' },
      optimal: { position: 66, impact: -1.8, label: '7-8 hours', description: '7-8 hours - Consistent 10pm-6am routine' },
      advanced: { position: 100, impact: -2.4, label: '8+ hours', description: '8+ hours - Sleep tracker optimized cycles' }
    }
  },
  {
    id: 'stress',
    label: 'Stress Management',
    description: 'Meditation & mindfulness',
    icon: Brain,
    currentPosition: 35, // User's actual baseline
    impactCurve: {
      low: { position: 0, impact: 2.5, label: 'No coping', description: 'Chronic stress, no management strategies' },
      current: { position: 33, impact: 0, label: 'Occasional', description: '1-2x/week breathing or walks' },
      optimal: { position: 66, impact: -1.2, label: 'Daily 15 min', description: 'Daily 15-20 min meditation or mindfulness' },
      advanced: { position: 100, impact: -1.8, label: 'Multi-modal', description: 'Daily meditation + therapy + yoga/breathwork' }
    }
  },
  {
    id: 'smoking',
    label: 'Smoking Status',
    description: 'Tobacco use',
    icon: Cigarette,
    currentPosition: 70, // User has quit
    impactCurve: {
      low: { position: 0, impact: 6.5, label: '1+ pack/day', description: '20+ cigarettes per day' },
      current: { position: 33, impact: 3.5, label: '5-10/day', description: 'Half pack - Social/stress smoking' },
      optimal: { position: 66, impact: 0, label: 'Quit 1+ year', description: 'Successfully quit smoking 1+ years ago' },
      advanced: { position: 100, impact: -0.5, label: 'Never smoked', description: 'Never smoked - Pristine lung health' }
    }
  },
  {
    id: 'alcohol',
    label: 'Alcohol Consumption',
    description: 'Weekly drinks',
    icon: Wine,
    currentPosition: 40, // User's actual baseline
    impactCurve: {
      low: { position: 0, impact: 2.5, label: '14+ drinks', description: '14+ drinks/week - Heavy consumption' },
      current: { position: 33, impact: 0, label: '7 drinks', description: '5-8 drinks/week - Moderate drinking' },
      optimal: { position: 66, impact: -1.5, label: '1-2 drinks', description: '1-2 drinks/week - Minimal consumption' },
      advanced: { position: 100, impact: -1.8, label: 'None', description: '0 drinks - No alcohol consumption' }
    }
  },
  {
    id: 'activity',
    label: 'Daily Movement',
    description: 'Steps & general activity',
    icon: Footprints,
    currentPosition: 45, // User's actual baseline
    impactCurve: {
      low: { position: 0, impact: 2.2, label: '<2K steps', description: '<2000 steps/day - Sedentary desk job' },
      current: { position: 33, impact: 0, label: '5K steps', description: '4000-6000 steps/day - Light activity' },
      optimal: { position: 66, impact: -1.8, label: '10K steps', description: '10,000 steps/day - Active lifestyle' },
      advanced: { position: 100, impact: -2.2, label: '15K+ steps', description: '15,000+ steps/day - Very active' }
    }
  },
  {
    id: 'heart_health',
    label: 'Cardiovascular Health',
    description: 'Heart rate variability & BP',
    icon: HeartPulse,
    currentPosition: 50, // User's actual baseline
    impactCurve: {
      low: { position: 0, impact: 2.8, label: 'Poor', description: 'BP 140/90+, HRV <30ms, elevated resting HR' },
      current: { position: 33, impact: 0, label: 'Fair', description: 'BP 120-130/80, HRV 30-50ms, normal HR' },
      optimal: { position: 66, impact: -1.5, label: 'Good', description: 'BP <120/80, HRV 50-70ms, good recovery' },
      advanced: { position: 100, impact: -2.0, label: 'Excellent', description: 'BP <110/70, HRV 70+ms, athlete metrics' }
    }
  }
];

// Interpolate impact based on slider position
const calculateImpact = (position: number, impactCurve: LifestyleFactor['impactCurve']): number => {
  const points = [
    { pos: impactCurve.low.position, impact: impactCurve.low.impact },
    { pos: impactCurve.current.position, impact: impactCurve.current.impact },
    { pos: impactCurve.optimal.position, impact: impactCurve.optimal.impact },
    { pos: impactCurve.advanced.position, impact: impactCurve.advanced.impact }
  ];

  // Find the two points to interpolate between
  for (let i = 0; i < points.length - 1; i++) {
    if (position >= points[i].pos && position <= points[i + 1].pos) {
      const t = (position - points[i].pos) / (points[i + 1].pos - points[i].pos);
      return points[i].impact + t * (points[i + 1].impact - points[i].impact);
    }
  }

  // Edge cases
  if (position <= points[0].pos) return points[0].impact;
  if (position >= points[points.length - 1].pos) return points[points.length - 1].impact;
  return 0;
};

// Get level label based on position
const getLevelLabel = (position: number, impactCurve: LifestyleFactor['impactCurve']): string => {
  if (position <= 16) return impactCurve.low.label;
  if (position <= 49) return `${impactCurve.low.label} - ${impactCurve.current.label}`;
  if (position <= 82) return `${impactCurve.current.label} - ${impactCurve.optimal.label}`;
  return `${impactCurve.optimal.label} - ${impactCurve.advanced.label}`;
};

const getLevelDescription = (position: number, impactCurve: LifestyleFactor['impactCurve']): string => {
  if (position <= 16) return impactCurve.low.description;
  if (position <= 49) return impactCurve.current.description;
  if (position <= 82) return impactCurve.optimal.description;
  return impactCurve.advanced.description;
};

interface WhatIfLifestyleSimulationV2Props {
  currentAge?: number;
  currentBiologicalAge?: number;
}

export function WhatIfLifestyleSimulationV2({ 
  currentAge = 36, 
  currentBiologicalAge = 37.5 
}: WhatIfLifestyleSimulationV2Props) {
  // Initialize with current positions
  const [factorPositions, setFactorPositions] = useState<Record<string, number>>(
    lifestyleFactors.reduce((acc, factor) => ({ ...acc, [factor.id]: factor.currentPosition }), {})
  );

  const handleSliderChange = (factorId: string, value: number[]) => {
    setFactorPositions(prev => ({ ...prev, [factorId]: value[0] }));
  };

  // Preset functions
  const applyPreset = (preset: 'low' | 'current' | 'optimal' | 'advanced') => {
    const positions: Record<string, number> = {};
    lifestyleFactors.forEach(factor => {
      positions[factor.id] = factor.impactCurve[preset].position;
    });
    setFactorPositions(positions);
  };

  const resetToCurrent = () => {
    const positions: Record<string, number> = {};
    lifestyleFactors.forEach(factor => {
      positions[factor.id] = factor.currentPosition;
    });
    setFactorPositions(positions);
  };

  // Calculate current baseline impact (from actual current positions)
  const currentBaselineImpact = lifestyleFactors.reduce((sum, factor) => {
    return sum + calculateImpact(factor.currentPosition, factor.impactCurve);
  }, 0);

  // Calculate projected age based on selected positions
  const projectedImpact = lifestyleFactors.reduce((sum, factor) => {
    return sum + calculateImpact(factorPositions[factor.id], factor.impactCurve);
  }, 0);

  const projectedAge = currentAge + projectedImpact;
  const ageChange = projectedImpact - currentBaselineImpact;
  const gapFromChronological = projectedAge - currentAge;

  // Get factors that changed
  const changedFactors = lifestyleFactors.filter(
    factor => Math.abs(factorPositions[factor.id] - factor.currentPosition) > 2
  );

  const improvedFactors = changedFactors.filter(
    factor => factorPositions[factor.id] > factor.currentPosition
  );

  const worsenedFactors = changedFactors.filter(
    factor => factorPositions[factor.id] < factor.currentPosition
  );

  // AI Summary generation
  const generateAISummary = (): string => {
    if (changedFactors.length === 0) {
      return "You're viewing your current lifestyle baseline. Try adjusting the sliders or use the preset buttons to explore how different lifestyle choices could impact your biological age.";
    }

    const improvementCount = improvedFactors.length;
    const worseningCount = worsenedFactors.length;

    if (improvementCount > 0 && worseningCount === 0) {
      if (ageChange < -5) {
        return `🎯 Excellent transformation! You've optimized ${improvementCount} lifestyle factors, potentially reducing your biological age by ${Math.abs(ageChange).toFixed(1)} years. This represents significant longevity gains through sustainable lifestyle changes. Focus areas: ${improvedFactors.slice(0, 2).map(f => f.label.toLowerCase()).join(', ')}.`;
      } else if (ageChange < -2) {
        return `✨ Great progress! By improving ${improvementCount} lifestyle factors, you could reduce your biological age by ${Math.abs(ageChange).toFixed(1)} years. These changes are achievable and can create meaningful health improvements. Key wins: ${improvedFactors.slice(0, 2).map(f => f.label.toLowerCase()).join(', ')}.`;
      } else {
        return `💪 Positive changes! Your ${improvementCount} lifestyle improvements could reduce biological aging by ${Math.abs(ageChange).toFixed(1)} years. Small consistent changes compound over time.`;
      }
    }

    if (worseningCount > 0 && improvementCount === 0) {
      if (ageChange > 5) {
        return `⚠️ Warning: These lifestyle changes could accelerate biological aging by ${ageChange.toFixed(1)} years. Primary concerns: ${worsenedFactors.slice(0, 2).map(f => f.label.toLowerCase()).join(', ')}. Consider the long-term health implications.`;
      } else {
        return `📉 Caution: ${worseningCount} lifestyle factors show decline, adding ${ageChange.toFixed(1)} years to biological age. Areas needing attention: ${worsenedFactors.slice(0, 2).map(f => f.label.toLowerCase()).join(', ')}.`;
      }
    }

    // Mixed changes
    return `🔄 Mixed impact: You've improved ${improvementCount} factors but ${worseningCount} areas show decline. Net effect: ${ageChange > 0 ? '+' : ''}${ageChange.toFixed(1)} years biological age. Consider focusing on high-impact improvements first.`;
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-8">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        {/* Header with Preset Buttons */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">Lifestyle Simulation Engine</h2>
                <p className="text-slate-400 text-sm">Adjust factors to see impact on biological age</p>
              </div>
            </div>
          </div>

          {/* Preset Scenarios */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Button
              onClick={() => applyPreset('low')}
              variant="outline"
              className="bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-300 h-auto py-3 flex flex-col items-center gap-1"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-medium">Worst Habits</span>
              <span className="text-[10px] text-red-400/70">&lt;5h sleep, no exercise</span>
            </Button>

            <Button
              onClick={resetToCurrent}
              variant="outline"
              className="bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 text-blue-300 h-auto py-3 flex flex-col items-center gap-1"
            >
              <Target className="w-5 h-5" />
              <span className="text-xs font-medium">My Baseline</span>
              <span className="text-[10px] text-blue-400/70">Your actual habits</span>
            </Button>

            <Button
              onClick={() => applyPreset('optimal')}
              variant="outline"
              className="bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 h-auto py-3 flex flex-col items-center gap-1"
            >
              <TrendingDown className="w-5 h-5" />
              <span className="text-xs font-medium">Healthy Target</span>
              <span className="text-[10px] text-emerald-400/70">7-8h sleep, 150min exercise</span>
            </Button>

            <Button
              onClick={() => applyPreset('advanced')}
              variant="outline"
              className="bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 h-auto py-3 flex flex-col items-center gap-1"
            >
              <Zap className="w-5 h-5" />
              <span className="text-xs font-medium">Peak Performance</span>
              <span className="text-[10px] text-cyan-400/70">8h+ sleep, daily training</span>
            </Button>
          </div>

          {/* AI Summary */}
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium mb-1 flex items-center gap-2">
                  AI Lifestyle Analysis
                  <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px]">
                    Real-time
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {generateAISummary()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Lifestyle Factors */}
          <div className="lg:col-span-2 space-y-4">
            {lifestyleFactors.map((factor) => {
              const Icon = factor.icon;
              const currentPos = factor.currentPosition;
              const selectedPos = factorPositions[factor.id];
              const currentImpact = calculateImpact(currentPos, factor.impactCurve);
              const selectedImpact = calculateImpact(selectedPos, factor.impactCurve);
              const impactDelta = selectedImpact - currentImpact;
              const isChanged = Math.abs(selectedPos - currentPos) > 2;
              const isImproved = selectedPos > currentPos;
              const isWorsened = selectedPos < currentPos;

              const levelLabel = getLevelLabel(selectedPos, factor.impactCurve);
              const levelDescription = getLevelDescription(selectedPos, factor.impactCurve);

              return (
                <div
                  key={factor.id}
                  className={`bg-slate-800/50 border rounded-2xl p-4 transition-all duration-200 ${
                    isChanged
                      ? isImproved
                        ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                        : 'border-red-500/50 shadow-lg shadow-red-500/10'
                      : 'border-slate-700/50'
                  }`}
                >
                  {/* Factor Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isChanged
                          ? isImproved
                            ? 'bg-emerald-500/20 border border-emerald-500/30'
                            : 'bg-red-500/20 border border-red-500/30'
                          : 'bg-slate-700/50 border border-slate-600/30'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          isChanged
                            ? isImproved
                              ? 'text-emerald-400'
                              : 'text-red-400'
                            : 'text-slate-400'
                        }`} />
                      </div>
                      <div>
                        <div className="text-white font-medium">{factor.label}</div>
                        <div className="text-xs text-slate-400">{factor.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        isChanged
                          ? isImproved
                            ? 'text-emerald-400'
                            : 'text-red-400'
                          : 'text-slate-300'
                      }`}>
                        {selectedImpact > 0 ? '+' : ''}{selectedImpact.toFixed(1)}y
                      </div>
                      {isChanged && (
                        <div className={`text-xs ${
                          isImproved ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {impactDelta > 0 ? '+' : ''}{impactDelta.toFixed(1)}y
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Slider with position value */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500">Position: {selectedPos}</span>
                      {isChanged && (
                        <span className="text-xs text-slate-400">
                          From: {currentPos}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Slider
                        value={[selectedPos]}
                        onValueChange={(value) => handleSliderChange(factor.id, value)}
                        min={0}
                        max={100}
                        step={1}
                        className="mb-2"
                      />
                      {/* Current baseline marker */}
                      {Math.abs(selectedPos - currentPos) > 2 && (
                        <div 
                          className="absolute top-0 w-0.5 h-6 bg-blue-400/50 rounded-full pointer-events-none"
                          style={{ left: `${currentPos}%`, transform: 'translateX(-50%)' }}
                        >
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full ring-2 ring-slate-900" />
                        </div>
                      )}
                    </div>
                    
                    {/* Level Markers */}
                    <div className="flex justify-between text-[10px] text-slate-500 px-0.5 mt-1">
                      <div className={`text-center ${selectedPos <= 16 ? 'text-red-400 font-medium' : ''}`}>
                        <div className="mb-0.5">{factor.impactCurve.low.label}</div>
                        <div className="text-[9px] opacity-70">(0)</div>
                      </div>
                      <div className={`text-center ${selectedPos > 16 && selectedPos <= 49 ? 'text-blue-400 font-medium' : ''}`}>
                        <div className="mb-0.5">{factor.impactCurve.current.label}</div>
                        <div className="text-[9px] opacity-70">(33)</div>
                      </div>
                      <div className={`text-center ${selectedPos > 49 && selectedPos <= 82 ? 'text-emerald-400 font-medium' : ''}`}>
                        <div className="mb-0.5">{factor.impactCurve.optimal.label}</div>
                        <div className="text-[9px] opacity-70">(66)</div>
                      </div>
                      <div className={`text-center ${selectedPos > 82 ? 'text-cyan-400 font-medium' : ''}`}>
                        <div className="mb-0.5">{factor.impactCurve.advanced.label}</div>
                        <div className="text-[9px] opacity-70">(100)</div>
                      </div>
                    </div>
                  </div>

                  {/* Level Description */}
                  <div className={`rounded-xl p-3 ${
                    isChanged
                      ? isImproved
                        ? 'bg-emerald-500/10 border border-emerald-500/20'
                        : 'bg-red-500/10 border border-red-500/20'
                      : 'bg-slate-900/50 border border-slate-700/30'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${
                        isChanged
                          ? isImproved
                            ? 'text-emerald-400'
                            : 'text-red-400'
                          : 'text-slate-400'
                      }`}>
                        {levelLabel}
                      </span>
                      {selectedImpact !== 0 && (
                        <div className="flex items-center gap-1">
                          {selectedImpact < 0 ? (
                            <TrendingDown className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <TrendingUp className="w-3 h-3 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {levelDescription}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Projected Impact */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Projected Age Card */}
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-5 shadow-xl">
                <div className="text-center mb-4">
                  <div className="text-slate-400 text-sm mb-2">Projected Biological Age</div>
                  <div className="relative inline-block">
                    <div className={`text-5xl font-bold mb-1 ${
                      ageChange < 0 ? 'text-emerald-400' : ageChange > 0 ? 'text-red-400' : 'text-white'
                    }`}>
                      {projectedAge.toFixed(1)}
                    </div>
                    {Math.abs(ageChange) > 0.1 && (
                      <div className={`text-sm font-medium ${
                        ageChange < 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {ageChange > 0 ? '+' : ''}{ageChange.toFixed(1)} years change
                      </div>
                    )}
                  </div>
                  <div className="text-slate-500 text-xs mt-2">vs chronological age {currentAge}</div>
                </div>

                {/* Stats */}
                <div className="space-y-3 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Current Baseline</span>
                    <span className="text-white font-medium">{currentBiologicalAge}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Chronological</span>
                    <span className="text-slate-300 font-medium">{currentAge}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                    <span className="text-slate-400 text-sm">Age Gap</span>
                    <span className={`font-semibold ${
                      gapFromChronological > 0 ? 'text-red-400' : gapFromChronological < 0 ? 'text-emerald-400' : 'text-slate-300'
                    }`}>
                      {gapFromChronological > 0 ? '+' : ''}{gapFromChronological.toFixed(1)} years
                    </span>
                  </div>
                </div>

                {/* Scientific Note */}
                <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-3 mt-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      <strong className="text-slate-300">Note:</strong> Estimates use an additive model based on peer-reviewed research. 
                      Real-world effects may vary due to factor interactions and individual biology. 
                      Typical biological age range: ±15 years from chronological age.
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {changedFactors.length > 0 && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
                  <div className="text-white text-sm font-medium mb-3">Changes Summary</div>
                  
                  {improvedFactors.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-emerald-400 font-medium">
                          Improvements ({improvedFactors.length})
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {improvedFactors.map(factor => {
                          const impact = calculateImpact(factorPositions[factor.id], factor.impactCurve);
                          const baseImpact = calculateImpact(factor.currentPosition, factor.impactCurve);
                          const delta = impact - baseImpact;
                          return (
                            <div key={factor.id} className="flex items-center justify-between text-xs">
                              <span className="text-slate-300">{factor.label}</span>
                              <span className="text-emerald-400 font-medium">{delta.toFixed(1)}y</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {worsenedFactors.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-red-400 font-medium">
                          Concerns ({worsenedFactors.length})
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {worsenedFactors.map(factor => {
                          const impact = calculateImpact(factorPositions[factor.id], factor.impactCurve);
                          const baseImpact = calculateImpact(factor.currentPosition, factor.impactCurve);
                          const delta = impact - baseImpact;
                          return (
                            <div key={factor.id} className="flex items-center justify-between text-xs">
                              <span className="text-slate-300">{factor.label}</span>
                              <span className="text-red-400 font-medium">+{delta.toFixed(1)}y</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Info */}
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-3">
                <p className="text-xs text-blue-300 leading-relaxed">
                  <strong className="font-medium">Note:</strong> Sliders support continuous values (0-100). Impact is interpolated between key milestones for precision modeling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
