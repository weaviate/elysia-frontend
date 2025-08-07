"use client";

import React from "react";
import { IoKeyOutline, IoWarning, IoAdd } from "react-icons/io5";
import { FaFileImport } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  SettingCard,
  SettingHeader,
  SettingGroup,
  SettingItem,
} from "../SettingComponents";
import SettingKey from "../SettingKey";
import { BackendConfig } from "@/app/types/objects";

interface ApiKeysSectionProps {
  currentUserConfig: BackendConfig | null;
  apiKeysIssues: string[];
  onAddAPIKey: () => void;
  onAddAllMissingAPIKeys: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdateAPIKeys: (key: string, newKey: string, value: any) => void;
  onRemoveAPIKey: (key: string) => void;
  onOpenEnvModal: () => void;
}

/**
 * Component for managing API keys configuration
 * Handles adding, editing, removing API keys and importing from .env files
 */
export default function ApiKeysSection({
  currentUserConfig,
  apiKeysIssues,
  onAddAPIKey,
  onAddAllMissingAPIKeys,
  onUpdateAPIKeys,
  onRemoveAPIKey,
  onOpenEnvModal,
}: ApiKeysSectionProps) {
  return (
    <SettingCard>
      <SettingHeader
        icon={<IoKeyOutline />}
        buttonText="Import .env"
        buttonIcon={<FaFileImport />}
        className="bg-alt_color_b"
        header="API Keys"
        onClick={onOpenEnvModal}
      />

      {/* Warning Card for API Keys Issues */}
      {apiKeysIssues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 border border-warning bg-warning/10 rounded-md mb-2"
        >
          <IoWarning className="text-warning flex-shrink-0 mt-0.5" size={20} />
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex flex-col gap-1">
              <h3 className="text-warning font-medium">API Keys Required</h3>
              <p className="text-sm text-secondary">
                The following API keys are required for your selected models:
              </p>
              <ul className="text-sm text-secondary list-disc list-inside">
                {apiKeysIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-start">
              <Button
                variant="outline"
                size="sm"
                onClick={onAddAllMissingAPIKeys}
                className="bg-accent/10 text-accent hover:bg-accent/20 border-accent/30 flex items-center gap-2"
              >
                <IoAdd size={16} />
                Add Missing Keys
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <SettingGroup>
        {/* New API Keys (editable by default) */}
        {Object.entries(currentUserConfig?.settings.API_KEYS || {})
          .filter(([key]) => key.startsWith("new_key"))
          .map(([key, value]) => (
            <SettingItem key={key}>
              <SettingKey
                isProtected={true}
                startEditable={true}
                title={key}
                value={value || ""}
                onChange={(key, newKey, value) => {
                  onUpdateAPIKeys(key, newKey, value);
                }}
                onRemove={() => {
                  onRemoveAPIKey(key);
                }}
              />
            </SettingItem>
          ))}

        {/* Existing API Keys */}
        {Object.entries(currentUserConfig?.settings.API_KEYS || {})
          .filter(([key]) => !key.startsWith("new_key"))
          .map(([key, value]) => (
            <SettingItem key={key}>
              <SettingKey
                isProtected={true}
                startEditable={false}
                title={key}
                onRemove={() => {
                  onRemoveAPIKey(key);
                }}
                value={value || ""}
                onChange={(key, newKey, value) => {
                  onUpdateAPIKeys(key, newKey, value);
                }}
              />
            </SettingItem>
          ))}

        {/* Manual Add API Key Button */}
        <div className="flex items-center justify-center pt-2">
          <Button
            variant="outline"
            onClick={onAddAPIKey}
            className="bg-accent/10 hover:bg-accent/20 border-accent/30 text-accent hover:text-accent-foreground flex items-center gap-2"
          >
            <IoAdd size={16} />
            Add API Key
          </Button>
        </div>
      </SettingGroup>
    </SettingCard>
  );
}
