import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Activity, Check, X, RefreshCw, AlertCircle, Heart, Footprints, Moon, Zap, Calendar } from 'lucide-react';

interface GoogleFitData {
  steps: number;
  heartRate: number;
  calories: number;
  distance: number;
  activeMinutes: number;
  sleep: {
    duration: number;
    quality: string;
  };
  lastSync: string;
}

interface GoogleFitIntegrationProps {
  onConnectionChange?: (isConnected: boolean) => void;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_FIT_CLIENT_ID || '';
const REDIRECT_URI = typeof window !== 'undefined' ? window.location.origin : '';
const SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
  'https://www.googleapis.com/auth/fitness.location.read',
].join(' ');

export function GoogleFitIntegration({ onConnectionChange }: GoogleFitIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [googleFitData, setGoogleFitData] = useState<GoogleFitData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchGoogleFitData = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://ombjteysx3.execute-api.us-east-1.amazonaws.com/prod/fetch',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Token expired or invalid. Please reconnect.');
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const transformedData: GoogleFitData = {
        steps: data.steps || 0,
        heartRate: data.heartRate || data.heart_rate || 0,
        calories: data.calories || 0,
        distance: data.distance || 0,
        activeMinutes: data.activeMinutes || data.active_minutes || 0,
        sleep: {
          duration: data.sleep?.duration || 0,
          quality: data.sleep?.quality || 'Unknown',
        },
        lastSync: new Date().toISOString(),
      };

      setGoogleFitData(transformedData);
    } catch (err: any) {
      console.error('Google Fit fetch error:', err);
      setError(err.message || 'Failed to fetch Google Fit data');
      
      if (err.message.includes('expired') || err.message.includes('invalid')) {
        handleDisconnect();
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem('google_fit_access_token');
    if (savedToken) {
      setAccessToken(savedToken);
      setIsConnected(true);
      fetchGoogleFitData(savedToken);
    }
  }, [fetchGoogleFitData]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      
      if (token) {
        localStorage.setItem('google_fit_access_token', token);
        setAccessToken(token);
        setIsConnected(true);
        onConnectionChange?.(true);
        fetchGoogleFitData(token);
        
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [fetchGoogleFitData, onConnectionChange]);

  const handleConnect = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Client ID not configured. Please add VITE_GOOGLE_FIT_CLIENT_ID to environment.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `response_type=token&` +
      `scope=${encodeURIComponent(SCOPES)}&` +
      `prompt=consent`;

    window.location.href = authUrl;
  };

  const handleDisconnect = () => {
    localStorage.removeItem('google_fit_access_token');
    setAccessToken(null);
    setIsConnected(false);
    setGoogleFitData(null);
    setError(null);
    onConnectionChange?.(false);
  };

  const handleRefresh = () => {
    if (accessToken) {
      fetchGoogleFitData(accessToken);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl shadow-lg">
            🏃
          </div>
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              Google Fit
              {isConnected && (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  Connected
                </Badge>
              )}
            </h3>
            <p className="text-slate-400 text-sm">
              {isConnected 
                ? 'Syncing activity, heart rate, and sleep data'
                : 'Connect to sync your fitness data'
              }
            </p>
          </div>
        </div>

        {isConnected && (
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="ghost"
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700/50 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 text-sm font-medium">Error</p>
            <p className="text-red-400/80 text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {!isConnected && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h4 className="text-white text-sm font-medium mb-3">What you'll get:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Daily step count and distance</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Heart rate monitoring</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Sleep duration and quality</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Active minutes and calories</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0 h-11"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 mr-2" />
                Connect Google Fit
              </>
            )}
          </Button>

          <p className="text-slate-500 text-xs text-center">
            Secure OAuth 2.0 authentication
          </p>
        </div>
      )}

      {isConnected && googleFitData && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Footprints className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <p className="text-white text-xl font-semibold">
                {googleFitData.steps.toLocaleString()}
              </p>
              <p className="text-slate-400 text-xs">Steps</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-red-400" />
                </div>
              </div>
              <p className="text-white text-xl font-semibold">
                {googleFitData.heartRate}
              </p>
              <p className="text-slate-400 text-xs">Heart Rate (bpm)</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-orange-400" />
                </div>
              </div>
              <p className="text-white text-xl font-semibold">
                {googleFitData.calories}
              </p>
              <p className="text-slate-400 text-xs">Calories</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Moon className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <p className="text-white text-xl font-semibold">
                {(googleFitData.sleep.duration / 60).toFixed(1)}h
              </p>
              <p className="text-slate-400 text-xs">Sleep</p>
            </div>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-xs mb-1">Distance</p>
                <p className="text-white text-lg font-semibold">
                  {(googleFitData.distance / 1000).toFixed(2)} km
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Active Minutes</p>
                <p className="text-white text-lg font-semibold">
                  {googleFitData.activeMinutes} min
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-3 h-3" />
              <span>
                Last synced: {new Date(googleFitData.lastSync).toLocaleString()}
              </span>
            </div>
            <Button
              onClick={handleDisconnect}
              variant="ghost"
              className="h-7 px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <X className="w-3 h-3 mr-1" />
              Disconnect
            </Button>
          </div>
        </div>
      )}

      {isLoading && !googleFitData && isConnected && (
        <div className="flex flex-col items-center justify-center py-8">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
          <p className="text-slate-400 text-sm">Fetching your Google Fit data...</p>
        </div>
      )}
    </div>
  );
}
