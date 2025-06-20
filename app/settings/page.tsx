"use client";

import { FaDatabase } from "react-icons/fa";
import SettingInput from "../components/configuration/SettingInput";
import {
  SettingCard,
  SettingHeader,
  SettingGroup,
  SettingItem,
  SettingTitle,
} from "../components/configuration/SettingComponents";
import { useContext, useEffect, useState } from "react";
import { UserConfig } from "../types/objects";
import { SessionContext } from "../components/contexts/SessionContext";
import { RiRobot2Line } from "react-icons/ri";
import SettingTextarea from "../components/configuration/SettingTextarea";
import { TbManualGearboxFilled } from "react-icons/tb";
import SettingCheckbox from "../components/configuration/SettingCheckbox";
import SettingDropdown from "../components/configuration/SettingDropdown";

export default function Home() {
  const { id, userConfig, fetchCurrentConfig } = useContext(SessionContext);

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
    fetchCurrentConfig();
  }, []);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <div className="flex w-full flex-col gap-2 min-h-0 items-center justify-start h-full fade-in">
        {/* Title */}
        <div className="flex mb-2 w-full justify-start">
          <p className="text-lg text-primary">Configuration</p>
        </div>
        <div className="flex flex-col w-full md:w-[60vw] lg:w-[40vw] gap-6 h-full">
          {!loadingConfig ? (
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
                        console.log(value);
                      }}
                      onSave={() => {
                        console.log("saved");
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
                        console.log(value);
                      }}
                      onSave={() => {
                        console.log("saved");
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
                        if (currentUserConfig) {
                          setCurrentUserConfig({
                            ...currentUserConfig,
                            agent_description: value,
                          });
                          setChangedConfig(true);
                        }
                      }}
                      onSave={() => {
                        console.log("saved");
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
                        console.log(value);
                      }}
                      onSave={() => {
                        console.log("saved");
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
                        console.log(value);
                      }}
                      onSave={() => {
                        console.log("saved");
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
                        console.log(value);
                      }}
                      onSave={() => {
                        console.log("saved");
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
                  {/* TODO : Add fetching all possible model names from the API */}
                  <SettingItem>
                    <SettingTitle
                      title="Base Model"
                      description="The base model to use for the agent."
                    />
                    <SettingDropdown
                      value={currentUserConfig?.settings.BASE_MODEL || ""}
                      values={["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"]}
                      onChange={(value) => {
                        console.log(value);
                      }}
                      onSave={() => {
                        console.log("saved");
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
                      values={["meta-llama/Llama-3.1-8B-Instruct"]}
                      onChange={(value) => {
                        console.log(value);
                      }}
                      onSave={() => {
                        console.log("saved");
                      }}
                    />
                  </SettingItem>
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
