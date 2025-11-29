import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_CLIENT_ID = process.env.GOOGLE_FIT_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

app.post('/api/google-fit/token', async (req, res) => {
  const { code, redirect_uri } = req.body;

  if (!code || !redirect_uri) {
    return res.status(400).json({ error: 'Missing code or redirect_uri' });
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Google credentials not configured' });
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Google token exchange error:', data);
      return res.status(response.status).json({ error: data.error_description || data.error || 'Token exchange failed' });
    }

    res.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      token_type: data.token_type,
    });
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).json({ error: 'Failed to exchange token' });
  }
});

app.post('/api/google-fit/refresh', async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ error: 'Missing refresh_token' });
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Google credentials not configured' });
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        grant_type: 'refresh_token',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Google token refresh error:', data);
      return res.status(response.status).json({ error: data.error_description || data.error || 'Token refresh failed' });
    }

    res.json({
      access_token: data.access_token,
      expires_in: data.expires_in,
      token_type: data.token_type,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/google-fit/data', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  try {
    // Request 365 days of data by default
    const requestBody = {
      days: req.body.days || 365,
      ...req.body,
    };
    
    const response = await fetch(
      'https://ombjteysx3.execute-api.us-east-1.amazonaws.com/prod/fetch',
      {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API error:', response.status, errorText);
      return res.status(response.status).json({ error: errorText || 'API request failed' });
    }

    const data = await response.json();
    console.log('External API response:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch Google Fit data' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});

// S3 file upload endpoint
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload-to-s3', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const bucket = req.body.bucket || 'med-document-input';
  const fileName = `${Date.now()}-${req.file.originalname}`;

  // In a real implementation, upload to S3
  // For now, store file info in memory
  console.log(`File uploaded: ${fileName} to ${bucket}`);
  
  res.json({
    fileKey: fileName,
    url: `/downloads/${bucket}/${fileName}`,
    message: 'File uploaded successfully'
  });
});

// List S3 files endpoint
app.get('/api/list-s3-files', async (req, res) => {
  const bucket = req.query.bucket || 'med-document-input';
  
  // Return mock data for now
  res.json([
    {
      id: 'doc1',
      name: 'Lab Report - Nov 2024.pdf',
      size: 1024000,
      type: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      url: `/downloads/${bucket}/lab-report.pdf`
    },
    {
      id: 'doc2',
      name: 'Chest X-ray Report.pdf',
      size: 2048000,
      type: 'application/pdf',
      uploadedAt: new Date(Date.now() - 86400000).toISOString(),
      url: `/downloads/${bucket}/xray.pdf`
    }
  ]);
});

// Download file endpoint
app.get('/api/download-from-s3', async (req, res) => {
  const { key, bucket } = req.query;
  
  // In a real implementation, download from S3
  console.log(`Downloading file: ${key} from ${bucket}`);
  
  res.json({ message: 'Download initiated' });
});
