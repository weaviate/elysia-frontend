"use client";

import React from "react";
import { MdStorage } from "react-icons/md";
import { IoCopy } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  SettingCard,
  SettingGroup,
  SettingItem,
  SettingTitle,
} from "../SettingComponents";
import SettingInput from "../SettingInput";
import SettingCheckbox from "../SettingCheckbox";
import WarningCard from "../WarningCard";
import { FrontendConfig } from "@/app/types/objects";

interface StorageSectionProps {
  currentFrontendConfig: FrontendConfig | null;
  storageIssues: string[];
  shouldHighlightUseSameCluster: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdateFrontend: (key: string, value: any) => void;
  onCopyWeaviateValues: () => void;
}

/**
 * Component for configuring Elysia storage settings
 * Handles storage URL, API key, and save options for configs and conversations
 */
export default function StorageSection({
  currentFrontendConfig,
  storageIssues,
  shouldHighlightUseSameCluster,
  onUpdateFrontend,
  onCopyWeaviateValues,
}: StorageSectionProps) {
  return (
    <SettingCard>
      <div className="flex flex-col sm:flex-row items-start sm:items-center w-full justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 bg-background rounded-md flex items-center justify-center">
            <MdStorage />
          </div>
          <p className="text-primary text-lg">Elysia Storage</p>
        </div>
        <div className="flex items-center justify-end w-full sm:w-auto">
          <motion.div
            animate={
              shouldHighlightUseSameCluster
                ? {
                    rotate: [-2, 2, -2, 2, 0],
                    y: [0, -4, 0, -4, 0],
                  }
                : {}
            }
            transition={{
              duration: 0.5,
              repeat: shouldHighlightUseSameCluster ? Infinity : 0,
              repeatDelay: 1,
              ease: "easeInOut",
            }}
          >
            <Button
              variant="default"
              onClick={onCopyWeaviateValues}
              className={`flex items-center gap-2 w-full sm:w-[10rem] ${
                shouldHighlightUseSameCluster
                  ? "bg-highlight/10 text-highlight hover:bg-highlight/20 border-highlight/30"
                  : ""
              }`}
            >
              <IoCopy />
              <span className="text-sm font-base">Use Same Cluster</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Warning Card for Storage Issues */}
      {storageIssues.length > 0 && (
        <WarningCard
          title="Storage Configuration Required"
          issues={storageIssues}
        />
      )}

      <SettingGroup>
        <SettingItem>
          <SettingTitle
            title="URL"
            description="The URL of your Weaviate cluster to save configs and conversations to."
          />
          <SettingInput
            key="elysia-storage-url"
            isProtected={false}
            value={currentFrontendConfig?.save_location_wcd_url || ""}
            onChange={(value) => {
              onUpdateFrontend("save_location_wcd_url", value);
            }}
            isInvalid={
              (currentFrontendConfig?.save_configs_to_weaviate ||
                currentFrontendConfig?.save_trees_to_weaviate) &&
              !currentFrontendConfig?.save_location_wcd_url?.trim()
            }
          />
        </SettingItem>

        <SettingItem>
          <SettingTitle
            title="API Key"
            description="The API key of your Weaviate cluster to save configs and conversations to."
          />
          <SettingInput
            key="elysia-storage-api-key"
            isProtected={true}
            value={currentFrontendConfig?.save_location_wcd_api_key || ""}
            onChange={(value) => {
              onUpdateFrontend("save_location_wcd_api_key", value);
            }}
            isInvalid={
              (currentFrontendConfig?.save_configs_to_weaviate ||
                currentFrontendConfig?.save_trees_to_weaviate) &&
              !currentFrontendConfig?.save_location_wcd_api_key?.trim()
            }
          />
        </SettingItem>

        <SettingItem>
          <SettingTitle
            title="Save Conversations"
            description="Save conversations to Weaviate."
          />
          <SettingCheckbox
            value={currentFrontendConfig?.save_trees_to_weaviate || false}
            onChange={(value) => {
              onUpdateFrontend("save_trees_to_weaviate", value);
            }}
          />
        </SettingItem>

        <SettingItem>
          <SettingTitle
            title="Save Configs"
            description="Save configs to Weaviate."
          />
          <SettingCheckbox
            value={currentFrontendConfig?.save_configs_to_weaviate || false}
            onChange={(value) => {
              onUpdateFrontend("save_configs_to_weaviate", value);
            }}
          />
        </SettingItem>
      </SettingGroup>
    </SettingCard>
  );
}
