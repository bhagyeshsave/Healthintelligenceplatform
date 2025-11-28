import { useState } from 'react';
import { Sparkles, Activity, Salad, Moon, Brain, Cigarette, Wine, Footprints, Heart, TrendingUp, TrendingDown, Minus, RotateCcw, Info } from 'lucide-react';
import { Button } from './ui/button';

interface LifestyleFactor {
  id: string;
  label: string;
  icon: any;
  currentPosition: number;
  impactCurve: 'linear' | 'exponential' | 'sigmoid';
  maxImpact: number;
  minImpact: number;
  minLabel: string;
  maxLabel: string;
  getValueLabel: (position: number) => string;
}

interface Props {
  currentAge: number;
  currentBiologicalAge: number;
}

export function LifestyleSimulationCompact({ currentAge, currentBiologicalAge }: Props) {
  const lifestyleFactors: LifestyleFactor[] = [
    {
      id: 'exercise',
      label: 'Exercise Frequency',
      icon: Activity,
      currentPosition: 30,
      impactCurve: 'exponential',
      maxImpact: -2.6,
      minImpact: 2.8,
      minLabel: 'Never',
      maxLabel: '7x/week',
      getValueLabel: (pos) => {
        const times = Math.round((pos / 100) * 7);
        return times === 0 ? 'Never' : `${times}x/week`;
      }
    },
    {
      id: 'diet',
      label: 'Diet Quality',
      icon: Salad,
      currentPosition: 55,
      impactCurve: 'linear',
      maxImpact: -2.8,
      minImpact: 3.2,
      minLabel: 'Poor',
      maxLabel: 'Optimal',
      getValueLabel: (pos) => {
        if (pos < 25) return 'Poor';
        if (pos < 50) return 'Fair';
        if (pos < 75) return 'Good';
        return 'Optimal';
      }
    },
    {
      id: 'sleep',
      label: 'Sleep Duration',
      icon: Moon,
      currentPosition: 40,
      impactCurve: 'sigmoid',
      maxImpact: -2.4,
      minImpact: 3.6,
      minLabel: '<4 hrs',
      maxLabel: '8+ hrs',
      getValueLabel: (pos) => {
        const hours = 4 + (pos / 100) * 4.5;
        return `${hours.toFixed(1)} hrs`;
      }
    },
    {
      id: 'stress',
      label: 'Stress Management',
      icon: Brain,
      currentPosition: 45,
      impactCurve: 'exponential',
      maxImpact: -1.8,
      minImpact: 3.8,
      minLabel: 'High stress',
      maxLabel: 'Well managed',
      getValueLabel: (pos) => {
        if (pos < 25) return 'High stress';
        if (pos < 50) return 'Moderate';
        if (pos < 75) return 'Good';
        return 'Excellent';
      }
    },
    {
      id: 'smoking',
      label: 'Tobacco Use',
      icon: Cigarette,
      currentPosition: 100,
      impactCurve: 'exponential',
      maxImpact: 0,
      minImpact: 8.5,
      minLabel: '2+ packs/day',
      maxLabel: 'Never',
      getValueLabel: (pos) => {
        if (pos === 100) return 'Never';
        if (pos > 75) return 'Quit >1yr';
        if (pos > 50) return '<5 cigs/day';
        if (pos > 25) return '1 pack/day';
        return '2+ packs/day';
      }
    },
    {
      id: 'alcohol',
      label: 'Alcohol Intake',
      icon: Wine,
      currentPosition: 70,
      impactCurve: 'linear',
      maxImpact: -0.4,
      minImpact: 2.8,
      minLabel: 'Heavy',
      maxLabel: 'None/Light',
      getValueLabel: (pos) => {
        if (pos > 85) return 'None';
        if (pos > 60) return 'Light (1-2/wk)';
        if (pos > 35) return 'Moderate (3-7/wk)';
        return 'Heavy (>7/wk)';
      }
    },
    {
      id: 'activity',
      label: 'Daily Movement',
      icon: Footprints,
      currentPosition: 50,
      impactCurve: 'linear',
      maxImpact: -1.2,
      minImpact: 1.6,
      minLabel: '<3k steps',
      maxLabel: '12k+ steps',
      getValueLabel: (pos) => {
        const steps = 3000 + (pos / 100) * 9000;
        return `${(steps / 1000).toFixed(1)}k steps`;
      }
    },
    {
      id: 'cardio',
      label: 'Cardiovascular Health',
      icon: Heart,
      currentPosition: 60,
      impactCurve: 'exponential',
      maxImpact: -2.2,
      minImpact: 4.2,
      minLabel: 'Poor',
      maxLabel: 'Excellent',
      getValueLabel: (pos) => {
        if (pos < 25) return 'Poor';
        if (pos < 50) return 'Fair';
        if (pos < 75) return 'Good';
        return 'Excellent';
      }
    }
  ];

  const [currentPositions, setCurrentPositions] = useState<Record<string, number>>(
    lifestyleFactors.reduce((acc, factor) => ({ ...acc, [factor.id]: factor.currentPosition }), {})
  );
  
  const [targetPositions, setTargetPositions] = useState<Record<string, number>>(
    lifestyleFactors.reduce((acc, factor) => ({ ...acc, [factor.id]: factor.currentPosition }), {})
  );

  const calculateImpact = (position: number, factor: LifestyleFactor): number => {
    const normalizedPos = position / 100;
    const range = factor.maxImpact - factor.minImpact;

    switch (factor.impactCurve) {
      case 'linear':
        return factor.minImpact + range * normalizedPos;
      case 'exponential':
        return factor.minImpact + range * Math.pow(normalizedPos, 2);
      case 'sigmoid':
        const sigmoid = 1 / (1 + Math.exp(-10 * (normalizedPos - 0.5)));
        return factor.minImpact + range * sigmoid;
      default:
        return 0;
    }
  };

  const calculateTotalImpact = () => {
    return lifestyleFactors.reduce((total, factor) => {
      const currentImpact = calculateImpact(currentPositions[factor.id], factor);
      const targetImpact = calculateImpact(targetPositions[factor.id], factor);
      return total + (targetImpact - currentImpact);
    }, 0);
  };

  const projectedBioAge = currentBiologicalAge + calculateTotalImpact();
  const totalImpact = calculateTotalImpact();

  const applyPreset = (preset: 'worst' | 'baseline' | 'healthy' | 'peak') => {
    const presets = {
      worst: { exercise: 0, diet: 0, sleep: 0, stress: 0, smoking: 0, alcohol: 0, activity: 0, cardio: 0 },
      baseline: currentPositions,
      healthy: { exercise: 70, diet: 75, sleep: 75, stress: 70, smoking: 100, alcohol: 80, activity: 70, cardio: 75 },
      peak: { exercise: 100, diet: 100, sleep: 100, stress: 100, smoking: 100, alcohol: 100, activity: 100, cardio: 100 }
    };
    setTargetPositions(presets[preset]);
  };

  const resetToBaseline = () => {
    setTargetPositions(currentPositions);
  };

  const updateCurrentPosition = (factorId: string, value: number) => {
    setCurrentPositions(prev => ({ ...prev, [factorId]: value }));
  };

  const updateTargetPosition = (factorId: string, value: number) => {
    setTargetPositions(prev => ({ ...prev, [factorId]: value }));
  };

  const getStatusColor = (impact: number) => {
    if (impact < -1) return 'text-emerald-400';
    if (impact < 0) return 'text-emerald-500';
    if (impact === 0) return 'text-slate-400';
    if (impact < 1) return 'text-orange-400';
    return 'text-red-400';
  };

  const getBarColor = (impact: number) => {
    if (impact < -1) return 'bg-emerald-500';
    if (impact < 0) return 'bg-emerald-600';
    if (impact === 0) return 'bg-slate-600';
    if (impact < 1) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">What-If Lifestyle Simulation Engine</h3>
            <p className="text-slate-400 text-sm">Adjust factors to see real-time biological age impact</p>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        <Button
          onClick={() => applyPreset('worst')}
          variant="outline"
          className="h-auto py-2 text-xs bg-slate-800/50 hover:bg-red-500/20 border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-400"
        >
          Worst Habits
        </Button>
        <Button
          onClick={() => applyPreset('baseline')}
          variant="outline"
          className="h-auto py-2 text-xs bg-slate-800/50 hover:bg-blue-500/20 border-slate-700 hover:border-blue-500/50 text-slate-300 hover:text-blue-400"
        >
          My Baseline
        </Button>
        <Button
          onClick={() => applyPreset('healthy')}
          variant="outline"
          className="h-auto py-2 text-xs bg-slate-800/50 hover:bg-emerald-500/20 border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400"
        >
          Healthy Target
        </Button>
        <Button
          onClick={() => applyPreset('peak')}
          variant="outline"
          className="h-auto py-2 text-xs bg-slate-800/50 hover:bg-purple-500/20 border-slate-700 hover:border-purple-500/50 text-slate-300 hover:text-purple-400"
        >
          Peak Performance
        </Button>
        <Button
          onClick={resetToBaseline}
          variant="outline"
          className="h-auto py-2 text-xs bg-slate-800/50 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="text-slate-400 text-xs mb-1">Current Bio Age</div>
          <div className="text-white text-2xl font-semibold">{currentBiologicalAge.toFixed(1)}</div>
          <div className="text-slate-500 text-xs">Age {currentAge}</div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="text-slate-400 text-xs mb-1">Projected Bio Age</div>
          <div className={`text-2xl font-semibold ${getStatusColor(totalImpact)}`}>
            {projectedBioAge.toFixed(1)}
          </div>
          <div className={`text-xs font-medium ${getStatusColor(totalImpact)}`}>
            {totalImpact > 0 ? '+' : ''}{totalImpact.toFixed(1)} years
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="text-slate-400 text-xs mb-1">Net Impact</div>
          <div className="flex items-center gap-2">
            {totalImpact < 0 ? (
              <TrendingDown className="w-6 h-6 text-emerald-400" />
            ) : totalImpact > 0 ? (
              <TrendingUp className="w-6 h-6 text-red-400" />
            ) : (
              <Minus className="w-6 h-6 text-slate-400" />
            )}
            <span className={`text-xl font-semibold ${getStatusColor(totalImpact)}`}>
              {totalImpact < 0 ? 'Improving' : totalImpact > 0 ? 'Declining' : 'Neutral'}
            </span>
          </div>
        </div>
      </div>

      {/* Factors Grid - Optimized for visibility */}
      <div className="grid md:grid-cols-2 gap-4">
        {lifestyleFactors.map((factor) => {
          const Icon = factor.icon;
          const currentPos = currentPositions[factor.id];
          const targetPos = targetPositions[factor.id];
          const currentImpact = calculateImpact(currentPos, factor);
          const targetImpact = calculateImpact(targetPos, factor);
          const delta = targetImpact - currentImpact;
          const isChanged = Math.abs(targetPos - currentPos) > 2;

          return (
            <div
              key={factor.id}
              className={`bg-slate-800/30 border rounded-xl p-4 transition-all ${
                isChanged
                  ? delta < 0
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-red-500/50 bg-red-500/5'
                  : 'border-slate-700/50'
              }`}
            >
              {/* Factor Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isChanged
                      ? delta < 0
                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                        : 'bg-red-500/20 border border-red-500/30'
                      : 'bg-slate-700/50 border border-slate-600/30'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      isChanged
                        ? delta < 0
                          ? 'text-emerald-400'
                          : 'text-red-400'
                        : 'text-slate-400'
                    }`} />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{factor.label}</div>
                    {isChanged && (
                      <div className={`text-xs font-medium ${getStatusColor(delta)}`}>
                        {delta < 0 ? '' : '+'}{delta.toFixed(1)}y impact
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Current and Target Sliders - Horizontal Layout */}
              <div className="space-y-3">
                {/* Current Position */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-slate-400 text-xs font-medium">Current:</label>
                    <span className="text-slate-300 text-xs font-semibold">
                      {factor.getValueLabel(currentPos)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px] min-w-[60px]">{factor.minLabel}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentPos}
                      onChange={(e) => updateCurrentPosition(factor.id, parseInt(e.target.value))}
                      className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-slate-700"
                      style={{
                        background: `linear-gradient(to right, rgb(100, 116, 139) 0%, rgb(100, 116, 139) ${currentPos}%, rgb(51, 65, 85) ${currentPos}%, rgb(51, 65, 85) 100%)`
                      }}
                    />
                    <span className="text-slate-500 text-[10px] min-w-[60px] text-right">{factor.maxLabel}</span>
                  </div>
                </div>

                {/* Target Position */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-slate-400 text-xs font-medium">Target:</label>
                    <span className={`text-xs font-semibold ${isChanged ? getStatusColor(delta) : 'text-slate-300'}`}>
                      {factor.getValueLabel(targetPos)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px] min-w-[60px]">{factor.minLabel}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={targetPos}
                      onChange={(e) => updateTargetPosition(factor.id, parseInt(e.target.value))}
                      className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${
                          isChanged
                            ? delta < 0
                              ? 'rgb(16, 185, 129)'
                              : 'rgb(239, 68, 68)'
                            : 'rgb(139, 92, 246)'
                        } 0%, ${
                          isChanged
                            ? delta < 0
                              ? 'rgb(16, 185, 129)'
                              : 'rgb(239, 68, 68)'
                            : 'rgb(139, 92, 246)'
                        } ${targetPos}%, rgb(51, 65, 85) ${targetPos}%, rgb(51, 65, 85) 100%)`
                      }}
                    />
                    <span className="text-slate-500 text-[10px] min-w-[60px] text-right">{factor.maxLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scientific Disclaimer */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-2">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-blue-300/90 text-xs leading-relaxed">
          <strong>Scientific Note:</strong> Impact values based on DNA methylation clocks, telomere studies, and peer-reviewed research. 
          This additive model simplifies complex biological interactions. Actual aging is influenced by genetics (25-35%), epigenetics, 
          and lifestyle synergies. Use for educational lifestyle optimization, not medical diagnosis.
        </p>
      </div>
    </div>
  );
}
