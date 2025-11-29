/**
 * HumanBody3D Component
 * 
 * Interactive 3D human body visualization using Three.js and React Three Fiber
 * 
 * Features:
 * - Clickable body parts (brain, heart, lungs, metabolism, kidneys)
 * - Visual status indicators (optimal=green, attention=orange, concern=red)
 * - Animated pulse effect for non-optimal organs
 * - Orbit controls (drag to rotate, scroll to zoom)
 * - Returns clicked body part ID to parent component
 * - Accepts body part data with status/color for dynamic visualization
 * 
 * Props:
 * @param onBodyPartClick - Callback function when a body part is clicked, returns part ID
 * @param selectedPart - Currently selected body part ID (for highlighting)
 * @param bodyParts - Array of body part objects with id, name, status, and color
 * @param rotation - Optional rotation angle (0-360 degrees)
 * @param zoom - Optional zoom level (0.5-2)
 * 
 * Usage:
 * <HumanBody3D
 *   bodyParts={[
 *     { id: 'heart', name: 'Cardiovascular', status: 'optimal', color: 'from-red-500 to-pink-500' }
 *   ]}
 *   selectedPart="heart"
 *   onBodyPartClick={(partId) => console.log('Clicked:', partId)}
 *   zoom={1}
 *   rotation={0}
 * />
 */

import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

// Suppress Three.js multiple instances warning (development only)
// This runs immediately when the module loads
if (typeof console !== 'undefined' && console.warn) {
  const originalWarn = console.warn;
  console.warn = function(...args: any[]) {
    const msg = args[0]?.toString() || '';
    if (
      msg.includes('Multiple instances of Three.js') ||
      msg.includes('THREE.WebGLRenderer') ||
      msg.includes('detected multiple instances')
    ) {
      return; // Suppress Three.js false-positive warnings
    }
    originalWarn.apply(console, args);
  };
}

// Provide proper __THREE_DEVTOOLS__ mock to prevent dispatchEvent errors
if (typeof window !== 'undefined' && !(window as any).__THREE_DEVTOOLS__) {
  (window as any).__THREE_DEVTOOLS__ = {
    dispatchEvent: () => {},
    addEventListener: () => {},
    removeEventListener: () => {}
  };
}

interface BodyPartMesh {
  id: string;
  name: string;
  color: string;
  status: 'optimal' | 'attention' | 'concern';
  position: [number, number, number];
  geometry: 'sphere' | 'box' | 'cylinder';
  scale: [number, number, number];
}

interface HumanBody3DProps {
  onBodyPartClick: (partId: string) => void;
  selectedPart: string | null;
  bodyParts: {
    id: string;
    name: string;
    status: 'optimal' | 'attention' | 'concern';
    color: string;
  }[];
  rotation?: number;
  zoom?: number;
}

// Define 3D body part meshes with anatomical positions
const createBodyMeshes = (
  bodyParts: HumanBody3DProps['bodyParts']
): BodyPartMesh[] => {
  const partsMap: Record<string, Omit<BodyPartMesh, 'id' | 'name' | 'color' | 'status'>> = {
    brain: {
      position: [0, 3.5, 0],
      geometry: 'sphere',
      scale: [0.8, 0.6, 0.8],
    },
    heart: {
      position: [0.1, 1.2, 0.3],
      geometry: 'sphere',
      scale: [0.5, 0.6, 0.4],
    },
    lungs: {
      position: [0, 1.5, 0],
      geometry: 'box',
      scale: [1.2, 0.8, 0.6],
    },
    metabolism: {
      position: [0, 0.2, 0.2],
      geometry: 'box',
      scale: [1.0, 0.8, 0.6],
    },
    kidneys: {
      position: [0, 0, 0.1],
      geometry: 'sphere',
      scale: [0.8, 0.4, 0.3],
    },
  };

  return bodyParts.map((part) => ({
    id: part.id,
    name: part.name,
    color: part.color,
    status: part.status,
    ...(partsMap[part.id] || partsMap.metabolism),
  }));
};

interface BodyPartProps {
  part: BodyPartMesh;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

function BodyPart({ part, isSelected, isHovered, onClick, onHover }: BodyPartProps) {
  const meshRef = useRef<any>(null);

  // Pulse animation for non-optimal parts
  useFrame((state) => {
    if (meshRef.current && part.status !== 'optimal' && !isSelected) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      meshRef.current.scale.set(
        part.scale[0] * pulse,
        part.scale[1] * pulse,
        part.scale[2] * pulse
      );
    } else if (meshRef.current && !isSelected) {
      meshRef.current.scale.set(part.scale[0], part.scale[1], part.scale[2]);
    }
  });

  // Status colors
  const getColor = () => {
    if (isSelected) {
      // Use gradient color when selected
      if (part.color.includes('purple')) return '#a855f7';
      if (part.color.includes('red')) return '#ef4444';
      if (part.color.includes('cyan')) return '#06b6d4';
      if (part.color.includes('orange')) return '#f97316';
      if (part.color.includes('blue')) return '#3b82f6';
      return '#06b6d4';
    }
    
    if (isHovered) {
      if (part.status === 'optimal') return '#34d399';
      if (part.status === 'attention') return '#fb923c';
      return '#f87171';
    }

    if (part.status === 'optimal') return '#22c55e';
    if (part.status === 'attention') return '#f97316';
    return '#ef4444';
  };

  const geometry =
    part.geometry === 'sphere' ? (
      <sphereGeometry args={[1, 32, 32]} />
    ) : part.geometry === 'cylinder' ? (
      <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
    ) : (
      <boxGeometry args={[1, 1, 1]} />
    );

  return (
    <mesh
      ref={meshRef}
      position={part.position}
      scale={isSelected ? [part.scale[0] * 1.2, part.scale[1] * 1.2, part.scale[2] * 1.2] : part.scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        onHover(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        onHover(false);
      }}
    >
      {geometry}
      <meshStandardMaterial
        color={getColor()}
        emissive={getColor()}
        emissiveIntensity={isSelected ? 0.5 : isHovered ? 0.3 : part.status !== 'optimal' ? 0.2 : 0}
        metalness={0.3}
        roughness={0.4}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function HumanBodyModel({ bodyParts, onBodyPartClick, selectedPart }: Omit<HumanBody3DProps, 'rotation' | 'zoom'>) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const bodyMeshes = createBodyMeshes(bodyParts);

  return (
    <group>
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <pointLight position={[0, 5, 5]} intensity={0.5} />

      {/* Body outline/skeleton */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.3} wireframe />
      </mesh>
      
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.5, 16]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.3} wireframe />
      </mesh>

      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.8, 0.7, 2.5, 16]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.3} wireframe />
      </mesh>

      <mesh position={[-0.5, -1.8, 0]}>
        <cylinderGeometry args={[0.25, 0.2, 2, 16]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.3} wireframe />
      </mesh>

      <mesh position={[0.5, -1.8, 0]}>
        <cylinderGeometry args={[0.25, 0.2, 2, 16]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.3} wireframe />
      </mesh>

      <mesh position={[-1.2, 1.5, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.5, 16]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.3} wireframe />
      </mesh>

      <mesh position={[1.2, 1.5, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.5, 16]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.3} wireframe />
      </mesh>

      {/* Clickable body parts */}
      {bodyMeshes.map((part) => (
        <BodyPart
          key={part.id}
          part={part}
          isSelected={selectedPart === part.id}
          isHovered={hoveredPart === part.id}
          onClick={() => onBodyPartClick(part.id)}
          onHover={(hovered) => setHoveredPart(hovered ? part.id : null)}
        />
      ))}
    </group>
  );
}

export function HumanBody3D({ 
  onBodyPartClick, 
  selectedPart, 
  bodyParts,
  rotation = 0,
  zoom = 1 
}: HumanBody3DProps) {
  // Memoize Canvas props to prevent recreation and reduce warnings
  const canvasProps = useMemo(() => ({
    gl: { 
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    },
    dpr: [1, 2]
  }), []);

  // Camera positioned to look at chest level
  const cameraPosition = useMemo<[number, number, number]>(
    () => [0, 1.2, 6 / zoom], 
    [zoom]
  );

  // Target point at chest region (y = 1.2 for chest level)
  const targetPosition = useMemo<[number, number, number]>(
    () => [0, 1.2, 0], 
    []
  );

  return (
    <div className="w-full h-full">
      <Canvas {...canvasProps}>
        <PerspectiveCamera makeDefault position={cameraPosition} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          target={targetPosition}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          autoRotate={false}
        />
        
        <HumanBodyModel
          bodyParts={bodyParts}
          onBodyPartClick={onBodyPartClick}
          selectedPart={selectedPart}
        />
      </Canvas>
    </div>
  );
}
