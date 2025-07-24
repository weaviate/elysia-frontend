import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Globe from "./Globe";
import { PixelationEffect } from "./PixelationEffect";

function CameraRotation() {
  useFrame(({ camera }) => {
    // Rotate camera around the globe
    const radius = 6; // Increased distance for better view
    const speed = 0.03; // Slower rotation for the network globe
    const time = performance.now() * 0.001 * speed;

    camera.position.x = Math.sin(time) * radius;
    camera.position.z = Math.cos(time) * radius;
    camera.position.y = Math.sin(time * 0.3) * 2; // Add some vertical movement
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function NetworkGlobe({
  debug = false,
  nodeCount = 120,
  glowColor = "#00ff88",
  secondaryColor = "#8844ff",
  pixelSize = 3,
  enableRetroEffect = true,
  enableLoFiPixelation = true,
  pixelationFactor = 4.0,
  enableWobble = true,
}: {
  debug?: boolean;
  nodeCount?: number;
  glowColor?: string;
  secondaryColor?: string;
  pixelSize?: number;
  enableRetroEffect?: boolean;
  enableLoFiPixelation?: boolean;
  pixelationFactor?: number;
  enableWobble?: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ background: "transparent" }}
      gl={{
        alpha: true,
        antialias: false, // Disable antialiasing for sharper pixels
        powerPreference: "high-performance",
      }}
    >
      {!debug && <CameraRotation />}

      <OrbitControls
        enableZoom={debug}
        enablePan={debug}
        enableRotate={debug}
        maxDistance={15}
        minDistance={3}
      />

      {/* Ambient lighting for subtle illumination */}
      <ambientLight intensity={0.2} />

      {/* Main Globe Component with Network Topology and Retro Effects */}
      <Globe
        radius={2}
        nodeCount={nodeCount}
        wireframeColor={glowColor}
        branchColor={secondaryColor}
        glowColor={glowColor}
        retroMode={enableRetroEffect}
        pixelSize={pixelSize}
      />

      {/* Post-processing Effects */}
      {enableLoFiPixelation && (
        <EffectComposer>
          <Bloom intensity={0.3} luminanceThreshold={0.9} />
          <PixelationEffect
            pixelationFactor={pixelationFactor}
            enableWobble={enableWobble}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
