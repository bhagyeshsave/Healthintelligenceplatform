import { useState, useEffect } from 'react';
import { Heart, Brain, Activity, Shield, Wind, Bone, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Lightbulb, Target, Droplets, Moon, Zap, Info, Sparkles, Watch, ClipboardList, Calendar } from 'lucide-react';
import { HealthMetrics } from './HomePage';

interface MetricsPanelProps {
  currentMetrics: HealthMetrics;
  simulatedMetrics: HealthMetrics;
  isSimulating: boolean;
  onSystemHighlight?: (system: string | null) => void;
  onSystemClick?: (systemKey: string) => void;
  highlightedSystem?: string | null;
}

interface Driver {
  label: string;
  impact: number; // -5 to +5
}

interface MetricCard {
  key: keyof Omit<HealthMetrics, 'vibeScore'>;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  summary: string;
  drivers: Driver[];
  wearableSignals: string[];
  behaviorSignals: string[];
  lifestyleInputs: string[];
  labData: string[];
  insight: string;
  action: string;
  dataConfidence: 'Low' | 'Medium' | 'High';
}

const metricCards: MetricCard[] = [
  { 
    key: 'cardiovascular', 
    label: 'Cardiovascular', 
    icon: Heart, 
    color: 'red',
    summary: 'Your heart & circulation performance driven by activity patterns, recovery signals, and stress balance.',
    drivers: [
      { label: 'Resting HR', impact: 3 },
      { label: 'HRV Recovery', impact: -2 },
      { label: 'Activity Balance', impact: 4 },
      { label: 'Stress Episodes', impact: -1 }
    ],
    wearableSignals: ['HR', 'HRV', 'BP', 'Steps', 'VO₂ Max', 'Recovery'],
    behaviorSignals: ['Activity patterns', 'Stress episodes', 'Recovery quality'],
    lifestyleInputs: ['Exercise duration', 'Sleep hours', 'Hydration'],
    labData: ['Recent BP', 'Lipids'],
    insight: 'Your cardiovascular score improves 8% on days with consistent morning activity.',
    action: 'Try 20-min morning walks for 5 days to strengthen heart rhythm patterns.',
    dataConfidence: 'High'
  },
  { 
    key: 'mental', 
    label: 'Mental Resilience', 
    icon: Brain, 
    color: 'purple',
    summary: 'Your emotional stability and stress recovery pattern based on HRV variation, sleep, and daily stress load.',
    drivers: [
      { label: 'HRV Variation', impact: 4 },
      { label: 'Stress Peaks', impact: -3 },
      { label: 'Sleep Consistency', impact: 2 },
      { label: 'Restlessness (motion)', impact: -1 }
    ],
    wearableSignals: ['HRV', 'Stress score', 'EDA', 'Sleep stages', 'Resting HR'],
    behaviorSignals: ['Mood logs', 'Screen time spikes', 'Routine stability'],
    lifestyleInputs: ['Sleep timing', 'Wind-down routine'],
    labData: [],
    insight: 'Lower HRV days align with your highest stress episodes.',
    action: 'Try a 5-minute wind-down routine before bed to improve next-day resilience.',
    dataConfidence: 'High'
  },
  { 
    key: 'metabolic', 
    label: 'Metabolic', 
    icon: Activity, 
    color: 'green',
    summary: 'Your glucose stability and metabolic fitness based on activity, sleep quality, and post-meal glucose patterns.',
    drivers: [
      { label: 'Time-In-Range', impact: 2 },
      { label: 'Glucose Spikes', impact: -4 },
      { label: 'Sleep Quality', impact: 3 },
      { label: 'Activity Level', impact: 1 }
    ],
    wearableSignals: ['Continuous glucose', 'Glucose trend', 'TIR', 'Temp deviation', 'Steps'],
    behaviorSignals: ['Meal timing', 'Sugar logs', 'Movement consistency'],
    lifestyleInputs: ['Sleep duration', 'Post-meal walking', 'Hydration'],
    labData: ['HbA1c', 'Fasting glucose (older than 90 days)'],
    insight: 'Your evening glucose spikes are lowering your weekly metabolic score.',
    action: 'Add a light 10-minute post-dinner walk to reduce glucose variability.',
    dataConfidence: 'Medium'
  },
  { 
    key: 'immunity', 
    label: 'Immunity', 
    icon: Shield, 
    color: 'blue',
    summary: 'Your body\'s resilience based on sleep restoration, recovery patterns, and physiological stability.',
    drivers: [
      { label: 'Recovery Score', impact: 4 },
      { label: 'Temperature Stability', impact: 2 },
      { label: 'HRV Drop Events', impact: -3 },
      { label: 'Sleep Depth', impact: 1 }
    ],
    wearableSignals: ['Body temp', 'Skin temp', 'HRV', 'Resting HR', 'Recovery', 'Resp. Rate'],
    behaviorSignals: ['Stress load', 'Sleep timing', 'Activity strain'],
    lifestyleInputs: ['Nutrition', 'Hydration', 'Rest'],
    labData: ['CBC/CRP (if provided)'],
    insight: 'Your recovery score is highest after nights with stable temperature and deep sleep.',
    action: 'Aim for consistent sleep timing for the next 3 nights to enhance immune readiness.',
    dataConfidence: 'Medium'
  },
  { 
    key: 'respiratory', 
    label: 'Respiratory', 
    icon: Wind, 
    color: 'cyan',
    summary: 'Your breathing efficiency and lung performance based on oxygenation, respiratory stability, and aerobic capacity.',
    drivers: [
      { label: 'Night Respiratory Rate', impact: 2 },
      { label: 'SpO₂ Stability', impact: 3 },
      { label: 'VO₂ Max', impact: 2 },
      { label: 'Activity Intensity', impact: 1 }
    ],
    wearableSignals: ['Resp. rate', 'SpO₂', 'VO₂ Max', 'HRV'],
    behaviorSignals: ['Aerobic activity', 'Breath patterns'],
    lifestyleInputs: ['Daily walking', 'Sleep quality'],
    labData: [],
    insight: 'Your respiratory score improves on days with moderate aerobic activity.',
    action: 'Include 10 minutes of Zone-2 walking or cycling in your day.',
    dataConfidence: 'High'
  },
  { 
    key: 'musculoskeletal', 
    label: 'Musculoskeletal', 
    icon: Bone, 
    color: 'orange',
    summary: 'Your movement quality, strength readiness, and posture stability based on mobility patterns.',
    drivers: [
      { label: 'Activity Volume', impact: 3 },
      { label: 'Posture Events', impact: -2 },
      { label: 'EMG Activation/Movement Quality', impact: 2 },
      { label: 'Recovery Score', impact: 1 }
    ],
    wearableSignals: ['Steps', 'Motion raw', 'EMG (if available)', 'Posture/Fall data', 'VO₂ Max'],
    behaviorSignals: ['Exercise form', 'Sedentary time'],
    lifestyleInputs: ['Stretching routine', 'Strength workouts'],
    labData: [],
    insight: 'Extended sedentary periods reduce your movement quality score.',
    action: 'Add 2 short stretch breaks (2 minutes each) during long sitting periods.',
    dataConfidence: 'Medium'
  }
];

const getZoneTag = (value: number): { label: string; color: string } => {
  if (value >= 75) return { label: 'Healthy Zone', color: 'emerald' };
  if (value >= 60) return { label: 'Healthy Zone', color: 'cyan' };
  if (value >= 40) return { label: 'Monitor Zone', color: 'yellow' };
  return { label: 'Needs Attention', color: 'orange' };
};

const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' }
  };
  return colorMap[color] || colorMap.cyan;
};

// Generate 7-day sparkline data with deterministic seed
const generateSparklineData = (baseScore: number, seed: string): number[] => {
  const data: number[] = [];
  // Simple deterministic hash function
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  
  for (let i = 0; i < 7; i++) {
    // Use seed-based variation with more dynamic range
    const seedOffset = (hash % 100) / 100;
    const trend = Math.sin((i + seedOffset) * 0.8) * 5; // Larger trend variation
    const noise = Math.cos((i + seedOffset) * 1.3) * 3; // Some noise
    const variation = trend + noise;
    data.push(Math.max(0, Math.min(100, baseScore + variation)));
  }
  return data;
};

// Sparkline SVG component
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-16 h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={getColorClasses(color).text}
        opacity="0.9"
      />
    </svg>
  );
};

export const MetricsPanel = ({ currentMetrics, simulatedMetrics, isSimulating, onSystemHighlight, onSystemClick, highlightedSystem }: MetricsPanelProps) => {
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const [showAboutScores, setShowAboutScores] = useState(false);

  // Auto-expand when a system is highlighted from the 3D model
  useEffect(() => {
    if (highlightedSystem) {
      setExpandedMetric(highlightedSystem);
    }
  }, [highlightedSystem]);

  const toggleMetric = (key: string) => {
    const newExpanded = expandedMetric === key ? null : key;
    setExpandedMetric(newExpanded);
    if (onSystemHighlight) {
      onSystemHighlight(newExpanded);
    }
  };

  // Calculate overall data confidence based on all metrics
  const calculateOverallConfidence = (): 'Low' | 'Medium' | 'High' => {
    const confidenceCounts = metricCards.reduce(
      (acc, card) => {
        acc[card.dataConfidence] = (acc[card.dataConfidence] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    
    if (confidenceCounts['High'] >= 4) return 'High';
    if (confidenceCounts['Medium'] >= 3) return 'Medium';
    return 'Low';
  };

  // Get date range for last 7 days
  const getDateRange = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    
    const formatDate = (date: Date) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getDate()}`;
    };
    
    return `${formatDate(weekAgo)}–${formatDate(today)}`;
  };

  const overallConfidence = calculateOverallConfidence();
  const dateRange = getDateRange();

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-5 flex flex-col shadow-2xl h-full">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-white text-lg font-semibold mb-1">Health Overview</h2>
        <p className="text-xs text-slate-400">Real-time insights from your lifestyle, wearables, and health data</p>
      </div>

      {/* 7-Day Trend Overview Card - Compact Secondary Action */}
      <div className="mb-3 bg-slate-800/30 border border-slate-700/30 rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <div>
              <h3 className="text-xs text-white font-medium">7-Day Trend</h3>
              <p className="text-xs text-slate-500">{dateRange}</p>
            </div>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              overallConfidence === 'High'
                ? 'bg-emerald-500/10 text-emerald-400'
                : overallConfidence === 'Medium'
                ? 'bg-cyan-500/10 text-cyan-400'
                : 'bg-orange-500/10 text-orange-400'
            }`}
          >
            Data: {overallConfidence}
          </span>
        </div>
        
        <p className="text-xs text-slate-500 leading-relaxed">
          {overallConfidence === 'High' 
            ? 'Comprehensive data across systems' 
            : overallConfidence === 'Medium' 
            ? 'Connect more sources for better insights' 
            : 'Add more sources to improve accuracy'}
        </p>
      </div>

      {/* Improve Accuracy CTA - Show if confidence is not High */}
      {overallConfidence !== 'High' && (
        <div className="mb-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle improve accuracy action
            }}
            className="w-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/30 hover:border-cyan-500/50 rounded-lg px-3 py-2.5 flex items-center justify-center gap-2 transition-all group"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 transition-transform group-hover:scale-110" />
            <span className="text-xs text-cyan-400 font-medium">
              Improve Accuracy
            </span>
            <ChevronDown className="w-3 h-3 text-cyan-400 rotate-[-90deg]" />
          </button>
        </div>
      )}

      {/* About These Scores - Collapsible - Compact Secondary */}
      <div className="mb-4">
        <button
          onClick={() => setShowAboutScores(!showAboutScores)}
          className="w-full flex items-center justify-between bg-slate-800/20 hover:bg-slate-800/40 border border-slate-700/20 rounded-lg px-3 py-2 transition-all text-left group"
        >
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">How are scores calculated?</span>
          </div>
          {showAboutScores ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>
        
        {showAboutScores && (
          <div className="mt-2 bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 space-y-3">
            {/* Data Sources */}
            <div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculated using <span className="text-cyan-400 font-medium">multi-source data</span>: physiological signals (wearables), lifestyle patterns, historical labs, and environmental context.
              </p>
              <p className="text-xs text-slate-500 mt-2 italic">
                Interpret these scores as indicative trends, not clinical conclusions.
              </p>
            </div>

            {/* Score Classification */}
            <div>
              <h4 className="text-xs text-slate-400 mb-2 font-medium">Score Classification</h4>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-xs text-slate-300">Optimal Performance</span>
                  </div>
                  <span className="text-xs text-slate-500">75+</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                    <span className="text-xs text-slate-300">Healthy Range</span>
                  </div>
                  <span className="text-xs text-slate-500">60–74</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <span className="text-xs text-slate-300">Moderate</span>
                  </div>
                  <span className="text-xs text-slate-500">40–59</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="text-xs text-slate-300">Elevated Risk</span>
                  </div>
                  <span className="text-xs text-slate-500">25–39</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <span className="text-xs text-slate-300">Critical State</span>
                  </div>
                  <span className="text-xs text-slate-500">0–24</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* System Cards */}
      <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          const currentValue = currentMetrics[metric.key];
          const simulatedValue = simulatedMetrics[metric.key];
          const difference = simulatedValue - currentValue;
          const hasChanged = difference !== 0 && isSimulating;
          
          const zone = getZoneTag(isSimulating && hasChanged ? simulatedValue : currentValue);
          const isExpanded = expandedMetric === metric.key;
          const isHighlighted = highlightedSystem === metric.key;
          const sparklineData = generateSparklineData(currentValue, metric.key);

          return (
            <div 
              key={metric.key}
              className={`bg-slate-800/40 border border-slate-700/50 rounded-xl transition-all duration-300 cursor-pointer
                ${hasChanged
                  ? difference > 0
                    ? 'shadow-emerald-500/20'
                    : 'shadow-orange-500/20'
                  : ''
                }
                ${isExpanded ? 'shadow-lg' : ''}`}
              onClick={() => toggleMetric(metric.key)}
            >
              {/* COLLAPSED STATE */}
              <div className="p-4">
                {/* Header Row: Icon + Title + Chevron */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-11 h-11 rounded-xl ${getColorClasses(metric.color).bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${getColorClasses(metric.color).text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base text-white font-semibold">{metric.label}</h3>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>

                {/* Content Row: Tags + Score + Mini Chart */}
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[11px] px-2 py-1 rounded-md ${getColorClasses(zone.color).bg} ${getColorClasses(zone.color).text} font-medium whitespace-nowrap`}>
                      {zone.label}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap ${
                      metric.dataConfidence === 'High'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : metric.dataConfidence === 'Medium'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {metric.dataConfidence === 'High' ? 'High confidence' : metric.dataConfidence === 'Medium' ? 'Med confidence' : 'Low confidence'}
                    </span>
                  </div>

                  {/* Right: Score + Sparkline */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Mini Sparkline */}
                    <div className="hidden md:flex flex-col items-end gap-1">
                      <Sparkline data={sparklineData} color={metric.color} />
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider">7-day</span>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <div className={`text-3xl font-bold tabular-nums leading-none ${getColorClasses(zone.color).text}`}>
                        {isSimulating && hasChanged ? simulatedValue : currentValue}
                      </div>
                      {hasChanged && (
                        <div className={`text-xs font-semibold mt-1 ${difference > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                          {difference > 0 ? '+' : ''}{difference}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Improve Accuracy CTA - Only show for Medium confidence when NOT expanded */}
                {!isExpanded && metric.dataConfidence === 'Medium' && (
                  <div className="mt-3 pt-3 border-t border-slate-700/30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle improve accuracy action
                      }}
                      className="w-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20 border border-orange-500/30 hover:border-orange-500/50 rounded-lg px-3 py-2 flex items-center justify-center gap-2 transition-all group"
                    >
                      <Sparkles className="w-3 h-3 text-orange-400 transition-transform group-hover:scale-110" />
                      <span className="text-xs text-orange-400 font-medium">
                        Improve Accuracy
                      </span>
                      <ChevronDown className="w-2.5 h-2.5 text-orange-400 rotate-[-90deg]" />
                    </button>
                  </div>
                )}
              </div>

              {/* EXPANDED STATE */}
              {isExpanded && (
                <div className="border-t border-slate-700/40 bg-slate-900/40 px-3.5 pb-3.5 pt-3 space-y-3.5">
                  {/* 1. System Summary */}
                  <div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {metric.summary}
                    </p>
                  </div>

                  {/* 2. Key Drivers */}
                  <div>
                    <h4 className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Key Drivers</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {metric.drivers.map((driver, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${
                            driver.impact > 0
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                          }`}
                        >
                          <span>{driver.label}</span>
                          <span className="font-medium">{driver.impact > 0 ? '+' : ''}{driver.impact}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Data Input Transparency */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs text-slate-500 uppercase tracking-wide">Data Sources</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-md ${
                        metric.dataConfidence === 'High'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : metric.dataConfidence === 'Medium'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {metric.dataConfidence} Confidence
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Wearable Signals */}
                      {metric.wearableSignals.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Watch className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-xs text-slate-500 mb-1">Wearable Signals</div>
                            <div className="flex flex-wrap gap-1.5">
                              {metric.wearableSignals.map((signal, idx) => (
                                <span key={idx} className="text-xs px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-md border border-cyan-500/20">
                                  {signal}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Behavior Signals */}
                      {metric.behaviorSignals.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Activity className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-xs text-slate-500 mb-1">Behavior Signals</div>
                            <div className="flex flex-wrap gap-1.5">
                              {metric.behaviorSignals.map((signal, idx) => (
                                <span key={idx} className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-md border border-purple-500/20">
                                  {signal}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Lifestyle Inputs */}
                      {metric.lifestyleInputs.length > 0 && (
                        <div className="flex items-start gap-2">
                          <ClipboardList className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-xs text-slate-500 mb-1">Lifestyle Inputs</div>
                            <div className="flex flex-wrap gap-1.5">
                              {metric.lifestyleInputs.map((input, idx) => (
                                <span key={idx} className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-md border border-amber-500/20">
                                  {input}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Lab Data */}
                      {metric.labData.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Zap className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-xs text-slate-500 mb-1">Lab Data</div>
                            <div className="flex flex-wrap gap-1.5">
                              {metric.labData.map((data, idx) => (
                                <span key={idx} className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">
                                  {data}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4. Personalized Insight */}
                  <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs text-cyan-400 mb-1 font-medium">Insight</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {metric.insight}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5. Recommended Action */}
                  <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Target className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs text-cyan-400 mb-1 font-medium">Recommended Action</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {metric.action}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 6. 14-day Trend Visualization */}
                  <div>
                    <h4 className="text-xs text-slate-500 mb-2 uppercase tracking-wide">14-Day Trend</h4>
                    <div className="h-12 bg-slate-900/50 rounded-lg border border-slate-700/40 p-2">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id={`gradient-${metric.key}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" className={getColorClasses(metric.color).text} stopOpacity="0.3" />
                            <stop offset="100%" className={getColorClasses(metric.color).text} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {(() => {
                          const data = Array.from({ length: 14 }, (_, i) => 
                            Math.max(40, Math.min(90, currentValue + Math.sin(i * 0.4) * 8 + (Math.random() - 0.5) * 3))
                          );
                          const max = Math.max(...data);
                          const min = Math.min(...data);
                          const range = max - min || 1;
                          
                          const points = data.map((value, index) => {
                            const x = (index / (data.length - 1)) * 100;
                            const y = 100 - ((value - min) / range) * 100;
                            return `${x},${y}`;
                          }).join(' ');

                          return (
                            <>
                              <polyline
                                points={`0,100 ${points} 100,100`}
                                fill={`url(#gradient-${metric.key})`}
                              />
                              <polyline
                                points={points}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={getColorClasses(metric.color).text}
                                opacity="0.8"
                              />
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};