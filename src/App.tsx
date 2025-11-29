// Suppress Three.js warning BEFORE any imports
if (typeof console !== 'undefined' && console.warn) {
  const originalWarn = console.warn;
  console.warn = function(...args: any[]) {
    const msg = args[0]?.toString() || '';
    if (msg.includes('Multiple instances of Three.js') || msg.includes('THREE.WebGLRenderer')) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

// Provide proper __THREE_DEVTOOLS__ mock to prevent dispatchEvent errors
if (typeof window !== 'undefined' && !(window as any).__THREE_DEVTOOLS__) {
  (window as any).__THREE_DEVTOOLS__ = {
    dispatchEvent: () => {},
    addEventListener: () => {},
    removeEventListener: () => {}
  };
}

import { useState } from 'react';
import { HealthRecords } from './components/HealthRecords';
import { UserProfile } from './components/UserProfile';
import { Routines } from './components/Routines';
import { DigitalTwinV2 } from './components/DigitalTwinV2';
import { FloatingAIChat } from './components/FloatingAIChat';
import { Activity, FileText, User, Repeat, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'twin-v2' | 'records' | 'routines' | 'profile'>('twin-v2');

  const tabs = [
    { id: 'twin-v2', label: 'Digital Twin', icon: Sparkles },
    { id: 'records', label: 'Health Records', icon: FileText },
    { id: 'routines', label: 'Routines', icon: Repeat },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Top Navigation */}
      <nav className="border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="px-4 md:px-8">
          <div className="flex items-center justify-between max-w-[1800px] mx-auto py-3">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Activity className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white text-lg md:text-xl font-semibold">Thryve</h1>
                <p className="text-slate-400 text-xs">Digital Health Twin</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 md:gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-700/50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-3 md:px-6 py-2 md:py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Spacer for balance */}
            <div className="w-10 md:w-12" />
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative">
        {activeTab === 'twin-v2' && <DigitalTwinV2 />}
        {activeTab === 'records' && <HealthRecords />}
        {activeTab === 'routines' && <Routines />}
        {activeTab === 'profile' && <UserProfile />}
      </div>

      {/* Floating AI Chat - Available on all pages */}
      <FloatingAIChat />
    </div>
  );
}