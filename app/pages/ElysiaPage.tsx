"use client";

import React from "react";

import dynamic from "next/dynamic";

const AbstractSphereScene = dynamic(
  () => import("@/app/components/threejs/AbstractSphere"),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <AbstractSphereScene
        debug={true}
        displacementStrength={null}
        distortionStrength={null}
      />
    </div>
  );
}
