import { useState, useEffect } from "react";
import { BackendConfig } from "@/app/types/objects";
import { isEqual } from "lodash";
import { getTreeConfig } from "@/app/api/getTreeConfig";
import { saveTreeConfig } from "@/app/api/saveTreeConfig";
import { newTreeConfig } from "@/app/api/newTreeConfig";

/**
 * Custom hook for managing tree-specific configuration state
 * Handles loading, saving, resetting tree configurations for specific conversations
 */
export function useTreeConfigState(
  user_id: string | null | undefined,
  conversation_id: string | null | undefined
) {
  const [originalConfig, setOriginalConfig] = useState<BackendConfig | null>(
    null
  );
  const [currentConfig, setCurrentConfig] = useState<BackendConfig | null>(
    null
  );
  const [changedConfig, setChangedConfig] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch tree configuration from API
  const fetchTreeConfig = async () => {
    if (!user_id || !conversation_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getTreeConfig(user_id, conversation_id);
      if (data.config) {
        setOriginalConfig(data.config);
        setCurrentConfig({ ...data.config });
        setChangedConfig(false);
      }
    } catch (error) {
      console.error("Failed to fetch tree config:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save current configuration
  const handleSaveConfig = async () => {
    if (currentConfig) {
      const data = await saveTreeConfig(
        user_id,
        conversation_id,
        currentConfig
      );
      if (data.config) {
        setOriginalConfig({ ...data.config });
        setCurrentConfig({ ...data.config });
        setChangedConfig(false);
      }
    }
  };

  // Reset configuration to default
  const resetConfig = async () => {
    const data = await newTreeConfig(user_id, conversation_id);
    if (data.config) {
      setOriginalConfig({ ...data.config });
      setCurrentConfig({ ...data.config });
      setChangedConfig(false);
    }
  };

  // Cancel changes and revert to original
  const cancelConfig = () => {
    if (originalConfig) {
      setCurrentConfig({ ...originalConfig });
      setChangedConfig(false);
    }
  };

  // Update general config fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFields = (key: string, value: any) => {
    if (currentConfig) {
      setCurrentConfig({
        ...currentConfig,
        [key]: value,
      });
    }
  };

  // Update settings fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateSettingsFields = (key: string, value: any) => {
    if (currentConfig) {
      setCurrentConfig({
        ...currentConfig,
        settings: {
          ...currentConfig.settings,
          [key]: value,
        },
      });
    }
  };

  // Effect to fetch config when dependencies change
  useEffect(() => {
    fetchTreeConfig();
  }, [user_id, conversation_id]);

  // Effect to track changes
  useEffect(() => {
    if (currentConfig && originalConfig) {
      const configsMatch = isEqual(currentConfig, originalConfig);
      setChangedConfig(!configsMatch);
    }
  }, [currentConfig, originalConfig]);

  return {
    // State
    originalConfig,
    currentConfig,
    changedConfig,
    loading,

    // Actions
    handleSaveConfig,
    resetConfig,
    cancelConfig,
    updateFields,
    updateSettingsFields,
    fetchTreeConfig,

    // State setters (for complex updates)
    setCurrentConfig,
  };
}
