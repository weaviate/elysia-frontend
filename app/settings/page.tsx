"use client";

import { FaDatabase } from "react-icons/fa";
import SettingInput from "../components/configuration/SettingInput";
import { FaSave } from "react-icons/fa";
import { ModelProviders } from "../components/configuration/ModelProviders";
import {
  SettingCard,
  SettingHeader,
  SettingGroup,
  SettingItem,
  SettingTitle,
} from "../components/configuration/SettingComponents";
import SettingKey from "../components/configuration/SettingKey";
import { useContext, useEffect, useState } from "react";
import { UserConfig } from "../types/objects";
import { SessionContext } from "../components/contexts/SessionContext";
import { RiRobot2Line } from "react-icons/ri";
import SettingTextarea from "../components/configuration/SettingTextarea";
import { TbManualGearboxFilled } from "react-icons/tb";
import SettingCheckbox from "../components/configuration/SettingCheckbox";
import SettingDropdown from "../components/configuration/SettingDropdown";
import { IoKeyOutline } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const { id, userConfig, fetchCurrentConfig, configIDs, updateConfig } =
    useContext(SessionContext);

  const [currentUserConfig, setCurrentUserConfig] = useState<UserConfig | null>(
    null
  );
  const [changedConfig, setChangedConfig] = useState<boolean>(false);
  const [loadingConfig, setLoadingConfig] = useState(false);

  useEffect(() => {
    if (userConfig) {
      setCurrentUserConfig({ ...userConfig });
      setChangedConfig(false);
      setLoadingConfig(false);
    } else {
      setLoadingConfig(true);
    }
  }, [userConfig]);

  useEffect(() => {
    //fetchCurrentConfig();
  }, []);

  const cancelConfig = () => {
    if (userConfig) {
      setCurrentUserConfig({ ...userConfig });
      setChangedConfig(false);
    }
  };

  const updateFields = (key: string, value: any) => {
    if (currentUserConfig) {
      setCurrentUserConfig({
        ...currentUserConfig,
        [key]: value,
      });
      setChangedConfig(true);
    }
  };

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

  const saveConfig = () => {
    if (currentUserConfig) {
      updateConfig(currentUserConfig);
      setChangedConfig(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen ">
      <div className="flex w-full flex-col gap-2 min-h-0 items-center justify-start h-full fade-in">
        {/* Title */}
        <div className="flex mb-2 w-full justify-between items-center">
          <div className="flex items-center justify-between gap-2">
            <p className="text-lg text-primary">Configuration</p>
            <div className="flex items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>{userConfig?.config_id || "Default"}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="h-[20rem] overflow-y-scroll">
                  {configIDs.map((configID, index) => (
                    <DropdownMenuItem key={index + "config_name"}>
                      {configID}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
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
                onClick={() => {
                  saveConfig();
                }}
              >
                <FaSave />
                Save
              </Button>
            </motion.div>
            <Button
              variant="destructive"
              onClick={() => {
                cancelConfig();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full md:w-[60vw] lg:w-[40vw] gap-6 h-full overflow-y-scroll mb-8">
          {!loadingConfig || !currentUserConfig ? (
            <div className="flex flex-col gap-2">
              {/* Weaviate Cluster */}
              <SettingCard>
                <SettingHeader
                  icon={<FaDatabase />}
                  className="bg-accent"
                  header="Weaviate Cluster"
                />
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
                      onSave={() => {
                        saveConfig();
                      }}
                      onCancel={() => {
                        cancelConfig();
                      }}
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
                      onSave={() => {
                        saveConfig();
                      }}
                      onCancel={() => {
                        cancelConfig();
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
                      onSave={() => {
                        saveConfig();
                      }}
                      onCancel={() => {
                        cancelConfig();
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
                      onSave={() => {
                        saveConfig();
                      }}
                      onCancel={() => {
                        cancelConfig();
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
                      onSave={() => {
                        saveConfig();
                      }}
                      onCancel={() => {
                        cancelConfig();
                      }}
                    />
                  </SettingItem>
                  <SettingItem>
                    <SettingTitle
                      title="Improve over Time"
                      description="Utilize liked responses to improve results over time."
                    />
                    <SettingCheckbox
                      value={currentUserConfig?.settings.USE_FEEDBACK || false}
                      onChange={(value) => {
                        updateSettingsFields("USE_FEEDBACK", value);
                      }}
                      onSave={() => {
                        saveConfig();
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
                />
                <SettingGroup>
                  <SettingItem>
                    <SettingTitle
                      title="Base Provider"
                      description="The base provider to select a model from."
                    />
                    <SettingDropdown
                      value={currentUserConfig?.settings.BASE_PROVIDER || ""}
                      values={Object.keys(ModelProviders)}
                      onChange={(value) => {
                        updateSettingsFields("BASE_PROVIDER", value);
                      }}
                    />
                  </SettingItem>
                  <SettingItem>
                    <SettingTitle
                      title="Base Model"
                      description="The base model to use for the agent."
                    />
                    <SettingDropdown
                      value={currentUserConfig?.settings.BASE_MODEL || ""}
                      values={
                        ModelProviders[
                          currentUserConfig?.settings
                            .BASE_PROVIDER as keyof typeof ModelProviders
                        ] || []
                      }
                      onChange={(value) => {
                        updateSettingsFields("BASE_MODEL", value);
                      }}
                    />
                  </SettingItem>
                  <SettingItem>
                    <SettingTitle
                      title="Complex Provider"
                      description="The complex provider to select a model from."
                    />
                    <SettingDropdown
                      value={currentUserConfig?.settings.COMPLEX_PROVIDER || ""}
                      values={Object.keys(ModelProviders)}
                      onChange={(value) => {
                        updateSettingsFields("COMPLEX_PROVIDER", value);
                      }}
                    />
                  </SettingItem>
                  <SettingItem>
                    <SettingTitle
                      title="Complex Model"
                      description="The fine-tuned model to use for the agent."
                    />
                    <SettingDropdown
                      value={currentUserConfig?.settings.COMPLEX_MODEL || ""}
                      values={
                        ModelProviders[
                          currentUserConfig?.settings
                            .COMPLEX_PROVIDER as keyof typeof ModelProviders
                        ] || []
                      }
                      onChange={(value) => {
                        updateSettingsFields("COMPLEX_MODEL", value);
                      }}
                    />
                  </SettingItem>
                  <SettingItem>
                    <SettingTitle
                      title="API Base URL"
                      description="The API base URL of your model provider."
                    />
                    <SettingInput
                      isProtected={false}
                      value={currentUserConfig?.settings.MODEL_API_BASE || ""}
                      onChange={(value) => {
                        updateSettingsFields("MODEL_API_BASE", value);
                      }}
                      onSave={() => {
                        saveConfig();
                      }}
                      onCancel={() => {
                        cancelConfig();
                      }}
                    />
                  </SettingItem>
                </SettingGroup>
              </SettingCard>

              {/* API Keys */}
              {/* TODO : ADD AND REMOVE API KEYS */}
              <SettingCard>
                <SettingHeader
                  icon={<IoKeyOutline />}
                  className="bg-alt_color_b"
                  header="API Keys"
                  onClick={() => {
                    addAPIKey();
                  }}
                />
                <SettingGroup>
                  {Object.entries(currentUserConfig?.settings.API_KEYS || {})
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
                          onCancel={() => {
                            cancelConfig();
                          }}
                        />
                      </SettingItem>
                    ))}
                  {Object.entries(currentUserConfig?.settings.API_KEYS || {})
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
                          onCancel={() => {
                            cancelConfig();
                          }}
                        />
                      </SettingItem>
                    ))}
                </SettingGroup>
              </SettingCard>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <p className="text-primary shine">Loading Config...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
