import { useState, useEffect } from 'react';
import { DigitalTwin3D } from './DigitalTwin3D';
import { WhatIfSimulator } from './WhatIfSimulator';
import { MetricsPanel } from './MetricsPanel';
import { Activity, Heart, Brain, Droplet, Utensils, Moon, TrendingUp } from 'lucide-react';

export interface HealthParameters {
  sleep: number;
  activity: number;
  stress: number;
  diet: number;
  hydration: number;
  // New wearable-driven components for Vibe Score
  recovery?: number; // HRV/Recovery score
  activityBalance?: number; // Movement balance
  glucoseStability?: number; // Metabolic stability
}

export interface LabMarkers {
  // Cardiovascular
  ldlCholesterol: number; // 0-100 normalized
  hdlCholesterol: number;
  triglycerides: number;
  bloodPressure: number;
  
  // Metabolic
  fastingGlucose: number;
  hba1c: number;
  insulinLevel: number;
  
  // General health
  vitaminD: number;
  vitaminB12: number;
  hemoglobin: number;
  wbcCount: number;
  
  // Liver/Kidney
  altLevel: number;
  creatinine: number;
}

export interface WearableData {
  restingHeartRate: number; // 0-100 normalized
  heartRateVariability: number;
  spo2: number;
  vo2max: number;
  dailySteps: number;
  sleepScore: number;
}

export interface EnvironmentalFactors {
  aqi: number; // 0-100 (inverted - lower AQI is better)
  uvIndex: number;
  temperature: number;
  humidity: number;
}

export interface HealthMetrics {
  vibeScore: number;
  cardiovascular: number;
  mental: number;
  metabolic: number;
  immunity: number;
  respiratory: number;
  musculoskeletal: number;
}

// Calculate NEW Vibe Score (Wearable-Driven Daily Balance Index)
const calculateVibeScore = (params: HealthParameters): number => {
  // Map existing params to new components
  // In real app, these would come from actual wearable data
  
  // 1. Sleep (30%) - Use sleep parameter directly
  const sleepScore = params.sleep;
  
  // 2. Recovery/HRV (25%) - Derive from stress (inverse) and sleep quality
  // In real app: HRV baseline, resting HR, temperature deviation, recovery score
  const recoveryScore = params.recovery || (params.sleep * 0.6 + (100 - params.stress) * 0.4);
  
  // 3. Activity Balance (20%) - Use activity parameter
  // In real app: Steps, intensity, sedentary reduction, VO₂ Max
  const activityBalanceScore = params.activityBalance || params.activity;
  
  // 4. Stress Load (15%) - Inverted stress
  // In real app: HRV variation, EDA peaks, wearable stress score
  const lowStressScore = 100 - params.stress;
  
  // 5. Hydration + Glucose Stability (10%)
  // In real app: Hydration logs, glucose variability, time-in-range, temp deviation
  const metabolicScore = params.glucoseStability || (params.hydration * 0.7 + params.diet * 0.3);
  
  const weights = {
    sleep: 0.30,
    recovery: 0.25,
    activityBalance: 0.20,
    lowStress: 0.15,
    metabolic: 0.10
  };
  
  return Math.round(
    sleepScore * weights.sleep +
    recoveryScore * weights.recovery +
    activityBalanceScore * weights.activityBalance +
    lowStressScore * weights.lowStress +
    metabolicScore * weights.metabolic
  );
};

// Calculate organ-specific metrics
const calculateMetrics = (params: HealthParameters): HealthMetrics => {
  // Mock lab markers (in real app, these would come from ABHA/ABDM records)
  const labMarkers: LabMarkers = {
    ldlCholesterol: 70,
    hdlCholesterol: 65,
    triglycerides: 68,
    bloodPressure: 75,
    fastingGlucose: 72,
    hba1c: 70,
    insulinLevel: 68,
    vitaminD: 60,
    vitaminB12: 65,
    hemoglobin: 75,
    wbcCount: 70,
    altLevel: 80,
    creatinine: 78
  };
  
  // Mock wearable data (in real app, from connected devices)
  const wearableData: WearableData = {
    restingHeartRate: 72,
    heartRateVariability: 68,
    spo2: 85,
    vo2max: 65,
    dailySteps: params.activity, // Correlated with activity
    sleepScore: params.sleep
  };
  
  // Mock environmental data (in real app, from location-based APIs)
  const envFactors: EnvironmentalFactors = {
    aqi: 65, // Lower is better
    uvIndex: 70,
    temperature: 75,
    humidity: 70
  };
  
  // Cardiovascular: Lab (40%) + Lifestyle (30%) + Wearables (20%) + Environment (10%)
  const cardiovascular = Math.round(
    (labMarkers.ldlCholesterol * 0.15 + labMarkers.hdlCholesterol * 0.10 + 
     labMarkers.triglycerides * 0.08 + labMarkers.bloodPressure * 0.07) + // 40%
    (params.activity * 0.18 + (100 - params.stress) * 0.08 + params.diet * 0.04) + // 30%
    (wearableData.restingHeartRate * 0.08 + wearableData.heartRateVariability * 0.06 + 
     wearableData.vo2max * 0.06) + // 20%
    (envFactors.aqi * 0.05 + envFactors.temperature * 0.05) // 10%
  );
  
  // Mental Health: Lifestyle (40%) + Lab (30%) + Wearables (20%) + Environment (10%)
  const mental = Math.round(
    (params.sleep * 0.20 + (100 - params.stress) * 0.15 + params.activity * 0.05) + // 40%
    (labMarkers.vitaminD * 0.12 + labMarkers.vitaminB12 * 0.10 + 
     labMarkers.hba1c * 0.08) + // 30%
    (wearableData.sleepScore * 0.10 + wearableData.heartRateVariability * 0.10) + // 20%
    (envFactors.aqi * 0.05 + envFactors.uvIndex * 0.05) // 10%
  );
  
  // Metabolic: Lab (45%) + Lifestyle (30%) + Wearables (15%) + Environment (10%)
  const metabolic = Math.round(
    (labMarkers.fastingGlucose * 0.15 + labMarkers.hba1c * 0.15 + 
     labMarkers.insulinLevel * 0.08 + labMarkers.altLevel * 0.07) + // 45%
    (params.diet * 0.15 + params.activity * 0.10 + params.hydration * 0.05) + // 30%
    (wearableData.dailySteps * 0.08 + wearableData.vo2max * 0.07) + // 15%
    (envFactors.temperature * 0.05 + envFactors.humidity * 0.05) // 10%
  );
  
  // Immunity: Lab (40%) + Lifestyle (35%) + Wearables (15%) + Environment (10%)
  const immunity = Math.round(
    (labMarkers.wbcCount * 0.15 + labMarkers.vitaminD * 0.12 + 
     labMarkers.hemoglobin * 0.08 + labMarkers.vitaminB12 * 0.05) + // 40%
    (params.sleep * 0.15 + params.diet * 0.12 + (100 - params.stress) * 0.08) + // 35%
    (wearableData.sleepScore * 0.08 + wearableData.heartRateVariability * 0.07) + // 15%
    (envFactors.aqi * 0.06 + envFactors.uvIndex * 0.04) // 10%
  );
  
  // Respiratory: Wearables (35%) + Lifestyle (30%) + Lab (20%) + Environment (15%)
  const respiratory = Math.round(
    (wearableData.spo2 * 0.15 + wearableData.vo2max * 0.12 + 
     wearableData.restingHeartRate * 0.08) + // 35%
    (params.activity * 0.15 + (100 - params.stress) * 0.10 + params.sleep * 0.05) + // 30%
    (labMarkers.hemoglobin * 0.12 + labMarkers.creatinine * 0.08) + // 20%
    (envFactors.aqi * 0.10 + envFactors.humidity * 0.05) // 15%
  );
  
  // Musculoskeletal: Lifestyle (35%) + Lab (30%) + Wearables (25%) + Environment (10%)
  const musculoskeletal = Math.round(
    (params.activity * 0.20 + params.diet * 0.10 + params.sleep * 0.05) + // 35%
    (labMarkers.vitaminD * 0.15 + labMarkers.vitaminB12 * 0.08 + 
     labMarkers.hemoglobin * 0.07) + // 30%
    (wearableData.dailySteps * 0.12 + wearableData.vo2max * 0.08 + 
     wearableData.sleepScore * 0.05) + // 25%
    (envFactors.temperature * 0.05 + envFactors.uvIndex * 0.05) // 10%
  );
  
  const vibeScore = calculateVibeScore(params);
  
  return {
    vibeScore,
    cardiovascular,
    mental,
    metabolic,
    immunity,
    respiratory,
    musculoskeletal
  };
};

export const HomePage = () => {
  // Current state (baseline)
  const [currentParams] = useState<HealthParameters>({
    sleep: 65,
    activity: 55,
    stress: 60,
    diet: 60,
    hydration: 70
  });

  // What-If simulation state
  const [simulatedParams, setSimulatedParams] = useState<HealthParameters>(currentParams);
  const [isSimulating, setIsSimulating] = useState(false);
  const [highlightedSystem, setHighlightedSystem] = useState<string | null>(null);

  // Calculate metrics
  const currentMetrics = calculateMetrics(currentParams);
  const simulatedMetrics = calculateMetrics(simulatedParams);

  // Check if any parameter has changed
  useEffect(() => {
    const hasChanged = Object.keys(currentParams).some(
      key => currentParams[key as keyof HealthParameters] !== simulatedParams[key as keyof HealthParameters]
    );
    setIsSimulating(hasChanged);
  }, [currentParams, simulatedParams]);

  const handleReset = () => {
    setSimulatedParams(currentParams);
    setIsSimulating(false);
  };

  const handleSystemClick = (systemKey: string) => {
    // Toggle the highlighted system
    setHighlightedSystem(highlightedSystem === systemKey ? null : systemKey);
  };

  const improvement = simulatedMetrics.vibeScore - currentMetrics.vibeScore;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Score Header - Compact */}
      <div className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center justify-center max-w-[1800px] mx-auto">
            {/* Current Score Card */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl md:rounded-2xl px-4 py-2 md:px-6 md:py-3 shadow-xl">
              <div className="flex items-center gap-2 md:gap-4">
                <div>
                  <div className="text-xs text-slate-400 mb-0.5 md:mb-1">Current Vibe Score</div>
                  <div className="text-xl md:text-3xl text-cyan-400">{currentMetrics.vibeScore}</div>
                </div>
                {isSimulating && improvement !== 0 && (
                  <>
                    <div className="w-px h-8 md:h-12 bg-slate-700"></div>
                    <div>
                      <div className="text-xs text-slate-400 mb-0.5 md:mb-1">Predicted</div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <div className="text-xl md:text-3xl text-emerald-400">{simulatedMetrics.vibeScore}</div>
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg text-xs md:text-sm ${
                          improvement > 0 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          <TrendingUp className={`w-3 h-3 md:w-4 md:h-4 ${improvement < 0 ? 'rotate-180' : ''}`} />
                          <span>{improvement > 0 ? '+' : ''}{improvement}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
          {/* Left Panel - What-If Simulator */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <WhatIfSimulator
              currentParams={currentParams}
              simulatedParams={simulatedParams}
              onParamChange={setSimulatedParams}
              onReset={handleReset}
              isSimulating={isSimulating}
            />
          </div>

          {/* Center - 3D Digital Twin */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex items-center justify-center min-h-[500px] md:min-h-[600px] lg:h-[calc(100vh-220px)]">
            <DigitalTwin3D
              currentMetrics={currentMetrics}
              simulatedMetrics={simulatedMetrics}
              isSimulating={isSimulating}
              highlightedSystem={highlightedSystem}
              onSystemClick={handleSystemClick}
            />
          </div>

          {/* Right Panel - Metrics */}
          <div className="lg:col-span-3 order-3">
            <MetricsPanel
              currentMetrics={currentMetrics}
              simulatedMetrics={simulatedMetrics}
              isSimulating={isSimulating}
              onSystemHighlight={setHighlightedSystem}
              highlightedSystem={highlightedSystem}
            />
          </div>
        </div>
      </div>
    </div>
  );
};