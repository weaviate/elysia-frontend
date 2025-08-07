"use client";

import React from "react";
import { FaDatabase } from "react-icons/fa";
import { BsDatabaseFillAdd } from "react-icons/bs";
import {
  SettingCard,
  SettingHeader,
  SettingGroup,
  SettingItem,
  SettingTitle,
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
  onUpdateSettings: (key: string, value: any) => void;
  onUpdateFrontend: (key: string, value: any) => void;
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
  return (
    <SettingCard>
      <SettingHeader
        icon={<FaDatabase />}
        className="bg-accent"
        header="Weaviate Cluster"
        buttonIcon={<BsDatabaseFillAdd />}
        buttonText="Add Cluster"
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

        <SettingItem>
          <SettingTitle
            title="API Key"
            description="The API key of your Weaviate cluster."
          />
          <SettingInput
            isProtected={true}
            value={currentUserConfig?.settings.WCD_API_KEY || ""}
            onChange={(value) => {
              onUpdateSettings("WCD_API_KEY", value);
            }}
            isInvalid={!wcdApiKeyValid}
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
