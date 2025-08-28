import { BackendConfig, FrontendConfig } from "@/app/types/objects";

/**
 * Utility functions for configuration management
 */

/**
 * Helper function to determine if "Use Same Cluster" button should be highlighted
 * Returns true when Weaviate cluster is configured but storage fields are missing
 */
export function shouldHighlightUseSameCluster(
  currentUserConfig: BackendConfig | null,
  currentFrontendConfig: FrontendConfig | null
): boolean {
  if (!currentUserConfig || !currentFrontendConfig) return false;

  const saveConfigsEnabled = currentFrontendConfig.save_configs_to_weaviate;
  const saveConversationsEnabled = currentFrontendConfig.save_trees_to_weaviate;
  const isSavingEnabled = saveConfigsEnabled || saveConversationsEnabled;

  if (!isSavingEnabled) return false;

  // Check if Weaviate cluster fields are filled
  const isWeaviateLocal = currentUserConfig.settings?.WEAVIATE_IS_LOCAL as boolean;
  const weaviateHasUrl = Boolean(currentUserConfig.settings.WCD_URL?.trim());
  const weaviateHasApiKey = isWeaviateLocal || Boolean(
    currentUserConfig.settings.WCD_API_KEY?.trim()
  );
  const weaviateFieldsFilled = weaviateHasUrl && weaviateHasApiKey;

  // Check if storage fields are missing
  const isStorageLocal = currentFrontendConfig.save_location_wcd_url?.trim() === "http://localhost:8080";
  const storageUrlMissing =
    !currentFrontendConfig.save_location_wcd_url?.trim();
  const storageApiKeyMissing = !isStorageLocal &&
    !currentFrontendConfig.save_location_wcd_api_key?.trim();
  const storageFieldsMissing = storageUrlMissing || storageApiKeyMissing;

  return weaviateFieldsFilled && storageFieldsMissing;
}

/**
 * Copy Weaviate cluster values to storage configuration
 * Helper function to populate storage fields with Weaviate cluster values
 */
export function copyWeaviateValuesToStorage(
  currentUserConfig: BackendConfig | null,
  currentFrontendConfig: FrontendConfig | null
): FrontendConfig | null {
  if (!currentUserConfig || !currentFrontendConfig) return null;

  const wcdUrl = currentUserConfig.settings.WCD_URL || "";
  const wcdApiKey = currentUserConfig.settings.WCD_API_KEY || "";

  if (!wcdUrl.trim() && !wcdApiKey.trim()) {
    return null;
  }

  return {
    ...currentFrontendConfig,
    save_location_wcd_url: wcdUrl,
    save_location_wcd_api_key: wcdApiKey,
  };
}

/**
 * Generate a unique configuration name
 * Appends a number to the base name if it already exists
 */
export function generateUniqueConfigName(
  baseName: string,
  configList: { name: string }[]
): string {
  if (!configList.some((config) => config.name === baseName)) {
    return baseName;
  }

  let counter = 1;
  let uniqueName = `${baseName} ${counter}`;

  while (configList.some((config) => config.name === uniqueName)) {
    counter++;
    uniqueName = `${baseName} ${counter}`;
  }

  return uniqueName;
}
