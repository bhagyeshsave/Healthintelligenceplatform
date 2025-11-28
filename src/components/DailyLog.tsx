import { useState } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { AppAlert } from './ui/app-alert';
import {
  Sparkles,
  Mic,
  Send,
  Droplet,
  Activity,
  Scale,
  Heart,
  Pill,
  UtensilsCrossed,
  Dumbbell,
  Smile,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Tag,
  Zap,
  ChevronRight,
  X,
  Watch,
  Smartphone,
  Wifi,
} from 'lucide-react';

interface LogEntry {
  id: string;
  type: 'bp' | 'sugar' | 'weight' | 'heart-rate' | 'medication' | 'meal' | 'exercise' | 'symptom' | 'mood';
  content: string;
  value?: string;
  context?: string;
  tags: string[];
  timestamp: string;
  aiExtracted?: boolean;
}

const recentLogs: LogEntry[] = [
  {
    id: '1',
    type: 'sugar',
    content: 'Blood sugar fasting reading',
    value: '110 mg/dL',
    context: 'fasting',
    tags: ['morning', 'fasting'],
    timestamp: '2024-11-26T08:00:00',
    aiExtracted: true,
  },
  {
    id: '2',
    type: 'bp',
    content: 'Blood pressure reading',
    value: '128/82 mmHg',
    context: 'afternoon reading',
    tags: ['afternoon', 'post-walk'],
    timestamp: '2024-11-26T14:30:00',
    aiExtracted: true,
  },
  {
    id: '3',
    type: 'exercise',
    content: 'Walked 45 minutes',
    context: 'felt energized',
    tags: ['walking', 'cardio'],
    timestamp: '2024-11-26T06:30:00',
  },
  {
    id: '4',
    type: 'medication',
    content: 'Took Metformin 500mg',
    value: '500mg',
    context: 'with breakfast',
    tags: ['metformin', 'morning'],
    timestamp: '2024-11-26T08:15:00',
  },
  {
    id: '5',
    type: 'meal',
    content: 'Breakfast - Oats with berries',
    context: 'healthy, low-carb',
    tags: ['breakfast', 'healthy'],
    timestamp: '2024-11-26T08:30:00',
  },
];

const trendData = {
  sugar: [
    { time: 'Mon', value: 105, date: 'Nov 20' },
    { time: 'Tue', value: 108, date: 'Nov 21' },
    { time: 'Wed', value: 102, date: 'Nov 22' },
    { time: 'Thu', value: 110, date: 'Nov 23' },
    { time: 'Fri', value: 107, date: 'Nov 24' },
    { time: 'Sat', value: 112, date: 'Nov 25' },
    { time: 'Sun', value: 110, date: 'Nov 26' },
  ],
  bp: [
    { time: 'Mon', value: 122, date: 'Nov 20' },
    { time: 'Tue', value: 125, date: 'Nov 21' },
    { time: 'Wed', value: 124, date: 'Nov 22' },
    { time: 'Thu', value: 127, date: 'Nov 23' },
    { time: 'Fri', value: 126, date: 'Nov 24' },
    { time: 'Sat', value: 128, date: 'Nov 25' },
    { time: 'Sun', value: 128, date: 'Nov 26' },
  ],
  weight: [
    { time: 'Mon', value: 75.2, date: 'Nov 20' },
    { time: 'Tue', value: 75.0, date: 'Nov 21' },
    { time: 'Wed', value: 74.8, date: 'Nov 22' },
    { time: 'Thu', value: 74.9, date: 'Nov 23' },
    { time: 'Fri', value: 74.7, date: 'Nov 24' },
    { time: 'Sat', value: 74.5, date: 'Nov 25' },
    { time: 'Sun', value: 74.6, date: 'Nov 26' },
  ],
};

const lastReadingDates = {
  sugar: '2024-11-26T08:00:00',
  bp: '2024-11-26T14:30:00',
  weight: '2024-11-26T07:15:00',
};

export function DailyLog() {
  const [logInput, setLogInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiInterpretation, setAiInterpretation] = useState<{
    type: string;
    value: string;
    tags: string[];
    summary: string;
  } | null>(null);
  const [showQuickLog, setShowQuickLog] = useState<string | null>(null);
  const [quickLogInput, setQuickLogInput] = useState('');
  const [quickLogInputMode, setQuickLogInputMode] = useState<'manual' | 'voice' | null>(null);
  const [logDateTime, setLogDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [quickLogDateTime, setQuickLogDateTime] = useState(new Date().toISOString().slice(0, 16));
  
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info' | 'emergency';
  }>({ open: false, title: '', message: '', type: 'info' });

  const showAppAlert = (title: string, message: string, type: 'success' | 'warning' | 'info' | 'emergency' = 'info') => {
    setAlertDialog({ open: true, title, message, type });
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'bp':
        return Activity;
      case 'sugar':
        return Droplet;
      case 'weight':
        return Scale;
      case 'heart-rate':
        return Heart;
      case 'medication':
        return Pill;
      case 'meal':
        return UtensilsCrossed;
      case 'exercise':
        return Dumbbell;
      case 'mood':
        return Smile;
      default:
        return Activity;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'bp':
        return 'from-orange-500 to-red-500';
      case 'sugar':
        return 'from-purple-500 to-pink-500';
      case 'weight':
        return 'from-blue-500 to-cyan-500';
      case 'heart-rate':
        return 'from-rose-500 to-pink-500';
      case 'medication':
        return 'from-indigo-500 to-purple-500';
      case 'meal':
        return 'from-green-500 to-emerald-500';
      case 'exercise':
        return 'from-cyan-500 to-blue-500';
      case 'mood':
        return 'from-violet-500 to-purple-500';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Simulate voice input
    setTimeout(() => {
      setLogInput('BP 130 over 85 after my morning walk');
      setIsListening(false);
      handleAIInterpret('BP 130 over 85 after my morning walk');
    }, 2000);
  };

  const handleAIInterpret = (text: string) => {
    // Simulate AI interpretation
    setTimeout(() => {
      setAiInterpretation({
        type: 'Blood Pressure',
        value: '130/85 mmHg',
        tags: ['BP', 'morning', 'post-exercise'],
        summary: 'BP slightly elevated compared to last week. Post-exercise reading is normal.',
      });
    }, 500);
  };

  const handleSubmitLog = () => {
    if (!logInput.trim()) return;
    
    // Process the log entry
    console.log('Submitting log:', logInput);
    setLogInput('');
    setAiInterpretation(null);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
  };

  const getTrendDirection = (data: { value: number }[]) => {
    if (data.length < 2) return 'stable';
    const latest = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    const change = ((latest - previous) / previous) * 100;
    if (change > 2) return 'up';
    if (change < -2) return 'down';
    return 'stable';
  };

  const formatLastReadingDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    
    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    
    // Otherwise show date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getQuickLogTitle = (type: string) => {
    switch (type) {
      case 'sugar':
        return 'Log Blood Sugar';
      case 'bp':
        return 'Log Blood Pressure';
      case 'weight':
        return 'Log Weight';
      case 'heart':
        return 'Log Heart Rate';
      case 'medication':
        return 'Log Medication';
      case 'meal':
        return 'Log Meal';
      default:
        return 'Quick Log';
    }
  };

  const getQuickLogPlaceholder = (type: string) => {
    switch (type) {
      case 'sugar':
        return 'Enter blood sugar (e.g., 110 mg/dL or "fasting 105")';
      case 'bp':
        return 'Enter blood pressure (e.g., 120/80 or "BP 125 over 82")';
      case 'weight':
        return 'Enter weight (e.g., 75.5 kg or "75.5")';
      case 'heart':
        return 'Enter heart rate (e.g., 72 bpm or "72")';
      case 'medication':
        return 'Enter medication (e.g., "Metformin 500mg with breakfast")';
      case 'meal':
        return 'Enter meal details (e.g., "Grilled chicken salad, low carb")';
      default:
        return 'Enter details...';
    }
  };

  const handleQuickLogVoice = () => {
    setQuickLogInputMode('voice');
    setIsListening(true);
    
    // Simulate voice input based on quick log type
    setTimeout(() => {
      let voiceInput = '';
      switch (showQuickLog) {
        case 'sugar':
          voiceInput = 'Blood sugar 112 fasting';
          break;
        case 'bp':
          voiceInput = 'BP 130 over 82';
          break;
        case 'weight':
          voiceInput = 'Weight 74.8 kg';
          break;
        case 'heart':
          voiceInput = 'Heart rate 75 bpm';
          break;
        case 'medication':
          voiceInput = 'Took aspirin 100mg';
          break;
        case 'meal':
          voiceInput = 'Had oatmeal with berries for breakfast';
          break;
      }
      setQuickLogInput(voiceInput);
      setIsListening(false);
    }, 2000);
  };

  const handleQuickLogSubmit = () => {
    if (!quickLogInput.trim()) return;
    
    console.log('Quick log submitted:', { type: showQuickLog, value: quickLogInput });
    
    // Reset
    setQuickLogInput('');
    setShowQuickLog(null);
    setQuickLogInputMode(null);
    
    showAppAlert('Log Saved', `${getQuickLogTitle(showQuickLog || '')} saved successfully!`, 'success');
  };

  // Custom Tooltip Components
  const CustomTooltip = ({ active, payload, unit, color }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-white text-base" style={{ color }}>{payload[0].value}</span>
            <span className="text-slate-400 text-xs">{unit}</span>
          </div>
          <div className="text-slate-500 text-xs mt-1">{payload[0].payload.date}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-8">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="px-4 md:px-6 py-3 md:py-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-white mb-0.5">Daily Health Log</h1>
            <p className="text-slate-400 text-sm">AI-powered health tracking</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-4 space-y-4">
        {/* Smart AI Log Box - Compact */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white text-sm font-medium">Quick Log</h3>
              <p className="text-slate-500 text-xs">Type or speak naturally</p>
            </div>
          </div>

          <div className="relative">
            <Textarea
              value={logInput}
              onChange={(e) => {
                setLogInput(e.target.value);
                if (e.target.value.length > 5) {
                  handleAIInterpret(e.target.value);
                } else {
                  setAiInterpretation(null);
                }
              }}
              placeholder="e.g., BP 130/85, sugar 110, walked 30 mins..."
              className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 min-h-[80px] text-sm resize-none pr-12"
            />
            
            {/* Voice Input Button */}
            <button
              onClick={handleVoiceInput}
              className={`absolute bottom-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-gradient-to-r from-red-500 to-rose-500 animate-pulse'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              }`}
            >
              <Mic className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* AI Interpretation Panel */}
          {aiInterpretation && (
            <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-purple-300 text-xs font-medium">AI Detected:</span>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                      {aiInterpretation.type}
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                      {aiInterpretation.value}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-xs">{aiInterpretation.summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* Date & Time - Compact */}
          <div className="mt-3 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <input
              type="datetime-local"
              value={logDateTime}
              onChange={(e) => setLogDateTime(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-cyan-500/50"
            />
            <Button
              onClick={handleSubmitLog}
              disabled={!logInput.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1.5 h-auto text-sm"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Log
            </Button>
          </div>
        </div>

        {/* Quick Log Buttons - Simplified */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-white text-sm font-medium">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { id: 'sugar', icon: Droplet, label: 'Sugar', color: 'from-purple-500 to-pink-500' },
              { id: 'bp', icon: Activity, label: 'BP', color: 'from-orange-500 to-red-500' },
              { id: 'weight', icon: Scale, label: 'Weight', color: 'from-blue-500 to-cyan-500' },
              { id: 'heart', icon: Heart, label: 'Heart', color: 'from-rose-500 to-pink-500' },
              { id: 'medication', icon: Pill, label: 'Meds', color: 'from-indigo-500 to-purple-500' },
              { id: 'meal', icon: UtensilsCrossed, label: 'Meal', color: 'from-green-500 to-emerald-500' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setShowQuickLog(item.id)}
                  className="flex flex-col items-center gap-1.5 p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition-all group"
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-400 text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Device Connection CTA - Compact */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-medium">Automate Logging</h3>
                <p className="text-cyan-300/80 text-xs">Connect wearables & devices for auto-sync</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm px-4 py-2 h-auto whitespace-nowrap flex-shrink-0">
              Connect
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Trend Summary Widget - Compact */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <h3 className="text-white text-sm font-medium">Top Metrics (7 days)</h3>
            </div>
            <button className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1">
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {/* Blood Sugar - Compact */}
            <div className="bg-slate-900 border border-purple-500/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Droplet className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-slate-300 text-xs font-medium">Blood Sugar</span>
                </div>
                {getTrendDirection(trendData.sugar) === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
                ) : getTrendDirection(trendData.sugar) === 'down' ? (
                  <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-slate-500" />
                )}
              </div>
              
              <div className="mb-2">
                <div className="text-2xl font-bold text-white">110</div>
                <div className="text-xs text-slate-500">mg/dL • {formatLastReadingDate(lastReadingDates.sugar)}</div>
              </div>

              <div className="space-y-1">
                <div className="h-16 w-full" style={{ minHeight: '64px' }}>
                  <ResponsiveContainer width="100%" height={64}>
                    <LineChart data={trendData.sugar} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#a855f7"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                      <Tooltip content={<CustomTooltip unit="mg/dL" color="#a855f7" />} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex justify-between items-center pt-1 border-t border-purple-500/10">
                  <span className="text-xs text-purple-300">Avg: 108</span>
                  <span className="text-xs text-slate-600">7d trend</span>
                </div>
              </div>
            </div>

            {/* Blood Pressure - Compact */}
            <div className="bg-slate-900 border border-orange-500/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Activity className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-slate-300 text-xs font-medium">Blood Pressure</span>
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
              </div>
              
              <div className="mb-2">
                <div className="text-2xl font-bold text-white">128/82</div>
                <div className="text-xs text-slate-500">mmHg • {formatLastReadingDate(lastReadingDates.bp)}</div>
              </div>

              <div className="space-y-1">
                <div className="h-16 w-full" style={{ minHeight: '64px' }}>
                  <ResponsiveContainer width="100%" height={64}>
                    <LineChart data={trendData.bp} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                      <Tooltip content={<CustomTooltip unit="mmHg" color="#f97316" />} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex justify-between items-center pt-1 border-t border-orange-500/10">
                  <span className="text-xs text-orange-300">Avg: 126/81</span>
                  <span className="text-xs text-slate-600">7d trend</span>
                </div>
              </div>
            </div>

            {/* Weight - Compact */}
            <div className="bg-slate-900 border border-blue-500/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Scale className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-slate-300 text-xs font-medium">Weight</span>
                </div>
                <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              
              <div className="mb-2">
                <div className="text-2xl font-bold text-white">74.6</div>
                <div className="text-xs text-slate-500">kg • {formatLastReadingDate(lastReadingDates.weight)}</div>
              </div>

              <div className="space-y-1">
                <div className="h-16 w-full" style={{ minHeight: '64px' }}>
                  <ResponsiveContainer width="100%" height={64}>
                    <LineChart data={trendData.weight} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                      <Tooltip content={<CustomTooltip unit="kg" color="#06b6d4" />} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex justify-between items-center pt-1 border-t border-cyan-500/10">
                  <span className="text-xs text-cyan-300">Avg: 74.8 kg</span>
                  <span className="text-xs text-slate-600">7d trend</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Logs Timeline - Compact */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-white text-sm font-medium">Recent Logs</h3>
          </div>

          <div className="space-y-2">
            {recentLogs.map((log) => {
              const Icon = getLogIcon(log.type);
              const colorClass = getLogColor(log.type);

              return (
                <div
                  key={log.id}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-0.5 flex-wrap">
                        {log.value && (
                          <span className="text-white font-medium text-sm">{log.value}</span>
                        )}
                        {log.aiExtracted && (
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs px-1.5 py-0">
                            <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                            AI
                          </Badge>
                        )}
                        <span className="text-slate-500 text-xs ml-auto">{formatTimestamp(log.timestamp)}</span>
                      </div>
                      
                      <p className="text-slate-400 text-xs mb-1">{log.content}</p>
                      
                      {log.context && (
                        <p className="text-slate-600 text-xs mb-1">{log.context}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-1">
                        {log.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 bg-slate-800/50 text-slate-500 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Log Modal */}
      {showQuickLog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-slate-900 border-t md:border border-slate-700 rounded-t-3xl md:rounded-2xl w-full md:max-w-lg md:w-full max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700/50 p-6 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getLogColor(showQuickLog)} flex items-center justify-center`}>
                    {(() => {
                      const Icon = getLogIcon(showQuickLog);
                      return <Icon className="w-5 h-5 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold">{getQuickLogTitle(showQuickLog)}</h3>
                    <p className="text-slate-400 text-xs">Choose input method</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowQuickLog(null);
                    setQuickLogInput('');
                    setQuickLogInputMode(null);
                  }}
                  className="text-slate-400 hover:text-white transition-colors p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Input Mode Selection or Input Field */}
              {!quickLogInputMode ? (
                <div className="space-y-3">
                  <p className="text-slate-400 text-sm mb-4">How would you like to log this data?</p>
                  
                  {/* Manual Entry Button */}
                  <button
                    onClick={() => setQuickLogInputMode('manual')}
                    className="w-full flex items-center gap-4 p-4 bg-slate-800/50 hover:bg-slate-700/50 border-2 border-slate-700/50 hover:border-cyan-500/50 rounded-xl transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Send className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-white font-medium mb-1">Manual Entry</div>
                      <div className="text-slate-400 text-xs">Type the data manually</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </button>

                  {/* Voice Input Button */}
                  <button
                    onClick={handleQuickLogVoice}
                    className="w-full flex items-center gap-4 p-4 bg-slate-800/50 hover:bg-slate-700/50 border-2 border-slate-700/50 hover:border-purple-500/50 rounded-xl transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mic className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-white font-medium mb-1">Voice Input</div>
                      <div className="text-slate-400 text-xs">Speak naturally to log</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Input Mode Indicator */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {quickLogInputMode === 'manual' ? (
                        <Send className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Mic className="w-4 h-4 text-purple-400" />
                      )}
                      <span className="text-slate-400 text-sm">
                        {quickLogInputMode === 'manual' ? 'Manual Entry' : 'Voice Input'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setQuickLogInputMode(null);
                        setQuickLogInput('');
                      }}
                      className="text-cyan-400 hover:text-cyan-300 text-xs"
                    >
                      Change Method
                    </button>
                  </div>

                  {/* Voice Listening Indicator */}
                  {isListening && quickLogInputMode === 'voice' && (
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center animate-pulse">
                          <Mic className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Listening...</p>
                          <p className="text-purple-300 text-xs">Speak now</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Input Field */}
                  <div>
                    <Textarea
                      value={quickLogInput}
                      onChange={(e) => setQuickLogInput(e.target.value)}
                      placeholder={getQuickLogPlaceholder(showQuickLog)}
                      className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 min-h-[100px] text-base resize-none"
                      autoFocus={quickLogInputMode === 'manual'}
                      disabled={isListening}
                    />
                  </div>

                  {/* Date & Time Picker */}
                  <div className="flex items-center gap-3 p-3 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                    <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <div className="flex-1">
                      <label className="text-slate-400 text-xs mb-1 block">When?</label>
                      <input
                        type="datetime-local"
                        value={quickLogDateTime}
                        onChange={(e) => setQuickLogDateTime(e.target.value)}
                        className="bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setShowQuickLog(null);
                        setQuickLogInput('');
                        setQuickLogInputMode(null);
                      }}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleQuickLogSubmit}
                      disabled={!quickLogInput.trim() || isListening}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Save Log
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AppAlert
        open={alertDialog.open}
        onClose={() => setAlertDialog(prev => ({ ...prev, open: false }))}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
      />
    </div>
  );
}