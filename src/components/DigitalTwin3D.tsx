import { useState, useEffect } from 'react';
import { Heart, Brain, Activity, Shield, Wind, Bone, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import bodyModel from 'figma:asset/17e853fb67534c2f2be0bd9253a18af9b671678f.png';

interface DigitalTwin3DProps {
  currentMetrics: HealthMetrics;
  simulatedMetrics: HealthMetrics;
  isSimulating: boolean;
  highlightedSystem: string | null;
  onSystemClick?: (systemKey: string) => void;
}

interface OrganZone {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  position: { top: string; left: string };
  currentValue: number;
  simulatedValue: number;
  metricKey: string; // Maps to the metric key in MetricsPanel
}

const getHealthColor = (value: number): string => {
  if (value >= 75) return 'emerald';
  if (value >= 60) return 'cyan';
  if (value >= 40) return 'yellow';
  if (value >= 25) return 'orange';
  return 'red';
};

const getModelOverlayColor = (vibeScore: number): string => {
  if (vibeScore >= 75) return 'rgba(16, 185, 129, 0.4)'; // emerald
  if (vibeScore >= 60) return 'rgba(6, 182, 212, 0.4)'; // cyan
  if (vibeScore >= 40) return 'rgba(234, 179, 8, 0.3)'; // yellow
  if (vibeScore >= 25) return 'rgba(249, 115, 22, 0.3)'; // orange
  return 'rgba(239, 68, 68, 0.3)'; // red
};

const getGlowIntensity = (vibeScore: number): number => {
  return Math.min(vibeScore / 100 * 40, 40);
};

export const DigitalTwin3D = ({ currentMetrics, simulatedMetrics, isSimulating, highlightedSystem, onSystemClick }: DigitalTwin3DProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showVibeScoreInfo, setShowVibeScoreInfo] = useState(false);

  const metrics = isSimulating ? simulatedMetrics : currentMetrics;
  const vibeScore = metrics.vibeScore;
  
  // Mock yesterday's score (in real app, this would come from historical data)
  const yesterdayVibeScore = 68;
  const dailyChange = vibeScore - yesterdayVibeScore;

  useEffect(() => {
    if (isSimulating) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 600);
      return () => clearTimeout(timer);
    }
  }, [simulatedMetrics, isSimulating]);

  const organZones: OrganZone[] = [
    { 
      id: 'brain', 
      name: 'Mental Health', 
      icon: Brain, 
      position: { top: '8%', left: '50%' },
      currentValue: currentMetrics.mental,
      simulatedValue: simulatedMetrics.mental,
      metricKey: 'mental'
    },
    { 
      id: 'heart', 
      name: 'Cardiovascular', 
      icon: Heart, 
      position: { top: '28%', left: '48%' },
      currentValue: currentMetrics.cardiovascular,
      simulatedValue: simulatedMetrics.cardiovascular,
      metricKey: 'cardiovascular'
    },
    { 
      id: 'lungs', 
      name: 'Respiratory', 
      icon: Wind, 
      position: { top: '28%', left: '52%' },
      currentValue: currentMetrics.respiratory,
      simulatedValue: simulatedMetrics.respiratory,
      metricKey: 'respiratory'
    },
    { 
      id: 'stomach', 
      name: 'Metabolic', 
      icon: Activity, 
      position: { top: '42%', left: '50%' },
      currentValue: currentMetrics.metabolic,
      simulatedValue: simulatedMetrics.metabolic,
      metricKey: 'metabolic'
    },
    { 
      id: 'immunity', 
      name: 'Immunity', 
      icon: Shield, 
      position: { top: '35%', left: '42%' },
      currentValue: currentMetrics.immunity,
      simulatedValue: simulatedMetrics.immunity,
      metricKey: 'immunity'
    },
    { 
      id: 'musculoskeletal', 
      name: 'Musculoskeletal', 
      icon: Bone, 
      position: { top: '60%', left: '50%' },
      currentValue: currentMetrics.musculoskeletal,
      simulatedValue: simulatedMetrics.musculoskeletal,
      metricKey: 'musculoskeletal'
    }
  ];

  const modelColor = getModelOverlayColor(vibeScore);
  const glowIntensity = getGlowIntensity(vibeScore);
  const healthColorName = getHealthColor(vibeScore);

  return (
    <div className="relative w-full h-full flex items-center justify-center px-4">
      {/* Simulation Active Banner - At Top */}
      {isSimulating && (
        <div className="absolute top-4 md:top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 md:gap-3 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 backdrop-blur-xl border border-indigo-500/40 rounded-2xl px-4 py-2.5 md:px-6 md:py-3 shadow-2xl z-20">
          <div className="relative flex-shrink-0">
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-indigo-400 animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-indigo-400 animate-ping" />
          </div>
          <div className="text-left">
            <div className="text-xs md:text-sm text-white font-medium">Simulation Active</div>
            <p className="text-xs text-indigo-200 hidden md:block">Your Digital Twin is responding to changes. Watch the health zones transform!</p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="relative w-full max-w-[400px] md:max-w-[500px] h-[500px] md:h-[700px]">
        {/* Glow Background Effect */}
        <div 
          className={`absolute inset-0 blur-3xl transition-all duration-1000 ${isTransitioning ? 'scale-110' : 'scale-100'}`}
          style={{
            background: `radial-gradient(ellipse at center, ${modelColor}, transparent 70%)`,
            opacity: glowIntensity / 100
          }}
        />

        {/* Ambient Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full bg-${healthColorName}-400 animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                opacity: vibeScore / 200
              }}
            />
          ))}
        </div>

        {/* Human Model Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <ImageWithFallback 
            src={bodyModel} 
            alt="Digital Health Twin"
            className={`w-full h-full object-contain transition-all duration-1000 ${isTransitioning ? 'scale-105' : 'scale-100'}`}
            style={{
              filter: `
                drop-shadow(0 0 ${glowIntensity}px ${modelColor})
                brightness(${0.9 + (vibeScore / 100) * 0.3})
                saturate(${0.9 + (vibeScore / 100) * 0.4})
              `
            }}
          />

          {/* Color Overlay based on Vibe Score */}
          <div 
            className="absolute inset-0 mix-blend-overlay transition-all duration-1000 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${modelColor}, transparent)`,
              opacity: 0.25
            }}
          />

          {/* Organ Zone Indicators */}
          {organZones.map((zone) => {
            const value = isSimulating ? zone.simulatedValue : zone.currentValue;
            const color = getHealthColor(value);
            const improved = isSimulating && zone.simulatedValue > zone.currentValue;
            const Icon = zone.icon;
            const isHighlighted = highlightedSystem === zone.metricKey;

            return (
              <div
                key={zone.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
                style={{ top: zone.position.top, left: zone.position.left }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSystemClick) {
                    onSystemClick(zone.metricKey);
                  }
                }}
              >
                {/* Pulse rings - Enhanced */}
                <div 
                  className={`absolute inset-0 w-14 h-14 md:w-20 md:h-20 -left-2 -top-2 md:-left-3 md:-top-3 rounded-2xl bg-${color}-500/30 ${isHighlighted ? 'animate-ping' : 'opacity-0 group-hover:opacity-100 group-hover:animate-ping'}`} 
                  style={{ animationDuration: isHighlighted ? '1.5s' : '2s' }} 
                />
                
                {/* Main indicator - Improved with gradient and better shadows */}
                <div 
                  className={`relative w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md border-2 
                    flex items-center justify-center cursor-pointer transition-all duration-500
                    ${isTransitioning ? 'scale-110 md:scale-125' : isHighlighted ? 'scale-110 md:scale-125' : 'scale-100'} 
                    active:scale-125 md:hover:scale-125 shadow-2xl
                    ${isHighlighted ? `border-${color}-400/80 shadow-${color}-500/50` : `border-${color}-500/40 hover:border-${color}-400/60`}`}
                  style={{
                    boxShadow: isHighlighted 
                      ? `0 0 30px rgba(var(--${color}-rgb), 0.4), 0 0 60px rgba(var(--${color}-rgb), 0.2), inset 0 0 20px rgba(0, 0, 0, 0.5)`
                      : `0 10px 25px rgba(0, 0, 0, 0.5), 0 0 ${value / 3}px rgba(var(--${color}-rgb), 0.3), inset 0 0 20px rgba(0, 0, 0, 0.3)`,
                  }}
                >
                  {/* Icon with gradient effect */}
                  <div className={`relative ${isHighlighted ? 'animate-pulse' : ''}`}>
                    <Icon className={`w-5 h-5 md:w-7 md:h-7 text-${color}-400 drop-shadow-lg`} 
                      style={{
                        filter: isHighlighted ? `drop-shadow(0 0 8px rgba(var(--${color}-rgb), 0.8))` : 'none'
                      }}
                    />
                  </div>
                  
                  {/* Value badge - Redesigned with better styling */}
                  <div 
                    className={`absolute -top-2 -right-2 md:-top-2.5 md:-right-2.5 min-w-[28px] md:min-w-[32px] h-7 md:h-8 px-1.5 rounded-xl
                      flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-500 
                      ${isHighlighted ? 'scale-110' : 'scale-100'}
                      shadow-lg border-2 border-slate-900`}
                    style={{
                      background: `linear-gradient(135deg, rgba(var(--${color}-rgb), 0.95), rgba(var(--${color}-rgb), 0.75))`,
                      boxShadow: `0 4px 12px rgba(var(--${color}-rgb), 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)`
                    }}
                  >
                    <span className="text-white drop-shadow-md">{value}</span>
                  </div>

                  {/* Improvement indicator - Enhanced */}
                  {improved && (
                    <div className="absolute -bottom-3 md:-bottom-4 left-1/2 transform -translate-x-1/2 
                      flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-2.5 md:px-3 py-1 md:py-1.5 rounded-xl text-xs md:text-sm whitespace-nowrap shadow-xl font-bold border border-emerald-300/50 animate-bounce"
                      style={{ 
                        animationDuration: '2s',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
                      }}>
                      <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      <span>+{zone.simulatedValue - zone.currentValue}</span>
                    </div>
                  )}

                  {/* Tooltip - Redesigned Desktop only */}
                  <div className="absolute bottom-full mb-3 md:mb-4 left-1/2 transform -translate-x-1/2 
                    opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 hidden md:block
                    group-hover:translate-y-[-4px]">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 rounded-2xl px-5 py-4 text-sm whitespace-nowrap shadow-2xl"
                      style={{
                        borderColor: `rgba(var(--${color}-rgb), 0.4)`,
                        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(var(--${color}-rgb), 0.2)`
                      }}>
                      <div className="text-white font-semibold mb-2">{zone.name}</div>
                      <div className={`text-${color}-400 text-2xl font-bold tracking-tight`}>{value}<span className="text-lg text-slate-500">/100</span></div>
                      {improved && (
                        <div className="text-emerald-400 text-sm mt-2 flex items-center gap-1.5 font-medium">
                          <TrendingUp className="w-4 h-4" />
                          +{zone.simulatedValue - zone.currentValue} improvement
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vibe Score Display */}
        <div className="absolute -bottom-4 md:bottom-0 left-1/2 transform -translate-x-1/2 text-center">
          <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-2 border-slate-700 rounded-2xl md:rounded-3xl px-5 py-3 md:px-8 md:py-5 shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-1 md:mb-2">
              <div className="text-xs text-slate-400 uppercase tracking-wider">
                {isSimulating ? 'Predicted Vibe Score' : 'Current Vibe Score'}
              </div>
              <button
                onClick={() => setShowVibeScoreInfo(!showVibeScoreInfo)}
                className="relative group"
              >
                <Info className="w-4 h-4 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer" />
              </button>
            </div>
            
            {/* Vibe Score Info Tooltip */}
            {showVibeScoreInfo && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-[320px] md:w-[400px] z-50">
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-500/30 rounded-2xl p-4 md:p-5 shadow-2xl text-left">
                  {/* Close button */}
                  <button
                    onClick={() => setShowVibeScoreInfo(false)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                  
                  <h4 className="text-sm font-semibold text-cyan-400 mb-3">Wearable-Driven Daily Balance Index</h4>
                  
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <div className="w-14 flex-shrink-0 text-slate-400">Sleep</div>
                      <div className="flex-1">
                        <div className="text-cyan-400 font-medium mb-0.5">30%</div>
                        <div className="text-[11px] text-slate-500">Duration, consistency, quality (deep + REM)</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="w-14 flex-shrink-0 text-slate-400">Recovery</div>
                      <div className="flex-1">
                        <div className="text-purple-400 font-medium mb-0.5">25%</div>
                        <div className="text-[11px] text-slate-500">HRV baseline, resting HR, temperature, recovery score</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="w-14 flex-shrink-0 text-slate-400">Activity</div>
                      <div className="flex-1">
                        <div className="text-emerald-400 font-medium mb-0.5">20%</div>
                        <div className="text-[11px] text-slate-500">Steps, intensity, sedentary time, VO₂ Max</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="w-14 flex-shrink-0 text-slate-400">Stress</div>
                      <div className="flex-1">
                        <div className="text-orange-400 font-medium mb-0.5">15%</div>
                        <div className="text-[11px] text-slate-500">HRV variation, EDA peaks, wearable stress score</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="w-14 flex-shrink-0 text-slate-400">Metabolic</div>
                      <div className="flex-1">
                        <div className="text-blue-400 font-medium mb-0.5">10%</div>
                        <div className="text-[11px] text-slate-500">Hydration, glucose stability, temperature deviation</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <p className="text-[11px] text-slate-500 italic">
                      All inputs convert to 0–100. Real science from wearables.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className={`text-4xl md:text-6xl text-${healthColorName}-400 transition-all duration-500 drop-shadow-lg`}>
              {vibeScore}
            </div>
            {isSimulating && currentMetrics.vibeScore !== simulatedMetrics.vibeScore && (
              <div className="mt-2 md:mt-3 flex items-center justify-center gap-2 md:gap-3">
                <div className="text-xs md:text-sm text-slate-400">from {currentMetrics.vibeScore}</div>
                <div className={`px-2 py-0.5 md:px-3 md:py-1 rounded-lg text-xs md:text-sm font-medium ${
                  simulatedMetrics.vibeScore > currentMetrics.vibeScore 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {simulatedMetrics.vibeScore > currentMetrics.vibeScore ? '+' : ''}{simulatedMetrics.vibeScore - currentMetrics.vibeScore}
                </div>
              </div>
            )}
            {/* Daily Change Indicator - Only show when NOT simulating */}
            {!isSimulating && (
              <div className="mt-2 md:mt-3 flex items-center justify-center gap-2 md:gap-3">
                <div className="text-xs md:text-sm text-slate-400">vs Yesterday</div>
                <div className={`flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 rounded-lg text-xs md:text-sm font-medium ${
                  dailyChange > 0 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : dailyChange < 0
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                }`}>
                  {dailyChange > 0 && <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                  {dailyChange < 0 && <TrendingDown className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                  <span>{dailyChange > 0 ? '+' : ''}{dailyChange}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};