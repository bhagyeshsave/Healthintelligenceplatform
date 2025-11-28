import { useState } from 'react';
import { X, Sparkles, TrendingDown, TrendingUp, Activity, Utensils, Brain, Moon, Cigarette, Wine, Footprints, HeartPulse, Info } from 'lucide-react';
import { Slider } from './ui/slider';

interface LifestyleFactor {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  levels: {
    low: { label: string; value: number; impact: number; description: string };
    current: { label: string; value: number; impact: number; description: string };
    optimal: { label: string; value: number; impact: number; description: string };
    advanced: { label: string; value: number; impact: number; description: string };
  };
  isNegative?: boolean; // For factors like poor sleep, smoking where higher is worse
}

const lifestyleFactors: LifestyleFactor[] = [
  {
    id: 'exercise',
    label: 'Exercise Frequency',
    description: 'Cardio + strength training',
    icon: Activity,
    levels: {
      low: { label: 'Sedentary', value: 0, impact: 3.5, description: '<1x per week, mostly inactive' },
      current: { label: '2x/week', value: 1, impact: 0, description: '2x per week light exercise' },
      optimal: { label: '5x/week', value: 2, impact: -2.6, description: '45min cardio + strength training' },
      advanced: { label: 'Athlete', value: 3, impact: -3.2, description: 'Daily training, competitive level' }
    }
  },
  {
    id: 'diet',
    label: 'Diet Quality',
    description: 'Nutrition & eating patterns',
    icon: Utensils,
    levels: {
      low: { label: 'Processed', value: 0, impact: 2.5, description: 'High processed foods, fast food' },
      current: { label: 'Mixed', value: 1, impact: 0, description: 'Some healthy, some processed' },
      optimal: { label: 'Mediterranean', value: 2, impact: -2.2, description: 'Plant-based, omega-3 rich' },
      advanced: { label: 'Optimized', value: 3, impact: -2.8, description: 'Personalized nutrition plan' }
    }
  },
  {
    id: 'sleep',
    label: 'Sleep Quality',
    description: 'Duration & consistency',
    icon: Moon,
    levels: {
      low: { label: '<6 hours', value: 0, impact: 2.8, description: 'Chronic sleep deprivation' },
      current: { label: '6-7 hours', value: 1, impact: 0, description: 'Inconsistent schedule' },
      optimal: { label: '8h consistent', value: 2, impact: -1.8, description: '10pm-6am schedule' },
      advanced: { label: 'Optimized', value: 3, impact: -2.4, description: 'Tracked, optimized sleep cycles' }
    }
  },
  {
    id: 'stress',
    label: 'Stress Management',
    description: 'Meditation & mindfulness',
    icon: Brain,
    levels: {
      low: { label: 'Unmanaged', value: 0, impact: 3.2, description: 'Chronic stress, no coping' },
      current: { label: 'Occasional', value: 1, impact: 0, description: 'Irregular stress relief' },
      optimal: { label: 'Daily Meditation', value: 2, impact: -1.2, description: '20min mindfulness practice' },
      advanced: { label: 'Advanced', value: 3, impact: -1.8, description: 'Meditation + therapy + yoga' }
    }
  },
  {
    id: 'smoking',
    label: 'Smoking Status',
    description: 'Tobacco use',
    icon: Cigarette,
    isNegative: true,
    levels: {
      low: { label: 'Heavy smoker', value: 0, impact: 8.5, description: '1+ pack per day' },
      current: { label: 'Smoker', value: 1, impact: 5.5, description: '5-10 cigarettes/day' },
      optimal: { label: 'Quit', value: 2, impact: 0, description: 'Successfully quit smoking' },
      advanced: { label: 'Never smoked', value: 3, impact: -0.5, description: 'Never smoker with healthy lungs' }
    }
  },
  {
    id: 'alcohol',
    label: 'Alcohol Consumption',
    description: 'Weekly drinks',
    icon: Wine,
    levels: {
      low: { label: 'Heavy (10+)', value: 0, impact: 3.2, description: '10+ drinks per week' },
      current: { label: 'Moderate (4-6)', value: 1, impact: 0, description: '4-6 drinks per week' },
      optimal: { label: 'Limited (≤2)', value: 2, impact: -1.5, description: '≤2 drinks per week' },
      advanced: { label: 'None', value: 3, impact: -1.8, description: 'No alcohol consumption' }
    }
  },
  {
    id: 'activity',
    label: 'Daily Movement',
    description: 'Steps & general activity',
    icon: Footprints,
    levels: {
      low: { label: '<3K steps', value: 0, impact: 2.8, description: 'Sedentary lifestyle' },
      current: { label: '5K steps', value: 1, impact: 0, description: 'Light daily movement' },
      optimal: { label: '10K steps', value: 2, impact: -1.8, description: 'Active throughout day' },
      advanced: { label: '15K+ steps', value: 3, impact: -2.2, description: 'Very active lifestyle' }
    }
  },
  {
    id: 'heart_health',
    label: 'Cardiovascular Health',
    description: 'Heart rate variability & BP',
    icon: HeartPulse,
    levels: {
      low: { label: 'Poor', value: 0, impact: 3.5, description: 'High BP, low HRV' },
      current: { label: 'Fair', value: 1, impact: 0, description: 'Normal BP, average HRV' },
      optimal: { label: 'Good', value: 2, impact: -1.5, description: 'Optimal BP, good HRV' },
      advanced: { label: 'Excellent', value: 3, impact: -2.0, description: 'Athletic heart health' }
    }
  }
];

interface WhatIfLifestyleSimulationProps {
  onClose: () => void;
  currentAge: number; // Chronological age
  currentBiologicalAge: number; // Current biological age
}

export function WhatIfLifestyleSimulation({ 
  onClose, 
  currentAge = 36, 
  currentBiologicalAge = 37.5 
}: WhatIfLifestyleSimulationProps) {
  // Initialize all factors at their current level (value: 1)
  const [factorLevels, setFactorLevels] = useState<Record<string, number>>(
    lifestyleFactors.reduce((acc, factor) => ({ ...acc, [factor.id]: 1 }), {})
  );

  const handleSliderChange = (factorId: string, value: number[]) => {
    setFactorLevels(prev => ({ ...prev, [factorId]: value[0] }));
  };

  // Calculate projected biological age based on selected levels
  const calculateProjectedAge = () => {
    let totalImpact = 0;
    
    lifestyleFactors.forEach(factor => {
      const selectedLevel = factorLevels[factor.id];
      const levelKey = ['low', 'current', 'optimal', 'advanced'][selectedLevel] as keyof typeof factor.levels;
      const impact = factor.levels[levelKey].impact;
      totalImpact += impact;
    });

    return currentBiologicalAge + totalImpact;
  };

  const projectedAge = calculateProjectedAge();
  const ageChange = projectedAge - currentBiologicalAge;
  const gapFromChronological = projectedAge - currentAge;

  // Get selected factors that are being optimized
  const optimizedFactors = lifestyleFactors.filter(
    factor => factorLevels[factor.id] > 1 // Above current level
  );

  const worsenedFactors = lifestyleFactors.filter(
    factor => factorLevels[factor.id] < 1 // Below current level
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-slate-700/50 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">What-If Lifestyle Simulation</h2>
              <p className="text-slate-400 text-sm">Select lifestyle changes to see their impact on your biological age</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Lifestyle Factors */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 flex items-start gap-2">
                <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-300 leading-relaxed">
                  Use sliders to adjust each lifestyle factor. Move right to optimize, left to see negative impacts.
                </p>
              </div>

              {lifestyleFactors.map((factor) => {
                const Icon = factor.icon;
                const selectedLevel = factorLevels[factor.id];
                const levelKey = ['low', 'current', 'optimal', 'advanced'][selectedLevel] as keyof typeof factor.levels;
                const levelData = factor.levels[levelKey];
                const isChanged = selectedLevel !== 1; // 1 is current
                const isImproved = selectedLevel > 1;
                const isWorsened = selectedLevel < 1;

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
                          {levelData.impact > 0 ? '+' : ''}{levelData.impact.toFixed(1)}y
                        </div>
                        {isChanged && (
                          <div className={`text-xs ${
                            isImproved ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {isImproved ? 'Improved' : 'Worsened'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Slider */}
                    <div className="mb-3">
                      <Slider
                        value={[selectedLevel]}
                        onValueChange={(value) => handleSliderChange(factor.id, value)}
                        min={0}
                        max={3}
                        step={1}
                        className="mb-2"
                      />
                      
                      {/* Level Labels */}
                      <div className="flex justify-between text-[10px] text-slate-500 px-0.5">
                        <span className={selectedLevel === 0 ? 'text-red-400 font-medium' : ''}>Low</span>
                        <span className={selectedLevel === 1 ? 'text-blue-400 font-medium' : ''}>Current</span>
                        <span className={selectedLevel === 2 ? 'text-emerald-400 font-medium' : ''}>Optimal</span>
                        <span className={selectedLevel === 3 ? 'text-cyan-400 font-medium' : ''}>Advanced</span>
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
                          {levelData.label}
                        </span>
                        {levelData.impact !== 0 && (
                          <div className="flex items-center gap-1">
                            {levelData.impact < 0 ? (
                              <TrendingDown className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <TrendingUp className="w-3 h-3 text-red-400" />
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {levelData.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Projected Impact */}
            <div className="lg:col-span-1">
              <div className="sticky top-0 space-y-4">
                {/* Projected Age Card */}
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-5 shadow-xl">
                  <div className="text-center mb-4">
                    <div className="text-slate-400 text-sm mb-2">Projected Impact</div>
                    <div className="relative inline-block">
                      <div className={`text-5xl font-bold mb-1 ${
                        ageChange < 0 ? 'text-emerald-400' : ageChange > 0 ? 'text-red-400' : 'text-white'
                      }`}>
                        {projectedAge.toFixed(1)}
                      </div>
                      {ageChange !== 0 && (
                        <div className={`text-sm font-medium ${
                          ageChange < 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {ageChange > 0 ? '+' : ''}{ageChange.toFixed(1)} years
                        </div>
                      )}
                    </div>
                    <div className="text-slate-500 text-xs mt-2">Biological Age</div>
                  </div>

                  {/* Current vs Projected */}
                  <div className="space-y-3 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Current</span>
                      <span className="text-white font-medium">{currentBiologicalAge}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Chronological Age</span>
                      <span className="text-slate-300 font-medium">{currentAge}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                      <span className="text-slate-400 text-sm">Gap</span>
                      <span className={`font-semibold ${
                        gapFromChronological > 0 ? 'text-red-400' : gapFromChronological < 0 ? 'text-emerald-400' : 'text-slate-300'
                      }`}>
                        {gapFromChronological > 0 ? '+' : ''}{gapFromChronological.toFixed(1)} years
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                {(optimizedFactors.length > 0 || worsenedFactors.length > 0) && (
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
                    <div className="text-white text-sm font-medium mb-3">Changes Selected</div>
                    
                    {optimizedFactors.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs text-emerald-400 font-medium">Improvements</span>
                        </div>
                        <div className="space-y-1.5">
                          {optimizedFactors.map(factor => {
                            const level = factorLevels[factor.id];
                            const levelKey = ['low', 'current', 'optimal', 'advanced'][level] as keyof typeof factor.levels;
                            const impact = factor.levels[levelKey].impact;
                            return (
                              <div key={factor.id} className="flex items-center justify-between text-xs">
                                <span className="text-slate-300">{factor.label}</span>
                                <span className="text-emerald-400 font-medium">{impact.toFixed(1)}y</span>
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
                          <span className="text-xs text-red-400 font-medium">Risk Factors</span>
                        </div>
                        <div className="space-y-1.5">
                          {worsenedFactors.map(factor => {
                            const level = factorLevels[factor.id];
                            const levelKey = ['low', 'current', 'optimal', 'advanced'][level] as keyof typeof factor.levels;
                            const impact = factor.levels[levelKey].impact;
                            return (
                              <div key={factor.id} className="flex items-center justify-between text-xs">
                                <span className="text-slate-300">{factor.label}</span>
                                <span className="text-red-400 font-medium">+{impact.toFixed(1)}y</span>
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
                    <strong className="font-medium">Note:</strong> These projections are based on peer-reviewed research on lifestyle factors and biological aging. Individual results may vary.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
