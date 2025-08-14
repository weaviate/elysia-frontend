"use client";

import React, { useState } from "react";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const V1 = dynamic(() => import("@/app/components/threejs/AbstractSphere"), {
  ssr: false,
});

const V2 = dynamic(
  () => import("@/app/components/threejs/blobv2/BlobV2Scene"),
  {
    ssr: false,
  }
);

export default function Home() {
  const [view, setView] = useState<"v1" | "v2">("v2");

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex flex-row gap-2 items-center justify-center">
        <Button
          onClick={() => setView("v1")}
          className={`${view === "v1" ? "bg-accent/10 text-accent border border-accent hover:bg-accent/20" : "bg-primary/10 text-secondary border-none hover:bg-primary/20"}`}
        >
          <p>V1</p>
        </Button>
        <Button
          onClick={() => setView("v2")}
          className={`${view === "v2" ? "bg-accent/10 text-accent border border-accent hover:bg-accent/20" : "bg-primary/10 text-secondary border-none hover:bg-primary/20"}`}
        >
          <p>V2</p>
        </Button>
      </div>
      {view === "v1" ? (
        <V1
          debug={true}
          displacementStrength={null}
          distortionStrength={null}
        />
      ) : (
        <V2 debug={true} />
      )}
    </div>
  );
}
