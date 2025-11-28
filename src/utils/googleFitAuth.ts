/**
 * Google Fit OAuth 2.0 Authentication Utilities
 * 
 * Handles OAuth flow, token management, and API communication
 */

// Configuration
export const GOOGLE_FIT_CONFIG = {
  // Client ID is now stored in localStorage and retrieved dynamically
  get clientId() {
    return typeof window !== 'undefined' 
      ? localStorage.getItem('google_fit_client_id') || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
      : 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
  },
  // IMPORTANT: This must EXACTLY match what you configured in Google Cloud Console
  // No trailing slash!
  redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
  scopes: [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.heart_rate.read',
    'https://www.googleapis.com/auth/fitness.sleep.read',
    'https://www.googleapis.com/auth/fitness.location.read',
  ],
  apiEndpoint: 'https://ombjteysx3.execute-api.us-east-1.amazonaws.com/prod/fetch',
};

// Token storage keys
const TOKEN_KEY = 'google_fit_access_token';
const TOKEN_EXPIRY_KEY = 'google_fit_token_expiry';

/**
 * Save access token to localStorage with expiry
 */
export function saveAccessToken(token: string, expiresIn: number = 3600): void {
  localStorage.setItem(TOKEN_KEY, token);
  const expiryTime = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
}

/**
 * Get access token from localStorage
 * Returns null if token is expired or doesn't exist
 */
export function getAccessToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!token || !expiry) {
    return null;
  }

  // Check if token is expired
  if (Date.now() > parseInt(expiry)) {
    clearAccessToken();
    return null;
  }

  return token;
}

/**
 * Clear access token from localStorage
 */
export function clearAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

/**
 * Generate OAuth authorization URL
 */
export function getAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_FIT_CONFIG.clientId,
    redirect_uri: GOOGLE_FIT_CONFIG.redirectUri,
    response_type: 'token',
    scope: GOOGLE_FIT_CONFIG.scopes.join(' '),
    // Remove access_type and prompt for implicit flow
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Open OAuth popup and handle callback
 */
export function openOAuthPopup(): Promise<string> {
  return new Promise((resolve, reject) => {
    const authUrl = getAuthUrl();
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
      reject(new Error('Popup blocked. Please allow popups for this site.'));
      return;
    }

    // Poll for OAuth callback
    const checkPopup = setInterval(() => {
      try {
        // Check if popup URL contains access token
        if (popup.location.hash) {
          const hash = popup.location.hash.substring(1);
          const params = new URLSearchParams(hash);
          const token = params.get('access_token');
          const expiresIn = params.get('expires_in');

          if (token) {
            saveAccessToken(token, expiresIn ? parseInt(expiresIn) : 3600);
            popup.close();
            clearInterval(checkPopup);
            resolve(token);
          }
        }
      } catch (e) {
        // Cross-origin error - popup still on Google's domain
        // This is expected and can be ignored
      }

      // Check if popup was closed by user
      if (popup.closed) {
        clearInterval(checkPopup);
        reject(new Error('Authorization cancelled by user'));
      }
    }, 500);

    // Timeout after 5 minutes
    setTimeout(() => {
      if (!popup.closed) {
        popup.close();
      }
      clearInterval(checkPopup);
      reject(new Error('Authorization timeout'));
    }, 300000);
  });
}

/**
 * Validate token with Google
 */
export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${token}`
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    
    // Verify the token is for our client
    return data.aud === GOOGLE_FIT_CONFIG.clientId;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

/**
 * Fetch Google Fit data from backend API
 */
export async function fetchGoogleFitData(token: string): Promise<any> {
  try {
    const response = await fetch(GOOGLE_FIT_CONFIG.apiEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch Google Fit data error:', error);
    throw error;
  }
}

/**
 * Complete OAuth flow: open popup, get token, validate, and fetch data
 */
export async function authenticateAndFetchData(): Promise<{
  token: string;
  data: any;
}> {
  try {
    // Open OAuth popup and get token
    const token = await openOAuthPopup();

    // Validate token
    const isValid = await validateToken(token);
    if (!isValid) {
      clearAccessToken();
      throw new Error('Invalid or expired token');
    }

    // Fetch data
    const data = await fetchGoogleFitData(token);

    return { token, data };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

/**
 * Revoke access token (disconnect)
 */
export async function revokeAccess(): Promise<void> {
  const token = getAccessToken();
  
  if (!token) {
    return;
  }

  try {
    // Revoke token with Google
    await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Token revocation error:', error);
  } finally {
    // Always clear local storage
    clearAccessToken();
  }
}

/**
 * Error types for better error handling
 */
export enum GoogleFitErrorType {
  POPUP_BLOCKED = 'POPUP_BLOCKED',
  AUTH_CANCELLED = 'AUTH_CANCELLED',
  AUTH_TIMEOUT = 'AUTH_TIMEOUT',
  INVALID_TOKEN = 'INVALID_TOKEN',
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

/**
 * Parse error and return user-friendly message
 */
export function getErrorMessage(error: Error): { type: GoogleFitErrorType; message: string } {
  const errorStr = error.message.toLowerCase();

  if (errorStr.includes('popup blocked')) {
    return {
      type: GoogleFitErrorType.POPUP_BLOCKED,
      message: 'Please allow popups to connect Google Fit',
    };
  }

  if (errorStr.includes('cancelled')) {
    return {
      type: GoogleFitErrorType.AUTH_CANCELLED,
      message: 'Authorization was cancelled',
    };
  }

  if (errorStr.includes('timeout')) {
    return {
      type: GoogleFitErrorType.AUTH_TIMEOUT,
      message: 'Authorization timed out. Please try again.',
    };
  }

  if (errorStr.includes('invalid') || errorStr.includes('expired')) {
    return {
      type: GoogleFitErrorType.INVALID_TOKEN,
      message: 'Session expired. Please reconnect.',
    };
  }

  if (errorStr.includes('401') || errorStr.includes('403')) {
    return {
      type: GoogleFitErrorType.INVALID_TOKEN,
      message: 'Authentication failed. Please reconnect.',
    };
  }

  if (errorStr.includes('api error')) {
    return {
      type: GoogleFitErrorType.API_ERROR,
      message: 'Failed to fetch data. Please try again.',
    };
  }

  return {
    type: GoogleFitErrorType.NETWORK_ERROR,
    message: 'Network error. Please check your connection.',
  };
}

export default {
  config: GOOGLE_FIT_CONFIG,
  saveAccessToken,
  getAccessToken,
  clearAccessToken,
  isAuthenticated,
  getAuthUrl,
  openOAuthPopup,
  validateToken,
  fetchGoogleFitData,
  authenticateAndFetchData,
  revokeAccess,
  getErrorMessage,
};
