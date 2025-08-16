// Sphere made of spheres - Step by step implementation

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import instanceVertex from "./instanceVertex.glsl";
import instanceFragment from "./instanceFragment.glsl";
import coreVertex from "./coreVertex.glsl";
import coreFragment from "./coreFragment.glsl";

function CoreSphere({ debug, ...props }: { debug?: boolean } & any) {
  const coreRef = useRef<THREE.Mesh>(null);
  const coreMaterialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (coreMaterialRef.current) {
      coreMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    // Rotate with the main sphere group
    if (coreRef.current && !debug) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <mesh ref={coreRef} {...props}>
      <sphereGeometry args={[0.7, 64, 64]} />
      <shaderMaterial
        ref={coreMaterialRef}
        vertexShader={coreVertex}
        fragmentShader={coreFragment}
        uniforms={{
          uTime: { value: 0.0 },
          uDistortionStrength: { value: 0.2 }, // Same as outer spheres
          uDistortionFrequency: { value: 1.2 }, // Same as outer spheres
          uTimeFrequency: { value: 0.3 }, // Same as outer spheres
          uCoreColor: { value: new THREE.Color("#2a0000") }, // Slightly brighter dark red
          uCoreIntensity: { value: 0.8 },
          uCoreDarkness: { value: 0.3 },
          uCoreGlow: { value: 1.0 },
          uGlowColor: { value: new THREE.Color("#ff4400") }, // Brighter red glow
        }}
        transparent={true}
        side={THREE.BackSide} // Render from inside so it shows through outer spheres
      />
    </mesh>
  );
}

function SphereOfSpheres({ debug, ...props }: { debug?: boolean } & any) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Generate positions for spheres on a sphere surface
  const spherePositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const radius = 0.85; // Main sphere radius
    const spheresCount = 5000; // Number of small spheres

    // Use Fibonacci sphere algorithm for even distribution
    for (let i = 0; i < spheresCount; i++) {
      const y = 1 - (i / (spheresCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);

      const theta = i * Math.PI * (3 - Math.sqrt(5)); // Golden angle

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      positions.push(new THREE.Vector3(x * radius, y * radius, z * radius));
    }

    return positions;
  }, []);

  // Instance position attribute for the shader
  const instancePositions = useMemo(() => {
    const positionsArray = new Float32Array(spherePositions.length * 3);
    spherePositions.forEach((pos, i) => {
      positionsArray[i * 3] = pos.x;
      positionsArray[i * 3 + 1] = pos.y;
      positionsArray[i * 3 + 2] = pos.z;
    });
    return new THREE.InstancedBufferAttribute(positionsArray, 3);
  }, [spherePositions]);

  const instanceIndices = useMemo(() => {
    const indicesArray = new Float32Array(spherePositions.length);
    spherePositions.forEach((_, i) => {
      indicesArray[i] = i;
    });
    return new THREE.InstancedBufferAttribute(indicesArray, 1);
  }, [spherePositions]);

  // Generate random sizes for each sphere (subtle variation)
  const instanceSizes = useMemo(() => {
    const sizesArray = new Float32Array(spherePositions.length);
    spherePositions.forEach((_, i) => {
      // Random size between 0.8 and 1.0 (current size is max)
      sizesArray[i] = 0.8 + Math.random() * 0.3;
    });
    return new THREE.InstancedBufferAttribute(sizesArray, 1);
  }, [spherePositions]);

  // Set up the instance matrix properly
  React.useEffect(() => {
    if (meshRef.current) {
      const matrix = new THREE.Matrix4();
      // Set identity matrices - positioning is handled in shader
      for (let i = 0; i < spherePositions.length; i++) {
        matrix.identity();
        meshRef.current.setMatrixAt(i, matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [spherePositions]);

  useFrame((state) => {
    if (materialRef.current && materialRef.current.uniforms.uTime) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    // Simple rotation when not in debug mode
    if (meshRef.current && !debug) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, spherePositions.length]}
      {...props}
    >
      <sphereGeometry args={[0.02, 8, 8]}>
        <instancedBufferAttribute
          attach="attributes-instancePosition"
          {...instancePositions}
        />
        <instancedBufferAttribute
          attach="attributes-instanceIndex"
          {...instanceIndices}
        />
        <instancedBufferAttribute
          attach="attributes-instanceSize"
          {...instanceSizes}
        />
      </sphereGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={instanceVertex}
        fragmentShader={instanceFragment}
        uniforms={{
          uTime: { value: 0.3 },
          uDistortionStrength: { value: 0.2 },
          uDistortionFrequency: { value: 1.2 },
          uTimeFrequency: { value: 0.3 },
          uColor: { value: new THREE.Color("#ffffff") },
          uNoiseStrength: { value: 1.0 },
          uInnerColor: { value: new THREE.Color("#ff1100") }, // Hot magma red
          uOuterColor: { value: new THREE.Color("#ffaa00") }, // Molten orange
          uGlassColor: { value: new THREE.Color("#88ccff") }, // Cool glass blue
          uColorIntensity: { value: 1.0 },
          uFresnelPower: { value: 2.0 },
          uFresnelIntensity: { value: 0.3 },
          uFresnelColor: { value: new THREE.Color("#ffffff") },
          uGlassiness: { value: 0.4 },
          uDistortionAmount: { value: 0.1 },
          uProximityRadius: { value: 0.15 },
          uMergingIntensity: { value: 0.5 },
          uIridescence: { value: 0.3 },
          uReflectionStrength: { value: 0.2 },
        }}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={true}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

export default function BlobV2Scene({ debug = false }: { debug: boolean }) {
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
        autoRotateSpeed={0.5}
      />
      <CoreSphere debug={debug} />
      <SphereOfSpheres debug={debug} />
      <ambientLight intensity={0.5} />

      <EffectComposer>
        <Bloom
          intensity={1.2} // Reduced intensity for softer glow
          kernelSize={5} // Larger kernel for smoother blur
          luminanceThreshold={0.3} // Higher threshold for more selective bloom
          luminanceSmoothing={0.8} // Much smoother luminance transition
          mipmapBlur={true} // Enable mipmap blur for better performance
          resolutionX={512} // Higher resolution for smoother gradients
          resolutionY={512} // Higher resolution for smoother gradients
        />
      </EffectComposer>
    </Canvas>
  );
}
