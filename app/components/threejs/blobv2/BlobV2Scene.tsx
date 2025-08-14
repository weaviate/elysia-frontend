// 3D Matrix Abstract Object

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

function Matrix3DObject({
  debug,
  ...props
}: {
  debug?: boolean;
  /* eslint-disable @typescript-eslint/no-explicit-any */
} & any) {
  const meshRef = useRef<THREE.Mesh>();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const materialRef = useRef<any>();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    // Slow rotation for better viewing
    if (meshRef.current && !debug) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} {...props}>
      {/* Using icosphere for smooth organic morphing */}
      <icosahedronGeometry args={[1, 8]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={{
          uTime: { value: 0.0 },
          uMorphStrength: { value: 0.3 },
          uWaveFrequency: { value: 2.0 },
          uNoiseScale: { value: 1.5 },
          uMatrixSpeed: { value: 1.0 },
          uGlowStrength: { value: 1.2 },
          uCodeDensity: { value: 8.0 },
          uPrimaryColor: { value: new THREE.Color("#00ff41") }, // Classic Matrix green
          uSecondaryColor: { value: new THREE.Color("#00ff88") }, // Brighter green
          uAccentColor: { value: new THREE.Color("#ffffff") }, // White highlights
        }}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function Matrix3DScene({ debug = false }: { debug: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      style={{ background: "transparent" }}
      gl={{
        alpha: true,
        antialias: true,
      }}
    >
      <OrbitControls
        enableZoom={debug}
        enablePan={debug}
        enableRotate={debug}
        autoRotate={!debug}
        autoRotateSpeed={1}
      />
      <Matrix3DObject debug={debug} />
      {/* Add some ambient lighting for depth */}
      <ambientLight intensity={0.1} />
    </Canvas>
  );
}
