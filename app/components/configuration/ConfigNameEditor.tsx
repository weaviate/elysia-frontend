"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoWarning } from "react-icons/io5";
import { BackendConfig } from "@/app/types/objects";

interface ConfigNameEditorProps {
  currentUserConfig: BackendConfig | null;
  editName: boolean;
  nameExists: boolean;
  nameIsEmpty: boolean;
  isNewConfig: boolean;
  isDefaultConfig: boolean;
  loadingConfigs: boolean;
  onNameChange: (name: string) => void;
  onEditStart: () => void;
  onEditEnd: () => void;
}

/**
 * Component for editing configuration names with validation
 * Handles inline editing, validation feedback, and status indicators
 */
export default function ConfigNameEditor({
  currentUserConfig,
  editName,
  nameExists,
  nameIsEmpty,
  isNewConfig,
  isDefaultConfig,
  loadingConfigs,
  onNameChange,
  onEditStart,
  onEditEnd,
}: ConfigNameEditorProps) {
  return (
    <div className="border-foreground_alt w-full lg:w-auto">
      <div className="flex flex-row sm:items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {editName ? (
                <Input
                  className={`text-primary bg-transparent flex-1 min-w-0 ${
                    nameExists || nameIsEmpty
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  value={currentUserConfig?.name || ""}
                  onChange={(e) => onNameChange(e.target.value)}
                  onBlur={onEditEnd}
                  placeholder="Config name"
                  autoFocus
                />
              ) : (
                <span
                  className={`text-sm lg:text-base text-primary font-medium border rounded-md px-4 py-1 flex-1 truncate cursor-pointer hover:bg-foreground_alt/10 transition-colors ${
                    nameExists || nameIsEmpty
                      ? "border-destructive"
                      : "border-foreground_alt"
                  }`}
                  onDoubleClick={onEditStart}
                >
                  {currentUserConfig?.name || "Loading config..."}
                </span>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>Double click to edit name</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Status indicators and validation messages */}
        <div className="flex flex-row items-center gap-2 flex-wrap">
          {nameExists && (
            <div className="flex flex-row fade-in items-center gap-2 bg-destructive text-destructive-foreground rounded-md px-2 py-1">
              <IoWarning size={12} />
              <p className="text-xs">Name exists</p>
            </div>
          )}
          {nameIsEmpty && (
            <div className="flex flex-row fade-in items-center gap-2 bg-destructive text-destructive-foreground rounded-md px-2 py-1">
              <IoWarning size={12} />
              <p className="text-xs">Name required</p>
            </div>
          )}
          {isNewConfig && !loadingConfigs && (
            <div className="flex flex-row fade-in items-center gap-2 bg-primary/10 rounded-md px-2 py-1">
              <p className="text-xs text-primary">New Config</p>
            </div>
          )}
          {isDefaultConfig && !loadingConfigs && (
            <div className="flex flex-row fade-in items-center gap-2 bg-highlight/10 rounded-md px-2 py-1">
              <p className="text-xs text-highlight">Default</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
