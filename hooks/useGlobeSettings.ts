import { useState, useEffect, useCallback } from "react";
import {
  GlobeSettings,
  DEFAULT_GLOBE_SETTINGS,
  GLOBE_SETTINGS_STORAGE_KEY,
} from "@/app/components/threejs/globeConfig";

// Custom event for cross-component settings sync
const GLOBE_SETTINGS_CHANGED_EVENT = "globeSettingsChanged";

export function useGlobeSettings() {
  const [settings, setSettings] = useState<GlobeSettings>(
    DEFAULT_GLOBE_SETTINGS
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Function to load settings from localStorage
  const loadSettingsFromStorage = useCallback(() => {
    try {
      const savedSettings = localStorage.getItem(GLOBE_SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        const newSettings = { ...DEFAULT_GLOBE_SETTINGS, ...parsed };
        setSettings(newSettings);
        return true;
      } else {
        setSettings(DEFAULT_GLOBE_SETTINGS);
        return false;
      }
    } catch (error) {
      console.error(
        "❌ Failed to load globe settings from localStorage:",
        error
      );
      setSettings(DEFAULT_GLOBE_SETTINGS);
      return false;
    }
  }, []);

  // Load settings from localStorage on mount
  useEffect(() => {
    loadSettingsFromStorage();
  }, [loadSettingsFromStorage]);

  // Listen for custom settings change events (for cross-component sync)
  useEffect(() => {
    const handleSettingsChanged = () => {
      loadSettingsFromStorage();
      setHasUnsavedChanges(false);
    };

    window.addEventListener(
      GLOBE_SETTINGS_CHANGED_EVENT,
      handleSettingsChanged
    );

    return () => {
      window.removeEventListener(
        GLOBE_SETTINGS_CHANGED_EVENT,
        handleSettingsChanged
      );
    };
  }, [loadSettingsFromStorage]);

  // Listen for storage events (when localStorage changes in other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === GLOBE_SETTINGS_STORAGE_KEY) {
        loadSettingsFromStorage();
        setHasUnsavedChanges(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadSettingsFromStorage]);

  const updateSetting = useCallback(
    <K extends keyof GlobeSettings>(key: K, value: GlobeSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const saveSettings = useCallback(() => {
    try {
      localStorage.setItem(
        GLOBE_SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
      );
      setHasUnsavedChanges(false);

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent(GLOBE_SETTINGS_CHANGED_EVENT));

      return true;
    } catch (error) {
      console.error("❌ Failed to save globe settings to localStorage:", error);
      return false;
    }
  }, [settings]);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_GLOBE_SETTINGS);
    setHasUnsavedChanges(true);
  }, []);

  const cancelChanges = useCallback(() => {
    loadSettingsFromStorage();
    setHasUnsavedChanges(false);
  }, [loadSettingsFromStorage]);

  return {
    settings,
    hasUnsavedChanges,
    updateSetting,
    saveSettings,
    resetToDefaults,
    cancelChanges,
  };
}
