"use client"; // App Router, forces client‑side execution
import { useEffect, useState } from "react";
import type { Agent } from "@fingerprintjs/fingerprintjs";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

/** Key used in localStorage / cookie */
const STORAGE_KEY = "device_id";

export function useDeviceId() {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      setId(cached);
      return;
    }

    // Load FingerprintJS lazily (~15 kB gzipped)
    FingerprintJS.load().then((agent: Agent) =>
      // @ts-ignore
      agent.get().then((result: any) => {
        localStorage.setItem(STORAGE_KEY, result.visitorId);
        setId(result.visitorId);
      })
    );
  }, []);

  return id;
}
