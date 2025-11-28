# Google Fit OAuth Setup Guide

## The 400 Error Fix

The 400 error occurs when there's a mismatch between your OAuth configuration and Google Cloud Console settings.

## ✅ CORRECT Configuration

### In Google Cloud Console:

#### **Authorized JavaScript origins**
```
http://localhost:5173
https://your-production-domain.com
```
**Note:** NO trailing slash, NO path (like `/profile`)

#### **Authorized redirect URIs**
```
http://localhost:5173
https://your-production-domain.com
```
**Note:** For implicit flow (response_type=token), use the SAME URL as JavaScript origins

---

## Step-by-Step Setup

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Fitness API**:
   - Go to **APIs & Services** → **Library**
   - Search for "Fitness API"
   - Click **Enable**

4. Create OAuth 2.0 Credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - Choose **Web application**
   - Name it (e.g., "Thryve Health App")

5. Configure OAuth Client:
   - **Authorized JavaScript origins:**
     ```
     http://localhost:5173
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:5173
     ```
   - Click **CREATE**

6. Copy your **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)

### 2. Update Your Code

Replace `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` in these files:

**File 1:** `/utils/googleFitAuth.ts` (line 9)
```typescript
clientId: 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com',
```

**File 2:** `/components/GoogleFitIntegration.tsx` (line 47)
```typescript
const GOOGLE_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com';
```

### 3. Test the Integration

1. Start your dev server: `npm run dev`
2. Navigate to the Profile page
3. Click "Connect Google Fit"
4. You should see Google's consent screen
5. After authorization, you'll be redirected back with an access token

---

## Common Issues & Solutions

### ❌ "400: redirect_uri_mismatch"
**Problem:** Redirect URI doesn't match Google Cloud Console configuration

**Solution:**
- Ensure redirect URI in Console is EXACTLY: `http://localhost:5173` (no trailing slash)
- Check your dev server port (might be 3000, 5173, 5174, etc.)
- URLs are case-sensitive and must match exactly

### ❌ "400: invalid_request"
**Problem:** Malformed OAuth parameters

**Solution:**
- Remove `access_type` and `prompt` parameters (not needed for implicit flow)
- Ensure Client ID is correct
- Check that all parameters are properly URL encoded

### ❌ Token not saving after redirect
**Problem:** Popup closes but no token is stored

**Solution:**
- Check browser console for errors
- Ensure popup isn't blocked
- Verify the popup can access `popup.location.hash`

---

## Production Deployment

When deploying to production:

1. Add your production domain to Google Cloud Console:
   - **Authorized JavaScript origins:** `https://yourdomain.com`
   - **Authorized redirect URIs:** `https://yourdomain.com`

2. The code automatically uses `window.location.origin`, so no code changes needed!

---

## Security Notes

- ✅ Using OAuth 2.0 Implicit Flow (suitable for client-side apps)
- ✅ Access tokens are stored in localStorage
- ✅ Tokens expire after 1 hour (configurable)
- ⚠️ For production, consider using Authorization Code Flow with PKCE for better security

---

## Testing Without Real Data

If you don't have Google Fit data yet:

1. Install Google Fit app on Android/iOS
2. Connect a fitness tracker (or use phone's sensors)
3. Walk around for a few minutes
4. Data should appear in the app after connecting

---

## API Endpoint

The code fetches data from:
```
https://ombjteysx3.execute-api.us-east-1.amazonaws.com/prod/fetch
```

Make sure this endpoint:
- Accepts `Authorization: Bearer <token>` header
- Returns Google Fit data in the expected format
- Handles CORS properly

---

## Need Help?

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Fitness API Documentation](https://developers.google.com/fit)
- Check browser console for detailed error messages
