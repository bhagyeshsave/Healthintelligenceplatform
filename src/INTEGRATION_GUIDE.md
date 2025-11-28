# 3D Human Body Integration Guide

## Overview
The **HumanBody3D** component provides an interactive 3D anatomical visualization using Three.js and React Three Fiber. It's integrated into the **Twin v2 Copy** tab.

## Component: `HumanBody3D.tsx`

### Features
✅ **Interactive 3D Model** - Drag to rotate, scroll to zoom  
✅ **Clickable Organs** - Click on brain, heart, lungs, metabolism, kidneys  
✅ **Status Visualization** - Color-coded health status (green=optimal, orange=attention, red=concern)  
✅ **Pulse Animation** - Non-optimal organs pulse to draw attention  
✅ **Event Callbacks** - Returns clicked body part ID to parent  
✅ **Data-Driven** - Accepts body part data for dynamic rendering  

---

## Usage

### Basic Implementation

```tsx
import { HumanBody3D } from './components/HumanBody3D';

function MyComponent() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  
  const bodyParts = [
    { 
      id: 'heart', 
      name: 'Cardiovascular', 
      status: 'optimal', 
      color: 'from-red-500 to-pink-500' 
    },
    { 
      id: 'brain', 
      name: 'Brain & Cognition', 
      status: 'attention', 
      color: 'from-purple-500 to-pink-500' 
    },
    // ... more body parts
  ];

  return (
    <div className="w-full h-[500px]">
      <HumanBody3D
        bodyParts={bodyParts}
        selectedPart={selectedPart}
        onBodyPartClick={(partId) => {
          console.log('Clicked:', partId);
          setSelectedPart(partId);
        }}
        zoom={1}
        rotation={0}
      />
    </div>
  );
}
```

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `bodyParts` | `BodyPart[]` | ✅ Yes | Array of body part objects |
| `onBodyPartClick` | `(partId: string) => void` | ✅ Yes | Callback when body part is clicked |
| `selectedPart` | `string \| null` | ✅ Yes | Currently selected body part ID |
| `zoom` | `number` | ❌ No | Zoom level (0.5-2, default: 1) |
| `rotation` | `number` | ❌ No | Rotation angle in degrees (0-360) |

### BodyPart Interface

```typescript
interface BodyPart {
  id: string;           // Unique identifier: 'brain', 'heart', 'lungs', etc.
  name: string;         // Display name: 'Brain & Cognition'
  status: 'optimal' | 'attention' | 'concern';  // Health status
  color: string;        // Tailwind gradient classes
}
```

---

## Supported Body Parts

The component currently supports 5 major body systems:

| ID | Name | Position | Typical Status Colors |
|----|------|----------|----------------------|
| `brain` | Brain & Cognition | Head | Purple/Pink gradient |
| `heart` | Cardiovascular | Chest (upper) | Red/Pink gradient |
| `lungs` | Respiratory | Chest (middle) | Cyan/Blue gradient |
| `metabolism` | Metabolic Health | Abdomen | Orange/Red gradient |
| `kidneys` | Renal Function | Lower abdomen | Blue/Cyan gradient |

---

## Status Color Mapping

The component automatically maps status to colors:

- **Optimal** (Green): `#22c55e` → `#34d399` (hover)
- **Attention** (Orange): `#f97316` → `#fb923c` (hover)
- **Concern** (Red): `#ef4444` → `#f87171` (hover)
- **Selected**: Uses custom gradient color from props

---

## Event Flow

```
User clicks organ
    ↓
onBodyPartClick(partId) triggered
    ↓
Parent component updates selectedPart state
    ↓
HumanBody3D re-renders with highlighted organ
    ↓
Parent can show detailed info panel
```

---

## Example: Full Integration

See `/components/DigitalTwinV2Copy.tsx` for a complete implementation example that includes:

1. **3D Body Visualization** - Left panel with HumanBody3D
2. **Historical Insights** - Right panel showing AI-powered health insights
3. **What-If Simulation** - Bottom panel for lifestyle change projections
4. **Interactive Controls** - Zoom, rotate, and reset buttons

---

## Customization

### Adding New Body Parts

Edit the `createBodyMeshes` function in `HumanBody3D.tsx`:

```typescript
const partsMap: Record<string, ...> = {
  // ... existing parts
  liver: {
    position: [0.3, 0.5, 0.2],  // [x, y, z] coordinates
    geometry: 'box',             // 'sphere' | 'box' | 'cylinder'
    scale: [0.6, 0.4, 0.3],     // [width, height, depth]
  },
};
```

### Adjusting Animations

Modify the `useFrame` hook in the `BodyPart` component:

```typescript
// Change pulse speed
const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
                                              // ↑ Speed multiplier

// Change pulse intensity
meshRef.current.scale.set(
  part.scale[0] * pulse,
  part.scale[1] * pulse * 1.2,  // ← Vertical emphasis
  part.scale[2] * pulse
);
```

---

## Performance Notes

- Uses **WebGL** for hardware-accelerated rendering
- Optimized with **React Three Fiber** reconciliation
- Minimal re-renders with proper React memoization
- Tested with 5-10 concurrent body parts
- Responsive on mobile and desktop

---

## Browser Compatibility

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  

**Requirements:**
- WebGL 2.0 support
- ES6+ JavaScript

---

## Dependencies

```json
{
  "@react-three/fiber": "latest",
  "@react-three/drei": "latest",
  "three": "latest"
}
```

These are auto-imported in the Figma Make environment.

---

## Future Enhancements

🔮 **Potential additions:**
- [ ] External organ systems (skin, muscles, bones)
- [ ] Anatomical labels on hover
- [ ] Animated blood flow visualization
- [ ] Real-time health metric overlays
- [ ] VR/AR support
- [ ] Multi-language labels
- [ ] Accessibility improvements (keyboard navigation)

---

## Support

For questions or issues with the 3D body integration, refer to:
- Component: `/components/HumanBody3D.tsx`
- Example usage: `/components/DigitalTwinV2Copy.tsx`
- Three.js docs: https://threejs.org
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
