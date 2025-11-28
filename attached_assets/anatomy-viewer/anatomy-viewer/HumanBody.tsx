import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { HumanBodyProps } from "./types";

const VALID_PART_IDS = [
  "head", "neck", "leftShoulder", "rightShoulder", "chest", "heart",
  "leftLung", "rightLung", "spine", "leftArm", "rightArm", "liver",
  "leftKidney", "rightKidney", "lowerBack", "abdomen", "hip",
  "leftLeg", "rightLeg", "leftFoot", "rightFoot"
] as const;

export function HumanBody({ onPartClick, onPartHover, selectedPart, modelPath }: HumanBodyProps) {
  const [hovered, setHovered] = useState(false);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  
  const { scene } = useGLTF(modelPath);
  
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    materialsRef.current = [];
    
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = new THREE.MeshStandardMaterial({
          color: "#e8e0d5",
          roughness: 0.4,
          metalness: 0.05,
        });
        child.material = material;
        materialsRef.current.push(material);
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    const baseColor = new THREE.Color("#e8e0d5");
    const selectedColor = new THREE.Color("#a8d8ff");
    const hoverColor = new THREE.Color("#c8e8ff");
    
    materialsRef.current.forEach((material) => {
      if (selectedPart) {
        material.color.copy(selectedColor);
        material.emissive.setHex(0x111122);
      } else if (hoveredPart) {
        material.color.copy(hoverColor);
        material.emissive.setHex(0x050510);
      } else {
        material.color.copy(baseColor);
        material.emissive.setHex(0x000000);
      }
    });
  }, [selectedPart, hoveredPart]);

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = hovered ? 1.02 : 1;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  const getBodyPartFromPosition = (point: THREE.Vector3): string => {
    const x = point.x;
    const y = point.y;
    const z = point.z;
    
    if (y > 0.36) {
      return "head";
    }
    if (y > 0.30) return "neck";
    
    if (y > 0.22) {
      if (Math.abs(z) > 0.08) {
        return z < 0 ? "leftShoulder" : "rightShoulder";
      }
      if (x < -0.03) return "spine";
      if (z < -0.03) return "leftLung";
      if (z > 0.03) return "rightLung";
      return "heart";
    }
    
    if (y > 0.12) {
      if (Math.abs(z) > 0.10) {
        return z < 0 ? "leftArm" : "rightArm";
      }
      if (x < -0.03) return "spine";
      if (z < -0.03) return "leftLung";
      if (z > 0.03) return "rightLung";
      return "chest";
    }
    
    if (y > -0.04) {
      if (Math.abs(z) > 0.10) {
        return z < 0 ? "leftArm" : "rightArm";
      }
      if (x < -0.03) {
        if (z < -0.02) return "leftKidney";
        if (z > 0.02) return "rightKidney";
        return "lowerBack";
      }
      if (z > 0.02) return "liver";
      return "abdomen";
    }
    
    if (y > -0.18) {
      return "hip";
    }
    
    if (y > -0.42) {
      return z < 0 ? "leftLeg" : "rightLeg";
    }
    
    return z < 0 ? "leftFoot" : "rightFoot";
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.point && modelRef.current) {
      const localPoint = modelRef.current.worldToLocal(e.point.clone());
      const partId = getBodyPartFromPosition(localPoint);
      onPartClick(partId);
    }
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
    if (e.point && modelRef.current) {
      const localPoint = modelRef.current.worldToLocal(e.point.clone());
      const partId = getBodyPartFromPosition(localPoint);
      setHoveredPart(partId);
      if (onPartHover) {
        onPartHover(partId);
      }
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    setHoveredPart(null);
    document.body.style.cursor = 'default';
    if (onPartHover) {
      onPartHover(null);
    }
  };

  return (
    <group ref={groupRef} position={[0, 0.1, 0]} scale={[4.0, 4.0, 4.0]}>
      <group 
        ref={modelRef}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <primitive 
          object={clonedScene}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      </group>
    </group>
  );
}
