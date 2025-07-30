"use client";

import { getTreeConfig } from "@/app/api/getTreeConfig";
import { BackendConfig } from "@/app/types/objects";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaSave } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";
import { TbArrowBackUp, TbManualGearboxFilled } from "react-icons/tb";
import { isEqual } from "lodash";
import {
  SettingCard,
  SettingHeader,
  SettingGroup,
  SettingItem,
  SettingTitle,
} from "./SettingComponents";
import SettingTextarea from "./SettingTextarea";
import SettingDropdown from "./SettingDropdown";
import SettingInput from "./SettingInput";
import { ModelProviders } from "./ModelProviders";
import { saveTreeConfig } from "@/app/api/saveTreeConfig";
import { newTreeConfig } from "@/app/api/newTreeConfig";
import { DeleteButton } from "@/app/components/navigation/DeleteButton";

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
            <SettingGroup>
              <SettingItem>
                <SettingTitle
                  title="Base Provider"
                  description="The base provider to select a model from."
                />
                <SettingDropdown
                  value={currentConfig?.settings.BASE_PROVIDER || ""}
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
                  value={currentConfig?.settings.BASE_MODEL || ""}
                  values={
                    ModelProviders[
                      currentConfig?.settings
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
                  value={currentConfig?.settings.COMPLEX_PROVIDER || ""}
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
                  value={currentConfig?.settings.COMPLEX_MODEL || ""}
                  values={
                    ModelProviders[
                      currentConfig?.settings
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
                  value={currentConfig?.settings.MODEL_API_BASE || ""}
                  onChange={(value) => {
                    updateSettingsFields("MODEL_API_BASE", value);
                  }}
                />
              </SettingItem>
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
