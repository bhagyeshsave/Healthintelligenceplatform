/**
 * Example: How to use HumanBody3D with custom health data
 * 
 * This example shows how to integrate the 3D body viewer with:
 * - Real-time health metrics
 * - ABHA/ABDM health records
 * - Wearable device data
 * - Lab reports
 */

import { useState, useEffect } from 'react';
import { HumanBody3D } from './HumanBody3D';

// Example: Fetching data from health APIs
interface HealthData {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  bloodGlucose: number;
  spo2: number;
  cognitiveScore: number;
  kidneyFunction: number;
}

export function Example3DUsage() {
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [healthData, setHealthData] = useState<HealthData | null>(null);

  // Example: Simulate fetching health data
  useEffect(() => {
    // In real app, fetch from ABHA/ABDM API or wearable devices
    const mockData: HealthData = {
      heartRate: 72,
      bloodPressure: { systolic: 120, diastolic: 80 },
      bloodGlucose: 95,
      spo2: 98,
      cognitiveScore: 85,
      kidneyFunction: 90,
    };
    setHealthData(mockData);
  }, []);

  // Example: Map health data to body part status
  const calculateStatus = (
    value: number,
    optimal: [number, number],
    attention: [number, number]
  ): 'optimal' | 'attention' | 'concern' => {
    if (value >= optimal[0] && value <= optimal[1]) return 'optimal';
    if (value >= attention[0] && value <= attention[1]) return 'attention';
    return 'concern';
  };

  // Example: Create body parts from health data
  const bodyParts = healthData
    ? [
        {
          id: 'brain',
          name: 'Brain & Cognition',
          status: calculateStatus(healthData.cognitiveScore, [80, 100], [60, 79]),
          color: 'from-purple-500 to-pink-500',
        },
        {
          id: 'heart',
          name: 'Cardiovascular',
          status: calculateStatus(healthData.heartRate, [60, 80], [50, 90]),
          color: 'from-red-500 to-pink-500',
        },
        {
          id: 'lungs',
          name: 'Respiratory',
          status: calculateStatus(healthData.spo2, [95, 100], [90, 94]),
          color: 'from-cyan-500 to-blue-500',
        },
        {
          id: 'metabolism',
          name: 'Metabolic Health',
          status: calculateStatus(healthData.bloodGlucose, [70, 100], [100, 125]),
          color: 'from-orange-500 to-red-500',
        },
        {
          id: 'kidneys',
          name: 'Renal Function',
          status: calculateStatus(healthData.kidneyFunction, [85, 100], [70, 84]),
          color: 'from-blue-500 to-cyan-500',
        },
      ]
    : [];

  // Example: Handle organ click and show detailed info
  const handleOrganClick = (organId: string) => {
    setSelectedOrgan(organId);
    console.log('User clicked on:', organId);
    
    // Example: Trigger API call to fetch detailed organ-specific data
    // fetchOrganDetails(organId);
    
    // Example: Log analytics event
    // analytics.track('organ_viewed', { organ: organId });
  };

  // Example: Get detailed info for selected organ
  const getOrganDetails = (organId: string | null) => {
    if (!organId || !healthData) return null;

    const details: Record<string, any> = {
      brain: {
        metrics: [
          { label: 'Cognitive Score', value: healthData.cognitiveScore, unit: '/100' },
        ],
        recommendations: ['Get 7-8 hours of sleep', 'Practice meditation'],
      },
      heart: {
        metrics: [
          { label: 'Heart Rate', value: healthData.heartRate, unit: 'bpm' },
          {
            label: 'Blood Pressure',
            value: `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`,
            unit: 'mmHg',
          },
        ],
        recommendations: ['Regular cardio exercise', 'Reduce sodium intake'],
      },
      lungs: {
        metrics: [{ label: 'SpO2', value: healthData.spo2, unit: '%' }],
        recommendations: ['Deep breathing exercises', 'Avoid air pollution'],
      },
      metabolism: {
        metrics: [
          { label: 'Blood Glucose', value: healthData.bloodGlucose, unit: 'mg/dL' },
        ],
        recommendations: ['Low-carb diet', 'Regular meal timing'],
      },
      kidneys: {
        metrics: [
          { label: 'Kidney Function', value: healthData.kidneyFunction, unit: '%' },
        ],
        recommendations: ['Stay hydrated', 'Limit protein intake'],
      },
    };

    return details[organId];
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-white text-2xl mb-6">3D Health Visualization Example</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 3D Body Viewer */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-white mb-4">Interactive Body Model</h2>
            <div className="h-[500px] bg-slate-950/50 rounded-lg border border-slate-800/50">
              {bodyParts.length > 0 && (
                <HumanBody3D
                  bodyParts={bodyParts}
                  selectedPart={selectedOrgan}
                  onBodyPartClick={handleOrganClick}
                  zoom={1}
                  rotation={0}
                />
              )}
            </div>
            <p className="text-slate-400 text-sm mt-3 text-center">
              Click on any organ to view detailed health metrics
            </p>
          </div>

          {/* Organ Details Panel */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-white mb-4">Organ Details</h2>
            {selectedOrgan ? (
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">
                    {bodyParts.find((p) => p.id === selectedOrgan)?.name}
                  </h3>

                  {/* Metrics */}
                  <div className="space-y-2 mb-4">
                    {getOrganDetails(selectedOrgan)?.metrics.map(
                      (metric: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex justify-between items-baseline"
                        >
                          <span className="text-slate-400 text-sm">
                            {metric.label}
                          </span>
                          <span className="text-white">
                            {metric.value} {metric.unit}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-slate-300 text-sm font-medium mb-2">
                      Recommendations
                    </h4>
                    <ul className="space-y-1">
                      {getOrganDetails(selectedOrgan)?.recommendations.map(
                        (rec: string, idx: number) => (
                          <li
                            key={idx}
                            className="text-slate-400 text-sm flex items-start gap-2"
                          >
                            <span className="text-cyan-400">•</span>
                            <span>{rec}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-center">
                <div>
                  <p className="text-slate-400">No organ selected</p>
                  <p className="text-slate-500 text-sm mt-1">
                    Click on an organ in the 3D view
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Example: Health Data Source Badges */}
        <div className="mt-6 bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-2">Data Sources</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
              ABHA Health Records
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
              Apple Watch
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
              Lab Reports
            </span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs">
              Glucose Monitor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
