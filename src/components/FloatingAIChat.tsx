import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your Thryve Health Twin Assistant. I can help you understand your health data, explain biological age calculations, suggest lifestyle improvements, and answer questions about your health records. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Biological age questions
    if (lowerInput.includes('biological age') || lowerInput.includes('bio age')) {
      return "Your biological age is calculated using multiple biomarkers including cardiovascular health (HRV, BP), metabolic markers (glucose, cholesterol), lifestyle factors (sleep, exercise, stress), and epigenetic indicators. Your current biological age of 37.5 years vs chronological age of 36 suggests moderate lifestyle optimization opportunities. Would you like specific recommendations?";
    }
    
    // Sleep questions
    if (lowerInput.includes('sleep')) {
      return "Your current sleep pattern shows 6 hours average duration. Research shows optimal biological age requires 7-8 hours consistently. Improving your sleep by 1-2 hours could reduce biological age by ~1.8-2.4 years. Try maintaining a consistent 10pm-6am schedule and tracking sleep cycles with your wearable device.";
    }
    
    // Exercise questions
    if (lowerInput.includes('exercise') || lowerInput.includes('workout')) {
      return "You're currently at 2x/week exercise frequency. Studies show that increasing to 5x/week (WHO guidelines: 150+ min/week) can reduce biological age by ~2.6 years. Consider adding 30-minute cardio sessions on alternating days, combined with 2x/week strength training.";
    }
    
    // Stress questions
    if (lowerInput.includes('stress')) {
      return "Chronic stress accelerates biological aging through cortisol elevation and inflammation. Your current stress management shows room for improvement. Daily meditation (15-20 min) or mindfulness practices can reduce biological age by ~1.2-1.8 years. The What-If Simulator can show you the exact impact!";
    }
    
    // Heart health
    if (lowerInput.includes('heart') || lowerInput.includes('cardio') || lowerInput.includes('hrv')) {
      return "Your cardiovascular health metrics are key aging indicators. HRV (Heart Rate Variability) above 50ms, resting heart rate <60 bpm, and BP <120/80 are optimal. Current metrics suggest fair cardiovascular health. Regular aerobic exercise and stress reduction can improve these markers within 8-12 weeks.";
    }
    
    // Diet/nutrition
    if (lowerInput.includes('diet') || lowerInput.includes('nutrition') || lowerInput.includes('food')) {
      return "Nutrition quality significantly impacts biological age. Mediterranean-style diet (80%+ whole foods, omega-3 rich fish, leafy greens, limited processed foods) can reduce biological age by ~2.2-2.8 years. Focus on nutrient density over calorie counting. Need specific meal suggestions?";
    }
    
    // Health records
    if (lowerInput.includes('record') || lowerInput.includes('report') || lowerInput.includes('abha')) {
      return "You can access all your health records in Tab 3 (Health Records). This includes ABHA/ABDM integrated data, lab reports, prescriptions, and daily health logs. All records show data source badges for transparency. Would you like help interpreting any specific report?";
    }
    
    // What-if simulation
    if (lowerInput.includes('what if') || lowerInput.includes('simulation') || lowerInput.includes('scenario')) {
      return "The What-If Lifestyle Simulation in Tab 2 lets you see how lifestyle changes affect your biological age. You can adjust 8 factors (exercise, diet, sleep, stress, smoking, alcohol, activity, heart health) and see real-time projections. Try the preset scenarios: Worst Habits, My Baseline, Healthy Target, or Peak Performance!";
    }
    
    // Digital twin
    if (lowerInput.includes('twin') || lowerInput.includes('3d') || lowerInput.includes('body')) {
      return "Your Digital Health Twin visualizes your body systems with color-coded health states. Red = attention needed, Yellow = fair, Green = optimal. Click any body part for detailed insights, biomarkers, and AI recommendations. The twin integrates data from wearables, labs, and ABDM records for comprehensive health intelligence.";
    }
    
    // Premium/upgrade
    if (lowerInput.includes('premium') || lowerInput.includes('upgrade') || lowerInput.includes('subscription')) {
      return "Thryve Premium unlocks: Advanced biomarker analysis, Personalized meal plans, Priority health alerts, Genetic health insights, Extended health history, Family health sharing, and Dedicated health coach access. Check Tab 5 (Profile) for upgrade options and current plan details.";
    }
    
    // Default helpful response
    return "I can help you with:\n\n🧬 Biological age calculations & optimization\n💪 Exercise & lifestyle recommendations\n😴 Sleep quality improvement\n🫀 Cardiovascular health insights\n📊 Health records interpretation\n🔮 What-If scenario analysis\n🎯 Personalized health goals\n\nWhat specific area would you like to explore?";
  };

  const quickActions = [
    { label: "Explain my bio age", query: "What affects my biological age?" },
    { label: "Improve sleep", query: "How can I improve my sleep?" },
    { label: "Exercise plan", query: "What's the best exercise routine for me?" },
    { label: "Reduce stress", query: "How do I reduce stress?" }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 group"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse border-2 border-slate-950" />
      </button>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isMinimized 
        ? 'bottom-6 right-6 w-80 h-16' 
        : 'bottom-6 right-6 w-[380px] h-[600px]'
    }`}>
      {/* Chat Container */}
      <div className="w-full h-full bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Thryve AI Assistant</div>
              <div className="text-white/70 text-xs flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Always here to help
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white'
                      : 'bg-slate-800 text-slate-100 border border-slate-700/50'
                  } rounded-2xl px-4 py-3`}>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span className="text-purple-400 text-xs font-medium">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                    <div className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-white/60' : 'text-slate-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700/50 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span className="text-purple-400 text-xs font-medium">AI Assistant</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 py-3 bg-slate-900/50 border-t border-slate-700/50">
                <div className="text-slate-400 text-xs mb-2">Quick actions:</div>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputValue(action.query);
                        inputRef.current?.focus();
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-xs text-slate-300 transition-colors"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-slate-900 border-t border-slate-700/50">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything about your health..."
                  className="flex-1 bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
