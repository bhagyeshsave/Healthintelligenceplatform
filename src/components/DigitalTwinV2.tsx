import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LifestyleSimulationCompact } from './LifestyleSimulationCompact';
import {
  Activity,
  Heart,
  Brain,
  Aperture,
  Droplets,
  Wind,
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  TrendingDown,
  TrendingUp,
  ChevronRight,
  Calendar,
  AlertCircle,
  CheckCircle,
  Info,
  Sparkles,
  Plus,
  Minus,
} from 'lucide-react';

interface BodyPart {
  id: string;
  name: string;
  icon: any;
  color: string;
  status: 'optimal' | 'attention' | 'concern';
  bioAge: number;
  position: { x: number; y: number };
}

interface HistoricalData {
  metric: string;
  current: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  period: string;
  insights: string[];
  recommendations: string[];
}

interface WhatIfFactor {
  id: string;
  name: string;
  category: 'lifestyle' | 'diet' | 'exercise' | 'sleep' | 'stress';
  impact: number; // years impact on biological age
  icon: any;
  description: string;
}

const bodyParts: BodyPart[] = [
  {
    id: 'brain',
    name: 'Brain & Cognition',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    status: 'optimal',
    bioAge: 32,
    position: { x: 50, y: 15 },
  },
  {
    id: 'heart',
    name: 'Cardiovascular',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    status: 'attention',
    bioAge: 38,
    position: { x: 50, y: 35 },
  },
  {
    id: 'lungs',
    name: 'Respiratory',
    icon: Wind,
    color: 'from-cyan-500 to-blue-500',
    status: 'optimal',
    bioAge: 34,
    position: { x: 50, y: 40 },
  },
  {
    id: 'metabolism',
    name: 'Metabolic Health',
    icon: Activity,
    color: 'from-orange-500 to-red-500',
    status: 'concern',
    bioAge: 42,
    position: { x: 50, y: 55 },
  },
  {
    id: 'kidneys',
    name: 'Renal Function',
    icon: Droplets,
    color: 'from-blue-500 to-cyan-500',
    status: 'optimal',
    bioAge: 35,
    position: { x: 50, y: 60 },
  },
];

const historicalDataMap: Record<string, HistoricalData[]> = {
  heart: [
    {
      metric: 'Resting Heart Rate',
      current: '68 bpm',
      trend: 'down',
      change: '-4 bpm',
      period: 'vs. 3 months ago',
      insights: [
        'Consistent improvement in cardiovascular fitness',
        'Morning readings show optimal recovery',
        'Stress-induced spikes reduced by 23%',
      ],
      recommendations: [
        'Continue current exercise routine',
        'Consider adding interval training 2x/week',
        'Monitor during high-stress periods',
      ],
    },
    {
      metric: 'HRV (Heart Rate Variability)',
      current: '58 ms',
      trend: 'up',
      change: '+8 ms',
      period: 'vs. last month',
      insights: [
        'Strong autonomic nervous system balance',
        'Recovery capacity improving',
        'Sleep quality correlation: 0.82',
      ],
      recommendations: [
        'Maintain sleep schedule (7-8h)',
        'Add meditation or breathwork',
        'Reduce alcohol intake',
      ],
    },
    {
      metric: 'Blood Pressure',
      current: '118/76 mmHg',
      trend: 'stable',
      change: 'Within optimal range',
      period: 'Last 6 months',
      insights: [
        'Consistent readings across all measurements',
        'No white coat hypertension detected',
        'Morning vs evening variance: <5 mmHg',
      ],
      recommendations: [
        'Continue monitoring weekly',
        'Maintain sodium intake <2300mg/day',
        'Regular cardio 3-4x/week',
      ],
    },
  ],
  brain: [
    {
      metric: 'Cognitive Performance',
      current: '92/100',
      trend: 'up',
      change: '+5 points',
      period: 'vs. last quarter',
      insights: [
        'Memory recall improved 12%',
        'Processing speed in 88th percentile',
        'Focus duration increased to 78 min avg',
      ],
      recommendations: [
        'Continue brain training exercises',
        'Optimize sleep (target: 7.5h)',
        'Consider omega-3 supplementation',
      ],
    },
  ],
  metabolism: [
    {
      metric: 'Fasting Glucose',
      current: '96 mg/dL',
      trend: 'up',
      change: '+8 mg/dL',
      period: 'vs. 3 months ago',
      insights: [
        'Trending toward pre-diabetic range',
        'Post-meal spikes averaging 145 mg/dL',
        'Correlation with carb intake: 0.76',
      ],
      recommendations: [
        'Reduce refined carbohydrate intake',
        'Increase fiber to 30g/day',
        'Consider time-restricted eating (16:8)',
        'Schedule HbA1c test',
      ],
    },
  ],
};

const whatIfFactors: WhatIfFactor[] = [
  {
    id: 'exercise-5x',
    name: 'Exercise 5x/week',
    category: 'exercise',
    impact: -2.5,
    icon: Activity,
    description: '45min cardio + strength training',
  },
  {
    id: 'sleep-8h',
    name: 'Sleep 8h consistently',
    category: 'sleep',
    impact: -1.8,
    icon: Activity,
    description: 'Consistent 10pm-6am schedule',
  },
  {
    id: 'mediterranean-diet',
    name: 'Mediterranean Diet',
    category: 'diet',
    impact: -2.2,
    icon: Activity,
    description: 'Plant-based, omega-3 rich',
  },
  {
    id: 'quit-smoking',
    name: 'Quit Smoking',
    category: 'lifestyle',
    impact: -5.5,
    icon: Activity,
    description: 'Complete cessation',
  },
  {
    id: 'stress-management',
    name: 'Daily Meditation',
    category: 'stress',
    impact: -1.2,
    icon: Activity,
    description: '20min mindfulness practice',
  },
  {
    id: 'alcohol-reduction',
    name: 'Limit Alcohol',
    category: 'lifestyle',
    impact: -1.5,
    description: '≤2 drinks/week',
  },
  {
    id: 'poor-sleep',
    name: 'Poor Sleep (<6h)',
    category: 'sleep',
    impact: 2.8,
    icon: Activity,
    description: 'Chronic sleep deprivation',
  },
  {
    id: 'sedentary',
    name: 'Sedentary Lifestyle',
    category: 'exercise',
    impact: 3.5,
    icon: Activity,
    description: '<3000 steps/day',
  },
];

export function DigitalTwinV2() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  
  const actualAge = 36;
  const currentBioAge = 37.5;
  
  const selectedPartData = bodyParts.find((p) => p.id === selectedPart);
  const historicalData = selectedPart ? historicalDataMap[selectedPart] || [] : [];
  
  const selectedWhatIfFactors = whatIfFactors.filter((f) =>
    selectedFactors.includes(f.id)
  );
  const totalImpact = selectedWhatIfFactors.reduce((sum, f) => sum + f.impact, 0);
  const projectedBioAge = currentBioAge + totalImpact;
  const ageGap = projectedBioAge - actualAge;

  const toggleFactor = (factorId: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factorId)
        ? prev.filter((id) => id !== factorId)
        : [...prev, factorId]
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-8">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="px-4 md:px-6 py-3 md:py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-white">Digital Health Twin</h1>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs px-2 py-0">
                    v2.0
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm">
                  Interactive 3D body visualization with AI insights
                </p>
              </div>
            </div>

            {/* Biological Age Summary */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Actual Age</p>
                    <p className="text-white text-2xl font-light">{actualAge}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Biological Age</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-white text-2xl font-light">{currentBioAge.toFixed(1)}</p>
                      <span className="text-orange-400 text-sm">
                        +{(currentBioAge - actualAge).toFixed(1)} years
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-slate-400 text-xs mb-1">Overall Status</p>
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    Needs Attention
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* 3D Body Visualization */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Body Systems Overview</h3>
              
              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  variant="ghost"
                  className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                  variant="ghost"
                  className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setRotation((rotation + 45) % 360)}
                  variant="ghost"
                  className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    setRotation(0);
                    setZoom(1);
                  }}
                  variant="ghost"
                  className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 3D Body Container */}
            <div className="relative h-[500px] bg-slate-950/50 rounded-lg border border-slate-800/50 overflow-hidden">
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `scale(${zoom}) rotateY(${rotation}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.5s ease-out',
                }}
              >
                {/* Human Body Silhouette */}
                <svg
                  width="200"
                  height="450"
                  viewBox="0 0 200 450"
                  className="relative"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))' }}
                >
                  {/* Head */}
                  <ellipse cx="100" cy="40" rx="30" ry="35" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  
                  {/* Neck */}
                  <rect x="90" y="70" width="20" height="20" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  
                  {/* Torso */}
                  <ellipse cx="100" cy="150" rx="50" ry="80" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  
                  {/* Arms */}
                  <ellipse cx="45" cy="140" rx="12" ry="60" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  <ellipse cx="155" cy="140" rx="12" ry="60" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  
                  {/* Legs */}
                  <ellipse cx="75" cy="310" rx="15" ry="90" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  <ellipse cx="125" cy="310" rx="15" ry="90" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                </svg>

                {/* Clickable Body Parts */}
                {bodyParts.map((part) => {
                  const Icon = part.icon;
                  const isSelected = selectedPart === part.id;
                  
                  return (
                    <button
                      key={part.id}
                      onClick={() => setSelectedPart(part.id)}
                      className="absolute group cursor-pointer"
                      style={{
                        left: `${part.position.x}%`,
                        top: `${part.position.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {/* Pulse Animation */}
                      {part.status !== 'optimal' && (
                        <div
                          className={`absolute inset-0 rounded-full animate-ping ${
                            part.status === 'concern'
                              ? 'bg-red-500/30'
                              : 'bg-orange-500/30'
                          }`}
                        />
                      )}
                      
                      {/* Icon Button */}
                      <div
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-gradient-to-br ' + part.color + ' scale-125 shadow-lg'
                            : part.status === 'optimal'
                            ? 'bg-green-500/20 border-2 border-green-500/40 group-hover:bg-green-500/30'
                            : part.status === 'attention'
                            ? 'bg-orange-500/20 border-2 border-orange-500/40 group-hover:bg-orange-500/30'
                            : 'bg-red-500/20 border-2 border-red-500/40 group-hover:bg-red-500/30'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-slate-300'}`} />
                      </div>
                      
                      {/* Label */}
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <div
                          className={`px-2 py-1 rounded text-xs transition-all ${
                            isSelected
                              ? 'bg-slate-900 text-white border border-slate-700'
                              : 'bg-slate-900/0 text-slate-500 group-hover:bg-slate-900 group-hover:text-white group-hover:border group-hover:border-slate-700'
                          }`}
                        >
                          {part.name}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Legend */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-slate-400">Optimal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-slate-400">Attention</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-slate-400">Concern</span>
              </div>
            </div>
          </div>

          {/* Historical Insights Panel */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            {selectedPartData ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedPartData.color} flex items-center justify-center`}
                    >
                      <selectedPartData.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{selectedPartData.name}</h3>
                      <p className="text-slate-400 text-xs">
                        Bio Age: {selectedPartData.bioAge} years
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedPart(null)}
                    variant="ghost"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Historical Data */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {historicalData.length > 0 ? (
                    historicalData.map((data, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
                      >
                        {/* Metric Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-white text-sm font-medium mb-1">
                              {data.metric}
                            </h4>
                            <div className="flex items-baseline gap-2">
                              <span className="text-white text-xl">{data.current}</span>
                              <div className="flex items-center gap-1">
                                {data.trend === 'up' ? (
                                  <TrendingUp className="w-3 h-3 text-green-400" />
                                ) : data.trend === 'down' ? (
                                  <TrendingDown className="w-3 h-3 text-red-400" />
                                ) : (
                                  <Activity className="w-3 h-3 text-slate-400" />
                                )}
                                <span
                                  className={`text-xs ${
                                    data.trend === 'up'
                                      ? 'text-green-400'
                                      : data.trend === 'down'
                                      ? 'text-red-400'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {data.change}
                                </span>
                              </div>
                            </div>
                            <p className="text-slate-500 text-xs mt-0.5">{data.period}</p>
                          </div>
                        </div>

                        {/* AI Insights */}
                        <div className="mb-3">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span className="text-cyan-300 text-xs font-medium">
                              AI Insights
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {data.insights.map((insight, i) => (
                              <li
                                key={i}
                                className="text-slate-300 text-xs flex items-start gap-2"
                              >
                                <CheckCircle className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Recommendations */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Info className="w-3 h-3 text-purple-400" />
                            <span className="text-purple-300 text-xs font-medium">
                              Recommendations
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {data.recommendations.map((rec, i) => (
                              <li
                                key={i}
                                className="text-slate-300 text-xs flex items-start gap-2"
                              >
                                <ChevronRight className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 text-center">
                      <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">
                        No historical data available yet
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        Keep logging your health metrics to see insights
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <Aperture className="w-12 h-12 text-slate-600 mb-3" />
                <h3 className="text-white font-medium mb-2">Select a Body System</h3>
                <p className="text-slate-400 text-sm max-w-xs">
                  Tap any organ or system on the body visualization to view historical data
                  and AI-powered insights
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lifestyle Simulation - Always Visible */}
        <div className="mt-8">
          <LifestyleSimulationCompact 
            currentAge={actualAge}
            currentBiologicalAge={currentBioAge}
          />
        </div>

        {/* What-If Simulation Panel */}
        {showWhatIf && (
          <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-white font-medium">What-If Lifestyle Simulation</h3>
              </div>
              <Button
                onClick={() => {
                  setShowWhatIf(false);
                  setSelectedFactors([]);
                }}
                variant="ghost"
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Factor Selection */}
              <div className="md:col-span-2">
                <p className="text-slate-300 text-sm mb-3">
                  Select lifestyle changes to see their impact on your biological age
                </p>
                
                <div className="grid md:grid-cols-2 gap-2">
                  {whatIfFactors.map((factor) => {
                    const Icon = factor.icon;
                    const isSelected = selectedFactors.includes(factor.id);
                    const isPositive = factor.impact < 0;
                    
                    return (
                      <button
                        key={factor.id}
                        onClick={() => toggleFactor(factor.id)}
                        className={`text-left p-3 rounded-lg border transition-all ${
                          isSelected
                            ? isPositive
                              ? 'bg-green-500/20 border-green-500/40'
                              : 'bg-red-500/20 border-red-500/40'
                            : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            {isSelected ? (
                              <div
                                className={`w-5 h-5 rounded flex items-center justify-center ${
                                  isPositive
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                                }`}
                              >
                                {isPositive ? (
                                  <Minus className="w-3 h-3 text-white" />
                                ) : (
                                  <Plus className="w-3 h-3 text-white" />
                                )}
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded border-2 border-slate-600" />
                            )}
                            <span className="text-white text-sm font-medium">
                              {factor.name}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              isPositive ? 'text-green-400' : 'text-red-400'
                            }`}
                          >
                            {isPositive ? '' : '+'}
                            {factor.impact.toFixed(1)}y
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs">{factor.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Impact Visualization */}
              <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4">
                <h4 className="text-white text-sm font-medium mb-4">Projected Impact</h4>
                
                <div className="space-y-4">
                  {/* Current State */}
                  <div>
                    <p className="text-slate-400 text-xs mb-2">Current</p>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-slate-400 text-xs">Biological Age</span>
                        <span className="text-white text-lg">{currentBioAge.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500">Gap:</span>
                        <span className="text-orange-400">
                          +{(currentBioAge - actualAge).toFixed(1)} years
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  {selectedFactors.length > 0 && (
                    <div className="flex justify-center">
                      <ChevronRight className="w-6 h-6 text-purple-400 rotate-90" />
                    </div>
                  )}

                  {/* Projected State */}
                  {selectedFactors.length > 0 && (
                    <div>
                      <p className="text-purple-300 text-xs mb-2">Projected</p>
                      <div
                        className={`border rounded-lg p-3 ${
                          projectedBioAge < actualAge
                            ? 'bg-green-500/20 border-green-500/40'
                            : projectedBioAge < currentBioAge
                            ? 'bg-cyan-500/20 border-cyan-500/40'
                            : 'bg-orange-500/20 border-orange-500/40'
                        }`}
                      >
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-slate-300 text-xs">Biological Age</span>
                          <span className="text-white text-lg">{projectedBioAge.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs mb-2">
                          <span className="text-slate-400">Gap:</span>
                          <span
                            className={
                              ageGap < 0
                                ? 'text-green-400'
                                : ageGap < currentBioAge - actualAge
                                ? 'text-cyan-400'
                                : 'text-orange-400'
                            }
                          >
                            {ageGap < 0 ? '' : '+'}
                            {ageGap.toFixed(1)} years
                          </span>
                        </div>
                        <div className="pt-2 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            {totalImpact < 0 ? (
                              <TrendingDown className="w-4 h-4 text-green-400" />
                            ) : (
                              <TrendingUp className="w-4 h-4 text-red-400" />
                            )}
                            <span
                              className={`text-xs font-medium ${
                                totalImpact < 0 ? 'text-green-400' : 'text-red-400'
                              }`}
                            >
                              {totalImpact < 0 ? '' : '+'}
                              {totalImpact.toFixed(1)} year impact
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {selectedFactors.length === 0 && (
                  <div className="mt-8 text-center">
                    <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 text-xs">
                      Select factors to see projected impact
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lifestyle Simulation Modal */}
    </div>
  );
}
