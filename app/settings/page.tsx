"use client";

import { FaCheck, FaDatabase, FaEdit, FaStar } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import SettingInput from "../components/configuration/SettingInput";
import { FaSave } from "react-icons/fa";
import { ModelProviders } from "../components/configuration/ModelProviders";
import { MdStorage } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { IoIosRefresh } from "react-icons/io";
import {
  SettingCard,
  SettingHeader,
  SettingGroup,
  SettingItem,
  SettingTitle,
} from "../components/configuration/SettingComponents";
import { IoCheckmarkSharp } from "react-icons/io5";
import SettingKey from "../components/configuration/SettingKey";
import { useContext, useEffect, useState } from "react";
import { BackendConfig, FrontendConfig, UserConfig } from "../types/objects";
import { SessionContext } from "../components/contexts/SessionContext";
import { RiRobot2Line } from "react-icons/ri";
import SettingTextarea from "../components/configuration/SettingTextarea";
import { TbManualGearboxFilled } from "react-icons/tb";
import SettingCheckbox from "../components/configuration/SettingCheckbox";
import SettingDropdown from "../components/configuration/SettingDropdown";
import { IoKeyOutline } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { isEqual } from "lodash";
import { Input } from "@/components/ui/input";
import { DeleteButton } from "../components/navigation/DeleteButton";
import { Checkbox } from "@/components/ui/checkbox";

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

  useEffect(() => {
    if (userConfig && userConfig.backend && userConfig.frontend) {
      setCurrentUserConfig({ ...userConfig.backend });
      setCurrentFrontendConfig({ ...userConfig.frontend });
      setChangedConfig(false);
      setMatchingConfig(true);
    }
  }, [userConfig]);

  useEffect(() => {
    if (userConfig?.backend?.id && configIDs) {
      const configExists = configIDs.some(
        (config) => config.config_id === userConfig.backend?.id
      );
      const isDefault = configIDs.some(
        (config) =>
          config.default && config.config_id === userConfig.backend?.id
      );
      setIsDefaultConfig(isDefault);
      setIsNewConfig(!configExists);
    }
  }, [configIDs, userConfig, currentUserConfig]);

  useEffect(() => {
    //fetchCurrentConfig();
  }, []);

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

  const cancelConfig = () => {
    if (userConfig && userConfig.backend && userConfig.frontend) {
      setCurrentUserConfig({ ...userConfig.backend });
      setCurrentFrontendConfig({ ...userConfig.frontend });
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

  const updateFrontendFields = (key: string, value: any) => {
    if (currentFrontendConfig) {
      setCurrentFrontendConfig({
        ...currentFrontendConfig,
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

  const triggerEditName = () => {
    if (editName) {
      // TODO: Add tooltip to show name already exists
      const nameExists = configIDs.some(
        (config) => config.name === currentUserConfig?.name
      );
      if (!nameExists) {
        setEditName(false);
      }
    } else {
      setEditName(true);
    }
  };

  const selectConfig = (configId: string) => {
    if (id) {
      setCurrentUserConfig(null);
      setCurrentFrontendConfig(null);
      handleLoadConfig(id, configId);
      setEditName(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-col lg:flex-row w-full gap-2 lg:gap-4 min-h-0 items-start justify-start h-full fade-in p-2 lg:p-0">
        {/* Sidebar */}
        <div className="flex flex-col justify-start w-full lg:w-1/4 xl:w-1/5 border-b lg:border-b-0 lg:border-r border-foreground_alt h-auto lg:h-full p-4 gap-2 lg:min-h-0">
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
              <span className="hidden sm:inline">New</span>
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
          <div className="flex flex-col gap-1 flex-1 lg:overflow-y-auto max-h-48 lg:max-h-none">
            {!loadingConfigs &&
              configIDs.map((configID, index) => (
                <div className="flex flex-row items-center justify-between">
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
                    confirmText="?"
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
                <p className="text-primary shine">Loading configs...</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full lg:w-3/4 xl:w-4/5 flex-col gap-4 min-h-0 items-center justify-start h-full lg:h-full fade-in">
          {currentUserConfig && currentFrontendConfig && !loadingConfig && (
            <div className="flex items-end justify-between gap-4 w-full fade-in">
              {/* Config Name Editor */}
              <div className="border-foreground_alt pt-2 sm:pt-4 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  {editName ? (
                    <Input
                      className="text-primary bg-transparent flex-1 min-w-0"
                      value={currentUserConfig?.name || ""}
                      onChange={(e) => {
                        updateFields("name", e.target.value);
                      }}
                      placeholder="Config name"
                    />
                  ) : (
                    <span className="text-sm lg:text-base text-foreground font-medium flex-1 truncate">
                      {currentUserConfig?.name || "Loading config..."}
                    </span>
                  )}
                  <Button variant="ghost" size="sm" onClick={triggerEditName}>
                    {editName ? <IoCheckmarkSharp /> : <MdEdit />}
                  </Button>
                  {isNewConfig && !loadingConfigs && (
                    <div className="flex flex-row fade-in items-center gap-2 bg-primary text-primary-foreground rounded-md px-2 py-1">
                      <p className="text-xs text-background">New Config</p>
                    </div>
                  )}
                  {isDefaultConfig && !loadingConfigs && (
                    <div className="flex flex-row fade-in items-center gap-2 bg-highlight text-primary-foreground rounded-md px-2 py-1">
                      <p className="text-xs text-background">Default</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-row items-stretch md:items-center gap-3">
                <div className="flex flex-row items-center gap-2 mr-2">
                  <Checkbox
                    checked={saveAsDefault}
                    onCheckedChange={(checked) => {
                      setSaveAsDefault(checked as boolean);
                    }}
                  />
                  <p className="text-sm text-foreground">Save as default</p>
                </div>
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
                    !loadingConfigs && (
                      <Button
                        disabled={!changedConfig && !isNewConfig}
                        className="bg-accent text-primary w-full "
                        onClick={() => {
                          handleSaveConfig(saveAsDefault);
                        }}
                      >
                        <FaSave />
                        Save
                      </Button>
                    )}
                  {matchingConfig &&
                    !isNewConfig &&
                    !isDefaultConfig &&
                    !loadingConfig &&
                    !loadingConfigs && (
                      <Button
                        className="bg-highlight text-primary w-full "
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
          )}
          {/* Configs */}
          {currentUserConfig && currentFrontendConfig && !loadingConfig ? (
            <div className="flex flex-col gap-6 h-full overflow-y-auto mb-8 w-full px-2 sm:px-4 lg:px-0 fade-in">
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
                        onSave={() => {}}
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
                        onSave={() => {}}
                        onCancel={() => {
                          cancelConfig();
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
                          currentFrontendConfig?.save_trees_to_weaviate || false
                        }
                        onChange={(value) => {
                          updateFrontendFields("save_trees_to_weaviate", value);
                        }}
                        onSave={() => {}}
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
                        onSave={() => {}}
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
                        onSave={() => {}}
                        onCancel={() => {
                          cancelConfig();
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
                        onSave={() => {}}
                        onCancel={() => {
                          cancelConfig();
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
                    header="Config Storage"
                  />
                  <SettingGroup>
                    <SettingItem>
                      <SettingTitle
                        title="URL"
                        description="The URL of your Weaviate cluster to save configs to."
                      />
                      <SettingInput
                        isProtected={false}
                        value={
                          currentFrontendConfig?.save_location_wcd_url || ""
                        }
                        onChange={(value) => {
                          updateFrontendFields("save_location_wcd_url", value);
                        }}
                        onSave={() => {}}
                        onCancel={() => {
                          cancelConfig();
                        }}
                      />
                    </SettingItem>
                    <SettingItem>
                      <SettingTitle
                        title="API Key"
                        description="The API key of your Weaviate cluster to save configs to."
                      />
                      <SettingInput
                        isProtected={true}
                        value={
                          currentFrontendConfig?.save_location_wcd_api_key || ""
                        }
                        onChange={(value) => {
                          updateFrontendFields(
                            "save_location_wcd_api_key",
                            value
                          );
                        }}
                        onSave={() => {}}
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
                        onSave={() => {}}
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
                        onSave={() => {}}
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
                        onSave={() => {}}
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
                        value={
                          currentUserConfig?.settings.USE_FEEDBACK || false
                        }
                        onChange={(value) => {
                          updateSettingsFields("USE_FEEDBACK", value);
                        }}
                        onSave={() => {}}
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
                        value={
                          currentUserConfig?.settings.COMPLEX_PROVIDER || ""
                        }
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
                        onSave={() => {}}
                        onCancel={() => {
                          cancelConfig();
                        }}
                      />
                    </SettingItem>
                  </SettingGroup>
                </SettingCard>

                {/* API Keys */}
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
            </div>
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <p className="text-primary shine">Loading config...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
