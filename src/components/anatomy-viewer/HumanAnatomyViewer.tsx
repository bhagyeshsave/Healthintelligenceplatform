import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useCallback } from "react";
import { OrbitControls } from "@react-three/drei";
import { HumanBody } from "./HumanBody";
import { InfoPanel } from "./InfoPanel";
import { defaultAnatomyData } from "./defaultAnatomyData";
import type { HumanAnatomyViewerProps, BodyPartInfo } from "./types";

function Lights({ ambientIntensity = 0.6, directionalIntensity = 1 }: { ambientIntensity?: number; directionalIntensity?: number }) {
  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[5, 5, 5]} intensity={directionalIntensity} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={directionalIntensity * 0.5} />
      <pointLight position={[0, 3, 3]} intensity={0.4} />
    </>
  );
}

const DEFAULT_MODEL_URL = "/geometries/human_body.glb";

export function HumanAnatomyViewer({
  modelUrl = DEFAULT_MODEL_URL,
  onPartSelect,
  onPartHover,
  initialPartId = null,
  anatomyData = defaultAnatomyData,
  renderInfoContent,
  controlsConfig = {},
  lightingConfig = {},
  showInfoPanel = true,
  infoPanelPosition = 'right',
  infoPanelTitle,
  backgroundColor = '#e0f2fe',
  className,
  style
}: HumanAnatomyViewerProps) {
  const [selectedPart, setSelectedPart] = useState<string | null>(initialPartId);

  const {
    enablePan = true,
    enableZoom = false,
    enableRotate = true,
    horizontalOnly = true
  } = controlsConfig;

  const {
    ambientIntensity = 0.6,
    directionalIntensity = 1
  } = lightingConfig;

  const handlePartClick = useCallback((partId: string) => {
    setSelectedPart(partId);
    if (onPartSelect) {
      const partInfo = anatomyData[partId] || null;
      onPartSelect(partId, partInfo);
    }
  }, [onPartSelect, anatomyData]);

  const handlePartHover = useCallback((partId: string | null) => {
    if (onPartHover) {
      onPartHover(partId);
    }
  }, [onPartHover]);

  const handleCloseInfo = useCallback(() => {
    setSelectedPart(null);
    if (onPartSelect) {
      onPartSelect(null, null);
    }
  }, [onPartSelect]);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    background: `linear-gradient(to bottom, ${backgroundColor}, ${backgroundColor}ee)`,
    ...style
  };

  return (
    <div className={className} style={containerStyle}>
      <Canvas
        shadows
        camera={{
          position: [0, 0.3, 1.6],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          powerPreference: "default"
        }}
      >
        <color attach="background" args={[backgroundColor]} />
        <Suspense fallback={null}>
          <Lights 
            ambientIntensity={ambientIntensity} 
            directionalIntensity={directionalIntensity} 
          />
          <HumanBody 
            onPartClick={handlePartClick}
            onPartHover={handlePartHover}
            selectedPart={selectedPart}
            modelPath={modelUrl}
          />
          <OrbitControls 
            enablePan={enablePan}
            enableZoom={enableZoom}
            enableRotate={enableRotate}
            minPolarAngle={horizontalOnly ? Math.PI / 2 : 0}
            maxPolarAngle={horizontalOnly ? Math.PI / 2 : Math.PI}
          />
        </Suspense>
      </Canvas>

      {showInfoPanel && (
        <InfoPanel 
          selectedPartId={selectedPart}
          anatomyData={anatomyData}
          renderContent={renderInfoContent}
          onClose={handleCloseInfo}
          position={infoPanelPosition}
          title={infoPanelTitle}
        />
      )}

      <div 
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          padding: '8px 12px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
      >
        <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>
          <span style={{ fontWeight: 600 }}>Controls:</span> Left-click & drag to rotate • Right-click & drag to pan
        </p>
      </div>
    </div>
  );
}
