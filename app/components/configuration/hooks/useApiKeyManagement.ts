import { BackendConfig } from "@/app/types/objects";

/**
 * Custom hook for managing API keys in configuration
 * Handles adding, removing, updating, and importing API keys
 */
export function useApiKeyManagement(
  currentUserConfig: BackendConfig | null,
  setCurrentUserConfig: (config: BackendConfig) => void,
  setChangedConfig: (changed: boolean) => void,
  getMissingApiKeys: string[]
) {
  // Add a new empty API key entry
  const addAPIKey = () => {
    if (currentUserConfig) {
      const updatedAPIKeys = { ...currentUserConfig.settings.API_KEYS };
      updatedAPIKeys["new_key"] = "new_value";

      setCurrentUserConfig({
        ...currentUserConfig,
        settings: {
          ...currentUserConfig.settings,
          API_KEYS: updatedAPIKeys,
        },
      });
      setChangedConfig(true);
    }
  };

  // Add all missing API keys with empty values for user to fill
  const addAllMissingAPIKeys = () => {
    if (currentUserConfig) {
      const updatedAPIKeys = { ...currentUserConfig.settings.API_KEYS };
      const missingKeys = getMissingApiKeys;

      missingKeys.forEach((key) => {
        if (!updatedAPIKeys[key]) {
          updatedAPIKeys[key] = "";
        }
      });

      setCurrentUserConfig({
        ...currentUserConfig,
        settings: {
          ...currentUserConfig.settings,
          API_KEYS: updatedAPIKeys,
        },
      });
      setChangedConfig(true);
    }
  };

  // Remove an API key
  const removeAPIKey = (key: string) => {
    if (currentUserConfig) {
      const updatedAPIKeys = { ...currentUserConfig.settings.API_KEYS };
      delete updatedAPIKeys[key];

      setCurrentUserConfig({
        ...currentUserConfig,
        settings: {
          ...currentUserConfig.settings,
          API_KEYS: updatedAPIKeys,
        },
      });
      setChangedConfig(true);
    }
  };

  // Update an API key (both key name and value)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateAPIKeys = (key: string, newKey: string, value: any) => {
    if (currentUserConfig) {
      const updatedAPIKeys = { ...currentUserConfig.settings.API_KEYS };
      delete updatedAPIKeys[key];
      updatedAPIKeys[newKey] = value;

      setCurrentUserConfig({
        ...currentUserConfig,
        settings: {
          ...currentUserConfig.settings,
          API_KEYS: updatedAPIKeys,
        },
      });
      setChangedConfig(true);
    }
  };

  // Parse .env content and add to API keys
  const parseEnvContent = (content: string) => {
    if (!currentUserConfig) return;

    const lines = content
      .split("\n")
      .filter((line) => line.trim() && !line.trim().startsWith("#"));
    const newAPIKeys = { ...currentUserConfig.settings.API_KEYS };

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      // Match both key=value and key="value" formats
      const match = trimmedLine.match(/^([^=]+)=(.+)$/);

      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();

        // Remove quotes if they exist
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        // Only add if both key and value are not empty
        if (key && value) {
          newAPIKeys[key] = value;
        }
      }
    });

    setCurrentUserConfig({
      ...currentUserConfig,
      settings: {
        ...currentUserConfig.settings,
        API_KEYS: newAPIKeys,
      },
    });
    setChangedConfig(true);
  };

  return {
    addAPIKey,
    addAllMissingAPIKeys,
    removeAPIKey,
    updateAPIKeys,
    parseEnvContent,
  };
}
