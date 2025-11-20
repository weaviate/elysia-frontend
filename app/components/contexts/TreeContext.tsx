"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ToolPreset } from "@/app/types/objects";
import { ToolMetadataList } from "@/app/types/objects";
import { SessionContext } from "./SessionContext";
import { getToolPresets } from "@/app/api/getToolPresets";
import {
  ToolMetadataListPayload,
  ToolPresetPayload,
} from "@/app/types/payloads";
import { getToolMetadata } from "@/app/api/getToolMetadata";
import { ToastContext } from "./ToastContext";

export const TreeContext = createContext<{
  toolPresets: ToolPreset[];
  toolMetadata: ToolMetadataList;
  fetchToolPresets: () => void;
  fetchToolMetadata: () => void;
  selectToolPreset: (id: string) => void;
  selectedToolPreset: ToolPreset | null;
}>({
  toolPresets: [],
  toolMetadata: {},
  fetchToolPresets: () => {},
  fetchToolMetadata: () => {},
  selectToolPreset: () => {},
  selectedToolPreset: null,
});

export const TreeProvider = ({ children }: { children: React.ReactNode }) => {
  const { id, initialized } = useContext(SessionContext);
  const { showErrorToast } = useContext(ToastContext);

  const [toolPresets, setToolPresets] = useState<ToolPreset[]>([]);
  const [selectedToolPreset, setSelectedToolPreset] =
    useState<ToolPreset | null>(null);
  const [toolMetadata, setToolMetadata] = useState<ToolMetadataList>({});

  const fetchToolPresets = async () => {
    if (!id) return;
    const data: ToolPresetPayload = await getToolPresets(id);

    if (data.error) {
      showErrorToast("Failed to fetch tool presets", data.error);
      return;
    }

    setToolPresets(data.presets);
    setSelectedToolPreset(data.presets[0] || null);
  };

  const fetchToolMetadata = async () => {
    const data: ToolMetadataListPayload = await getToolMetadata();

    if (data.error) {
      showErrorToast("Failed to fetch tool metadata", data.error);
      return;
    }

    setToolMetadata(data.tools);
  };

  const selectToolPreset = (id: string) => {
    setSelectedToolPreset(
      toolPresets.find((preset) => preset.preset_id === id) || null
    );
  };

  useEffect(() => {
    if (!id || !initialized) return;
    fetchToolPresets();
    fetchToolMetadata();
  }, [id, initialized]);

  return (
    <TreeContext.Provider
      value={{
        toolPresets,
        toolMetadata,
        fetchToolPresets,
        fetchToolMetadata,
        selectToolPreset,
        selectedToolPreset,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
};
