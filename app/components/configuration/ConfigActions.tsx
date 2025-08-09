"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { FaSave, FaStar, FaCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { DeleteButton } from "@/app/components/navigation/DeleteButton";

interface ConfigActionsProps {
  changedConfig: boolean;
  matchingConfig: boolean;
  isNewConfig: boolean;
  isDefaultConfig: boolean;
  isConfigValid: boolean;
  nameExists: boolean;
  nameIsEmpty: boolean;
  loadingConfig: boolean;
  loadingConfigs: boolean;
  savingConfig: boolean;
  saveAsDefault: boolean;
  userConfigId?: string | null;
  onSaveAsDefaultChange: (checked: boolean) => void;
  onSaveConfig: (setDefault: boolean) => void;
  onCancelConfig: () => void;
  onDeleteConfig: () => void;
}

/**
 * Component for handling configuration actions (save, cancel, delete)
 * Includes save as default checkbox and various action states
 */
export default function ConfigActions({
  changedConfig,
  matchingConfig,
  isNewConfig,
  isDefaultConfig,
  isConfigValid,
  nameExists,
  nameIsEmpty,
  loadingConfig,
  loadingConfigs,
  savingConfig,
  saveAsDefault,
  userConfigId,
  onSaveAsDefaultChange,
  onSaveConfig,
  onCancelConfig,
  onDeleteConfig,
}: ConfigActionsProps) {
  const showSaveButton =
    (!matchingConfig || isNewConfig) && !loadingConfig && isConfigValid;
  const showSetDefaultButton =
    matchingConfig &&
    !isNewConfig &&
    !isDefaultConfig &&
    !loadingConfig &&
    !loadingConfigs;

  return (
    <div className="flex flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
      {/* Save as default checkbox */}
      <div className="flex flex-row items-center gap-2">
        <Checkbox
          checked={saveAsDefault}
          onCheckedChange={(checked) => {
            onSaveAsDefaultChange(checked as boolean);
          }}
        />
        <p className="text-sm text-secondary">Save as default</p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-row gap-2">
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
          {/* Save Button */}
          {showSaveButton && (
            <Button
              disabled={
                (!changedConfig && !isNewConfig) ||
                !isConfigValid ||
                nameExists ||
                nameIsEmpty
              }
              className="bg-accent/10 text-accent hover:bg-accent/20 w-full sm:w-auto"
              onClick={() => {
                onSaveConfig(saveAsDefault);
              }}
            >
              <FaSave />
              Save
            </Button>
          )}

          {/* Saving State */}
          {savingConfig && (
            <Button
              disabled={true}
              className="bg-accent/10 text-accent hover:bg-accent/20 w-full sm:w-auto"
            >
              <FaCircle scale={0.2} className="text-lg pulsing_color" />
              Saving...
            </Button>
          )}

          {/* Set as Default Button */}
          {showSetDefaultButton && (
            <Button
              disabled={!isConfigValid || nameExists || nameIsEmpty}
              className="bg-highlight/10 text-highlight hover:bg-highlight/20 w-full sm:w-auto fade-in"
              onClick={() => {
                onSaveConfig(true);
              }}
            >
              <FaStar />
              Set as default
            </Button>
          )}
        </motion.div>

        {/* Cancel Button */}
        <Button
          variant="destructive"
          onClick={onCancelConfig}
          disabled={matchingConfig}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>

        {/* Delete Button */}
        <DeleteButton
          variant="ghost"
          classNameDefault="w-full sm:w-auto text-secondary hover:text-error border border-foreground "
          classNameConfirm="w-full sm:w-auto text-secondary hover:text-error border border-foreground "
          icon={<TiDelete />}
          disabled={isNewConfig || !userConfigId}
          text="Delete"
          confirmText="Are you sure?"
          onClick={onDeleteConfig}
        />
      </div>
    </div>
  );
}
