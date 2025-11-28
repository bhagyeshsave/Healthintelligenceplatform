import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Activity, Heart, Droplet, TrendingUp, TrendingDown, Minus, Brain, Zap, Info, MessageSquare, Calendar, ArrowRight, Target } from "lucide-react";
import { useState } from "react";
import bodyImageMale from 'figma:asset/4607e552c950880fc507ceab20afe99b18ec43ae.png';

type BodyRegion = "head" | "heart" | "liver" | "kidneys" | "joints" | null;

export function HealthTwin() {
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion>(null);
  const [showBodyAgeInfo, setShowBodyAgeInfo] = useState(false);
  const [showVibeScoreInfo, setShowVibeScoreInfo] = useState(false);
  
  const vibeScore = 78; // Renamed from healthScore
  const bodyAge = 32;
  const actualAge = 35;

  // Determine vibe state based on score
  const getVibeState = (score: number) => {
    if (score >= 75) return {
      level: "high",
      color: "from-teal-400 to-cyan-400",
      message: "Great vibe today — your body is in balance ✨",
      glow: "shadow-teal-400/50"
    };
    if (score >= 50) return {
      level: "medium",
      color: "from-purple-400 to-indigo-400",
      message: "Your vibe is okay — one small step improves it.",
      glow: "shadow-purple-400/50"
    };
    return {
      level: "low",
      color: "from-gray-400 to-slate-400",
      message: "Your body needs rest today — let's ease up.",
      glow: "shadow-gray-400/50"
    };
  };

  const vibeState = getVibeState(vibeScore);

  const metrics = [
    { 
      label: "Blood Glucose", 
      value: "110 mg/dL", 
      normalRange: "70-100 mg/dL",
      status: "monitor", 
      trend: "up", 
      icon: Droplet, 
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      lastChecked: "Nov 20, 2024",
      relatedRegion: "liver",
      riskCategory: "Pre-diabetes risk"
    },
    { 
      label: "Blood Pressure", 
      value: "128/82 mmHg", 
      normalRange: "90-120/60-80 mmHg",
      status: "monitor", 
      trend: "up", 
      icon: Heart, 
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      lastChecked: "Nov 22, 2024",
      relatedRegion: "heart",
      riskCategory: "Cardiovascular health"
    },
    { 
      label: "Heart Rate", 
      value: "72 bpm", 
      normalRange: "60-100 bpm",
      status: "good", 
      trend: "stable", 
      icon: Activity, 
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      lastChecked: "Nov 23, 2024",
      relatedRegion: "heart",
      riskCategory: "Cardiovascular fitness"
    },
    { 
      label: "BMI", 
      value: "26.4", 
      normalRange: "18.5-24.9",
      status: "monitor", 
      trend: "up", 
      icon: TrendingUp, 
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      lastChecked: "Nov 18, 2024",
      relatedRegion: "joints",
      riskCategory: "Weight management"
    },
    { 
      label: "Daily Steps", 
      value: "7,432", 
      normalRange: "7,000-10,000",
      status: "good", 
      trend: "up", 
      icon: Zap, 
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      lastChecked: "Today, 6:30 PM",
      relatedRegion: "joints",
      riskCategory: "Activity level"
    },
    { 
      label: "Sleep Quality", 
      value: "7.2 hrs", 
      normalRange: "7-9 hrs",
      status: "good", 
      trend: "stable", 
      icon: Brain, 
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      lastChecked: "Today, 7:00 AM",
      relatedRegion: "head",
      riskCategory: "Sleep health"
    },
  ];

  const bodyRegions = {
    head: { 
      name: "Brain & Sleep", 
      status: "good", 
      metrics: ["Sleep Quality", "Mental Wellness"],
      color: "#10B981",
      position: { top: "12%", left: "50%" }
    },
    heart: { 
      name: "Cardiovascular", 
      status: "monitor", 
      metrics: ["Blood Pressure", "Heart Rate", "Cholesterol"],
      color: "#F59E0B",
      position: { top: "32%", left: "42%" }
    },
    liver: { 
      name: "Metabolic Health", 
      status: "monitor", 
      metrics: ["Blood Glucose", "Liver Function"],
      color: "#F59E0B",
      position: { top: "42%", left: "58%" }
    },
    kidneys: { 
      name: "Kidney Function", 
      status: "good", 
      metrics: ["Creatinine", "GFR"],
      color: "#10B981",
      position: { top: "50%", left: "35%" }
    },
    joints: { 
      name: "Musculoskeletal", 
      status: "monitor", 
      metrics: ["BMI", "Joint Health", "Daily Activity"],
      color: "#F59E0B",
      position: { top: "78%", left: "48%" }
    },
  };

  return (
    <div className="space-y-6">
      {/* Hero Card - Health Score & Body Age */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 flex-wrap">
                <span>Your Digital Health Twin</span>
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                  Live
                </Badge>
              </CardTitle>
              <CardDescription>
                Interactive health overview • Click on health indicators to explore
              </CardDescription>
            </div>
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chat with AI Assistant</span>
              <span className="sm:hidden">AI Chat</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Interactive Body Visualization */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-[240px] sm:w-[280px] h-[360px] sm:h-[420px]">
                {/* Vibe Glow Effect */}
                <div 
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${vibeState.color} opacity-20 blur-3xl animate-pulse`}
                  style={{ 
                    transform: 'scale(0.9)',
                    filter: 'blur(40px)'
                  }}
                />
                
                {/* Body Silhouette Image */}
                <img 
                  src={bodyImageMale} 
                  alt="Body silhouette"
                  className={`relative w-full h-full object-contain transition-all duration-500 ${
                    vibeState.level === "high" ? "drop-shadow-2xl" : 
                    vibeState.level === "medium" ? "drop-shadow-lg" : 
                    "drop-shadow-md opacity-90"
                  }`}
                  style={{ 
                    filter: vibeState.level === "high" ? 'brightness(1.05)' : 
                            vibeState.level === "medium" ? 'brightness(1)' : 
                            'brightness(0.95)' 
                  }}
                />
                
                {/* Colored Health Indicator Bubbles */}
                {Object.entries(bodyRegions).map(([key, region]) => (
                  <div
                    key={key}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{ 
                      top: region.position.top, 
                      left: region.position.left 
                    }}
                    onClick={() => setSelectedRegion(key as BodyRegion)}
                  >
                    {/* Outer pulse ring on hover */}
                    <div 
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity animate-ping"
                      style={{ 
                        backgroundColor: region.color,
                        width: '48px',
                        height: '48px',
                        marginLeft: '-12px',
                        marginTop: '-12px'
                      }}
                    />
                    
                    {/* Main bubble */}
                    <div 
                      className={`w-6 h-6 rounded-full border-3 border-white shadow-lg transition-all ${
                        selectedRegion === key ? 'scale-125 ring-4 ring-purple-300' : 'group-hover:scale-110'
                      }`}
                      style={{ backgroundColor: region.color }}
                    >
                      {/* Inner dot for selected state */}
                      {selectedRegion === key && (
                        <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">Click on health indicators</p>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600">Healthy</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-gray-600">Monitor</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs text-gray-600">Attention Needed</span>
                  </div>
                </div>
              </div>
              
              {/* Selected region info card */}
              {selectedRegion && (
                <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-purple-200 w-full max-w-[280px] animate-in slide-in-from-bottom duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: bodyRegions[selectedRegion].color }}
                    />
                    <p className="text-sm text-gray-900">{bodyRegions[selectedRegion].name}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`mb-3 ${bodyRegions[selectedRegion].status === "good" ? "text-green-700 border-green-600" : "text-amber-700 border-amber-600"}`}
                  >
                    {bodyRegions[selectedRegion].status === "good" ? "All Good" : "Keep Monitoring"}
                  </Badge>
                  <p className="text-xs text-gray-600 mb-2">Monitors:</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    {bodyRegions[selectedRegion].metrics.map((metric, idx) => (
                      <li key={idx}>• {metric}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Health Scores */}
            <div className="space-y-6">
              {/* Vibe Score */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Vibe Score</span>
                    <Dialog open={showVibeScoreInfo} onOpenChange={setShowVibeScoreInfo}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 rounded-full">
                          <Info className="w-4 h-4 text-gray-500" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>What is Vibe Score?</DialogTitle>
                          <DialogDescription className="space-y-3 pt-2">
                            <p>
                              Vibe Score reflects how balanced your body feels today, based on your inputs, data, and recent patterns.
                            </p>
                            <p className="text-sm">
                              <strong className="text-gray-900">What influences your Vibe Score:</strong>
                            </p>
                            <ul className="text-sm space-y-1 list-disc list-inside">
                              <li><strong>25%</strong> Sleep Balance - quality and duration</li>
                              <li><strong>20%</strong> Stress Balance - HRV and resting heart rate</li>
                              <li><strong>15%</strong> Activity Balance - movement and exercise</li>
                              <li><strong>15%</strong> Mood Signal - how you're feeling</li>
                              <li><strong>10%</strong> Metabolic Smoothness - BP and glucose trends</li>
                              <li><strong>10%</strong> Hydration Balance</li>
                              <li><strong>5%</strong> Environment - AQI and external factors</li>
                            </ul>
                            <p className="text-sm text-gray-600">
                              <strong>Note:</strong> Vibe Score doesn't diagnose or predict disease. It simply reflects your body's balance today.
                            </p>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <span className="text-3xl text-gray-900">{vibeScore}</span>
                </div>
                <div className="relative">
                  <Progress value={vibeScore} className={`h-3`} />
                  <div 
                    className={`absolute top-0 left-0 h-3 bg-gradient-to-r ${vibeState.color} rounded-full transition-all duration-500`}
                    style={{ width: `${vibeScore}%` }}
                  />
                </div>
                <div className="flex items-start gap-2">
                  <p className="text-sm text-gray-700 flex-1">
                    {vibeState.message}
                  </p>
                </div>
              </div>

              {/* Vibe Boosters */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Vibe Boosters</span>
                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                    Quick Wins
                  </Badge>
                </div>
                <div className="space-y-2">
                  <button className="w-full p-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-lg border border-blue-200 text-left transition-all hover:shadow-md group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-900">Drink 1 glass of water</span>
                      </div>
                      <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">+2 pts</span>
                    </div>
                  </button>
                  
                  <button className="w-full p-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg border border-green-200 text-left transition-all hover:shadow-md group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-900">Walk for 2 minutes</span>
                      </div>
                      <span className="text-xs text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">+3 pts</span>
                    </div>
                  </button>
                  
                  <button className="w-full p-3 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-lg border border-amber-200 text-left transition-all hover:shadow-md group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="5" />
                          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>
                        <span className="text-sm text-gray-900">Go outside for 5 min sunlight</span>
                      </div>
                      <span className="text-xs text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">+2 pts</span>
                    </div>
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center">Small actions boost your vibe score throughout the day</p>
              </div>

              {/* Body Age with info dialog */}
              <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Body Age</span>
                    <Dialog open={showBodyAgeInfo} onOpenChange={setShowBodyAgeInfo}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 rounded-full">
                          <Info className="w-4 h-4 text-gray-500" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>How is Body Age Calculated?</DialogTitle>
                          <DialogDescription className="space-y-3 pt-2">
                            <p>
                              Your body age is an estimate of your biological age based on multiple health markers, compared to the average person of your chronological age.
                            </p>
                            <p className="text-sm">
                              <strong className="text-gray-900">Factors considered:</strong>
                            </p>
                            <ul className="text-sm space-y-1 list-disc list-inside">
                              <li>Cardiovascular health (BP, heart rate, cholesterol)</li>
                              <li>Metabolic markers (glucose, BMI, HbA1c)</li>
                              <li>Physical activity levels</li>
                              <li>Sleep quality and duration</li>
                              <li>Overall fitness indicators</li>
                            </ul>
                            <p className="text-sm">
                              A body age younger than your actual age suggests your health markers are better than average for your age group. Keep up the good work!
                            </p>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Badge className="bg-purple-600">
                    {bodyAge < actualAge ? `${actualAge - bodyAge} years younger!` : bodyAge > actualAge ? "Needs improvement" : "On track"}
                  </Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl text-gray-900">{bodyAge} years</span>
                  <span className="text-sm text-gray-600">vs actual {actualAge}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {bodyAge < actualAge 
                    ? `Great job! Your body is ${actualAge - bodyAge} years younger than your actual age 🎉`
                    : "Let's work on improving your health markers together."
                  }
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="text-gray-900">78 kg</p>
                  <p className="text-xs text-gray-500">Updated Nov 18</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Height</p>
                  <p className="text-gray-900">175 cm</p>
                  <p className="text-xs text-gray-500">From profile</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Last Lab Tests</p>
                  <p className="text-gray-900">5 days ago</p>
                  <p className="text-xs text-gray-500">Nov 18, 2024</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Overall Risk</p>
                  <p className="text-amber-600">Low-Medium</p>
                  <p className="text-xs text-gray-500">for chronic disease</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Health Metrics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Key Health Metrics</h3>
          <Button variant="outline" size="sm" className="gap-2">
            View All Trends
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const TrendIcon = 
              metric.trend === "up" ? TrendingUp : 
              metric.trend === "down" ? TrendingDown : 
              Minus;
            
            return (
              <Card 
                key={index} 
                className={`${metric.status === "monitor" ? "border-2 " + metric.borderColor + " " + metric.bgColor : "border-gray-200"} hover:shadow-md transition-all cursor-pointer`}
                onClick={() => {
                  if (metric.relatedRegion) {
                    setSelectedRegion(metric.relatedRegion as BodyRegion);
                  }
                }}
              >
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${metric.color}`} />
                        <p className="text-sm text-gray-600">{metric.label}</p>
                      </div>
                      <TrendIcon className={`w-4 h-4 ${
                        metric.trend === "up" && metric.status === "monitor" ? "text-amber-600" :
                        metric.trend === "up" ? "text-green-600" :
                        metric.trend === "down" ? "text-red-600" :
                        "text-gray-400"
                      }`} />
                    </div>
                    
                    <div>
                      <p className="text-xl text-gray-900 mb-1">{metric.value}</p>
                      <p className="text-xs text-gray-500">Normal: {metric.normalRange}</p>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {metric.lastChecked}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {metric.riskCategory}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Health Insights</CardTitle>
              <CardDescription>Personalized recommendations based on your data patterns</CardDescription>
            </div>
            <Button variant="outline" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Ask AI
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-2">Your glucose levels show an upward trend over the past 2 weeks. This could be an early sign of insulin resistance.</p>
              <p className="text-xs text-gray-600 mb-2">Based on 8 glucose readings from Nov 8-22</p>
              <Button variant="outline" size="sm" className="gap-2">
                <Target className="w-3 h-3" />
                Create Action Plan
              </Button>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-2">Excellent! Your consistent 7+ hour sleep pattern is linked to better recovery and lower inflammation markers.</p>
              <p className="text-xs text-gray-600">Based on 30 days of sleep data from your Fitbit</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="w-2 h-2 bg-amber-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-2">Your blood pressure readings show mild elevation (avg 128/82). Consider stress management and reducing sodium intake.</p>
              <p className="text-xs text-gray-600 mb-2">Based on 5 BP readings from Nov 15-22</p>
              <Button variant="outline" size="sm" className="gap-2">
                <Info className="w-3 h-3" />
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}