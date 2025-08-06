"use client";

import { getTreeConfig } from "@/app/api/getTreeConfig";
import { BackendConfig, ModelProvider } from "@/app/types/objects";
import { getModels } from "@/app/api/getModels";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaSave } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";
import { TbArrowBackUp, TbManualGearboxFilled } from "react-icons/tb";
import { isEqual } from "lodash";
import { IoInformationCircle } from "react-icons/io5";
import {
  SettingCard,
  SettingHeader,
  SettingGroup,
  SettingItem,
  SettingTitle,
} from "./SettingComponents";
import SettingTextarea from "./SettingTextarea";
import SettingCombobox from "./SettingCombobox";
import SettingInput from "./SettingInput";
import { saveTreeConfig } from "@/app/api/saveTreeConfig";
import { newTreeConfig } from "@/app/api/newTreeConfig";
import { DeleteButton } from "@/app/components/navigation/DeleteButton";
import ModelBadges from "./ModelBadge";
import WarningCard from "./WarningCard";

export default function TreeSettingsView({
  user_id,
  conversation_id,
  selectChat,
}: {
  user_id: string | null | undefined;
  conversation_id: string | null | undefined;
  selectChat: () => void;
}) {
  const [originalConfig, setOriginalConfig] = useState<BackendConfig | null>(
    null
  );
  const [currentConfig, setCurrentConfig] = useState<BackendConfig | null>(
    null
  );
  const [changedConfig, setChangedConfig] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Models data state
  const [modelsData, setModelsData] = useState<{
    [key: string]: ModelProvider;
  } | null>(null);
  const [loadingModels, setLoadingModels] = useState<boolean>(true);

  // API key validation for models
  const getMissingApiKeys = useMemo(() => {
    if (!currentConfig || !modelsData) return [];

    const missingKeys: string[] = [];
    const availableKeys = Object.keys(currentConfig.settings.API_KEYS || {});
    const availableKeysLower = availableKeys.map((k) => k.toLowerCase());

    // Check base model API keys
    if (
      currentConfig.settings.BASE_PROVIDER &&
      currentConfig.settings.BASE_MODEL
    ) {
      const provider = modelsData[currentConfig.settings.BASE_PROVIDER];
      if (provider && provider[currentConfig.settings.BASE_MODEL]) {
        const requiredKeys =
          provider[currentConfig.settings.BASE_MODEL].api_keys;
        requiredKeys.forEach((key) => {
          if (!availableKeysLower.includes(key.toLowerCase())) {
            missingKeys.push(key);
          }
        });
      }
    }

    // Check complex model API keys
    if (
      currentConfig.settings.COMPLEX_PROVIDER &&
      currentConfig.settings.COMPLEX_MODEL
    ) {
      const provider = modelsData[currentConfig.settings.COMPLEX_PROVIDER];
      if (provider && provider[currentConfig.settings.COMPLEX_MODEL]) {
        const requiredKeys =
          provider[currentConfig.settings.COMPLEX_MODEL].api_keys;
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
  }, [currentConfig, modelsData]);

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

  // Fetch models data on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoadingModels(true);
        const modelsPayload = await getModels();
        if (modelsPayload.error) {
          console.error("Error fetching models:", modelsPayload.error);
        } else {
          setModelsData(modelsPayload.models);
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    fetchTreeConfig();
  }, [user_id, conversation_id]);

  useEffect(() => {
    if (currentConfig && originalConfig) {
      const configsMatch = isEqual(currentConfig, originalConfig);
      setChangedConfig(!configsMatch);
    }
  }, [currentConfig, originalConfig]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFields = (key: string, value: any) => {
    if (currentConfig) {
      setCurrentConfig({
        ...currentConfig,
        [key]: value,
      });
    }
  };

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

  const cancelConfig = () => {
    if (originalConfig) {
      setCurrentConfig({ ...originalConfig });
      setChangedConfig(false);
    }
  };

  const resetConfig = async () => {
    const data = await newTreeConfig(user_id, conversation_id);
    if (data.config) {
      setOriginalConfig({ ...data.config });
      setCurrentConfig({ ...data.config });
      setChangedConfig(false);
    }
  };

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

  // Helper function to get warning issues for models
  const getModelsIssues = () => {
    const issues: string[] = [];
    if (!currentConfig?.settings.BASE_PROVIDER) issues.push("Base Provider");
    if (!currentConfig?.settings.BASE_MODEL) issues.push("Base Model");
    if (!currentConfig?.settings.COMPLEX_PROVIDER)
      issues.push("Complex Provider");
    if (!currentConfig?.settings.COMPLEX_MODEL) issues.push("Complex Model");

    // Add missing API keys to issues
    const missingKeys = getMissingApiKeys;
    if (missingKeys.length > 0) {
      missingKeys.forEach((key) => {
        issues.push(`API Key: ${key}`);
      });
    }

    return issues;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-primary shine">Loading chat config...</p>
      </div>
    );
  }

  if (!currentConfig) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full gap-4">
        <p className="text-secondary">No chat configuration found</p>
        <Button variant="outline" onClick={selectChat}>
          <TbArrowBackUp size={16} />
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <div className="flex flex-col gap-4 w-full md:w-[80vw] lg:w-[60vw] min-h-0 h-full fade-in">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="md:flex-row flex-col flex items-center justify-between gap-4 w-full pt-2 sm:pt-4 px-2 sm:px-4 lg:px-0"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-primary ">Chat Configuration</h2>
            {changedConfig && (
              <div className="flex flex-row fade-in items-center gap-2 bg-highlight text-primary-foreground rounded-md px-2 py-1">
                <p className="text-xs text-background">Modified</p>
              </div>
            )}
          </div>

          <div className="flex flex-row items-center gap-3">
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
              <Button
                disabled={!changedConfig}
                className="bg-accent text-primary"
                onClick={handleSaveConfig}
              >
                <FaSave />
                Save
              </Button>
            </motion.div>

            <Button
              variant="destructive"
              onClick={cancelConfig}
              disabled={!changedConfig}
            >
              Cancel
            </Button>
            <Button variant="outline" onClick={selectChat}>
              <TbArrowBackUp size={16} />
              Back
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col gap-6 h-full overflow-y-auto mb-48 w-full px-2 sm:px-4 lg:px-0 fade-in"
        >
          {/* Agent Configuration */}
          <SettingCard>
            <SettingHeader
              icon={<RiRobot2Line />}
              className="bg-highlight"
              header="Agent Configuration"
            />
            <SettingGroup>
              <SettingItem>
                <SettingTitle
                  title="Agent Description"
                  description="The description of your agent."
                />
                <SettingTextarea
                  value={currentConfig.agent_description || ""}
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
                  value={currentConfig.end_goal || ""}
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
                  value={currentConfig.style || ""}
                  onChange={(value) => {
                    updateFields("style", value);
                  }}
                />
              </SettingItem>
            </SettingGroup>
          </SettingCard>

          {/* Models Configuration */}
          <SettingCard>
            <SettingHeader
              icon={<TbManualGearboxFilled />}
              className="bg-alt_color_a"
              header="Models"
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
                    Used for smaller, simpler tasks that require speed over
                    precision. Can be the same as complex model for consistency
                    at the cost of performance.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                  <div className="flex-1">
                    <p className="text-sm text-secondary mb-2">Provider</p>
                    <SettingCombobox
                      value={currentConfig?.settings.BASE_PROVIDER || ""}
                      values={modelsData ? Object.keys(modelsData) : []}
                      onChange={(value) => {
                        // Update both provider and clear model in a single state update
                        if (currentConfig) {
                          setCurrentConfig({
                            ...currentConfig,
                            settings: {
                              ...currentConfig.settings,
                              BASE_PROVIDER: value,
                              BASE_MODEL: "", // Clear base model when provider changes
                            },
                          });
                        }
                      }}
                      placeholder={
                        loadingModels
                          ? "Loading providers..."
                          : "Select provider..."
                      }
                      searchPlaceholder="Search providers..."
                    />
                  </div>
                  {currentConfig?.settings.BASE_PROVIDER && (
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-secondary">Model</p>
                        <ModelBadges
                          modelsData={modelsData}
                          provider={currentConfig?.settings.BASE_PROVIDER || ""}
                          model={currentConfig?.settings.BASE_MODEL || ""}
                        />
                      </div>
                      <SettingCombobox
                        value={currentConfig?.settings.BASE_MODEL || ""}
                        values={
                          modelsData && currentConfig?.settings.BASE_PROVIDER
                            ? Object.keys(
                                modelsData[
                                  currentConfig.settings.BASE_PROVIDER
                                ] || {}
                              )
                            : []
                        }
                        onChange={(value) => {
                          updateSettingsFields("BASE_MODEL", value);
                        }}
                        placeholder={
                          loadingModels
                            ? "Loading models..."
                            : "Select model..."
                        }
                        searchPlaceholder="Search models..."
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Complex Model Configuration */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-start gap-2">
                    <p className="text-primary font-bold">Complex Model</p>
                  </div>
                  <p className="text-sm text-secondary">
                    Used for complex tasks requiring higher precision and
                    reasoning. Speed may be slower but quality is higher. Can be
                    the same as base model.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                  <div className="flex-1">
                    <p className="text-sm text-secondary mb-2">Provider</p>
                    <SettingCombobox
                      value={currentConfig?.settings.COMPLEX_PROVIDER || ""}
                      values={modelsData ? Object.keys(modelsData) : []}
                      onChange={(value) => {
                        // Update both provider and clear model in a single state update
                        if (currentConfig) {
                          setCurrentConfig({
                            ...currentConfig,
                            settings: {
                              ...currentConfig.settings,
                              COMPLEX_PROVIDER: value,
                              COMPLEX_MODEL: "", // Clear complex model when provider changes
                            },
                          });
                        }
                      }}
                      placeholder={
                        loadingModels
                          ? "Loading providers..."
                          : "Select provider..."
                      }
                      searchPlaceholder="Search providers..."
                    />
                  </div>
                  {currentConfig?.settings.COMPLEX_PROVIDER && (
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-secondary">Model</p>
                        <ModelBadges
                          modelsData={modelsData}
                          provider={
                            currentConfig?.settings.COMPLEX_PROVIDER || ""
                          }
                          model={currentConfig?.settings.COMPLEX_MODEL || ""}
                        />
                      </div>
                      <SettingCombobox
                        value={currentConfig?.settings.COMPLEX_MODEL || ""}
                        values={
                          modelsData && currentConfig?.settings.COMPLEX_PROVIDER
                            ? Object.keys(
                                modelsData[
                                  currentConfig.settings.COMPLEX_PROVIDER
                                ] || {}
                              )
                            : []
                        }
                        onChange={(value) => {
                          updateSettingsFields("COMPLEX_MODEL", value);
                        }}
                        placeholder={
                          loadingModels
                            ? "Loading models..."
                            : "Select model..."
                        }
                        searchPlaceholder="Search models..."
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* API Base URL */}
              <SettingItem>
                <SettingTitle
                  title="API Base URL"
                  description="The API base URL of your model provider."
                />
                <SettingInput
                  isProtected={false}
                  value={currentConfig?.settings.MODEL_API_BASE || ""}
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
                  You can use the same model for both base and complex tasks.
                  Using different models allows you to balance speed vs quality
                  - faster models for simple tasks and more capable models for
                  complex reasoning.
                </p>
              </div>
            </SettingGroup>
            <div className="flex w-full items-center justify-center">
              <DeleteButton
                onClick={resetConfig}
                text="Reset Config"
                icon={<TbArrowBackUp size={16} />}
                confirmText="Are you sure?"
              />
            </div>
          </SettingCard>
        </motion.div>
      </div>
    </div>
  );
}
