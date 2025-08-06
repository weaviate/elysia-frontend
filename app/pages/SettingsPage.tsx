"use client";

import { FaCircle, FaDatabase, FaStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import SettingInput from "../components/configuration/SettingInput";
import { FaSave } from "react-icons/fa";
import { ModelProviders } from "../components/configuration/ModelProviders";
import { MdStorage } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { IoIosRefresh } from "react-icons/io";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoInformationCircle } from "react-icons/io5";
import {
  SettingCard,
  SettingHeader,
  SettingGroup,
  SettingItem,
  SettingTitle,
} from "../components/configuration/SettingComponents";
import { IoCopy } from "react-icons/io5";
import SettingKey from "../components/configuration/SettingKey";
import { useContext, useEffect, useState, useMemo } from "react";
import { BackendConfig, FrontendConfig } from "../types/objects";
import { SessionContext } from "../components/contexts/SessionContext";
import { RiRobot2Line } from "react-icons/ri";
import SettingTextarea from "../components/configuration/SettingTextarea";
import { TbManualGearboxFilled } from "react-icons/tb";
import SettingCheckbox from "../components/configuration/SettingCheckbox";
import SettingCombobox from "../components/configuration/SettingCombobox";
import { IoKeyOutline } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { isEqual } from "lodash";
import { Input } from "@/components/ui/input";
import { DeleteButton } from "../components/navigation/DeleteButton";
import { Checkbox } from "@/components/ui/checkbox";
import { IoWarning } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
import { BsDatabaseFillAdd } from "react-icons/bs";
import { SiDocsify } from "react-icons/si";
import { IoAdd } from "react-icons/io5";
import { FaFileImport } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Warning Card Component
const WarningCard: React.FC<{
  title: string;
  issues: string[];
}> = ({ title, issues }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 p-4 border border-warning bg-warning/10 rounded-md mb-2"
    >
      <IoWarning className="text-warning flex-shrink-0 mt-0.5" size={20} />
      <div className="flex flex-col gap-1">
        <h3 className="text-warning font-medium">{title}</h3>
        <p className="text-sm text-secondary">
          The following settings need to be configured:
        </p>
        <ul className="text-sm text-secondary list-disc list-inside">
          {issues.map((issue, index) => (
            <li key={index}>{issue}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const {
    id,
    userConfig,
    configIDs,
    updateConfig,
    handleCreateConfig,
    getConfigIDs,
    handleLoadConfig,
    handleDeleteConfig,
    loadingConfig,
    loadingConfigs,
    savingConfig,
  } = useContext(SessionContext);

  const [currentUserConfig, setCurrentUserConfig] =
    useState<BackendConfig | null>(null);
  const [currentFrontendConfig, setCurrentFrontendConfig] =
    useState<FrontendConfig | null>(null);
  const [changedConfig, setChangedConfig] = useState<boolean>(false);
  const [editName, setEditName] = useState<boolean>(false);

  const [isNewConfig, setIsNewConfig] = useState<boolean>(false);
  const [isDefaultConfig, setIsDefaultConfig] = useState<boolean>(false);

  const [matchingConfig, setMatchingConfig] = useState<boolean>(false);
  const [saveAsDefault, setSaveAsDefault] = useState<boolean>(true);

  // Name validation state
  const [nameExists, setNameExists] = useState<boolean>(false);
  const [nameIsEmpty, setNameIsEmpty] = useState<boolean>(false);

  // API Keys modal state
  const [isEnvModalOpen, setIsEnvModalOpen] = useState<boolean>(false);
  const [envContent, setEnvContent] = useState<string>("");

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

    return {
      wcd_url: Boolean(currentUserConfig.settings.WCD_URL?.trim()),
      wcd_api_key: Boolean(currentUserConfig.settings.WCD_API_KEY?.trim()),
      base_provider: Boolean(currentUserConfig.settings.BASE_PROVIDER?.trim()),
      base_model: Boolean(currentUserConfig.settings.BASE_MODEL?.trim()),
      complex_provider: Boolean(
        currentUserConfig.settings.COMPLEX_PROVIDER?.trim()
      ),
      complex_model: Boolean(currentUserConfig.settings.COMPLEX_MODEL?.trim()),
    };
  }, [currentUserConfig]);

  const isConfigValid = useMemo(() => {
    return (
      currentValidation.wcd_url &&
      currentValidation.wcd_api_key &&
      currentValidation.base_provider &&
      currentValidation.base_model &&
      currentValidation.complex_provider &&
      currentValidation.complex_model
    );
  }, [currentValidation]);

  useEffect(() => {
    if (userConfig && userConfig.backend && userConfig.frontend) {
      setCurrentUserConfig({ ...userConfig.backend });
      setCurrentFrontendConfig({ ...userConfig.frontend });
      setChangedConfig(false);
      setMatchingConfig(true);

      if (process.env.NODE_ENV === "development") {
        console.log("Current User Config", userConfig);
      }
    }
  }, [userConfig]);

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

  useEffect(() => {
    if (currentUserConfig && userConfig && userConfig.backend) {
      const configsMatch = isEqual(currentUserConfig, userConfig.backend);
      const frontendConfigsMatch = isEqual(
        currentFrontendConfig,
        userConfig.frontend
      );
      setMatchingConfig(configsMatch && frontendConfigsMatch);
    }
  }, [currentUserConfig, currentFrontendConfig, userConfig]);

  // Check if name already exists or is empty
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

  const cancelConfig = () => {
    if (userConfig && userConfig.backend && userConfig.frontend) {
      setCurrentUserConfig({ ...userConfig.backend });
      setCurrentFrontendConfig({ ...userConfig.frontend });
      setChangedConfig(false);
    }
  };

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFrontendFields = (key: string, value: any) => {
    if (currentFrontendConfig) {
      setCurrentFrontendConfig({
        ...currentFrontendConfig,
        [key]: value,
      });
      setChangedConfig(true);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateSettingsFields = (key: string, value: any) => {
    if (currentUserConfig) {
      setCurrentUserConfig({
        ...currentUserConfig,
        settings: {
          ...currentUserConfig.settings,
          [key]: value,
        },
      });
      setChangedConfig(true);
    }
  };

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

  const handleEnvSubmit = () => {
    if (envContent.trim()) {
      parseEnvContent(envContent);
      setEnvContent("");
      setIsEnvModalOpen(false);
    }
  };

  const handleSaveConfig = (setDefault: boolean = false) => {
    if (currentUserConfig && currentFrontendConfig) {
      updateConfig(
        {
          backend: currentUserConfig,
          frontend: currentFrontendConfig,
        },
        setDefault
      );
      setChangedConfig(false);
      setEditName(false);
    }
  };

  const handleNameDoubleClick = () => {
    setEditName(true);
  };

  const handleNameBlur = () => {
    setEditName(false);
  };

  const selectConfig = (configId: string) => {
    if (id) {
      handleLoadConfig(id, configId);
      setEditName(false);
    }
  };

  // Helper function to get warning issues for each section using dynamic validation
  const getWeaviateIssues = () => {
    const issues: string[] = [];
    if (!currentValidation.wcd_url) issues.push("Weaviate Cluster URL");
    if (!currentValidation.wcd_api_key) issues.push("Weaviate API Key");
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

  const copyWeaviateValuesToConfigStorage = () => {
    if (currentUserConfig && currentFrontendConfig) {
      const wcdUrl = currentUserConfig.settings.WCD_URL || "";
      const wcdApiKey = currentUserConfig.settings.WCD_API_KEY || "";

      if (!wcdUrl.trim() && !wcdApiKey.trim()) {
        return;
      }

      // Direct state update
      setCurrentFrontendConfig({
        ...currentFrontendConfig,
        save_location_wcd_url: wcdUrl,
        save_location_wcd_api_key: wcdApiKey,
      });
      setChangedConfig(true);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-col w-full gap-4 min-h-0 items-start justify-start h-full fade-in p-2 lg:p-4">
        {/* Mobile Config Selector - Only visible on small screens */}
        <div className="flex lg:hidden w-full">
          {currentUserConfig && !loadingConfigs && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
              <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-1">
                <label className="text-sm font-medium text-secondary">
                  Configuration
                </label>
                <Select
                  value={currentUserConfig.id ?? undefined}
                  onValueChange={(value) => selectConfig(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        {configIDs.find(
                          (config) => config.config_id === currentUserConfig.id
                        )?.default && (
                          <div className="w-2 h-2 rounded-full bg-highlight"></div>
                        )}
                        {currentUserConfig.name}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {configIDs.map((configID) => (
                      <SelectItem
                        key={configID.config_id}
                        value={configID.config_id}
                      >
                        <span className="flex items-center gap-2">
                          {configID.default && (
                            <div className="w-2 h-2 rounded-full bg-highlight"></div>
                          )}
                          {configID.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <Button
                  className="flex-1 sm:flex-none"
                  onClick={() => {
                    if (id) {
                      handleCreateConfig(id);
                    }
                  }}
                >
                  <IoMdAddCircle />
                  <span>New</span>
                </Button>
                <Button
                  className="w-10 flex-shrink-0"
                  onClick={() => {
                    if (id) {
                      getConfigIDs(id);
                    }
                  }}
                >
                  <IoIosRefresh />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-row w-full gap-4 min-h-0 items-start justify-start h-full">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden lg:flex flex-col justify-start w-1/4 xl:w-1/5 border-r border-foreground_alt h-full p-4 gap-2 min-h-0">
            {/* New Config Button */}
            <div className="flex flex-row items-center justify-between gap-2 w-full">
              <Button
                className="flex-1"
                onClick={() => {
                  if (id) {
                    handleCreateConfig(id);
                  }
                }}
              >
                <IoMdAddCircle />
                <span>New</span>
              </Button>
              <Button
                className="w-10"
                onClick={() => {
                  if (id) {
                    getConfigIDs(id);
                  }
                }}
              >
                <IoIosRefresh />
              </Button>
            </div>

            {/* Config List */}
            <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
              {!loadingConfigs &&
                configIDs.map((configID, index) => (
                  <div
                    key={configID.config_id + "_config_list_" + index}
                    className="flex flex-row items-center justify-between"
                  >
                    <Button
                      key={configID.config_id + "_config_" + index}
                      variant={
                        configID.config_id === currentUserConfig?.id
                          ? "default"
                          : "ghost"
                      }
                      className={`justify-start w-full text-left truncate ${
                        configID.config_id === currentUserConfig?.id
                          ? "bg-background_alt text-primary"
                          : "bg-background text-secondary hover:bg-foreground_alt hover:text-primary"
                      }`}
                      onClick={() => selectConfig(configID.config_id)}
                    >
                      {configID.default && (
                        <div className="flex flex-row items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-highlight"></div>
                        </div>
                      )}
                      <span className="truncate">{configID.name}</span>
                    </Button>
                    <DeleteButton
                      key={configID.config_id + "_delete_button_" + index}
                      className="w-10 text-secondary text-xs hover:bg-background hover:text-error"
                      variant="ghost"
                      icon={<MdDelete />}
                      text=""
                      confirmIcon={<IoIosCheckmarkCircle />}
                      onClick={() => {
                        if (id) {
                          handleDeleteConfig(
                            id,
                            configID.config_id,
                            configID.config_id === currentUserConfig?.id
                          );
                        }
                      }}
                    />
                  </div>
                ))}
              {loadingConfigs && (
                <div className="flex flex-row items-center justify-center w-full">
                  <p className="text-primary shine text-sm mt-4">
                    Loading configs...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex w-full lg:w-3/4 xl:w-4/5 flex-col min-h-0 h-full fade-in">
            {currentUserConfig && currentFrontendConfig && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 w-full py-4 flex-shrink-0"
              >
                {/* Config Name Editor */}
                <div className="border-foreground_alt w-full lg:w-auto">
                  <div className="flex flex-row sm:items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {editName ? (
                            <Input
                              className={`text-primary bg-transparent flex-1 min-w-0 ${
                                nameExists || nameIsEmpty
                                  ? "border-destructive focus-visible:ring-destructive"
                                  : ""
                              }`}
                              value={currentUserConfig?.name || ""}
                              onChange={(e) => {
                                updateFields("name", e.target.value);
                              }}
                              onBlur={handleNameBlur}
                              placeholder="Config name"
                              autoFocus
                            />
                          ) : (
                            <span
                              className={`text-sm lg:text-base text-primary font-medium border rounded-md px-4 py-1 flex-1 truncate cursor-pointer hover:bg-foreground_alt/10 transition-colors ${
                                nameExists || nameIsEmpty
                                  ? "border-destructive"
                                  : "border-foreground_alt"
                              }`}
                              onDoubleClick={handleNameDoubleClick}
                            >
                              {currentUserConfig?.name || "Loading config..."}
                            </span>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Double click to edit name</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex flex-row items-center gap-2 flex-wrap">
                      {nameExists && (
                        <div className="flex flex-row fade-in items-center gap-2 bg-destructive text-destructive-foreground rounded-md px-2 py-1">
                          <IoWarning size={12} />
                          <p className="text-xs">Name exists</p>
                        </div>
                      )}
                      {nameIsEmpty && (
                        <div className="flex flex-row fade-in items-center gap-2 bg-destructive text-destructive-foreground rounded-md px-2 py-1">
                          <IoWarning size={12} />
                          <p className="text-xs">Name required</p>
                        </div>
                      )}
                      {isNewConfig && !loadingConfigs && (
                        <div className="flex flex-row fade-in items-center gap-2 bg-primary/10 rounded-md px-2 py-1">
                          <p className="text-xs text-primary">New Config</p>
                        </div>
                      )}
                      {isDefaultConfig && !loadingConfigs && (
                        <div className="flex flex-row fade-in items-center gap-2 bg-highlight/10 rounded-md px-2 py-1">
                          <p className="text-xs text-highlight">Default</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                  <div className="flex flex-row items-center gap-2">
                    <Checkbox
                      checked={saveAsDefault}
                      onCheckedChange={(checked) => {
                        setSaveAsDefault(checked as boolean);
                      }}
                    />
                    <p className="text-sm text-secondary">Save as default</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <motion.div
                      animate={
                        changedConfig
                          ? { rotate: [-2, 2, -2, 2, 0], y: [0, -4, 0, -4, 0] }
                          : {}
                      }
                      transition={{
                        duration: 0.5,
                        repeat: changedConfig ? Infinity : 0,
                        repeatDelay: 1,
                        ease: "easeInOut",
                      }}
                    >
                      {(!matchingConfig || isNewConfig) &&
                        !loadingConfig &&
                        isConfigValid && (
                          <Button
                            disabled={
                              (!changedConfig && !isNewConfig) ||
                              !isConfigValid ||
                              nameExists ||
                              nameIsEmpty
                            }
                            className="bg-accent/10 text-accent hover:bg-accent/20 w-full sm:w-auto"
                            onClick={() => {
                              handleSaveConfig(saveAsDefault);
                            }}
                          >
                            <FaSave />
                            Save
                          </Button>
                        )}
                      {savingConfig && (
                        <Button
                          disabled={true}
                          className="bg-accent/10 text-accent hover:bg-accent/20 w-full sm:w-auto"
                        >
                          <FaCircle
                            scale={0.2}
                            className="text-lg pulsing_color"
                          />
                          Saving...
                        </Button>
                      )}
                      {matchingConfig &&
                        !isNewConfig &&
                        !isDefaultConfig &&
                        !loadingConfig &&
                        !loadingConfigs && (
                          <Button
                            disabled={
                              !isConfigValid || nameExists || nameIsEmpty
                            }
                            className="bg-highlight/10 text-highlight hover:bg-highlight/20 w-full sm:w-auto fade-in"
                            onClick={() => {
                              handleSaveConfig(true);
                            }}
                          >
                            <FaStar />
                            Set as default
                          </Button>
                        )}
                    </motion.div>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        cancelConfig();
                      }}
                      disabled={matchingConfig}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <DeleteButton
                      variant="ghost"
                      className="w-full sm:w-auto text-secondary hover:text-error border border-foreground"
                      icon={<TiDelete />}
                      disabled={isNewConfig || !currentUserConfig}
                      text="Delete"
                      confirmText="Are you sure?"
                      onClick={() => {
                        if (id && userConfig?.backend?.id) {
                          handleDeleteConfig(id, userConfig.backend.id, true);
                        }
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Scrollable Configs Content */}
            {userConfig ? (
              <div
                className={`flex flex-col gap-6 overflow-y-auto pb-8 flex-1 min-h-0 fade-in transition-opacity mb-8 ${loadingConfig ? "opacity-70" : "opacity-100"}`}
              >
                <div className="flex flex-col gap-2">
                  {/* Weaviate Cluster */}
                  <SettingCard>
                    <SettingHeader
                      icon={<FaDatabase />}
                      className="bg-accent"
                      header="Weaviate Cluster"
                      buttonIcon={<BsDatabaseFillAdd />}
                      buttonText="Add Cluster"
                      onClick={() => {
                        window.open(
                          "https://console.weaviate.cloud/",
                          "_blank"
                        );
                      }}
                    />
                    {/* Warning Card for Weaviate Issues */}
                    {getWeaviateIssues().length > 0 && (
                      <WarningCard
                        title="Weaviate Configuration Required"
                        issues={getWeaviateIssues()}
                      />
                    )}
                    <SettingGroup>
                      <SettingItem>
                        <SettingTitle
                          title="URL"
                          description="The URL of your Weaviate cluster."
                        />
                        <SettingInput
                          isProtected={false}
                          value={currentUserConfig?.settings.WCD_URL || ""}
                          onChange={(value) => {
                            updateSettingsFields("WCD_URL", value);
                          }}
                          isInvalid={!currentValidation.wcd_url}
                        />
                      </SettingItem>
                      <SettingItem>
                        <SettingTitle
                          title="API Key"
                          description="The API key of your Weaviate cluster."
                        />
                        <SettingInput
                          isProtected={true}
                          value={currentUserConfig?.settings.WCD_API_KEY || ""}
                          onChange={(value) => {
                            updateSettingsFields("WCD_API_KEY", value);
                          }}
                          isInvalid={!currentValidation.wcd_api_key}
                        />
                      </SettingItem>
                      <SettingItem>
                        <SettingTitle
                          title="Tree Timeout"
                          description="The timeout for the tree."
                        />
                        <SettingInput
                          isProtected={false}
                          value={currentFrontendConfig?.tree_timeout || 0}
                          onChange={(value) => {
                            updateFrontendFields("tree_timeout", value);
                          }}
                        />
                      </SettingItem>
                      <SettingItem>
                        <SettingTitle
                          title="Client Timeout"
                          description="The timeout for the client."
                        />
                        <SettingInput
                          isProtected={false}
                          value={currentFrontendConfig?.client_timeout || 0}
                          onChange={(value) => {
                            updateFrontendFields("client_timeout", value);
                          }}
                        />
                      </SettingItem>
                    </SettingGroup>
                  </SettingCard>

                  {/* Frontend Config */}
                  <SettingCard>
                    <SettingHeader
                      icon={<MdStorage />}
                      className="bg-background"
                      header="Elysia Storage"
                      buttonIcon={<IoCopy />}
                      buttonText="Use Same Cluster"
                      onClick={copyWeaviateValuesToConfigStorage}
                    />
                    <SettingGroup>
                      <SettingItem>
                        <SettingTitle
                          title="URL"
                          description="The URL of your Weaviate cluster to save configs and conversations to."
                        />
                        <SettingInput
                          key={`config-url-${currentFrontendConfig?.save_location_wcd_url || "empty"}`}
                          isProtected={false}
                          value={
                            currentFrontendConfig?.save_location_wcd_url || ""
                          }
                          onChange={(value) => {
                            updateFrontendFields(
                              "save_location_wcd_url",
                              value
                            );
                          }}
                        />
                      </SettingItem>
                      <SettingItem>
                        <SettingTitle
                          title="API Key"
                          description="The API key of your Weaviate cluster to save configs and conversations to."
                        />
                        <SettingInput
                          key={`config-key-${currentFrontendConfig?.save_location_wcd_api_key || "empty"}`}
                          isProtected={true}
                          value={
                            currentFrontendConfig?.save_location_wcd_api_key ||
                            ""
                          }
                          onChange={(value) => {
                            updateFrontendFields(
                              "save_location_wcd_api_key",
                              value
                            );
                          }}
                        />
                      </SettingItem>
                      <SettingItem>
                        <SettingTitle
                          title="Save Conversations"
                          description="Save conversations to Weaviate."
                        />
                        <SettingCheckbox
                          value={
                            currentFrontendConfig?.save_trees_to_weaviate ||
                            false
                          }
                          onChange={(value) => {
                            updateFrontendFields(
                              "save_trees_to_weaviate",
                              value
                            );
                          }}
                        />
                      </SettingItem>
                      <SettingItem>
                        <SettingTitle
                          title="Save Configs"
                          description="Save configs to Weaviate."
                        />
                        <SettingCheckbox
                          value={
                            currentFrontendConfig?.save_configs_to_weaviate ||
                            false
                          }
                          onChange={(value) => {
                            updateFrontendFields(
                              "save_configs_to_weaviate",
                              value
                            );
                          }}
                        />
                      </SettingItem>
                    </SettingGroup>
                  </SettingCard>

                  {/* Agent */}
                  <SettingCard>
                    <SettingHeader
                      icon={<RiRobot2Line />}
                      className="bg-highlight"
                      header="Agent"
                      buttonIcon={<SiDocsify />}
                      buttonText="Documentation"
                      onClick={() => {
                        window.open(
                          "https://weaviate.github.io/elysia/",
                          "_blank"
                        );
                      }}
                    />
                    <SettingGroup>
                      <SettingItem>
                        <SettingTitle
                          title="Description"
                          description="The description of your agent."
                        />
                        <SettingTextarea
                          value={currentUserConfig?.agent_description || ""}
                          onChange={(value) => {
                            updateFields("agent_description", value);
                          }}
                        />
                      </SettingItem>
                      <SettingItem>
                        <SettingTitle
                          title="End Goal"
                          description="The end goal of your agent."
                        />
                        <SettingTextarea
                          value={currentUserConfig?.end_goal || ""}
                          onChange={(value) => {
                            updateFields("end_goal", value);
                          }}
                        />
                      </SettingItem>
                      <SettingItem>
                        <SettingTitle
                          title="Style"
                          description="The style of your agent."
                        />
                        <SettingTextarea
                          value={currentUserConfig?.style || ""}
                          onChange={(value) => {
                            updateFields("style", value);
                          }}
                        />
                      </SettingItem>
                      <SettingItem>
                        <SettingTitle
                          title="Improve over Time"
                          description="Automatically uses the complex model for all tasks, unless there are enough previous positive feedback examples generated by the complex model, in which case the task will use the base model. If using this option, you should give feedback after a successful interaction."
                        />
                        <SettingCheckbox
                          value={
                            currentUserConfig?.settings.USE_FEEDBACK || false
                          }
                          onChange={(value) => {
                            updateSettingsFields("USE_FEEDBACK", value);
                          }}
                        />
                      </SettingItem>
                    </SettingGroup>
                  </SettingCard>

                  {/* LLM */}
                  <SettingCard>
                    <SettingHeader
                      icon={<TbManualGearboxFilled />}
                      className="bg-alt_color_a"
                      header="Models"
                      buttonIcon={<FaRobot />}
                      buttonText="Available Models"
                      onClick={() => {
                        window.open("https://openrouter.ai/models", "_blank");
                      }}
                    />
                    {/* Warning Card for Models Issues */}
                    {getModelsIssues().length > 0 && (
                      <WarningCard
                        title="Model Configuration Required"
                        issues={getModelsIssues()}
                      />
                    )}
                    <SettingGroup>
                      {/* Base Model Configuration */}
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col w-full">
                          <div className="flex items-center justify-start gap-2">
                            <p className="text-primary font-bold">Base Model</p>
                          </div>
                          <p className="text-sm text-secondary">
                            Used for the decision agent, as well as any tools
                            requiring simpler tasks that require speed over
                            precision. Can be the same as complex model for
                            consistency at the cost of performance.
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                          <div className="flex-1">
                            <p className="text-sm text-secondary mb-2">
                              Provider
                            </p>
                            <SettingCombobox
                              value={
                                currentUserConfig?.settings.BASE_PROVIDER || ""
                              }
                              values={Object.keys(ModelProviders)}
                              onChange={(value) => {
                                // Update both provider and clear model in a single state update
                                if (currentUserConfig) {
                                  setCurrentUserConfig({
                                    ...currentUserConfig,
                                    settings: {
                                      ...currentUserConfig.settings,
                                      BASE_PROVIDER: value,
                                      BASE_MODEL: "", // Clear base model when provider changes
                                    },
                                  });
                                  setChangedConfig(true);
                                }
                              }}
                              placeholder="Select provider..."
                              searchPlaceholder="Search providers..."
                              isInvalid={!currentValidation.base_provider}
                            />
                          </div>
                          {currentUserConfig?.settings.BASE_PROVIDER && (
                            <div className="flex-1">
                              <p className="text-sm text-secondary mb-2">
                                Model
                              </p>
                              <SettingCombobox
                                value={
                                  currentUserConfig?.settings.BASE_MODEL || ""
                                }
                                values={
                                  ModelProviders[
                                    currentUserConfig?.settings
                                      .BASE_PROVIDER as keyof typeof ModelProviders
                                  ] || []
                                }
                                onChange={(value) => {
                                  updateSettingsFields("BASE_MODEL", value);
                                }}
                                placeholder="Select model..."
                                searchPlaceholder="Search models..."
                                isInvalid={!currentValidation.base_model}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Complex Model Configuration */}
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col w-full">
                          <div className="flex items-center justify-start gap-2">
                            <p className="text-primary font-bold">
                              Complex Model
                            </p>
                          </div>
                          <p className="text-sm text-secondary">
                            Used in tools that require complex tasks requiring
                            higher precision and reasoning, such as the query
                            and aggregate tools. Speed may be slower but quality
                            is higher. Can be the same as base model.
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                          <div className="flex-1">
                            <p className="text-sm text-secondary mb-2">
                              Provider
                            </p>
                            <SettingCombobox
                              value={
                                currentUserConfig?.settings.COMPLEX_PROVIDER ||
                                ""
                              }
                              values={Object.keys(ModelProviders)}
                              onChange={(value) => {
                                // Update both provider and clear model in a single state update
                                if (currentUserConfig) {
                                  setCurrentUserConfig({
                                    ...currentUserConfig,
                                    settings: {
                                      ...currentUserConfig.settings,
                                      COMPLEX_PROVIDER: value,
                                      COMPLEX_MODEL: "", // Clear complex model when provider changes
                                    },
                                  });
                                  setChangedConfig(true);
                                }
                              }}
                              placeholder="Select provider..."
                              searchPlaceholder="Search providers..."
                              isInvalid={!currentValidation.complex_provider}
                            />
                          </div>
                          {currentUserConfig?.settings.COMPLEX_PROVIDER && (
                            <div className="flex-1">
                              <p className="text-sm text-secondary mb-2">
                                Model
                              </p>
                              <SettingCombobox
                                value={
                                  currentUserConfig?.settings.COMPLEX_MODEL ||
                                  ""
                                }
                                values={
                                  ModelProviders[
                                    currentUserConfig?.settings
                                      .COMPLEX_PROVIDER as keyof typeof ModelProviders
                                  ] || []
                                }
                                onChange={(value) => {
                                  updateSettingsFields("COMPLEX_MODEL", value);
                                }}
                                placeholder="Select model..."
                                searchPlaceholder="Search models..."
                                isInvalid={!currentValidation.complex_model}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <SettingItem>
                        <SettingTitle
                          title="API Base URL"
                          description="Use this to specify custom endpoints for accessing models, such as self-hosted or private models"
                        />
                        <SettingInput
                          isProtected={false}
                          value={
                            currentUserConfig?.settings.MODEL_API_BASE || ""
                          }
                          onChange={(value) => {
                            updateSettingsFields("MODEL_API_BASE", value);
                          }}
                        />
                      </SettingItem>

                      {/* Model Usage Disclaimer */}
                      <div className="flex flex-col gap-2 bg-highlight/10 rounded-lg p-3 text-sm text-highlight">
                        <div className="flex flex-row gap-1 items-center">
                          <IoInformationCircle className="text-highlight" />
                          <p className="font-bold text-highlight">Note</p>
                        </div>
                        <p>
                          You can use the same model for both base and complex
                          tasks. Using different models allows you to balance
                          speed vs quality - faster models for simple tasks and
                          more capable models for complex reasoning.
                        </p>
                      </div>
                    </SettingGroup>
                  </SettingCard>

                  {/* API Keys */}
                  <SettingCard>
                    <SettingHeader
                      icon={<IoKeyOutline />}
                      buttonText="Import .env"
                      buttonIcon={<FaFileImport />}
                      className="bg-alt_color_b"
                      header="API Keys"
                      onClick={() => {
                        setIsEnvModalOpen(true);
                      }}
                    />
                    <SettingGroup>
                      {Object.entries(
                        currentUserConfig?.settings.API_KEYS || {}
                      )
                        .filter(
                          ([key, value]) => key.startsWith("new_key") && value
                        )
                        .map(([key, value]) => (
                          <SettingItem key={key}>
                            <SettingKey
                              isProtected={true}
                              startEditable={true}
                              title={key}
                              value={value || ""}
                              onChange={(key, newKey, value) => {
                                updateAPIKeys(key, newKey, value);
                              }}
                              onRemove={() => {
                                removeAPIKey(key);
                              }}
                            />
                          </SettingItem>
                        ))}
                      {Object.entries(
                        currentUserConfig?.settings.API_KEYS || {}
                      )
                        .filter(
                          ([key, value]) => !key.startsWith("new_key") && value
                        )
                        .map(([key, value]) => (
                          <SettingItem key={key}>
                            <SettingKey
                              isProtected={true}
                              startEditable={false}
                              title={key}
                              onRemove={() => {
                                removeAPIKey(key);
                              }}
                              value={value || ""}
                              onChange={(key, newKey, value) => {
                                updateAPIKeys(key, newKey, value);
                              }}
                            />
                          </SettingItem>
                        ))}

                      {/* Manual Add API Key Button */}
                      <div className="flex items-center justify-center pt-2">
                        <Button
                          variant="outline"
                          onClick={addAPIKey}
                          className="bg-accent/10 hover:bg-accent/20 border-accent/30 text-accent hover:text-accent-foreground flex items-center gap-2"
                        >
                          <IoAdd size={16} />
                          Add API Key
                        </Button>
                      </div>
                    </SettingGroup>
                  </SettingCard>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <p className="text-primary shine">Loading config...</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* .env Import Modal */}
      <Dialog open={isEnvModalOpen} onOpenChange={setIsEnvModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import API Keys from .env</DialogTitle>
            <DialogDescription>
              Paste your .env file content below. We&apos;ll automatically parse
              and add your API keys. Supports both <code>KEY=value</code> and{" "}
              <code>KEY=&quot;value&quot;</code> formats.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="env-content" className="text-sm font-medium">
                .env Content
              </label>
              <textarea
                id="env-content"
                value={envContent}
                onChange={(e) => setEnvContent(e.target.value)}
                placeholder={`OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY="your_key_here"
GOOGLE_API_KEY=your_key_here`}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                Comments (lines starting with #) will be ignored
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsEnvModalOpen(false);
                setEnvContent("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEnvSubmit}
              disabled={!envContent.trim()}
              className="bg-accent/10 text-accent hover:bg-accent/20"
            >
              Import Keys
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
