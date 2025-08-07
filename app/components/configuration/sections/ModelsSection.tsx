"use client";

import React from "react";
import { TbManualGearboxFilled, TbArrowBackUp } from "react-icons/tb";
import { DeleteButton } from "@/app/components/navigation/DeleteButton";
import { FaRobot } from "react-icons/fa";
import { IoInformationCircle } from "react-icons/io5";
import {
  SettingCard,
  SettingHeader,
  SettingGroup,
  SettingItem,
  SettingTitle,
} from "../SettingComponents";
import SettingCombobox from "../SettingCombobox";
import SettingInput from "../SettingInput";
import WarningCard from "../WarningCard";
import ModelBadges from "../ModelBadge";
import { BackendConfig, ModelProvider } from "@/app/types/objects";

interface ModelsSectionProps {
  currentUserConfig: BackendConfig | null;
  modelsData: { [key: string]: ModelProvider } | null;
  loadingModels: boolean;
  modelsIssues: string[];
  baseProviderValid?: boolean;
  baseModelValid?: boolean;
  complexProviderValid?: boolean;
  complexModelValid?: boolean;
  onUpdateSettings: (key: string, value: any) => void;
  onUpdateConfig: (config: BackendConfig) => void;
  setChangedConfig: (changed: boolean) => void;
  showDocumentation?: boolean; // Option to show/hide "Available Models" button
  title?: string; // Optional title override
  onResetConfig?: () => void; // Optional reset function for tree settings
}

/**
 * Component for configuring AI models settings
 * Handles base and complex model selection, provider settings, and API base URL
 */
export default function ModelsSection({
  currentUserConfig,
  modelsData,
  loadingModels,
  modelsIssues,
  baseProviderValid = true,
  baseModelValid = true,
  complexProviderValid = true,
  complexModelValid = true,
  onUpdateSettings,
  onUpdateConfig,
  setChangedConfig,
  showDocumentation = true,
  title = "Models",
  onResetConfig,
}: ModelsSectionProps) {
  return (
    <SettingCard>
      <SettingHeader
        icon={<TbManualGearboxFilled />}
        className="bg-alt_color_a"
        header={title}
        buttonIcon={showDocumentation ? <FaRobot /> : undefined}
        buttonText={showDocumentation ? "Available Models" : undefined}
        onClick={
          showDocumentation
            ? () => {
                window.open("https://openrouter.ai/models", "_blank");
              }
            : undefined
        }
      />

      {/* Warning Card for Models Issues */}
      {modelsIssues.length > 0 && (
        <WarningCard
          title="Model Configuration Required"
          issues={modelsIssues}
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
              Used for the decision agent, as well as any tools requiring
              simpler tasks that require speed over precision. Can be the same
              as complex model for consistency at the cost of performance.
            </p>
          </div>
          <div className="flex flex-col items-end sm:flex-row gap-3 sm:gap-4 w-full">
            <div className="flex-1">
              <p className="text-sm text-secondary mb-2">Provider</p>
              <SettingCombobox
                value={currentUserConfig?.settings.BASE_PROVIDER || ""}
                values={modelsData ? Object.keys(modelsData) : []}
                onChange={(value) => {
                  // Update both provider and clear model in a single state update
                  if (currentUserConfig) {
                    onUpdateConfig({
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
                placeholder={
                  loadingModels ? "Loading providers..." : "Select provider..."
                }
                searchPlaceholder="Search providers..."
                isInvalid={!baseProviderValid}
              />
            </div>
            {currentUserConfig?.settings.BASE_PROVIDER && (
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-secondary">Model</p>
                  <ModelBadges
                    modelsData={modelsData}
                    provider={currentUserConfig?.settings.BASE_PROVIDER || ""}
                    model={currentUserConfig?.settings.BASE_MODEL || ""}
                  />
                </div>
                <SettingCombobox
                  value={currentUserConfig?.settings.BASE_MODEL || ""}
                  values={
                    modelsData && currentUserConfig?.settings.BASE_PROVIDER
                      ? Object.keys(
                          modelsData[
                            currentUserConfig.settings.BASE_PROVIDER
                          ] || {}
                        )
                      : []
                  }
                  onChange={(value) => {
                    onUpdateSettings("BASE_MODEL", value);
                  }}
                  placeholder={
                    loadingModels ? "Loading models..." : "Select model..."
                  }
                  searchPlaceholder="Search models..."
                  isInvalid={!baseModelValid}
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
              Used in tools that require complex tasks requiring higher
              precision and reasoning, such as the query and aggregate tools.
              Speed may be slower but quality is higher. Can be the same as base
              model.
            </p>
          </div>
          <div className="flex flex-col items-end sm:flex-row gap-3 sm:gap-4 w-full">
            <div className="flex-1">
              <p className="text-sm text-secondary mb-2">Provider</p>
              <SettingCombobox
                value={currentUserConfig?.settings.COMPLEX_PROVIDER || ""}
                values={modelsData ? Object.keys(modelsData) : []}
                onChange={(value) => {
                  // Update both provider and clear model in a single state update
                  if (currentUserConfig) {
                    onUpdateConfig({
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
                placeholder={
                  loadingModels ? "Loading providers..." : "Select provider..."
                }
                searchPlaceholder="Search providers..."
                isInvalid={!complexProviderValid}
              />
            </div>
            {currentUserConfig?.settings.COMPLEX_PROVIDER && (
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-secondary">Model</p>
                  <ModelBadges
                    modelsData={modelsData}
                    provider={
                      currentUserConfig?.settings.COMPLEX_PROVIDER || ""
                    }
                    model={currentUserConfig?.settings.COMPLEX_MODEL || ""}
                  />
                </div>
                <SettingCombobox
                  value={currentUserConfig?.settings.COMPLEX_MODEL || ""}
                  values={
                    modelsData && currentUserConfig?.settings.COMPLEX_PROVIDER
                      ? Object.keys(
                          modelsData[
                            currentUserConfig.settings.COMPLEX_PROVIDER
                          ] || {}
                        )
                      : []
                  }
                  onChange={(value) => {
                    onUpdateSettings("COMPLEX_MODEL", value);
                  }}
                  placeholder={
                    loadingModels ? "Loading models..." : "Select model..."
                  }
                  searchPlaceholder="Search models..."
                  isInvalid={!complexModelValid}
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
            value={currentUserConfig?.settings.MODEL_API_BASE || ""}
            onChange={(value) => {
              onUpdateSettings("MODEL_API_BASE", value);
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
            You can use the same model for both base and complex tasks. Using
            different models allows you to balance speed vs quality - faster
            models for simple tasks and more capable models for complex
            reasoning.
          </p>
        </div>

        {/* Reset config button for tree settings */}
        {onResetConfig && (
          <div className="flex w-full items-center justify-center pt-4">
            <DeleteButton
              onClick={onResetConfig}
              text="Reset Config"
              icon={<TbArrowBackUp />}
              confirmText="Are you sure?"
            />
          </div>
        )}
      </SettingGroup>
    </SettingCard>
  );
}
