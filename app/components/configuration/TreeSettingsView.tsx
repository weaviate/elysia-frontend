"use client";

import { ModelProvider } from "@/app/types/objects";
import { getModels } from "@/app/api/getModels";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TbArrowBackUp } from "react-icons/tb";

// Custom hooks
import { useTreeConfigState } from "./hooks/useTreeConfigState";
import { useConfigValidation } from "./hooks/useConfigValidation";

// Components
import AgentSection from "./sections/AgentSection";
import ModelsSection from "./sections/ModelsSection";
import TreeConfigActions from "./TreeConfigActions";

/**
 * TreeSettingsView - Refactored to use shared components and hooks
 * Handles tree-specific configuration for individual conversations
 */
export default function TreeSettingsView({
  user_id,
  conversation_id,
  selectChat,
}: {
  user_id: string | null | undefined;
  conversation_id: string | null | undefined;
  selectChat: () => void;
}) {
  // Tree configuration state management
  const {
    currentConfig,
    changedConfig,
    loading,
    handleSaveConfig,
    resetConfig,
    cancelConfig,
    updateFields,
    updateSettingsFields,
    setCurrentConfig,
  } = useTreeConfigState(user_id, conversation_id);

  // Models data state
  const [modelsData, setModelsData] = useState<{
    [key: string]: ModelProvider;
  } | null>(null);
  const [loadingModels, setLoadingModels] = useState<boolean>(true);

  // Configuration validation using shared hook
  const { getAllModelsIssues } = useConfigValidation(
    currentConfig,
    null, // No frontend config for tree settings
    modelsData
  );

  // Fetch models data on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoadingModels(true);
        const modelsPayload = await getModels();
        if (modelsPayload.error) {
          console.error("Error fetching models:", modelsPayload.error);
        } else {
          setModelsData(modelsPayload.models);
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-primary shine">Loading chat config...</p>
      </div>
    );
  }

  if (!currentConfig) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full gap-4">
        <p className="text-secondary">No chat configuration found</p>
        <button
          onClick={selectChat}
          className="flex items-center gap-2 px-4 py-2 border border-foreground_alt rounded-md hover:bg-foreground_alt/10 transition-colors"
        >
          <TbArrowBackUp size={16} />
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <div className="flex flex-col gap-4 w-full md:w-[80vw] lg:w-[60vw] min-h-0 h-full fade-in">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="md:flex-row flex-col flex items-center justify-between gap-4 w-full pt-2 sm:pt-4 px-2 sm:px-4 lg:px-0"
        >
          <TreeConfigActions
            changedConfig={changedConfig}
            onSaveConfig={handleSaveConfig}
            onCancelConfig={cancelConfig}
            onBack={selectChat}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col gap-6 h-full overflow-y-auto mb-48 w-full px-2 sm:px-4 lg:px-0 fade-in"
        >
          {/* Agent Configuration */}
          <AgentSection
            currentUserConfig={currentConfig}
            onUpdateFields={updateFields}
            onUpdateSettings={updateSettingsFields}
            title="Agent Configuration"
            showDocumentation={false}
            showFeedbackSetting={false}
          />

          {/* Models Configuration */}
          <ModelsSection
            currentUserConfig={currentConfig}
            modelsData={modelsData}
            loadingModels={loadingModels}
            modelsIssues={getAllModelsIssues()}
            onUpdateSettings={updateSettingsFields}
            onUpdateConfig={setCurrentConfig}
            setChangedConfig={() => {}} // Changes are tracked by the tree state hook
            showDocumentation={false}
            onResetConfig={resetConfig}
          />
        </motion.div>
      </div>
    </div>
  );
}
