import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Activity, Check, X, RefreshCw, AlertCircle, Heart, Footprints, Moon, Zap, TrendingUp, Calendar, Settings, Save, ExternalLink, AlertTriangle, Copy, CheckCircle } from 'lucide-react';

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

export function GoogleFitIntegration({ onConnectionChange }: GoogleFitIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [googleFitData, setGoogleFitData] = useState<GoogleFitData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showConfig, setShowConfig] = useState(false);
  const [showFullSetup, setShowFullSetup] = useState(false);
  const [clientId, setClientId] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    const savedToken = localStorage.getItem('google_fit_access_token');
    const savedClientId = localStorage.getItem('google_fit_client_id');
    
    if (savedClientId) {
      setClientId(savedClientId);
      setIsConfigured(true);
    }
    
    if (savedToken && savedClientId) {
      setAccessToken(savedToken);
      setIsConnected(true);
      fetchGoogleFitData(savedToken);
    }
  }, []);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentOrigin);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = currentOrigin;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleSaveConfig = () => {
    if (!clientId.trim()) {
      setError('Please enter a valid Client ID');
      return;
    }
    
    localStorage.setItem('google_fit_client_id', clientId.trim());
    setIsConfigured(true);
    setShowConfig(false);
    setShowFullSetup(false);
    setError(null);
  };

  const handleGoogleOAuth = async () => {
    if (!isConfigured || !clientId) {
      setError('Please configure your Google Client ID first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const GOOGLE_CLIENT_ID = clientId;
      const REDIRECT_URI = currentOrigin;
      const SCOPES = [
        'https://www.googleapis.com/auth/fitness.activity.read',
        'https://www.googleapis.com/auth/fitness.heart_rate.read',
        'https://www.googleapis.com/auth/fitness.sleep.read',
        'https://www.googleapis.com/auth/fitness.location.read',
      ].join(' ');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}&` +
        `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
        `response_type=token&` +
        `scope=${encodeURIComponent(SCOPES)}`;

      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        authUrl,
        'Google Fit Authorization',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      const checkPopup = setInterval(() => {
        try {
          if (popup.location.hash) {
            const hash = popup.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const token = params.get('access_token');

            if (token) {
              handleOAuthCallback(token);
              popup.close();
              clearInterval(checkPopup);
            }
          }
        } catch {
        }

        if (popup.closed) {
          clearInterval(checkPopup);
          setIsLoading(false);
        }
      }, 500);

      setTimeout(() => {
        if (!popup.closed) {
          popup.close();
        }
        clearInterval(checkPopup);
        setIsLoading(false);
      }, 300000);
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Google authorization');
      setIsLoading(false);
    }
  };

  const handleOAuthCallback = async (token: string) => {
    try {
      localStorage.setItem('google_fit_access_token', token);
      setAccessToken(token);
      setIsConnected(true);
      onConnectionChange?.(true);

      await fetchGoogleFitData(token);
    } catch (err: any) {
      setError(err.message || 'Failed to connect Google Fit');
      setIsConnected(false);
      localStorage.removeItem('google_fit_access_token');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGoogleFitData = async (token: string) => {
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
      
      if (err.message.includes('401') || err.message.includes('403')) {
        handleDisconnect();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('google_fit_access_token');
    setAccessToken(null);
    setIsConnected(false);
    setGoogleFitData(null);
    setError(null);
    onConnectionChange?.(false);
  };

  const handleResetConfig = () => {
    localStorage.removeItem('google_fit_client_id');
    localStorage.removeItem('google_fit_access_token');
    setClientId('');
    setIsConfigured(false);
    setIsConnected(false);
    setGoogleFitData(null);
    setAccessToken(null);
    setShowConfig(true);
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
              Google Fit Integration
              {isConnected && (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  Connected
                </Badge>
              )}
              {isConfigured && !isConnected && (
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Configured
                </Badge>
              )}
            </h3>
            <p className="text-slate-400 text-sm">
              {isConnected 
                ? 'Syncing activity, heart rate, and sleep data'
                : isConfigured 
                  ? 'Ready to connect'
                  : 'Configure your Google Client ID to get started'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
          {isConfigured && !isConnected && (
            <Button
              onClick={() => setShowConfig(true)}
              variant="ghost"
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700/50 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 text-sm font-medium">Connection Error</p>
            <p className="text-red-400/80 text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {(showConfig || !isConfigured) && !isConnected && (
        <div className="space-y-4">
          <div className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-300 text-sm font-medium">Important Notice</p>
                <p className="text-amber-300/80 text-xs mt-1">
                  Google Fit API is being deprecated. New signups closed May 2024. 
                  If you already have access, you can continue using it until June 2025.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-400" />
                <h4 className="text-white text-sm font-medium">Google Cloud Configuration</h4>
              </div>
              <Button
                onClick={() => setShowFullSetup(!showFullSetup)}
                variant="ghost"
                className="h-7 px-3 text-cyan-400 hover:text-cyan-300 text-xs"
              >
                {showFullSetup ? 'Hide' : 'Show'} Full Setup Guide
              </Button>
            </div>
            
            {showFullSetup && (
              <div className="mb-4 space-y-4">
                <div className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-medium mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">1</span>
                    Create Google Cloud Project
                  </h5>
                  <ol className="text-slate-400 text-xs space-y-2 ml-7">
                    <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-1">Google Cloud Console <ExternalLink className="w-3 h-3" /></a></li>
                    <li>Create a new project or select existing one</li>
                    <li>Enable "Fitness API" in APIs & Services → Library</li>
                  </ol>
                </div>

                <div className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-medium mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">2</span>
                    Configure OAuth Consent Screen
                  </h5>
                  <ol className="text-slate-400 text-xs space-y-2 ml-7">
                    <li>Go to APIs & Services → <a href="https://console.cloud.google.com/apis/credentials/consent" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-1">OAuth consent screen <ExternalLink className="w-3 h-3" /></a></li>
                    <li>Choose "External" user type → Click Create</li>
                    <li>Fill in required fields:
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• App name: <span className="text-white">Thryve Health</span></li>
                        <li>• User support email: <span className="text-white">Your email</span></li>
                        <li>• Developer contact: <span className="text-white">Your email</span></li>
                      </ul>
                    </li>
                    <li>Click "Save and Continue"</li>
                    <li>On Scopes page, click "Add or Remove Scopes"</li>
                    <li>Add these Fitness scopes:
                      <ul className="ml-4 mt-1 space-y-1 text-xs">
                        <li className="font-mono bg-slate-800 px-1 rounded">fitness.activity.read</li>
                        <li className="font-mono bg-slate-800 px-1 rounded">fitness.heart_rate.read</li>
                        <li className="font-mono bg-slate-800 px-1 rounded">fitness.sleep.read</li>
                        <li className="font-mono bg-slate-800 px-1 rounded">fitness.location.read</li>
                      </ul>
                    </li>
                    <li>Continue to "Test users" → Add your Google email</li>
                    <li>Complete the setup</li>
                  </ol>
                </div>

                <div className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-medium mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">3</span>
                    Create OAuth 2.0 Client ID
                  </h5>
                  <ol className="text-slate-400 text-xs space-y-2 ml-7">
                    <li>Go to APIs & Services → <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-1">Credentials <ExternalLink className="w-3 h-3" /></a></li>
                    <li>Click "Create Credentials" → "OAuth client ID"</li>
                    <li>Application type: <span className="text-white">Web application</span></li>
                    <li>Name: <span className="text-white">Thryve Health App</span></li>
                    <li>
                      <span className="text-white font-medium">Important:</span> Add this URL to both fields:
                      <div className="mt-2 flex items-center gap-2">
                        <code className="flex-1 bg-slate-800 text-cyan-300 px-3 py-2 rounded text-xs font-mono break-all">
                          {currentOrigin}
                        </code>
                        <Button
                          onClick={handleCopyUrl}
                          variant="ghost"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white flex-shrink-0"
                        >
                          {copiedUrl ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <ul className="ml-4 mt-2 space-y-1">
                        <li>• Authorized JavaScript origins</li>
                        <li>• Authorized redirect URIs</li>
                      </ul>
                    </li>
                    <li>Click "Create" and copy the <span className="text-white">Client ID</span></li>
                  </ol>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-slate-300 text-sm block mb-2">
                  Google Client ID <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="123456789-abc123def456.apps.googleusercontent.com"
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
                <p className="text-slate-500 text-xs mt-1">
                  Paste the Client ID from Google Cloud Console
                </p>
              </div>
            </div>
          </div>

          {!showFullSetup && (
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="text-blue-300 font-medium">Quick Setup Summary:</p>
                  <ol className="text-blue-300/80 space-y-1 list-decimal list-inside">
                    <li>Configure OAuth consent screen in Google Cloud Console</li>
                    <li>Create OAuth 2.0 Client ID (Web application)</li>
                    <li>Add <code className="bg-blue-500/20 px-1 rounded">{currentOrigin}</code> to authorized origins & redirect URIs</li>
                    <li>Paste Client ID above</li>
                  </ol>
                  <p className="text-blue-300/60 mt-2">Click "Show Full Setup Guide" for detailed instructions</p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleSaveConfig}
            disabled={!clientId.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0 h-11"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      )}

      {!isConnected && isConfigured && !showConfig && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h4 className="text-white text-sm font-medium mb-3">What you'll get:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Daily step count and distance tracking</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Heart rate monitoring and trends</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Sleep duration and quality analysis</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Active minutes and calorie burn</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={handleGoogleOAuth}
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

          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-xs">
              Secure OAuth 2.0 authentication
            </p>
            <Button
              onClick={handleResetConfig}
              variant="ghost"
              className="h-7 px-3 text-slate-500 hover:text-slate-300 text-xs"
            >
              <Settings className="w-3 h-3 mr-1" />
              Reconfigure
            </Button>
          </div>
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
