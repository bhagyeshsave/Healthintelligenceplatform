# Thryve Health Intelligence Platform

A comprehensive digital health twin application that provides personalized health insights, 3D body visualizations, and integrated health records management.

## Features

### Digital Twin Visualization
- Interactive 3D human body model with organ-level health mapping
- Real-time health status indicators with color-coded risk levels
- Locked horizontal rotation for optimal viewing experience

### Health Records Management
- **ABHA/ABDM Integration**: Sync health records from India's national health ecosystem
- **Google Fit Integration**: Connect wearables for real-time activity and vitals data
- **S3 Report Storage**: Upload and download medical reports securely
- **Vitals Logging**: Track blood pressure, glucose, heart rate, and more

### Health Analytics
- Cox Proportional Hazards risk modeling for predictive health insights
- Trend analysis for CBC, blood pressure, and glucose levels
- AI-powered health summaries and recommendations

### Export & Reporting
- PDF export with comprehensive health summary
- CSV data export for detailed analysis
- Visual trend charts with historical data

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **3D Graphics**: Three.js with @react-three/fiber
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **PDF Generation**: jsPDF with autoTable

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

### Environment Variables

Required secrets for full functionality:
- `AWS_ACCESS_KEY_ID` - AWS credentials for S3 storage
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_BUCKET_NAME` - S3 bucket name for reports
- `AWS_REGION` - AWS region
- `GOOGLE_FIT_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_FIT_CLIENT_SECRET` - Google OAuth client secret

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── DigitalTwinV2.tsx
│   ├── HealthRecords.tsx
│   ├── HumanBody3D.tsx
│   └── ...
├── utils/              # Utility functions
│   └── s3Upload.ts     # S3 upload/download utilities
├── assets/             # Static assets
└── styles/             # Global styles

server/
└── index.js            # Express backend for OAuth
```

## Related Projects

- [Thryve Doctors Portal](https://github.com/bhagyeshsave/ThryveDoctorsPortal1) - Healthcare provider portal for managing patient data and consultations
- [SOS Agent](https://github.com/sanetechies/SOS-agent) - Emergency response agent for health crisis situations

## Original Design

The original project design is available at: https://www.figma.com/design/W9TamjSEQ4LeWPqR2Adcj8/Health-Intelligence-Platform

## Deployment

The application is configured for Replit's autoscale deployment:

```bash
# Build for production
npm run build

# Preview production build
npx vite preview --host 0.0.0.0 --port 5000
```

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
