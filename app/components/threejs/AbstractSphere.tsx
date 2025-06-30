// pages/index.js

import React, { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
import { useControls } from "leva";

function BasicSphere({
  debug,
  displacementStrength,
  distortionStrength,
  ...props
}: {
  debug?: boolean;
  displacementStrength: React.MutableRefObject<number> | null;
  distortionStrength: React.MutableRefObject<number> | null;
  /* eslint-disable @typescript-eslint/no-explicit-any */
} & any) {
  const meshRef = useRef<THREE.Mesh>();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const materialRef = useRef<any>();

  const uniformsRef = useRef({
    uTime: { value: 0 },
    uTimeFrequency: { value: 0.3 },
    uDistortionFrequency: { value: 1.8 },
    uDistortionStrength: { value: 0.3 },
    uDisplacementFrequency: { value: 2.4 },
    uDisplacementStrength: { value: 0.15 },
    uLightAColor: { value: new THREE.Color("#7eff86") },
    uLightBColor: { value: new THREE.Color("#0c79f2") },
    uLightAPosition: { value: new THREE.Vector3(1.0, -2.0, 1) },
    uLightBPosition: { value: new THREE.Vector3(1.0, -2.0, 1) },
    uLightAIntensity: { value: 6 },
    uLightBIntensity: { value: 6 },
    uSubdivision: { value: new THREE.Vector2(512, 512) },
    uFresnelOffset: { value: 0.01 },
    uFresnelMultiplier: { value: 0.95 },
    uFresnelPower: { value: 9.0 },
    uNoiseStrength: { value: 1.5 },
    uNoiseFrequency: { value: 1 },
  });

  useEffect(() => {
    if (!debug) {
      uniformsRef.current.uFresnelMultiplier.value = 0;
      uniformsRef.current.uDisplacementStrength.value = 0;
    }
  }, [debug]);

  // Add debug controls
  const controls = debug
    ? /* eslint-disable react-hooks/rules-of-hooks */
      useControls("Sphere Settings", {
        timeFrequency: {
          value: uniformsRef.current.uTimeFrequency.value,
          min: 0,
          max: 2,
          step: 0.01,
        },
        distortionFrequency: {
          value: uniformsRef.current.uDistortionFrequency.value,
          min: 0,
          max: 10,
          step: 0.001,
        },
        distortionStrength: {
          value: uniformsRef.current.uDistortionStrength.value,
          min: 0,
          max: 10,
          step: 0.001,
        },
        displacementFrequency: {
          value: uniformsRef.current.uDisplacementFrequency.value,
          min: 0,
          max: 5,
          step: 0.001,
        },
        displacementStrength: {
          value: uniformsRef.current.uDisplacementStrength.value,
          min: 0,
          max: 1,
          step: 0.001,
        },
        lightAColor: "#0cf700",
        lightBColor: "#1896cc",
        lightAIntensity: {
          value: uniformsRef.current.uLightAIntensity.value,
          min: 0,
          max: 10,
          step: 0.001,
        },
        lightBIntensity: {
          value: uniformsRef.current.uLightBIntensity.value,
          min: 0,
          max: 10,
          step: 0.001,
        },
        lightAPosition: {
          value: [
            uniformsRef.current.uLightAPosition.value.x,
            uniformsRef.current.uLightAPosition.value.y,
            uniformsRef.current.uLightAPosition.value.z,
          ],
        },
        lightBPosition: {
          value: [
            uniformsRef.current.uLightBPosition.value.x,
            uniformsRef.current.uLightBPosition.value.y,
            uniformsRef.current.uLightBPosition.value.z,
          ],
        },
        subdivisionX: {
          value: uniformsRef.current.uSubdivision.value.x,
          min: 1,
          max: 1024,
          step: 1,
        },
        subdivisionY: {
          value: uniformsRef.current.uSubdivision.value.y,
          min: 1,
          max: 1024,
          step: 1,
        },
        fresnelOffset: {
          value: uniformsRef.current.uFresnelOffset.value,
          min: -1,
          max: 1,
          step: 0.001,
        },
        fresnelMultiplier: {
          value: uniformsRef.current.uFresnelMultiplier.value,
          min: 0,
          max: 5,
          step: 0.001,
        },
        fresnelPower: {
          value: uniformsRef.current.uFresnelPower.value,
          min: 0,
          max: 15,
          step: 0.001,
        },
        noiseStrength: {
          value: uniformsRef.current.uNoiseStrength.value,
          min: 0,
          max: 10,
          step: 0.01,
        },
        noiseFrequency: {
          value: uniformsRef.current.uNoiseFrequency.value,
          min: 0,
          max: 5,
          step: 0.01,
        },
      })
    : null;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (materialRef.current) {
      uniformsRef.current.uTime.value = time;

      if (controls) {
        uniformsRef.current.uTimeFrequency.value = controls.timeFrequency;
        uniformsRef.current.uDistortionFrequency.value =
          controls.distortionFrequency;
        uniformsRef.current.uDistortionStrength.value =
          controls.distortionStrength;
        uniformsRef.current.uDisplacementFrequency.value =
          controls.displacementFrequency;
        uniformsRef.current.uDisplacementStrength.value =
          controls.displacementStrength;
        uniformsRef.current.uLightAColor.value = new THREE.Color(
          controls.lightAColor,
        );
        uniformsRef.current.uLightBColor.value = new THREE.Color(
          controls.lightBColor,
        );
        uniformsRef.current.uLightAPosition.value = new THREE.Vector3(
          controls.lightAPosition[0],
          controls.lightAPosition[1],
          controls.lightAPosition[2],
        );
        uniformsRef.current.uLightBPosition.value = new THREE.Vector3(
          controls.lightBPosition[0],
          controls.lightBPosition[1],
          controls.lightBPosition[2],
        );
        uniformsRef.current.uSubdivision.value = new THREE.Vector2(
          controls.subdivisionX,
          controls.subdivisionY,
        );
        uniformsRef.current.uFresnelOffset.value = controls.fresnelOffset;
        uniformsRef.current.uFresnelMultiplier.value =
          controls.fresnelMultiplier;
        uniformsRef.current.uFresnelPower.value = controls.fresnelPower;
        uniformsRef.current.uLightAIntensity.value = controls.lightAIntensity;
        uniformsRef.current.uLightBIntensity.value = controls.lightBIntensity;
        uniformsRef.current.uNoiseStrength.value = controls.noiseStrength;
        uniformsRef.current.uNoiseFrequency.value = controls.noiseFrequency;
      } else {
        uniformsRef.current.uFresnelMultiplier.value += 0.01;
        uniformsRef.current.uFresnelMultiplier.value = Math.min(
          uniformsRef.current.uFresnelMultiplier.value,
          1.0,
        );

        if (displacementStrength && displacementStrength.current > 0.0) {
          const targetDisplacement = displacementStrength.current;
          const currentDisplacement =
            uniformsRef.current.uDisplacementStrength.value;
          const factor = 0.1;

          uniformsRef.current.uDisplacementStrength.value =
            THREE.MathUtils.lerp(
              currentDisplacement,
              targetDisplacement,
              factor,
            );

          displacementStrength.current -= 0.0001;
          displacementStrength.current = Math.max(
            displacementStrength.current,
            0.125,
          );
        }

        if (distortionStrength && distortionStrength.current > 0.0) {
          const targetDistortion = distortionStrength.current;
          const currentDistortion =
            uniformsRef.current.uDistortionStrength.value;
          const factor = 0.1;

          uniformsRef.current.uDistortionStrength.value = THREE.MathUtils.lerp(
            currentDistortion,
            targetDistortion,
            factor,
          );
          distortionStrength.current -= 0.0001;
          distortionStrength.current = Math.max(
            distortionStrength.current,
            0.125,
          );
        }
      }
    }
  });

  return (
    <mesh ref={meshRef} scale={[1, 1, 1]} {...props}>
      {/* Using sphereGeometry with computed tangents */}
      <sphereGeometry
        args={[
          1,
          uniformsRef.current.uSubdivision.value.x,
          uniformsRef.current.uSubdivision.value.y,
        ]}
        onUpdate={(geometry) => {
          geometry.computeTangents();
        }}
      />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniformsRef.current}
        defines={{
          USE_TANGENT: "",
        }}
      />
    </mesh>
  );
}

export default function AbstractSphereScene({
  debug = false,
  displacementStrength,
  distortionStrength,
}: {
  debug: boolean;
  displacementStrength: React.MutableRefObject<number> | null;
  distortionStrength: React.MutableRefObject<number> | null;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 45 }}
      style={{ background: "transparent" }}
      gl={{
        alpha: true,
        antialias: true,
      }}
    >
      {!debug && <CameraRotation />}
      <OrbitControls
        enableZoom={debug}
        enablePan={debug}
        enableRotate={debug}
      />
      <BasicSphere
        debug={debug}
        dispose={null}
        displacementStrength={displacementStrength}
        distortionStrength={distortionStrength}
      />
    </Canvas>
  );
}

function CameraRotation() {
  useFrame(({ camera }) => {
    // Rotate camera around the sphere
    const radius = 3.2; // Match the initial camera distance
    const speed = 0.1; // Adjust this value to control rotation speed
    const time = performance.now() * 0.001 * speed;

    camera.position.x = Math.sin(time) * radius;
    camera.position.z = Math.cos(time) * radius;
    camera.lookAt(0, 0, 0);
  });

  return null;
}
