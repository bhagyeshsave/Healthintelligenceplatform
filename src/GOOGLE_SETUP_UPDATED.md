# Google Fit Setup - Updated Flow

## New Configuration Flow

You no longer need to hardcode your Client ID! The app now has a built-in configuration UI.

---

## Step-by-Step Setup

### 1. Google Cloud Console Setup

#### A. Create/Select Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Note your project name

#### B. Enable Fitness API
1. Go to **APIs & Services** → **Library**
2. Search for "Fitness API"
3. Click **Enable**
4. Wait for it to be enabled (takes a few seconds)

#### C. Create OAuth 2.0 Client ID
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, configure OAuth consent screen:
   - User Type: **External** (or Internal if using Workspace)
   - Fill in required fields (App name, user support email, developer email)
   - Add scopes (optional at this stage)
   - Click **Save and Continue**

4. Back to OAuth client ID creation:
   - Application type: **Web application**
   - Name: `Thryve Health App` (or any name)

5. **Configure the URIs** (CRITICAL - must be exact):

   **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   ```
   
   **Authorized redirect URIs:**
   ```
   http://localhost:5173
   ```
   
   ⚠️ **Important Notes:**
   - NO trailing slash (`/`)
   - NO path suffix (like `/profile`)
   - Must match EXACTLY where your app runs
   - Check your dev server port (might be 5174, 3000, etc.)

6. Click **CREATE**

7. **Copy your Client ID** - looks like:
   ```
   123456789-abc123def456.apps.googleusercontent.com
   ```

---

### 2. Configure in Thryve App

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Profile page** (Tab 6 in the app)

3. **Scroll to Google Fit Integration section**

4. You'll see the configuration form with:
   - Google Client ID input field
   - Setup instructions
   
5. **Paste your Client ID** from step 1.7

6. Click **"Save Configuration"**

7. The form will close and you'll see the "Connect Google Fit" button

---

### 3. Connect Google Fit

1. Click **"Connect Google Fit"** button

2. A popup will open with Google's consent screen

3. **Select your Google account**

4. **Review permissions:**
   - Read your fitness activity data
   - Read your heart rate data
   - Read your sleep data
   - Read your location data

5. Click **"Allow"**

6. The popup will close automatically

7. You'll see your Google Fit data appear in the app!

---

## What Gets Stored

### localStorage Keys:
- `google_fit_client_id` - Your Google Client ID
- `google_fit_access_token` - OAuth access token (expires after 1 hour)
- `google_fit_token_expiry` - Token expiration timestamp

### Security Notes:
- ✅ Client ID is safe to store (it's public info)
- ✅ Access token is temporary (1 hour expiry)
- ✅ No sensitive data is permanently stored
- ✅ You can disconnect anytime

---

## Troubleshooting

### ❌ 400 Error: "redirect_uri_mismatch"

**Problem:** The redirect URI in your code doesn't match Google Cloud Console

**Solution:**
1. Check your dev server URL (e.g., `http://localhost:5173`)
2. Go to Google Cloud Console → Credentials → Your OAuth Client
3. Ensure **both** JavaScript origins AND Redirect URIs contain:
   ```
   http://localhost:5173
   ```
4. NO trailing slash, NO `/profile` suffix
5. Save and try again

### ❌ 400 Error: "invalid_client"

**Problem:** Client ID is incorrect

**Solution:**
1. Go to Profile → Google Fit section
2. Click **"Reconfigure"** button at bottom
3. Copy Client ID from Google Cloud Console again
4. Paste and save

### ❌ Popup is blocked

**Problem:** Browser is blocking the OAuth popup

**Solution:**
1. Look for popup blocker icon in browser address bar
2. Click and allow popups from this site
3. Try connecting again

### ❌ "Failed to fetch Google Fit data"

**Problem:** Backend API is not responding

**Solution:**
1. Check if your backend API is running:
   ```
   https://ombjteysx3.execute-api.us-east-1.amazonaws.com/prod/fetch
   ```
2. Ensure it accepts the OAuth token in Authorization header
3. Check CORS settings on your API

### ❌ No data showing after connecting

**Problem:** Google Fit has no data yet

**Solution:**
1. Install Google Fit app on your phone
2. Connect a fitness tracker OR
3. Just walk around with your phone for 10 minutes
4. Come back and click the refresh button (↻)

---

## Reconfigure or Reset

### To Change Client ID:
1. Go to Profile → Google Fit section
2. Click **"Reconfigure"** button (bottom right)
3. Enter new Client ID
4. Click **"Save Configuration"**

### To Fully Reset:
The "Reconfigure" button will:
- Clear saved Client ID
- Clear access token
- Disconnect from Google Fit
- Show the configuration form again

---

## Production Deployment

When deploying to production:

1. **Add production domain to Google Cloud Console:**
   - JavaScript origins: `https://yourdomain.com`
   - Redirect URIs: `https://yourdomain.com`

2. **No code changes needed!** The app automatically uses `window.location.origin`

3. **Users configure their own Client ID** in the Profile page

---

## UI States

The Google Fit integration has 3 states:

### 1. Not Configured (Initial State)
- Shows configuration form
- "Google Client ID" input field
- Blue "Save Configuration" button
- Setup instructions

### 2. Configured but Not Connected
- Shows "What you'll get" benefits list
- Green "Connect Google Fit" button
- "Reconfigure" button at bottom
- "Configured" badge in header

### 3. Connected
- Shows real-time fitness data:
  - Steps
  - Heart rate
  - Calories
  - Sleep duration
  - Distance
  - Active minutes
- "Connected" badge in header
- Refresh button (↻)
- "Disconnect" button

---

## API Integration

Your backend API endpoint should:

1. **Accept** OAuth token in Authorization header:
   ```
   Authorization: Bearer ya29.a0AfH6SMBq...
   ```

2. **Validate** the token with Google

3. **Fetch** data from Google Fit API

4. **Return** data in this format:
   ```json
   {
     "steps": 8234,
     "heartRate": 72,
     "calories": 2150,
     "distance": 6500,
     "activeMinutes": 45,
     "sleep": {
       "duration": 450,
       "quality": "Good"
     }
   }
   ```

---

## Need Help?

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Fitness API Documentation](https://developers.google.com/fit)
- Check browser console for detailed error messages
- Try the "Reconfigure" button to reset everything
