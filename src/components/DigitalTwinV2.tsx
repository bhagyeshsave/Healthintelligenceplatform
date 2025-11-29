import { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LifestyleSimulationCompact } from './LifestyleSimulationCompact';
import { HumanAnatomyViewer } from './anatomy-viewer/HumanAnatomyViewer';
import type { AnatomyData, BodyPartInfo } from './anatomy-viewer/types';
import { calculateTotalRiskIndex, calculateYearsImpact } from '../utils/lifespanRiskModel';
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
  Cigarette,
  Dumbbell,
  Apple,
  Moon,
  Zap,
  Wine,
  Armchair,
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
  category: 'smoking' | 'exercise' | 'diet' | 'sleep' | 'stress' | 'alcohol' | 'sitting';
  currentValue: number | string;
  targetValue: number | string;
  unit: string;
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
    id: 'smoking',
    name: 'Smoking Status',
    category: 'smoking',
    currentValue: 1,
    targetValue: 0,
    unit: '0=No, 1=Yes',
    icon: Cigarette,
    description: 'Smoking greatly increases mortality risk',
  },
  {
    id: 'exercise',
    name: 'Exercise Frequency',
    category: 'exercise',
    currentValue: 2,
    targetValue: 5,
    unit: 'days/week (30+ min)',
    icon: Dumbbell,
    description: 'Target 5+ days/week for optimal health',
  },
  {
    id: 'diet',
    name: 'Diet Quality',
    category: 'diet',
    currentValue: 2,
    targetValue: 3,
    unit: '1=Poor, 2=Avg, 3=Great',
    icon: Apple,
    description: 'Mediterranean or plant-based diet',
  },
  {
    id: 'sleep',
    name: 'Sleep Quality',
    category: 'sleep',
    currentValue: 2,
    targetValue: 2,
    unit: '1=Poor, 2=Good, 3=Excess',
    icon: Moon,
    description: 'Maintain 7-9 hours per night',
  },
  {
    id: 'stress',
    name: 'Stress Level',
    category: 'stress',
    currentValue: 2,
    targetValue: 1,
    unit: '1=Low, 2=Med, 3=High',
    icon: Zap,
    description: 'Reduce through meditation & relaxation',
  },
  {
    id: 'alcohol',
    name: 'Alcohol Consumption',
    category: 'alcohol',
    currentValue: 7,
    targetValue: 1,
    unit: 'drinks/week',
    icon: Wine,
    description: 'Moderate to light consumption',
  },
  {
    id: 'sitting',
    name: 'Sitting Time',
    category: 'sitting',
    currentValue: 8,
    targetValue: 4,
    unit: 'hours/day',
    icon: Armchair,
    description: 'Reduce sedentary time daily',
  },
];

// Health-focused anatomy data for the 3D body viewer
const healthAnatomyData: AnatomyData = {
  head: {
    id: "head",
    name: "Brain & Cognition",
    description: "Your cognitive health is in optimal condition. Neural activity and memory function are within healthy ranges.",
    facts: [
      "Cognitive Performance: 92/100",
      "Memory recall improved 12%",
      "Focus duration: 78 min avg"
    ],
    color: "#a855f7"
  },
  heart: {
    id: "heart",
    name: "Cardiovascular System",
    description: "Your heart health requires attention. Recent metrics show slight elevation that can be improved with lifestyle changes.",
    facts: [
      "Resting Heart Rate: 68 bpm (-4 from 3 months ago)",
      "HRV: 58 ms (+8 from last month)",
      "Blood Pressure: 118/76 mmHg (optimal)"
    ],
    color: "#ef4444"
  },
  chest: {
    id: "chest",
    name: "Respiratory Health",
    description: "Your respiratory system is functioning well with good lung capacity and oxygen levels.",
    facts: [
      "VO2 Max: 42 ml/kg/min",
      "Respiratory rate: 14-16 breaths/min",
      "SpO2: 98% average"
    ],
    color: "#06b6d4"
  },
  leftLung: {
    id: "leftLung",
    name: "Left Lung",
    description: "Left lung function is within normal parameters.",
    facts: [
      "Lung capacity: Normal",
      "No respiratory concerns detected"
    ],
    color: "#22c55e"
  },
  rightLung: {
    id: "rightLung",
    name: "Right Lung",
    description: "Right lung function is within normal parameters.",
    facts: [
      "Lung capacity: Normal",
      "No respiratory concerns detected"
    ],
    color: "#22c55e"
  },
  liver: {
    id: "liver",
    name: "Metabolic Health",
    description: "Your metabolic markers show some areas of concern. Focus on diet and exercise for improvement.",
    facts: [
      "Glucose metabolism: Needs attention",
      "Liver enzymes: Within range",
      "Cholesterol: Slightly elevated"
    ],
    color: "#f97316"
  },
  abdomen: {
    id: "abdomen",
    name: "Digestive System",
    description: "Your digestive health is generally good with room for improvement in gut microbiome diversity.",
    facts: [
      "Gut health score: 75/100",
      "Digestive efficiency: Good",
      "Microbiome diversity: Moderate"
    ],
    color: "#84cc16"
  },
  leftKidney: {
    id: "leftKidney",
    name: "Left Kidney",
    description: "Kidney function is optimal with good filtration rates.",
    facts: [
      "eGFR: Normal range",
      "Hydration status: Good"
    ],
    color: "#3b82f6"
  },
  rightKidney: {
    id: "rightKidney",
    name: "Right Kidney",
    description: "Kidney function is optimal with good filtration rates.",
    facts: [
      "eGFR: Normal range",
      "Hydration status: Good"
    ],
    color: "#3b82f6"
  },
  spine: {
    id: "spine",
    name: "Musculoskeletal System",
    description: "Your spine and skeletal health are good. Continue maintaining proper posture.",
    facts: [
      "Posture assessment: Good",
      "Bone density: Normal",
      "No chronic pain indicators"
    ],
    color: "#8b5cf6"
  },
  hip: {
    id: "hip",
    name: "Hip & Joint Health",
    description: "Joint mobility is within normal range. Regular movement helps maintain flexibility.",
    facts: [
      "Joint mobility: Normal",
      "Flexibility score: 70/100",
      "No arthritis indicators"
    ],
    color: "#eab308"
  },
  leftLeg: {
    id: "leftLeg",
    name: "Lower Body - Left",
    description: "Lower body strength and circulation are healthy.",
    facts: [
      "Muscle strength: Good",
      "Circulation: Normal"
    ],
    color: "#14b8a6"
  },
  rightLeg: {
    id: "rightLeg",
    name: "Lower Body - Right",
    description: "Lower body strength and circulation are healthy.",
    facts: [
      "Muscle strength: Good",
      "Circulation: Normal"
    ],
    color: "#14b8a6"
  },
  leftArm: {
    id: "leftArm",
    name: "Upper Body - Left",
    description: "Upper body strength and function are within healthy parameters.",
    facts: [
      "Grip strength: Normal",
      "Range of motion: Good"
    ],
    color: "#fbbf24"
  },
  rightArm: {
    id: "rightArm",
    name: "Upper Body - Right",
    description: "Upper body strength and function are within healthy parameters.",
    facts: [
      "Grip strength: Normal",
      "Range of motion: Good"
    ],
    color: "#fbbf24"
  },
  neck: {
    id: "neck",
    name: "Neck & Thyroid",
    description: "Neck mobility and thyroid function are normal.",
    facts: [
      "Thyroid levels: Normal",
      "Neck mobility: Good"
    ],
    color: "#fb923c"
  }
};

// Map anatomy part IDs to bodyParts for historical data lookup
const anatomyToHealthMap: Record<string, string> = {
  head: 'brain',
  heart: 'heart',
  chest: 'lungs',
  leftLung: 'lungs',
  rightLung: 'lungs',
  liver: 'metabolism',
  abdomen: 'metabolism',
  leftKidney: 'kidneys',
  rightKidney: 'kidneys'
};

export function DigitalTwinV2() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [selectedAnatomyPart, setSelectedAnatomyPart] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  
  const actualAge = 36;
  const currentBioAge = 37.5;
  
  // Map anatomy part to original bodyParts for backward compatibility
  const mappedPartId = selectedAnatomyPart ? anatomyToHealthMap[selectedAnatomyPart] : selectedPart;
  const selectedPartData = bodyParts.find((p) => p.id === mappedPartId);
  const historicalData = mappedPartId ? historicalDataMap[mappedPartId] || [] : [];
  
  // Handler for 3D body part selection
  const handlePartSelect = useCallback((partId: string | null, partInfo: BodyPartInfo | null) => {
    setSelectedAnatomyPart(partId);
    if (partId && anatomyToHealthMap[partId]) {
      setSelectedPart(anatomyToHealthMap[partId]);
    } else {
      // Clear legacy selection when no mapping exists to prevent stale data
      setSelectedPart(null);
    }
  }, []);
  
  // Get anatomy info for the currently selected part (for parts without health mapping)
  const selectedAnatomyInfo = selectedAnatomyPart ? healthAnatomyData[selectedAnatomyPart] : null;
  
  const selectedWhatIfFactors = whatIfFactors.filter((f) =>
    selectedFactors.includes(f.id)
  );
  
  // Calculate risk using Cox Proportional Hazards model
  const currentFactors = Object.fromEntries(
    whatIfFactors.map((f) => [f.category, f.currentValue])
  );
  const targetFactors = Object.fromEntries(
    whatIfFactors.map((f) => [f.category, f.targetValue])
  );
  const currentRisk = calculateTotalRiskIndex(currentFactors);
  const targetRisk = calculateTotalRiskIndex(
    selectedFactors.length > 0 ? targetFactors : currentFactors
  );
  const yearsGained = calculateYearsImpact(currentRisk, targetRisk);
  const projectedBioAge = currentBioAge - yearsGained;
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
              <h3 className="text-white font-medium">3D Body Systems Overview</h3>
              <p className="text-slate-400 text-xs">Click on body parts to view health data</p>
            </div>

            {/* 3D Human Body Viewer */}
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <HumanAnatomyViewer
                modelUrl="/geometries/human_body.glb"
                anatomyData={healthAnatomyData}
                onPartSelect={handlePartSelect}
                showInfoPanel={false}
                backgroundColor="#0f172a"
                controlsConfig={{
                  enablePan: true,
                  enableZoom: true,
                  enableRotate: true,
                  horizontalOnly: false
                }}
                lightingConfig={{
                  ambientIntensity: 0.7,
                  directionalIntensity: 1.2
                }}
                style={{ height: '100%', borderRadius: '8px' }}
              />
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
                    onClick={() => { setSelectedPart(null); setSelectedAnatomyPart(null); }}
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
            ) : selectedAnatomyInfo ? (
              // Show anatomy info for parts without health mapping
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: selectedAnatomyInfo.color + '30' }}
                    >
                      <Activity className="w-5 h-5" style={{ color: selectedAnatomyInfo.color }} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{selectedAnatomyInfo.name}</h3>
                      <p className="text-slate-400 text-xs">Body Region</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => { setSelectedPart(null); setSelectedAnatomyPart(null); }}
                    variant="ghost"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {selectedAnatomyInfo.description}
                    </p>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-1.5 mb-3">
                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-300 text-sm font-medium">Health Status</span>
                    </div>
                    <ul className="space-y-2">
                      {selectedAnatomyInfo.facts.map((fact, i) => (
                        <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                          <div 
                            className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" 
                            style={{ backgroundColor: selectedAnatomyInfo.color }} 
                          />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <Aperture className="w-12 h-12 text-slate-600 mb-3" />
                <h3 className="text-white font-medium mb-2">Select a Body System</h3>
                <p className="text-slate-400 text-sm max-w-xs">
                  Click on any part of the 3D body to view health data and AI-powered insights
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
                    const improvement = Number(factor.targetValue) < Number(factor.currentValue);
                    
                    return (
                      <button
                        key={factor.id}
                        onClick={() => toggleFactor(factor.id)}
                        className={`text-left p-3 rounded-lg border transition-all ${
                          isSelected
                            ? improvement
                              ? 'bg-green-500/20 border-green-500/40'
                              : 'bg-blue-500/20 border-blue-500/40'
                            : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            {isSelected ? (
                              <div
                                className={`w-5 h-5 rounded flex items-center justify-center ${
                                  improvement
                                    ? 'bg-green-500'
                                    : 'bg-blue-500'
                                }`}
                              >
                                {improvement ? (
                                  <Minus className="w-3 h-3 text-white" />
                                ) : (
                                  <Minus className="w-3 h-3 text-white" />
                                )}
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded border-2 border-slate-600" />
                            )}
                            <span className="text-white text-sm font-medium">
                              {factor.name}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-slate-300">
                            {factor.unit}
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
                            {yearsGained > 0 ? (
                              <TrendingDown className="w-4 h-4 text-green-400" />
                            ) : (
                              <TrendingUp className="w-4 h-4 text-blue-400" />
                            )}
                            <span
                              className={`text-xs font-medium ${
                                yearsGained > 0 ? 'text-green-400' : 'text-blue-400'
                              }`}
                            >
                              {yearsGained > 0 ? '+' : ''}
                              {yearsGained.toFixed(1)} years
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
