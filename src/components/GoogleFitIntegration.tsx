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
const BACKEND_URL = typeof window !== 'undefined' ? window.location.origin : '';
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
        `${BACKEND_URL}/api/google-fit/data`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          const refreshToken = localStorage.getItem('google_fit_refresh_token');
          if (refreshToken) {
            await refreshAccessToken(refreshToken);
            return;
          }
          throw new Error('Token expired. Please reconnect.');
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Check if the API returned error strings in the data fields
      const allValues = Object.values(data).flatMap((dayData: any) => 
        typeof dayData === 'object' ? Object.values(dayData) : [dayData]
      );
      const hasAuthError = allValues.some(
        (val) => typeof val === 'string' && val.includes('Error:') && val.includes('401')
      );
      
      if (hasAuthError) {
        console.log('Google Fit token expired, clearing and requesting re-auth');
        handleDisconnect();
        setError('Your Google Fit session has expired. Please reconnect.');
        return;
      }
      
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      // Get today's data from the response (data is organized by date)
      const todayData = data[todayStr] || {};
      
      // Parse numeric values safely
      const parseValue = (val: any): number => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && !val.includes('Error')) {
          const num = parseFloat(val);
          return isNaN(num) ? 0 : num;
        }
        return 0;
      };
      
      // Extract totals from today's data structure
      const transformedData: GoogleFitData = {
        steps: parseValue(todayData.steps?.total),
        heartRate: parseValue(todayData.heart_rate?.total || todayData.heartRate?.total),
        calories: Math.round(parseValue(todayData.calories?.total)),
        distance: Math.round(parseValue(todayData.distance?.total)),
        activeMinutes: parseValue(todayData.move_minutes?.total || todayData.activeMinutes?.total),
        sleep: {
          duration: typeof todayData.sleep === 'object' ? parseValue(todayData.sleep?.total || todayData.sleep?.duration) : 0,
          quality: typeof todayData.sleep === 'object' ? (todayData.sleep?.quality || 'Unknown') : 'Unknown',
        },
        lastSync: new Date().toISOString(),
      };

      console.log('Today\'s Google Fit data:', todayStr, transformedData);
      setGoogleFitData(transformedData);
    } catch (err: any) {
      console.error('Google Fit fetch error:', err);
      setError(err.message || 'Failed to fetch Google Fit data');
      
      if (err.message.includes('expired') || err.message.includes('reconnect')) {
        handleDisconnect();
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/google-fit/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      localStorage.setItem('google_fit_access_token', data.access_token);
      setAccessToken(data.access_token);
      await fetchGoogleFitData(data.access_token);
    } catch (err) {
      console.error('Token refresh failed:', err);
      handleDisconnect();
    }
  };

  const exchangeCodeForToken = useCallback(async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/google-fit/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Token exchange failed');
      }

      const data = await response.json();
      
      localStorage.setItem('google_fit_access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('google_fit_refresh_token', data.refresh_token);
      }
      
      setAccessToken(data.access_token);
      setIsConnected(true);
      onConnectionChange?.(true);
      
      await fetchGoogleFitData(data.access_token);
    } catch (err: any) {
      console.error('Token exchange error:', err);
      setError(err.message || 'Failed to connect to Google Fit');
    } finally {
      setIsLoading(false);
    }
  }, [fetchGoogleFitData, onConnectionChange]);

  useEffect(() => {
    const savedToken = localStorage.getItem('google_fit_access_token');
    if (savedToken) {
      setAccessToken(savedToken);
      setIsConnected(true);
      fetchGoogleFitData(savedToken);
    }
  }, [fetchGoogleFitData]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      exchangeCodeForToken(code);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [exchangeCodeForToken]);

  const handleConnect = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Client ID not configured.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(SCOPES)}&` +
      `access_type=offline&` +
      `prompt=consent`;

    window.location.href = authUrl;
  };

  const handleDisconnect = () => {
    localStorage.removeItem('google_fit_access_token');
    localStorage.removeItem('google_fit_refresh_token');
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
