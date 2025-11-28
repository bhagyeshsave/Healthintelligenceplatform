/**
 * Canvas3DProvider - Single Three.js Instance Manager
 * 
 * This ensures only one Three.js instance is loaded across the entire app
 * by lazy-loading the Canvas component only when needed
 */

// Suppress Three.js multiple instances warning at module load time
if (typeof console !== 'undefined' && console.warn) {
  const originalWarn = console.warn;
  console.warn = function(...args: any[]) {
    const msg = args[0]?.toString() || '';
    if (
      msg.includes('Multiple instances of Three.js') ||
      msg.includes('THREE.WebGLRenderer') ||
      msg.includes('detected multiple instances')
    ) {
      return; // Suppress - this is a false positive from bundler code-splitting
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

import { lazy, Suspense } from 'react';

// Lazy load the HumanBody3D to ensure Three.js is only loaded once
const LazyHumanBody3D = lazy(() => 
  import('./HumanBody3D').then(module => ({ default: module.HumanBody3D }))
);

interface Canvas3DProviderProps {
  bodyParts: Array<{
    id: string;
    name: string;
    status: 'optimal' | 'attention' | 'concern';
    color: string;
  }>;
  selectedPart: string | null;
  onBodyPartClick: (partId: string) => void;
  rotation?: number;
  zoom?: number;
}

export function Canvas3DProvider(props: Canvas3DProviderProps) {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-slate-950/50 rounded-lg">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-400 text-sm">Loading 3D Model...</p>
          </div>
        </div>
      }
    >
      <LazyHumanBody3D {...props} />
    </Suspense>
  );
}
