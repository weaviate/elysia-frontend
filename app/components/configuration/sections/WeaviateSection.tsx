"use client";

import React from "react";
import { FaDatabase, FaCloud, FaServer } from "react-icons/fa";
import { BsDatabaseFillAdd } from "react-icons/bs";
import {
  SettingCard,
  SettingHeader,
  SettingGroup,
  SettingItem,
  SettingTitle,
  SettingToggle,
} from "../SettingComponents";
import SettingInput from "../SettingInput";
import WarningCard from "../WarningCard";
import { BackendConfig, FrontendConfig } from "@/app/types/objects";

interface WeaviateSectionProps {
  currentUserConfig: BackendConfig | null;
  currentFrontendConfig: FrontendConfig | null;
  weaviateIssues: string[];
  wcdUrlValid: boolean;
  wcdApiKeyValid: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdateSettings: (
    keyOrUpdates: string | Record<string, any>,
    value?: any
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdateFrontend: (
    keyOrUpdates: string | Record<string, any>,
    value?: any
  ) => void;
}

/**
 * Component for configuring Weaviate cluster settings
 * Handles URL, API key, and timeout configurations
 */
export default function WeaviateSection({
  currentUserConfig,
  currentFrontendConfig,
  weaviateIssues,
  wcdUrlValid,
  wcdApiKeyValid,
  onUpdateSettings,
  onUpdateFrontend,
}: WeaviateSectionProps) {
  const isLocal = currentUserConfig?.settings.WEAVIATE_IS_LOCAL as boolean;

  return (
    <SettingCard>
      <SettingHeader
        icon={<FaDatabase />}
        className="bg-accent"
        header="Weaviate Cluster"
        buttonIcon={<BsDatabaseFillAdd />}
        buttonText="Create Cluster"
        onClick={() => {
          window.open("https://console.weaviate.cloud/", "_blank");
        }}
      />

      {/* Warning Card for Weaviate Issues */}
      {weaviateIssues.length > 0 && (
        <WarningCard
          title="Weaviate Configuration Required"
          issues={weaviateIssues}
        />
      )}

      <SettingGroup>
        <SettingItem>
          <SettingTitle
            title="Cluster Type"
            description="Choose between cloud-hosted or local Weaviate instance."
          />
          <SettingToggle
            value={isLocal ? "Local" : "Cloud"}
            onChange={(value) => {
              const updates: Record<string, any> = {
                WEAVIATE_IS_LOCAL: value === "Local",
              };

              // Auto-populate URL when switching to local if it's empty
              if (
                value === "Local" &&
                (!currentUserConfig?.settings?.WCD_URL ||
                  currentUserConfig.settings.WCD_URL.trim() === "")
              ) {
                updates.WCD_URL = "http://localhost";
              }

              onUpdateSettings(updates);
            }}
            labelA="Cloud"
            labelB="Local"
            iconA={<FaCloud />}
            iconB={<FaServer />}
          />
        </SettingItem>
        <SettingItem>
          <SettingTitle
            title="URL"
            description="The URL of your Weaviate cluster."
          />
          <SettingInput
            isProtected={false}
            value={currentUserConfig?.settings.WCD_URL || ""}
            onChange={(value) => {
              onUpdateSettings("WCD_URL", value);
            }}
            isInvalid={!wcdUrlValid}
          />
        </SettingItem>

        {isLocal && (
          <>
            <SettingItem>
              <SettingTitle
                title="GRPC Port"
                description="The GRPCport of the local Weaviate cluster."
              />
              <SettingInput
                isProtected={false}
                value={
                  currentUserConfig?.settings.LOCAL_WEAVIATE_GRPC_PORT || 0
                }
                onChange={(value) => {
                  onUpdateSettings("LOCAL_WEAVIATE_GRPC_PORT", value);
                }}
                disabled={!isLocal}
              />
            </SettingItem>
            <SettingItem>
              <SettingTitle
                title="Port"
                description="The port of the local Weaviate cluster."
              />
              <SettingInput
                isProtected={false}
                value={currentUserConfig?.settings.LOCAL_WEAVIATE_PORT || 0}
                onChange={(value) => {
                  onUpdateSettings("LOCAL_WEAVIATE_PORT", value);
                }}
                disabled={!isLocal}
              />
            </SettingItem>
          </>
        )}

        <SettingItem>
          <SettingTitle
            title="API Key"
            description={
              isLocal
                ? "The API key of your local Weaviate cluster. Needs to be configured in the local Weaviate cluster."
                : "The API key of your Weaviate cluster."
            }
          />
          <SettingInput
            isProtected={true}
            value={currentUserConfig?.settings.WCD_API_KEY || ""}
            onChange={(value) => {
              onUpdateSettings("WCD_API_KEY", value);
            }}
            isInvalid={!isLocal && !wcdApiKeyValid}
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
              onUpdateFrontend("tree_timeout", value);
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
              onUpdateFrontend("client_timeout", value);
            }}
          />
        </SettingItem>
      </SettingGroup>
    </SettingCard>
  );
}
