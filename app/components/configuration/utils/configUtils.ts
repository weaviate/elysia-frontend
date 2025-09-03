import { BackendConfig, FrontendConfig } from "@/app/types/objects";

/**
 * Utility functions for configuration management
 */

/**
 * Helper function to determine if "Use Same Cluster" button should be highlighted
 * Returns true when storage settings don't match Weaviate cluster settings
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

  // Get Weaviate cluster settings
  const isWeaviateLocal = currentUserConfig.settings
    ?.WEAVIATE_IS_LOCAL as boolean;
  const weaviateUrl = currentUserConfig.settings?.WCD_URL?.trim() || "";
  const weaviateApiKey = currentUserConfig.settings?.WCD_API_KEY?.trim() || "";
  const weaviateGrpcPort =
    currentUserConfig.settings?.LOCAL_WEAVIATE_GRPC_PORT || 0;
  const weaviatePort = currentUserConfig.settings?.LOCAL_WEAVIATE_PORT || 0;

  // Get storage settings
  const isStorageLocal = currentFrontendConfig.save_location_weaviate_is_local;
  const storageUrl = currentFrontendConfig.save_location_wcd_url?.trim() || "";
  const storageApiKey =
    currentFrontendConfig.save_location_wcd_api_key?.trim() || "";
  const storageGrpcPort =
    currentFrontendConfig.save_location_local_weaviate_grpc_port || 0;
  const storagePort =
    currentFrontendConfig.save_location_local_weaviate_port || 0;

  // Compare URLs
  const urlsMatch = weaviateUrl === storageUrl;

  // Compare local/remote settings
  const localSettingsMatch = isWeaviateLocal === isStorageLocal;

  // Compare API keys (only if not local)
  const apiKeysMatch = isWeaviateLocal || weaviateApiKey === storageApiKey;

  // Compare ports if both are local
  const portsMatch =
    !isWeaviateLocal ||
    !isStorageLocal ||
    (weaviateGrpcPort === storageGrpcPort && weaviatePort === storagePort);

  // Highlight if any settings don't match
  return !urlsMatch || !localSettingsMatch || !apiKeysMatch || !portsMatch;
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
  const wcdIsLocal = currentUserConfig.settings.WEAVIATE_IS_LOCAL as boolean;
  const wcdGrpcPort = currentUserConfig.settings.LOCAL_WEAVIATE_GRPC_PORT || 0;
  const wcdPort = currentUserConfig.settings.LOCAL_WEAVIATE_PORT || 0;

  return {
    ...currentFrontendConfig,
    save_location_wcd_url: wcdUrl,
    save_location_wcd_api_key: wcdApiKey,
    save_location_weaviate_is_local: wcdIsLocal,
    save_location_local_weaviate_grpc_port: wcdGrpcPort,
    save_location_local_weaviate_port: wcdPort,
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
