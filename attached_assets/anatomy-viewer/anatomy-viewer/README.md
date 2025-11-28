# Human Anatomy Viewer

An interactive 3D Human Anatomy Viewer React component library. Display and explore a 3D human body model with clickable body parts that show educational information.

## Features

- Interactive 3D human body model
- Clickable body parts with detailed anatomical information
- Customizable controls (rotation, zoom, pan)
- Built-in info panel with body part details
- Horizontal-only rotation for clean viewing experience
- Fully typed with TypeScript
- Built on React Three Fiber and Three.js

## Installation

### Option 1: Install from Git (Recommended)

Install directly from the Git repository:

```bash
npm install git+https://replit.com/@YourUsername/YourReplName.git#main:client/src/lib/anatomy-viewer
```

Or add to your `package.json`:

```json
{
  "dependencies": {
    "human-anatomy-viewer": "git+https://replit.com/@YourUsername/YourReplName.git#main"
  }
}
```

### Option 2: Copy the Library

Copy the entire `client/src/lib/anatomy-viewer/` folder into your project:

```
your-project/
├── src/
│   ├── lib/
│   │   └── anatomy-viewer/    <-- Copy here
│   │       ├── index.ts
│   │       ├── HumanAnatomyViewer.tsx
│   │       ├── HumanBody.tsx
│   │       ├── InfoPanel.tsx
│   │       ├── types.ts
│   │       └── defaultAnatomyData.ts
│   └── App.tsx
└── public/
    └── geometries/
        └── human_body.glb     <-- Also copy the 3D model
```

Then import from the local path:

```tsx
import { HumanAnatomyViewer } from './lib/anatomy-viewer';
```

### Required Peer Dependencies

Make sure you have these dependencies installed:

```bash
npm install react react-dom three @react-three/fiber @react-three/drei
```

### Required Asset

Copy the 3D model file `client/public/geometries/human_body.glb` to your project's public folder at `public/geometries/human_body.glb`.

## Quick Start

```tsx
import { HumanAnatomyViewer } from 'human-anatomy-viewer';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <HumanAnatomyViewer />
    </div>
  );
}
```

## Usage with Custom Options

```tsx
import { HumanAnatomyViewer } from 'human-anatomy-viewer';
import type { BodyPartInfo } from 'human-anatomy-viewer';

function App() {
  const handlePartSelect = (partId: string | null, partInfo: BodyPartInfo | null) => {
    if (partId && partInfo) {
      console.log(`Selected: ${partInfo.name}`);
      console.log(`Description: ${partInfo.description}`);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <HumanAnatomyViewer
        modelUrl="/geometries/human_body.glb"
        onPartSelect={handlePartSelect}
        showInfoPanel={true}
        infoPanelPosition="right"
        backgroundColor="#e0f2fe"
        controlsConfig={{
          enablePan: true,
          enableZoom: false,
          enableRotate: true,
          horizontalOnly: true
        }}
        lightingConfig={{
          ambientIntensity: 0.6,
          directionalIntensity: 1
        }}
      />
    </div>
  );
}
```

## Data Flow: Passing and Retrieving Data

This section explains how to pass your own data to the viewer and retrieve information when users click on body parts.

### How Data Flow Works

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR APPLICATION                          │
│                                                              │
│  1. YOUR DATA (e.g., patient records, symptoms)              │
│         │                                                    │
│         ▼                                                    │
│  2. Pass to viewer via props:                                │
│     - renderInfoContent (custom display)                     │
│     - anatomyData (structured data)                          │
│                                                              │
│  3. User clicks body part                                    │
│         │                                                    │
│         ▼                                                    │
│  4. Receive click via onPartSelect(partId, partInfo)         │
│         │                                                    │
│         ▼                                                    │
│  5. Use partId to look up YOUR DATA                          │
│         │                                                    │
│         ▼                                                    │
│  6. Update your app state, show details, etc.                │
└─────────────────────────────────────────────────────────────┘
```

### Example: Complete Data Flow

```tsx
import { HumanAnatomyViewer } from 'human-anatomy-viewer';
import { useState } from 'react';

function MyHealthApp() {
  // ═══════════════════════════════════════════════════════════
  // STEP 1: Define your data (from database, API, etc.)
  // ═══════════════════════════════════════════════════════════
  const myPatientData = {
    heart: { 
      status: "Needs Attention", 
      notes: "Irregular heartbeat detected",
      appointmentDate: "2024-02-15"
    },
    leftLung: { 
      status: "Healthy", 
      notes: "No issues found",
      appointmentDate: "2024-01-10"
    },
    liver: { 
      status: "Monitoring", 
      notes: "Elevated enzyme levels",
      appointmentDate: "2024-02-20"
    }
  };

  // ═══════════════════════════════════════════════════════════
  // STEP 2: Track which part user clicked (retrieve data)
  // ═══════════════════════════════════════════════════════════
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [clickedPartData, setClickedPartData] = useState<any>(null);

  // ═══════════════════════════════════════════════════════════
  // STEP 3: Handle click events - RETRIEVE data based on click
  // ═══════════════════════════════════════════════════════════
  const handleBodyPartClick = (partId: string | null) => {
    setSelectedPartId(partId);
    
    if (partId) {
      // Look up YOUR data using the partId
      const partData = myPatientData[partId];
      setClickedPartData(partData || null);
      
      // You can also:
      // - Send analytics
      // - Open a modal
      // - Navigate to a detail page
      // - Call an API
      console.log(`User clicked: ${partId}`, partData);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // STEP 4: PASS your data to the info panel via renderInfoContent
  // ═══════════════════════════════════════════════════════════
  const displayMyContent = (partId: string) => {
    const data = myPatientData[partId];
    
    if (!data) {
      return <p>No records for this body part.</p>;
    }

    return (
      <div>
        <p><strong>Status:</strong> {data.status}</p>
        <p><strong>Notes:</strong> {data.notes}</p>
        <p><strong>Next Appointment:</strong> {data.appointmentDate}</p>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* The 3D Viewer */}
      <div style={{ flex: 1 }}>
        <HumanAnatomyViewer
          renderInfoContent={displayMyContent}    // PASS your content
          onPartSelect={handleBodyPartClick}       // RETRIEVE click events
          infoPanelTitle="Patient Record"
        />
      </div>

      {/* Your own UI showing retrieved data */}
      <div style={{ width: '300px', padding: '20px', background: '#f5f5f5' }}>
        <h3>Click Data Retrieved:</h3>
        {selectedPartId ? (
          <div>
            <p><strong>Body Part ID:</strong> {selectedPartId}</p>
            <pre>{JSON.stringify(clickedPartData, null, 2)}</pre>
          </div>
        ) : (
          <p>Click a body part to see data here</p>
        )}
      </div>
    </div>
  );
}
```

### Valid Body Part IDs

When a user clicks, `partId` will be one of these values:

| partId | Body Part |
|--------|-----------|
| `head` | Head |
| `neck` | Neck |
| `leftShoulder` | Left Shoulder |
| `rightShoulder` | Right Shoulder |
| `chest` | Chest |
| `heart` | Heart |
| `leftLung` | Left Lung |
| `rightLung` | Right Lung |
| `spine` | Spine |
| `leftArm` | Left Arm |
| `rightArm` | Right Arm |
| `liver` | Liver |
| `leftKidney` | Left Kidney |
| `rightKidney` | Right Kidney |
| `lowerBack` | Lower Back |
| `abdomen` | Abdomen |
| `hip` | Hip |
| `leftLeg` | Left Leg |
| `rightLeg` | Right Leg |
| `leftFoot` | Left Foot |
| `rightFoot` | Right Foot |

### Quick Reference

| What You Want | Prop to Use | Example |
|---------------|-------------|---------|
| Show custom content when clicked | `renderInfoContent` | `renderInfoContent={(partId) => <MyComponent data={myData[partId]} />}` |
| Know when user clicks | `onPartSelect` | `onPartSelect={(partId) => console.log('Clicked:', partId)}` |
| Know when user hovers | `onPartHover` | `onPartHover={(partId) => setHoveredPart(partId)}` |
| Set custom panel title | `infoPanelTitle` | `infoPanelTitle="Patient Record"` |
| Hide the built-in panel | `showInfoPanel` | `showInfoPanel={false}` |

---

## Live Data with Multiple Sections

For real-time data that can be short or detailed with multiple sections, use the built-in helper components. The panel automatically scrolls for long content and handles varying data sizes gracefully.

### Helper Components

Import the helper components to structure your content:

```tsx
import { 
  HumanAnatomyViewer,
  InfoSection,      // Collapsible section with title
  InfoList,         // Formatted list of items
  InfoBadge,        // Colored tag/badge
  InfoStatus        // Status indicator (success/warning/error/info)
} from 'human-anatomy-viewer';
```

### Example: Live Data from API

```tsx
import { useState, useEffect } from 'react';
import { 
  HumanAnatomyViewer, 
  InfoSection, 
  InfoList, 
  InfoBadge, 
  InfoStatus 
} from 'human-anatomy-viewer';

function PatientDashboard({ patientId }) {
  const [liveData, setLiveData] = useState({});

  // Simulate live data updates from your system
  useEffect(() => {
    async function fetchPatientData() {
      const response = await fetch(`/api/patients/${patientId}/health`);
      const data = await response.json();
      setLiveData(data);
    }
    
    fetchPatientData();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchPatientData, 30000);
    return () => clearInterval(interval);
  }, [patientId]);

  // Render content based on live data
  const renderLiveContent = (partId: string) => {
    const data = liveData[partId];
    
    // No data available
    if (!data) {
      return <p style={{ color: '#6b7280' }}>No records available.</p>;
    }

    // Short info - just status
    if (!data.details) {
      return <InfoStatus status={data.status} type={data.statusType} />;
    }

    // Detailed info with multiple sections
    return (
      <>
        {/* Status at top */}
        <div style={{ marginBottom: '16px' }}>
          <InfoStatus status={data.status} type={data.statusType} />
        </div>

        {/* Diagnosis section */}
        {data.diagnosis && (
          <InfoSection title="Diagnosis">
            <p>{data.diagnosis}</p>
            {data.diagnosisTags && data.diagnosisTags.map(tag => (
              <InfoBadge key={tag} label={tag} color="#6366f1" />
            ))}
          </InfoSection>
        )}

        {/* Medications section */}
        {data.medications && (
          <InfoSection title="Current Medications">
            <InfoList items={data.medications} />
          </InfoSection>
        )}

        {/* Test Results - collapsed by default */}
        {data.testResults && (
          <InfoSection title="Recent Test Results" collapsed>
            {data.testResults.map((test, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <strong>{test.name}:</strong> {test.value}
                <InfoBadge 
                  label={test.status} 
                  color={test.status === 'Normal' ? '#22c55e' : '#f59e0b'} 
                />
              </div>
            ))}
          </InfoSection>
        )}

        {/* Notes section */}
        {data.notes && (
          <InfoSection title="Doctor's Notes">
            <p>{data.notes}</p>
          </InfoSection>
        )}

        {/* Appointments */}
        {data.appointments && (
          <InfoSection title="Upcoming Appointments" collapsed>
            <InfoList items={data.appointments} />
          </InfoSection>
        )}
      </>
    );
  };

  return (
    <HumanAnatomyViewer
      renderInfoContent={renderLiveContent}
      infoPanelTitle="Patient Health Record"
      onPartSelect={(partId) => {
        // Optionally fetch fresh data when part is clicked
        if (partId) fetchDetailedData(partId);
      }}
    />
  );
}
```

### Helper Component Reference

| Component | Props | Description |
|-----------|-------|-------------|
| `InfoSection` | `title`, `children`, `collapsed?`, `accentColor?` | Collapsible section with title bar |
| `InfoList` | `items: string[]` | Clean formatted list |
| `InfoBadge` | `label`, `color?` | Colored pill/tag badge |
| `InfoStatus` | `status`, `type?` | Status with dot indicator. Types: `success`, `warning`, `error`, `info` |

### Panel Features

The info panel automatically:
- **Scrolls** for long content without overlapping other UI
- **Resets scroll** to top when switching body parts
- **Animates** smoothly when opening/closing
- **Handles any content size** - from a single status to detailed multi-section reports

---

## Healthcare App Integration

The library is designed to integrate with healthcare applications. You can pass custom content to display when body parts are clicked:

```tsx
import { HumanAnatomyViewer } from 'human-anatomy-viewer';

function HealthcareApp() {
  // Your patient data from your healthcare system
  const patientHealthData = {
    heart: {
      condition: "Atrial Fibrillation",
      medications: ["Warfarin", "Metoprolol"],
      lastCheckup: "2024-01-15",
      notes: "Patient showing improvement"
    },
    leftLung: {
      condition: "Healthy",
      lastCheckup: "2024-01-15"
    }
    // ... other body parts
  };

  // Custom content renderer - your app controls what shows in the panel
  const renderPatientInfo = (partId: string) => {
    const data = patientHealthData[partId];
    
    if (!data) {
      return <p>No health records for this region.</p>;
    }

    return (
      <div>
        <p><strong>Condition:</strong> {data.condition}</p>
        {data.medications && (
          <div>
            <strong>Medications:</strong>
            <ul>
              {data.medications.map(med => <li key={med}>{med}</li>)}
            </ul>
          </div>
        )}
        <p><strong>Last Checkup:</strong> {data.lastCheckup}</p>
        {data.notes && <p><strong>Notes:</strong> {data.notes}</p>}
      </div>
    );
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <HumanAnatomyViewer
        renderInfoContent={renderPatientInfo}
        infoPanelTitle="Patient Health Record"
        onPartSelect={(partId) => {
          // Optionally log or track selections
          console.log('User selected:', partId);
        }}
        onPartHover={(partId) => {
          // Optionally show preview on hover
          console.log('User hovering:', partId);
        }}
      />
    </div>
  );
}
```

### Key Integration Props

| Prop | Type | Description |
|------|------|-------------|
| `renderInfoContent` | `(partId: string) => ReactNode` | Custom render function for panel content. Your app controls exactly what displays. |
| `onPartSelect` | `(partId, partInfo) => void` | Callback when a body part is clicked. Use this to update your app state. |
| `onPartHover` | `(partId) => void` | Callback when hovering over body parts. Useful for previews. |
| `infoPanelTitle` | `string` | Custom title for the info panel (overrides body part name). |

### Content Fallback Behavior

When `renderInfoContent` is not provided, the InfoPanel will display:
1. Content from your custom `anatomyData` if provided, or
2. The built-in default anatomy data (educational descriptions and facts)

## Props

### HumanAnatomyViewer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelUrl` | `string` | `/geometries/human_body.glb` | URL to the 3D model file |
| `onPartSelect` | `(partId: string \| null, partInfo: BodyPartInfo \| null) => void` | - | Callback when a body part is clicked |
| `onPartHover` | `(partId: string \| null) => void` | - | Callback when hovering over body parts |
| `initialPartId` | `string \| null` | `null` | Initially selected body part |
| `anatomyData` | `AnatomyData` | `defaultAnatomyData` | Custom anatomy data for body parts |
| `renderInfoContent` | `(partId: string) => ReactNode` | - | Custom render function for info panel content |
| `showInfoPanel` | `boolean` | `true` | Show/hide the info panel |
| `infoPanelPosition` | `'left' \| 'right'` | `'right'` | Position of the info panel |
| `infoPanelTitle` | `string` | - | Custom title for the info panel |
| `backgroundColor` | `string` | `'#e0f2fe'` | Background color of the viewer |
| `controlsConfig` | `ControlsConfig` | See below | Camera control settings |
| `lightingConfig` | `LightingConfig` | See below | Lighting settings |
| `className` | `string` | - | CSS class for the container |
| `style` | `React.CSSProperties` | - | Inline styles for the container |

### ControlsConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enablePan` | `boolean` | `true` | Enable camera panning |
| `enableZoom` | `boolean` | `false` | Enable camera zoom |
| `enableRotate` | `boolean` | `true` | Enable camera rotation |
| `horizontalOnly` | `boolean` | `true` | Restrict to horizontal rotation only |

### LightingConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `ambientIntensity` | `number` | `0.6` | Ambient light intensity |
| `directionalIntensity` | `number` | `1` | Directional light intensity |

## Custom Anatomy Data

You can provide custom anatomy data for body parts:

```tsx
import { HumanAnatomyViewer } from 'human-anatomy-viewer';
import type { AnatomyData } from 'human-anatomy-viewer';

const customAnatomyData: AnatomyData = {
  head: {
    id: "head",
    name: "Head",
    description: "Your custom description here",
    facts: ["Custom fact 1", "Custom fact 2"],
    color: "#ff6b6b"
  },
  // ... other body parts
};

function App() {
  return (
    <HumanAnatomyViewer anatomyData={customAnatomyData} />
  );
}
```

## Individual Components

You can also import individual components for more control:

```tsx
import { 
  HumanBody, 
  InfoPanel, 
  defaultAnatomyData 
} from 'human-anatomy-viewer';
```

## Body Parts

The following body parts are available:

- `head` - Head
- `neck` - Neck
- `leftShoulder` / `rightShoulder` - Shoulders
- `chest` - Chest
- `heart` - Heart
- `leftLung` / `rightLung` - Lungs
- `spine` - Spine
- `leftArm` / `rightArm` - Arms
- `liver` - Liver
- `leftKidney` / `rightKidney` - Kidneys
- `lowerBack` - Lower Back
- `abdomen` - Abdomen
- `hip` - Hip
- `leftLeg` / `rightLeg` - Legs
- `leftFoot` / `rightFoot` - Feet

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import type {
  HumanAnatomyViewerProps,
  HumanBodyProps,
  InfoPanelProps,
  BodyPartInfo,
  AnatomyData,
  ControlsConfig,
  LightingConfig
} from 'human-anatomy-viewer';
```

## License

MIT
