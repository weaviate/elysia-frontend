"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IoMdAddCircle,
  IoIosRefresh,
  IoIosCheckmarkCircle,
} from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { DeleteButton } from "@/app/components/navigation/DeleteButton";
import { BackendConfig } from "@/app/types/objects";

interface ConfigListItem {
  config_id: string;
  name: string;
  default: boolean;
}

interface ConfigSidebarProps {
  currentUserConfig: BackendConfig | null;
  configIDs: ConfigListItem[];
  loadingConfigs: boolean;
  onCreateConfig: () => void;
  onRefreshConfigs: () => void;
  onSelectConfig: (configId: string) => void;
  onDeleteConfig: (configId: string, isCurrentConfig: boolean) => void;
}

/**
 * Component for managing configuration selection and navigation
 * Includes both mobile dropdown and desktop sidebar layouts
 */
export default function ConfigSidebar({
  currentUserConfig,
  configIDs,
  loadingConfigs,
  onCreateConfig,
  onRefreshConfigs,
  onSelectConfig,
}: ConfigSidebarProps) {
  return (
    /* Mobile Config Selector - Only visible on small screens */
    <div className="flex lg:hidden w-full">
      {currentUserConfig && !loadingConfigs && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
          <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-1">
            <label className="text-sm font-medium text-secondary">
              Configuration
            </label>
            <Select
              value={currentUserConfig.id ?? undefined}
              onValueChange={(value) => onSelectConfig(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    {configIDs.find(
                      (config) => config.config_id === currentUserConfig.id
                    )?.default && (
                      <div className="w-2 h-2 rounded-full bg-highlight"></div>
                    )}
                    {currentUserConfig.name}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {configIDs.map((configID) => (
                  <SelectItem
                    key={configID.config_id}
                    value={configID.config_id}
                  >
                    <span className="flex items-center gap-2">
                      {configID.default && (
                        <div className="w-2 h-2 rounded-full bg-highlight"></div>
                      )}
                      {configID.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row gap-2 w-full sm:w-auto">
            <Button className="flex-1 sm:flex-none" onClick={onCreateConfig}>
              <IoMdAddCircle />
              <span>New</span>
            </Button>
            <Button className="w-10 flex-shrink-0" onClick={onRefreshConfigs}>
              <IoIosRefresh />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Component for the desktop sidebar
 * Separated so it can be used independently in the main layout
 */
export function DesktopConfigSidebar({
  currentUserConfig,
  configIDs,
  loadingConfigs,
  onCreateConfig,
  onRefreshConfigs,
  onSelectConfig,
  onDeleteConfig,
}: ConfigSidebarProps) {
  return (
    /* Desktop Sidebar - Hidden on mobile */
    <div className="hidden lg:flex flex-col justify-start w-1/4 xl:w-1/5 border-r border-foreground_alt h-full p-4 gap-2 min-h-0">
      {/* New Config Button */}
      <div className="flex flex-row items-center justify-between gap-2 w-full">
        <Button className="flex-1" onClick={onCreateConfig}>
          <IoMdAddCircle />
          <span>New</span>
        </Button>
        <Button className="w-10" onClick={onRefreshConfigs}>
          <IoIosRefresh />
        </Button>
      </div>

      {/* Config List */}
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {!loadingConfigs &&
          configIDs.map((configID, index) => (
            <div
              key={configID.config_id + "_config_list_" + index}
              className="flex flex-row items-center justify-between"
            >
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
                onClick={() => onSelectConfig(configID.config_id)}
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
                confirmIcon={<IoIosCheckmarkCircle />}
                onClick={() => {
                  onDeleteConfig(
                    configID.config_id,
                    configID.config_id === currentUserConfig?.id
                  );
                }}
              />
            </div>
          ))}
        {loadingConfigs && (
          <div className="flex flex-row items-center justify-center w-full">
            <p className="text-primary shine text-sm mt-4">
              Loading configs...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
