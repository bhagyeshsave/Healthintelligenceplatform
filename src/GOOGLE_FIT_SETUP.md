# Google Fit Integration Setup Guide

## Overview
The Google Fit integration allows users to connect their Google Fit account and sync fitness data (steps, heart rate, sleep, calories) into the Thryve Digital Health Twin app.

---

## Features

✅ **OAuth 2.0 Authentication** - Secure Google sign-in with popup flow  
✅ **Real-time Data Sync** - Fetch latest fitness data from your API  
✅ **Persistent Connection** - Token saved in localStorage  
✅ **Auto-refresh** - Manual refresh button to get latest data  
✅ **Disconnect Option** - Users can revoke access anytime  

---

## Setup Instructions

### Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google Fit API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Fitness API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Select "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - Add authorized redirect URIs:
     - `http://localhost:3000/profile`
     - `https://yourdomain.com/profile`
   - Save and copy your **Client ID**

### Step 2: Configure OAuth Scopes

The following scopes are requested:
- `https://www.googleapis.com/auth/fitness.activity.read` - Steps, distance, calories
- `https://www.googleapis.com/auth/fitness.heart_rate.read` - Heart rate data
- `https://www.googleapis.com/auth/fitness.sleep.read` - Sleep tracking
- `https://www.googleapis.com/auth/fitness.location.read` - Location data

### Step 3: Update Application Code

In `/components/GoogleFitIntegration.tsx`, update line 24:

```typescript
const GOOGLE_CLIENT_ID = 'YOUR_ACTUAL_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
```

Replace with your actual Client ID from Google Cloud Console.

### Step 4: Configure Your API Endpoint

The integration fetches data from:
```
https://ombjteysx3.execute-api.us-east-1.amazonaws.com/prod/fetch
```

**API Requirements:**
- Method: `GET`
- Header: `Authorization: Bearer {access_token}`
- Response format (JSON):

```json
{
  "steps": 12847,
  "heartRate": 72,
  "heart_rate": 72,
  "calories": 2340,
  "distance": 8540,
  "activeMinutes": 87,
  "active_minutes": 87,
  "sleep": {
    "duration": 432,
    "quality": "Good"
  }
}
```

---

## How It Works

### 1. User Clicks "Connect Google Fit"
- Opens OAuth popup window
- User signs in with Google account
- User authorizes requested permissions

### 2. OAuth Callback
- Google redirects to your app with `access_token` in URL hash
- Token is extracted and saved to `localStorage`
- Connection status updated to "Connected"

### 3. Fetch Data
- Makes API call to your backend: `https://ombjteysx3.execute-api.us-east-1.amazonaws.com/prod/fetch`
- Passes access token in `Authorization` header
- Your backend:
  1. Validates token with Google
  2. Fetches data from Google Fit API
  3. Returns formatted data to frontend

### 4. Display Metrics
- Steps, heart rate, calories, sleep shown in UI
- User can manually refresh data
- Last sync time displayed

### 5. Disconnect
- User can click "Disconnect"
- Token removed from localStorage
- Connection status reset

---

## Security Best Practices

### ✅ Token Storage
- Access token stored in `localStorage`
- Not recommended for production with sensitive data
- Consider using `httpOnly` cookies via backend

### ✅ Token Expiration
- Google access tokens expire after 1 hour
- Implement refresh token flow for longer sessions
- Current implementation will prompt re-auth on expiry

### ✅ Backend API Security
- Your API endpoint should validate the Google token
- Use Google's tokeninfo endpoint:
  ```
  GET https://oauth2.googleapis.com/tokeninfo?access_token={token}
  ```
- Verify `aud` (audience) matches your Client ID

---

## API Backend Example (Node.js/Express)

```javascript
const express = require('express');
const axios = require('axios');
const app = express();

app.get('/prod/fetch', async (req, res) => {
  const accessToken = req.headers.authorization?.split('Bearer ')[1];
  
  if (!accessToken) {
    return res.status(401).json({ error: 'No access token provided' });
  }

  try {
    // Validate token with Google
    const tokenInfo = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`
    );

    // Fetch Google Fit data
    const today = new Date();
    const startTime = new Date(today.setHours(0, 0, 0, 0)).getTime() * 1000000;
    const endTime = Date.now() * 1000000;

    // Steps
    const stepsRes = await axios.post(
      'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
      {
        aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: startTime / 1000000,
        endTimeMillis: endTime / 1000000,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Extract data and format response
    const steps = stepsRes.data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.intVal || 0;

    res.json({
      steps: steps,
      heartRate: 72, // Fetch from Google Fit Heart Rate API
      calories: 2340, // Calculate from activity data
      distance: 8540, // From distance delta
      activeMinutes: 87, // From activity segments
      sleep: {
        duration: 432,
        quality: 'Good',
      },
    });
  } catch (error) {
    console.error('Google Fit API error:', error);
    res.status(500).json({ error: 'Failed to fetch Google Fit data' });
  }
});

app.listen(3001, () => console.log('API running on port 3001'));
```

---

## Testing

### Development Testing

1. **Mock Mode** (no Google account needed):
   - Comment out the API call in `fetchGoogleFitData`
   - Return mock data:
   ```typescript
   const mockData: GoogleFitData = {
     steps: 12847,
     heartRate: 72,
     calories: 2340,
     distance: 8540,
     activeMinutes: 87,
     sleep: { duration: 432, quality: 'Good' },
     lastSync: new Date().toISOString(),
   };
   setGoogleFitData(mockData);
   ```

2. **Test OAuth Flow**:
   - Click "Connect Google Fit"
   - Verify popup opens
   - Sign in with Google test account
   - Check console for access token
   - Verify data appears in UI

3. **Test Disconnect**:
   - Click "Disconnect" button
   - Verify localStorage cleared
   - Verify UI returns to "Not Connected" state

---

## Troubleshooting

### Issue: OAuth popup blocked
**Solution**: Ensure popup blockers are disabled for your domain

### Issue: "Invalid Client ID"
**Solution**: 
- Verify Client ID is correct in code
- Check authorized domains in Google Cloud Console
- Ensure current domain is whitelisted

### Issue: "Access denied" from API
**Solution**:
- Check token is being sent in Authorization header
- Verify backend validates token correctly
- Check API endpoint CORS settings

### Issue: No data displayed after connection
**Solution**:
- Open browser DevTools → Network tab
- Check API request/response
- Verify response format matches expected interface
- Check console for errors

---

## Component Location

**File**: `/components/GoogleFitIntegration.tsx`  
**Used in**: `/components/UserProfile.tsx` (Profile tab)  
**Position**: Between "Emergency Alert System" and "Insurance Details" sections

---

## Future Enhancements

🔮 **Planned features:**
- [ ] Refresh token implementation for auto-renewal
- [ ] Real-time sync with webhooks
- [ ] Historical data charts (7-day, 30-day trends)
- [ ] Activity type breakdown (walking, running, cycling)
- [ ] Heart rate zones analysis
- [ ] Sleep stages visualization
- [ ] Export data to CSV/PDF
- [ ] Multi-device support (Fitbit, Apple Health)

---

## Support

For questions or issues:
- Check Google Fit API docs: https://developers.google.com/fit
- OAuth 2.0 guide: https://developers.google.com/identity/protocols/oauth2
- Component code: `/components/GoogleFitIntegration.tsx`
