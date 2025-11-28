# Health Intelligence Platform

## Overview
This is a **Health Intelligence Platform** - a React-based web application that provides a digital health twin experience. The app features interactive 3D visualizations of the human body, health metrics tracking, lifestyle simulation, and AI-powered health insights.

**Original Project:** https://www.figma.com/design/W9TamjSEQ4LeWPqR2Adcj8

## Current State
The application is fully configured and running in the Replit environment with:
- ✅ React 18 + TypeScript
- ✅ Vite build system
- ✅ Three.js for 3D visualizations
- ✅ Radix UI components
- ✅ Tailwind CSS for styling
- ✅ Recharts for data visualization
- ✅ Development server running on port 5000
- ✅ Deployment configured

## Recent Changes (November 28, 2025)
### Custom Themed Alert Dialogs
- Replaced all browser alert() calls with custom app-themed dialog boxes
- Created AppAlert component (src/components/ui/app-alert.tsx) with 4 alert types:
  - **success** (emerald/teal gradient) - For confirmations like "Contacts Updated"
  - **warning** (amber/orange gradient) - For warnings and cautions
  - **info** (cyan/blue gradient) - For informational messages
  - **emergency** (red/pink gradient) - For emergency alerts (SOS)
- Dialogs feature glassmorphism effects matching the app's dark theme
- Updated UserProfile.tsx, HealthRecords.tsx, and DailyLog.tsx to use custom dialogs

### Location Capture Feature
- Added location capture ability to the Profile page
- Uses browser's Geolocation API for GPS coordinates
- Integrates with OpenStreetMap Nominatim for address lookup
- Displays current location with coordinates and timestamp
- Includes error handling for permission denied/unavailable scenarios

### Project Setup for Replit
- Created TypeScript configuration files (tsconfig.json, tsconfig.node.json)
- Installed Node.js 20 and all dependencies
- Updated Vite configuration for Replit environment:
  - Changed port from 3000 to 5000
  - Set host to 0.0.0.0 for Replit proxy compatibility
  - Configured HMR with clientPort 443
  - Added allowedHosts: true for proxy support
- Created .gitignore for Node.js project
- Configured workflow "Frontend Development Server" on port 5000
- Set up deployment configuration using autoscale with build and preview commands

## Project Architecture

### Technology Stack
- **Frontend Framework:** React 18.3.1
- **Build Tool:** Vite 6.3.5
- **Language:** TypeScript
- **3D Graphics:** Three.js with @react-three/fiber and @react-three/drei
- **UI Components:** Radix UI primitives
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **State Management:** React hooks

### Directory Structure
```
/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components (Radix UI)
│   │   ├── figma/       # Figma-related components
│   │   ├── HomePage.tsx
│   │   ├── DigitalTwinV2.tsx
│   │   ├── HealthRecords.tsx
│   │   ├── Routines.tsx
│   │   ├── UserProfile.tsx
│   │   ├── FloatingAIChat.tsx
│   │   └── ... (other components)
│   ├── assets/          # Static assets (images)
│   ├── styles/          # Global styles
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global CSS
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript config
├── package.json         # Dependencies
└── .gitignore          # Git ignore rules
```

### Key Features
1. **Digital Twin Visualization** - 3D interactive human body model
2. **Health Metrics Dashboard** - Real-time health data visualization
3. **Health Records** - Medical history and records management
4. **Routines** - Daily health routines and habits tracking
5. **User Profile** - Personal health profile management
6. **AI Chat Assistant** - Floating AI chat for health insights
7. **Lifestyle Simulation** - "What-if" scenario modeling for health outcomes

## Development

### Running Locally
The development server is configured to run automatically via the workflow:
- **Command:** `npm run dev`
- **Port:** 5000
- **Host:** 0.0.0.0

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production

### Dependencies
The project uses locked peer dependencies with `--legacy-peer-deps` flag to resolve conflicts between React 18 and React Three Fiber.

## Deployment
Deployment is configured for Replit's autoscale service:
- **Build Command:** `npm run build`
- **Run Command:** `npx vite preview --host 0.0.0.0 --port 5000`
- **Target:** Autoscale (stateless web application)

## User Preferences
(No specific user preferences recorded yet)

## Notes
- The application includes Three.js warning suppression to prevent console noise
- The project uses multiple Radix UI components for accessible UI elements
- Vite is configured with custom aliases for package version resolution
