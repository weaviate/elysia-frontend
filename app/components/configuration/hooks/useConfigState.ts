import { useState, useEffect } from "react";
import { BackendConfig, FrontendConfig, UserConfig } from "@/app/types/objects";
import { isEqual } from "lodash";

/**
 * Custom hook for managing configuration state and related operations
 * Handles config loading, changes tracking, and field updates
 */
export function useConfigState(
  userConfig: UserConfig | null,
  configIDs: { config_id: string; name: string; default: boolean }[]
) {
  // Main configuration state
  const [currentUserConfig, setCurrentUserConfig] =
    useState<BackendConfig | null>(null);
  const [currentFrontendConfig, setCurrentFrontendConfig] =
    useState<FrontendConfig | null>(null);

  // Change tracking state
  const [changedConfig, setChangedConfig] = useState<boolean>(false);
  const [matchingConfig, setMatchingConfig] = useState<boolean>(false);

  // UI state
  const [editName, setEditName] = useState<boolean>(false);
  const [isNewConfig, setIsNewConfig] = useState<boolean>(false);
  const [isDefaultConfig, setIsDefaultConfig] = useState<boolean>(false);

  // Name validation state
  const [nameExists, setNameExists] = useState<boolean>(false);
  const [nameIsEmpty, setNameIsEmpty] = useState<boolean>(false);

  // Effect to sync with parent config
  useEffect(() => {
    if (userConfig?.backend && userConfig?.frontend) {
      setCurrentUserConfig({ ...userConfig.backend });
      setCurrentFrontendConfig({ ...userConfig.frontend });
      setChangedConfig(false);
      setMatchingConfig(true);

      if (process.env.NODE_ENV === "development") {
        console.log("Current User Config", userConfig);
      }
    }
  }, [userConfig]);

  // Effect to determine if config is new or default
  useEffect(() => {
    if (currentUserConfig && configIDs) {
      const backendId = currentUserConfig.id;
      const configExists = configIDs.some(
        (config) => config.config_id === backendId
      );
      const isDefault = configIDs.some(
        (config) => config.default && config.config_id === backendId
      );
      setIsDefaultConfig(isDefault);
      setIsNewConfig(!configExists);
    }
  }, [configIDs, currentUserConfig]);

  // Effect to track changes from original config
  useEffect(() => {
    if (currentUserConfig && userConfig?.backend) {
      const configsMatch = isEqual(currentUserConfig, userConfig.backend);
      const frontendConfigsMatch = isEqual(
        currentFrontendConfig,
        userConfig.frontend
      );
      setMatchingConfig(configsMatch && frontendConfigsMatch);
    }
  }, [currentUserConfig, currentFrontendConfig, userConfig]);

  // Effect to validate config name
  useEffect(() => {
    if (currentUserConfig && configIDs) {
      const exists = configIDs.some(
        (config) =>
          config.name === currentUserConfig.name &&
          config.config_id !== currentUserConfig.id
      );
      setNameExists(exists);
    }

    if (currentUserConfig) {
      const isEmpty =
        !currentUserConfig.name || currentUserConfig.name.trim() === "";
      setNameIsEmpty(isEmpty);
    }
  }, [currentUserConfig?.name, configIDs, currentUserConfig?.id]);

  // Update functions for different config sections
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFields = (key: string, value: any) => {
    if (currentUserConfig) {
      setCurrentUserConfig({
        ...currentUserConfig,
        [key]: value,
      });
      setChangedConfig(true);
    }
  };

  const updateFrontendFields = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keyOrUpdates: string | Record<string, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any
  ) => {
    if (currentFrontendConfig) {
      if (typeof keyOrUpdates === "string") {
        // Single key-value update
        setCurrentFrontendConfig({
          ...currentFrontendConfig,
          [keyOrUpdates]: value,
        });
      } else {
        // Multiple key-value updates
        setCurrentFrontendConfig({
          ...currentFrontendConfig,
          ...keyOrUpdates,
        });
      }
      setChangedConfig(true);
    }
  };

  const updateSettingsFields = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keyOrUpdates: string | Record<string, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any
  ) => {
    if (currentUserConfig) {
      if (typeof keyOrUpdates === "string") {
        // Single key-value update
        setCurrentUserConfig({
          ...currentUserConfig,
          settings: {
            ...currentUserConfig.settings,
            [keyOrUpdates]: value,
          },
        });
      } else {
        // Multiple key-value updates
        setCurrentUserConfig({
          ...currentUserConfig,
          settings: {
            ...currentUserConfig.settings,
            ...keyOrUpdates,
          },
        });
      }
      setChangedConfig(true);
    }
  };

  // Cancel changes and revert to original config
  const cancelConfig = () => {
    if (userConfig?.backend && userConfig?.frontend) {
      setCurrentUserConfig({ ...userConfig.backend });
      setCurrentFrontendConfig({ ...userConfig.frontend });
      setChangedConfig(false);
    }
  };

  return {
    // State
    currentUserConfig,
    currentFrontendConfig,
    changedConfig,
    matchingConfig,
    editName,
    isNewConfig,
    isDefaultConfig,
    nameExists,
    nameIsEmpty,

    // Setters
    setCurrentUserConfig,
    setCurrentFrontendConfig,
    setChangedConfig,
    setEditName,

    // Update functions
    updateFields,
    updateFrontendFields,
    updateSettingsFields,
    cancelConfig,
  };
}
