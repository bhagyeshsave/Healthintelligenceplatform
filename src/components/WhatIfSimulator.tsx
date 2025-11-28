import { Moon, Activity, Brain, Utensils, Droplet, RotateCcw, Zap, Info, Sparkles, TrendingUp, Target, Flame, ChevronDown, ChevronUp, Plus, Minus, Calendar, TrendingDown, Trophy, BarChart3 } from 'lucide-react';
import { HealthParameters } from './HomePage';
import { useState } from 'react';

interface WhatIfSimulatorProps {
  currentParams: HealthParameters;
  simulatedParams: HealthParameters;
  onParamChange: (params: HealthParameters) => void;
  onReset: () => void;
  isSimulating: boolean;
}

interface Parameter {
  key: keyof HealthParameters;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  tooltip: string;
  unit: string;
  getInsight: (value: number) => { level: string; meaning: string; action: string };
}

// Comparison scenarios based on realistic user data
interface ComparisonScenario {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  values: HealthParameters;
  color: string;
}

// Goal mode interface
interface HealthGoal {
  targetVibeScore: number;
  timeframe: number; // days
}

const comparisonScenarios: ComparisonScenario[] = [
  {
    name: 'Yesterday',
    icon: Calendar,
    description: '📅',
    values: { sleep: 72, activity: 58, stress: 48, diet: 65, hydration: 70 },
    color: 'slate'
  },
  {
    name: 'Best Day',
    icon: Trophy,
    description: '🏆',
    values: { sleep: 85, activity: 78, stress: 25, diet: 82, hydration: 85 },
    color: 'emerald'
  },
  {
    name: 'Optimized',
    icon: TrendingUp,
    description: '🎯',
    values: { sleep: 85, activity: 85, stress: 20, diet: 88, hydration: 85 },
    color: 'cyan'
  },
  {
    name: 'Weekday Avg',
    icon: BarChart3,
    description: '📊',
    values: { sleep: 68, activity: 55, stress: 55, diet: 70, hydration: 65 },
    color: 'blue'
  },
  {
    name: 'Weekend Avg',
    icon: ChevronDown,
    description: '🌙',
    values: { sleep: 82, activity: 45, stress: 35, diet: 65, hydration: 70 },
    color: 'purple'
  },
  {
    name: 'Worst Day',
    icon: TrendingDown,
    description: '⚠️',
    values: { sleep: 45, activity: 30, stress: 75, diet: 48, hydration: 50 },
    color: 'red'
  }
];

// Calculate impact of changing one parameter
interface OpportunityInsight {
  parameter: Parameter;
  currentValue: number;
  targetValue: number;
  estimatedImpact: number;
  label: string;
}

const parameters: Parameter[] = [
  { 
    key: 'sleep', 
    label: 'Sleep Quality', 
    icon: Moon, 
    color: 'purple', 
    description: 'Hours & quality',
    tooltip: '7-9 hours of quality sleep recommended',
    unit: 'hrs',
    getInsight: (value: number) => {
      if (value >= 75) return {
        level: 'Optimal',
        meaning: '7-9 hours of deep, restorative sleep',
        action: 'Excellent! Maintain your sleep routine'
      };
      if (value >= 60) return {
        level: 'Good',
        meaning: '6-7 hours with decent sleep quality',
        action: 'Try adding 30 min to reach optimal'
      };
      if (value >= 40) return {
        level: 'Fair',
        meaning: '5-6 hours or interrupted sleep',
        action: 'Prioritize earlier bedtime & sleep hygiene'
      };
      if (value >= 25) return {
        level: 'Poor',
        meaning: '<5 hours or very poor quality',
        action: 'Urgent: Sleep debt affects all health systems'
      };
      return {
        level: 'Critical',
        meaning: 'Severe sleep deprivation',
        action: 'Consult healthcare provider immediately'
      };
    }
  },
  { 
    key: 'activity', 
    label: 'Physical Activity', 
    icon: Activity, 
    color: 'orange', 
    description: 'Exercise & movement',
    tooltip: '150 min/week moderate activity recommended',
    unit: 'min',
    getInsight: (value: number) => {
      if (value >= 75) return {
        level: 'Optimal',
        meaning: '150+ min/week moderate-to-vigorous activity',
        action: 'Great! You\'re hitting WHO guidelines'
      };
      if (value >= 60) return {
        level: 'Good',
        meaning: '90-150 min/week regular exercise',
        action: 'Add 2 more 30-min sessions weekly'
      };
      if (value >= 40) return {
        level: 'Fair',
        meaning: '30-90 min/week light activity',
        action: 'Start with 20-min walks 3x/week'
      };
      if (value >= 25) return {
        level: 'Poor',
        meaning: '<30 min/week, mostly sedentary',
        action: 'Begin with 10-min daily movement breaks'
      };
      return {
        level: 'Critical',
        meaning: 'Complete sedentary lifestyle',
        action: 'Urgent: Inactivity increases chronic disease risk'
      };
    }
  },
  { 
    key: 'stress', 
    label: 'Stress Level', 
    icon: Brain, 
    color: 'red', 
    description: 'Lower is better',
    tooltip: 'Manage stress through mindfulness & breaks',
    unit: 'level',
    getInsight: (value: number) => {
      if (value <= 25) return {
        level: 'Low',
        meaning: 'Well-managed stress with good coping',
        action: 'Excellent! Maintain your stress practices'
      };
      if (value <= 40) return {
        level: 'Moderate',
        meaning: 'Occasional stress, mostly under control',
        action: 'Practice daily 10-min breathing exercises'
      };
      if (value <= 60) return {
        level: 'Elevated',
        meaning: 'Frequent stress affecting daily life',
        action: 'Consider mindfulness, therapy, or yoga'
      };
      if (value <= 75) return {
        level: 'High',
        meaning: 'Chronic stress impacting health',
        action: 'Urgent: Seek professional mental health support'
      };
      return {
        level: 'Critical',
        meaning: 'Severe stress or burnout',
        action: 'Consult healthcare provider immediately'
      };
    }
  },
  { 
    key: 'diet', 
    label: 'Diet Quality', 
    icon: Utensils, 
    color: 'green', 
    description: 'Nutrition balance',
    tooltip: 'Balanced meals with variety of nutrients',
    unit: 'score',
    getInsight: (value: number) => {
      if (value >= 75) return {
        level: 'Optimal',
        meaning: 'Balanced macros, varied whole foods, proper portions',
        action: 'Excellent! Keep up your nutrition habits'
      };
      if (value >= 60) return {
        level: 'Good',
        meaning: 'Mostly healthy with occasional treats',
        action: 'Add more colorful vegetables & lean protein'
      };
      if (value >= 40) return {
        level: 'Fair',
        meaning: 'Inconsistent nutrition, frequent processed foods',
        action: 'Plan meals ahead, reduce sugar & trans fats'
      };
      if (value >= 25) return {
        level: 'Poor',
        meaning: 'Poor dietary choices, nutrient deficiencies likely',
        action: 'Consider nutritionist consultation'
      };
      return {
        level: 'Critical',
        meaning: 'Severely imbalanced or inadequate nutrition',
        action: 'Urgent: Malnutrition affects all systems'
      };
    }
  },
  { 
    key: 'hydration', 
    label: 'Hydration', 
    icon: Droplet, 
    color: 'blue', 
    description: 'Water intake',
    tooltip: '8 glasses (2L) of water daily recommended',
    unit: 'cups',
    getInsight: (value: number) => {
      if (value >= 75) return {
        level: 'Optimal',
        meaning: '8+ glasses (2L+) of water daily',
        action: 'Perfect! You\'re well-hydrated'
      };
      if (value >= 60) return {
        level: 'Good',
        meaning: '6-8 glasses (~1.5L) of water daily',
        action: 'Add 1-2 more glasses to reach optimal'
      };
      if (value >= 40) return {
        level: 'Fair',
        meaning: '4-6 glasses (~1L) of water daily',
        action: 'Set hourly reminders to drink water'
      };
      if (value >= 25) return {
        level: 'Poor',
        meaning: '<4 glasses, chronic mild dehydration',
        action: 'Dehydration affects cognition & energy'
      };
      return {
        level: 'Critical',
        meaning: 'Severe dehydration',
        action: 'Increase fluid intake immediately'
      };
    }
  }
];

const getColorClasses = (color: string, value: number, currentValue: number) => {
  const improved = value > currentValue;
  const worsened = value < currentValue;
  
  const baseColors: Record<string, string> = {
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500'
  };
  
  if (improved) return 'bg-emerald-500';
  if (worsened) return 'bg-red-500';
  return baseColors[color] || 'bg-slate-500';
};

export const WhatIfSimulator = ({
  currentParams,
  simulatedParams,
  onParamChange,
  onReset,
  isSimulating
}: WhatIfSimulatorProps) => {
  const [hoveredParam, setHoveredParam] = useState<string | null>(null);

  const handleChange = (key: keyof HealthParameters, value: number) => {
    onParamChange({
      ...simulatedParams,
      [key]: value
    });
  };

  // Apply preset scenario
  const applyPreset = (preset: ComparisonScenario) => {
    onParamChange(preset.values);
  };

  // Calculate biggest opportunities - which input changes give the most ROI
  const calculateOpportunities = (): OpportunityInsight[] => {
    const opportunities: OpportunityInsight[] = [];
    
    parameters.forEach(param => {
      const currentValue = currentParams[param.key];
      let targetValue = 0;
      let estimatedImpact = 0;
      
      if (param.key === 'stress') {
        // For stress, lower is better
        if (currentValue > 40) {
          targetValue = Math.max(20, currentValue - 20);
          estimatedImpact = (currentValue - targetValue) * 0.8; // High impact from reducing stress
        }
      } else {
        // For other params, higher is better
        if (currentValue < 75) {
          targetValue = Math.min(85, currentValue + 20);
          estimatedImpact = (targetValue - currentValue) * (param.key === 'sleep' ? 1.2 : param.key === 'activity' ? 0.9 : 0.7);
        }
      }
      
      if (estimatedImpact > 0) {
        opportunities.push({
          parameter: param,
          currentValue,
          targetValue,
          estimatedImpact,
          label: param.key === 'stress' 
            ? `Reduce to ${targetValue}` 
            : `Increase to ${targetValue}`
        });
      }
    });
    
    // Sort by estimated impact (highest first)
    return opportunities.sort((a, b) => b.estimatedImpact - a.estimatedImpact).slice(0, 3);
  };

  const topOpportunities = calculateOpportunities();

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col shadow-2xl h-full">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white mb-0 text-base md:text-2xl">What-If Simulator</h2>
              <p className="text-xs text-slate-400">Adjust to see predictions</p>
            </div>
          </div>
          {isSimulating && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 text-xs md:text-sm rounded-lg md:rounded-xl transition-all duration-200 border border-slate-600/50 hover:border-slate-500 hover:shadow-lg"
            >
              <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg md:rounded-xl p-2.5 md:p-3 flex items-start gap-2">
          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-300 leading-relaxed">
            Slide to explore how lifestyle changes impact your health metrics in real-time
          </p>
        </div>
      </div>

      {/* Preset Scenarios - Quick Lifestyle Templates */}
      <div className="mb-4 md:mb-5">
        <div className="flex items-center gap-2 mb-2.5">
          <BarChart3 className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-400" />
          <h3 className="text-white text-xs md:text-sm font-medium">Compare With</h3>
        </div>
        
        {/* Horizontal scrollable chip-style buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          {comparisonScenarios.map((preset) => {
            // Color scheme mapping
            const colorSchemes: Record<string, { bg: string; border: string; text: string; hover: string }> = {
              slate: { bg: 'bg-slate-600/20', border: 'border-slate-500/30', text: 'text-slate-300', hover: 'hover:bg-slate-500/30 hover:border-slate-400/50' },
              emerald: { bg: 'bg-emerald-600/20', border: 'border-emerald-500/30', text: 'text-emerald-300', hover: 'hover:bg-emerald-500/30 hover:border-emerald-400/50' },
              cyan: { bg: 'bg-cyan-600/20', border: 'border-cyan-500/30', text: 'text-cyan-300', hover: 'hover:bg-cyan-500/30 hover:border-cyan-400/50' },
              blue: { bg: 'bg-blue-600/20', border: 'border-blue-500/30', text: 'text-blue-300', hover: 'hover:bg-blue-500/30 hover:border-blue-400/50' },
              purple: { bg: 'bg-purple-600/20', border: 'border-purple-500/30', text: 'text-purple-300', hover: 'hover:bg-purple-500/30 hover:border-purple-400/50' },
              red: { bg: 'bg-red-600/20', border: 'border-red-500/30', text: 'text-red-300', hover: 'hover:bg-red-500/30 hover:border-red-400/50' }
            };
            
            const colors = colorSchemes[preset.color] || colorSchemes.slate;
            
            return (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className={`group flex-shrink-0 flex items-center gap-1.5 md:gap-2 ${colors.bg} ${colors.border} ${colors.hover} border rounded-full px-3 md:px-3.5 py-1.5 md:py-2 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg`}
              >
                <span className="text-base md:text-lg">{preset.description}</span>
                <span className={`${colors.text} text-xs md:text-sm font-medium whitespace-nowrap`}>
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Smart Suggestions - Biggest Opportunities */}
      {topOpportunities.length > 0 && !isSimulating && (
        <div className="mb-4 md:mb-5">
          <div className="flex items-center gap-2 mb-2.5 md:mb-3">
            <Target className="w-4 h-4 text-cyan-400" />
            <h3 className="text-white text-sm md:text-base font-medium">Biggest Opportunities</h3>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-indigo-500/10 border border-cyan-500/30 rounded-xl p-3 md:p-4 space-y-2.5">
            {topOpportunities.map((opp, index) => {
              const Icon = opp.parameter.icon;
              return (
                <button
                  key={opp.parameter.key}
                  onClick={() => handleChange(opp.parameter.key, opp.targetValue)}
                  className="w-full group bg-slate-900/40 hover:bg-slate-800/60 border border-slate-700/50 hover:border-cyan-400/50 rounded-lg p-2.5 md:p-3 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                >
                  <div className="flex items-center gap-2.5 md:gap-3">
                    {/* Rank Badge */}
                    <div className={`flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center font-bold text-xs md:text-sm ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/30' :
                      index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900' :
                      'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-lg bg-${opp.parameter.color}-500/20 border border-${opp.parameter.color}-500/30 flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 md:w-4.5 md:h-4.5 text-${opp.parameter.color}-400`} />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 text-left">
                      <div className="text-white text-xs md:text-sm font-medium mb-0.5">
                        {opp.parameter.label}
                      </div>
                      <div className="text-[10px] md:text-xs text-slate-400">
                        {opp.label} <span className="text-cyan-400 font-medium">→ ~+{Math.round(opp.estimatedImpact)} impact</span>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <TrendingUp className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 text-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Parameters */}
      <div className="space-y-4 md:space-y-5 flex-1 overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
        {parameters.map((param) => {
          const Icon = param.icon;
          const current = currentParams[param.key];
          const simulated = simulatedParams[param.key];
          const changed = current !== simulated;
          
          const isImproved = param.key === 'stress' 
            ? simulated < current 
            : simulated > current;

          const isHovered = hoveredParam === param.key;
          
          const currentInsight = param.getInsight(current);
          const simulatedInsight = param.getInsight(simulated);

          return (
            <div 
              key={param.key} 
              className={`bg-slate-800/50 rounded-xl md:rounded-2xl p-3 md:p-4 border transition-all duration-200 ${
                changed 
                  ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
                  : 'border-slate-700/50'
              }`}
              onMouseEnter={() => setHoveredParam(param.key)}
              onMouseLeave={() => setHoveredParam(null)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2.5 md:mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-${param.color}-500/20 flex items-center justify-center border border-${param.color}-500/30`}>
                    <Icon className={`w-4 h-4 md:w-5 md:h-5 text-${param.color}-400`} />
                  </div>
                  <div>
                    <div className="text-white text-sm md:text-base flex items-center gap-1.5">
                      {param.label}
                    </div>
                    <div className="text-xs text-slate-500">{param.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  {changed && (
                    <span className={`text-xs px-1.5 md:px-2 py-0.5 rounded-md ${
                      isImproved 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isImproved ? '+' : ''}{simulated - current}
                    </span>
                  )}
                  <span className="text-white text-sm md:text-base min-w-[2rem] md:min-w-[2.5rem] text-right">{simulated}</span>
                </div>
              </div>

              {/* Slider */}
              <div className="relative mb-2">
                {/* Background track */}
                <div className="h-2.5 md:h-3 bg-slate-900/50 rounded-full overflow-hidden relative">
                  {/* Current value indicator (ghost) */}
                  {changed && (
                    <div 
                      className="absolute top-0 left-0 h-2.5 md:h-3 bg-slate-700/50 rounded-full transition-all duration-300"
                      style={{ width: `${current}%` }}
                    />
                  )}
                  {/* Simulated value */}
                  <div 
                    className={`absolute top-0 left-0 h-2.5 md:h-3 rounded-full transition-all duration-300 ${
                      changed
                        ? isImproved
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                          : 'bg-gradient-to-r from-red-500 to-red-400'
                        : `bg-gradient-to-r from-${param.color}-600 to-${param.color}-400`
                    }`}
                    style={{ width: `${simulated}%` }}
                  />
                </div>
                
                {/* Slider input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simulated}
                  onChange={(e) => handleChange(param.key, parseInt(e.target.value))}
                  className="absolute top-0 left-0 w-full h-2.5 md:h-3 opacity-0 cursor-pointer z-10"
                />
              </div>

              {/* Min/Max labels */}
              <div className="flex justify-between text-xs text-slate-500 px-1 mb-3">
                <span>Poor</span>
                <span>Optimal</span>
              </div>

              {/* Actionable Insight */}
              <div className={`bg-slate-900/50 border rounded-lg p-2.5 space-y-1.5 ${
                changed 
                  ? isImproved 
                    ? 'border-emerald-500/30 bg-emerald-500/5' 
                    : 'border-red-500/30 bg-red-500/5'
                  : 'border-slate-700/50'
              }`}>
                {/* Current State */}
                {!changed ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Current Status:</span>
                      <span className={`text-xs font-medium ${
                        param.key === 'stress' 
                          ? current <= 40 ? 'text-emerald-400' : 'text-orange-400'
                          : current >= 60 ? 'text-emerald-400' : 'text-orange-400'
                      }`}>
                        {currentInsight.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {currentInsight.meaning}
                    </p>
                    <div className="flex items-start gap-1.5 pt-1 border-t border-slate-700/50">
                      <Sparkles className="w-3 h-3 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-indigo-300 leading-relaxed">
                        {currentInsight.action}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Comparison View */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">From:</span>
                      <span className="text-slate-400">{currentInsight.level} ({current})</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">To:</span>
                      <span className={`font-medium ${
                        isImproved ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {simulatedInsight.level} ({simulated})
                      </span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-700/30">
                      <p className="text-xs text-slate-300 leading-relaxed mb-1.5">
                        {simulatedInsight.meaning}
                      </p>
                      <div className="flex items-start gap-1.5">
                        <Sparkles className={`w-3 h-3 flex-shrink-0 mt-0.5 ${
                          isImproved ? 'text-emerald-400' : 'text-orange-400'
                        }`} />
                        <p className={`text-xs leading-relaxed ${
                          isImproved ? 'text-emerald-300' : 'text-orange-300'
                        }`}>
                          {simulatedInsight.action}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulation Status */}
      {isSimulating && (
        <div className="mt-4 md:mt-6 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg">
          <div className="flex items-start gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-indigo-500/30 flex items-center justify-center flex-shrink-0 border border-indigo-400/30">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-indigo-300 animate-pulse" />
            </div>
            <div>
              <div className="text-sm text-white mb-1">Simulation Active</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your Digital Twin is responding to changes. Watch the health zones transform!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};