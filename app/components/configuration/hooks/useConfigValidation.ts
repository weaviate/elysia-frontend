import { useMemo } from "react";
import {
  BackendConfig,
  FrontendConfig,
  ModelProvider,
} from "@/app/types/objects";

/**
 * Custom hook for validating configuration settings
 * Handles validation for Weaviate cluster, models, API keys, and storage settings
 */
export function useConfigValidation(
  currentUserConfig: BackendConfig | null,
  currentFrontendConfig: FrontendConfig | null,
  modelsData: { [key: string]: ModelProvider } | null
) {
  // Dynamic validation based on current config values
  const currentValidation = useMemo(() => {
    if (!currentUserConfig) {
      return {
        wcd_url: false,
        wcd_api_key: false,
        base_provider: false,
        base_model: false,
        complex_provider: false,
        complex_model: false,
      };
    }

    const isWeaviateLocal = currentUserConfig.settings
      ?.WEAVIATE_IS_LOCAL as boolean;

    return {
      wcd_url: Boolean(currentUserConfig.settings.WCD_URL?.trim()),
      wcd_api_key: isWeaviateLocal
        ? true
        : Boolean(currentUserConfig.settings.WCD_API_KEY?.trim()),
      base_provider: Boolean(currentUserConfig.settings.BASE_PROVIDER?.trim()),
      base_model: Boolean(currentUserConfig.settings.BASE_MODEL?.trim()),
      complex_provider: Boolean(
        currentUserConfig.settings.COMPLEX_PROVIDER?.trim()
      ),
      complex_model: Boolean(currentUserConfig.settings.COMPLEX_MODEL?.trim()),
    };
  }, [currentUserConfig]);

  // API key validation for models - checks if required API keys are available
  const getMissingApiKeys = useMemo(() => {
    if (!currentUserConfig || !modelsData) return [];

    const missingKeys: string[] = [];
    const availableKeys = Object.keys(
      currentUserConfig.settings.API_KEYS || {}
    );
    const availableKeysLower = availableKeys.map((k) => k.toLowerCase());

    // Check base model API keys
    if (
      currentUserConfig.settings.BASE_PROVIDER &&
      currentUserConfig.settings.BASE_MODEL
    ) {
      const provider = modelsData[currentUserConfig.settings.BASE_PROVIDER];
      if (provider && provider[currentUserConfig.settings.BASE_MODEL]) {
        const requiredKeys =
          provider[currentUserConfig.settings.BASE_MODEL].api_keys;
        requiredKeys.forEach((key) => {
          if (!availableKeysLower.includes(key.toLowerCase())) {
            missingKeys.push(key);
          }
        });
      }
    }

    // Check complex model API keys
    if (
      currentUserConfig.settings.COMPLEX_PROVIDER &&
      currentUserConfig.settings.COMPLEX_MODEL
    ) {
      const provider = modelsData[currentUserConfig.settings.COMPLEX_PROVIDER];
      if (provider && provider[currentUserConfig.settings.COMPLEX_MODEL]) {
        const requiredKeys =
          provider[currentUserConfig.settings.COMPLEX_MODEL].api_keys;
        requiredKeys.forEach((key) => {
          if (
            !availableKeysLower.includes(key.toLowerCase()) &&
            !missingKeys.includes(key)
          ) {
            missingKeys.push(key);
          }
        });
      }
    }

    return missingKeys;
  }, [currentUserConfig, modelsData]);

  // Helper function to get storage validation issues
  const getStorageIssues = useMemo(() => {
    const issues: string[] = [];
    const needsStorageValidation =
      currentFrontendConfig?.save_configs_to_weaviate ||
      currentFrontendConfig?.save_trees_to_weaviate;

    if (needsStorageValidation) {
      const isStorageLocal =
        currentFrontendConfig?.save_location_weaviate_is_local;

      if (!currentFrontendConfig?.save_location_wcd_url?.trim()) {
        issues.push("Storage URL required when saving is enabled");
      }
      if (
        !isStorageLocal &&
        !currentFrontendConfig?.save_location_wcd_api_key?.trim()
      ) {
        issues.push("Storage API Key required when saving is enabled");
      }
    }
    return issues;
  }, [currentFrontendConfig]);

  // Overall config validation status
  const isConfigValid = useMemo(() => {
    return (
      currentValidation.wcd_url &&
      currentValidation.wcd_api_key &&
      currentValidation.base_provider &&
      currentValidation.base_model &&
      currentValidation.complex_provider &&
      currentValidation.complex_model &&
      getMissingApiKeys.length === 0 &&
      getStorageIssues.length === 0
    );
  }, [currentValidation, getMissingApiKeys, getStorageIssues]);

  // Helper functions to get warning issues for each section
  const getWeaviateIssues = () => {
    const issues: string[] = [];
    const isWeaviateLocal = currentUserConfig?.settings
      ?.WEAVIATE_IS_LOCAL as boolean;

    if (!currentValidation.wcd_url) issues.push("Weaviate Cluster URL");
    if (
      !isWeaviateLocal &&
      !Boolean(currentUserConfig?.settings?.WCD_API_KEY?.trim())
    ) {
      issues.push("Weaviate API Key");
    }
    return issues;
  };

  const getModelsIssues = () => {
    const issues: string[] = [];
    if (!currentValidation.base_provider) issues.push("Base Provider");
    if (!currentValidation.base_model) issues.push("Base Model");
    if (!currentValidation.complex_provider) issues.push("Complex Provider");
    if (!currentValidation.complex_model) issues.push("Complex Model");
    return issues;
  };

  const getApiKeysIssues = () => {
    const issues: string[] = [];
    // Add missing API keys to issues
    const missingKeys = getMissingApiKeys;
    if (missingKeys.length > 0) {
      missingKeys.forEach((key) => {
        issues.push(`Missing API Key: ${key}`);
      });
    }
    return issues;
  };

  // Get all model issues including missing API keys (for TreeSettingsView compatibility)
  const getAllModelsIssues = () => {
    const issues: string[] = [];
    if (!currentValidation.base_provider) issues.push("Base Provider");
    if (!currentValidation.base_model) issues.push("Base Model");
    if (!currentValidation.complex_provider) issues.push("Complex Provider");
    if (!currentValidation.complex_model) issues.push("Complex Model");

    // Add missing API keys to issues (different format for TreeSettingsView)
    const missingKeys = getMissingApiKeys;
    if (missingKeys.length > 0) {
      missingKeys.forEach((key) => {
        issues.push(`API Key: ${key}`);
      });
    }
    return issues;
  };

  return {
    currentValidation,
    getMissingApiKeys,
    getStorageIssues,
    isConfigValid,
    getWeaviateIssues,
    getModelsIssues,
    getApiKeysIssues,
    getAllModelsIssues,
  };
}
