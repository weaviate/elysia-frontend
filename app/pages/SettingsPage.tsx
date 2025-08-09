"use client";

import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getModels } from "../api/getModels";
import { SessionContext } from "../components/contexts/SessionContext";
import { ModelProvider } from "../types/objects";

// Custom hooks
import { useConfigState } from "../components/configuration/hooks/useConfigState";
import { useConfigValidation } from "../components/configuration/hooks/useConfigValidation";
import { useApiKeyManagement } from "../components/configuration/hooks/useApiKeyManagement";

// Components
import ConfigSidebar, {
  DesktopConfigSidebar,
} from "../components/configuration/ConfigSidebar";
import ConfigNameEditor from "../components/configuration/ConfigNameEditor";
import ConfigActions from "../components/configuration/ConfigActions";
import WeaviateSection from "../components/configuration/sections/WeaviateSection";
import StorageSection from "../components/configuration/sections/StorageSection";
import AgentSection from "../components/configuration/sections/AgentSection";
import ModelsSection from "../components/configuration/sections/ModelsSection";
import ApiKeysSection from "../components/configuration/sections/ApiKeysSection";
import EnvImportModal from "../components/configuration/EnvImportModal";

// Utilities
import {
  shouldHighlightUseSameCluster,
  copyWeaviateValuesToStorage,
} from "../components/configuration/utils/configUtils";

/**
 * Main Settings Page Component - Refactored for better maintainability
 *
 * This component orchestrates the entire configuration interface, including:
 * - Configuration selection and management (sidebar/mobile dropdown)
 * - Config name editing with validation
 * - Save/cancel/delete actions with proper state management
 * - Multiple configuration sections (Weaviate, Storage, Agent, Models, API Keys)
 * - Environment file import functionality
 *
 * The component uses custom hooks for state management and validation,
 * and breaks down the UI into focused, reusable components.
 */
export default function Home() {
  const {
    id,
    userConfig,
    configIDs,
    updateConfig,
    handleCreateConfig,
    getConfigIDs,
    handleLoadConfig,
    handleDeleteConfig,
    loadingConfig,
    loadingConfigs,
    savingConfig,
  } = useContext(SessionContext);

  // Configuration state management
  const {
    currentUserConfig,
    currentFrontendConfig,
    changedConfig,
    matchingConfig,
    editName,
    isNewConfig,
    isDefaultConfig,
    nameExists,
    nameIsEmpty,
    setCurrentUserConfig,
    setCurrentFrontendConfig,
    setChangedConfig,
    setEditName,
    updateFields,
    updateFrontendFields,
    updateSettingsFields,
    cancelConfig,
  } = useConfigState(userConfig, configIDs);

  // Models data state
  const [modelsData, setModelsData] = useState<{
    [key: string]: ModelProvider;
  } | null>(null);
  const [loadingModels, setLoadingModels] = useState<boolean>(true);

  // Configuration validation
  const {
    currentValidation,
    getMissingApiKeys,
    getStorageIssues,
    isConfigValid,
    getWeaviateIssues,
    getModelsIssues,
    getApiKeysIssues,
  } = useConfigValidation(currentUserConfig, currentFrontendConfig, modelsData);

  // API key management
  const {
    addAPIKey,
    addAllMissingAPIKeys,
    removeAPIKey,
    updateAPIKeys,
    parseEnvContent,
  } = useApiKeyManagement(
    currentUserConfig,
    setCurrentUserConfig,
    setChangedConfig,
    getMissingApiKeys
  );

  // Modal and UI state
  const [saveAsDefault, setSaveAsDefault] = useState<boolean>(true);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState<boolean>(false);
  const [envContent, setEnvContent] = useState<string>("");

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

  // Helper function to handle saving configuration
  const handleSaveConfig = (setDefault: boolean = false) => {
    if (currentUserConfig && currentFrontendConfig) {
      updateConfig(
        {
          backend: currentUserConfig,
          frontend: currentFrontendConfig,
        },
        setDefault
      );
      setChangedConfig(false);
      setEditName(false);
    }
  };

  // Helper function to handle config selection
  const selectConfig = (configId: string) => {
    if (id) {
      handleLoadConfig(id, configId);
      setEditName(false);
    }
  };

  // Helper function to handle storage cluster copying
  const copyWeaviateValuesToConfigStorage = () => {
    const updatedConfig = copyWeaviateValuesToStorage(
      currentUserConfig,
      currentFrontendConfig
    );
    if (updatedConfig) {
      setCurrentFrontendConfig(updatedConfig);
      setChangedConfig(true);
    }
  };

  // Helper function to create a new config
  const handleCreateConfigWithUniqueName = async () => {
    if (!id) return;
    await handleCreateConfig(id);
  };

  // Helper function to handle environment file import
  const handleEnvSubmit = () => {
    if (envContent.trim()) {
      parseEnvContent(envContent);
      setEnvContent("");
      setIsEnvModalOpen(false);
    }
  };

  // Calculate helper values
  const shouldHighlight = shouldHighlightUseSameCluster(
    currentUserConfig,
    currentFrontendConfig
  );

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-col w-full gap-4 min-h-0 items-start justify-start h-full fade-in p-2 lg:p-4">
        {/* Mobile Config Selector - Only visible on small screens */}
        <ConfigSidebar
          currentUserConfig={currentUserConfig}
          configIDs={configIDs}
          loadingConfigs={loadingConfigs}
          onCreateConfig={handleCreateConfigWithUniqueName}
          onRefreshConfigs={() => {
            if (id) {
              getConfigIDs(id);
            }
          }}
          onSelectConfig={selectConfig}
          onDeleteConfig={(configId, isCurrentConfig) => {
            if (id) {
              handleDeleteConfig(id, configId, isCurrentConfig);
            }
          }}
        />

        <div className="flex flex-row w-full gap-4 min-h-0 items-start justify-start h-full">
          {/* Desktop Sidebar */}
          <DesktopConfigSidebar
            currentUserConfig={currentUserConfig}
            configIDs={configIDs}
            loadingConfigs={loadingConfigs}
            onCreateConfig={handleCreateConfigWithUniqueName}
            onRefreshConfigs={() => {
              if (id) {
                getConfigIDs(id);
              }
            }}
            onSelectConfig={selectConfig}
            onDeleteConfig={(configId, isCurrentConfig) => {
              if (id) {
                handleDeleteConfig(id, configId, isCurrentConfig);
              }
            }}
          />

          {/* Main Content Area */}
          <div className="flex w-full lg:w-3/4 xl:w-4/5 flex-col min-h-0 h-full fade-in">
            {currentUserConfig && currentFrontendConfig && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 w-full py-4 flex-shrink-0"
              >
                {/* Configuration Name Editor */}
                <ConfigNameEditor
                  currentUserConfig={currentUserConfig}
                  editName={editName}
                  nameExists={nameExists}
                  nameIsEmpty={nameIsEmpty}
                  isNewConfig={isNewConfig}
                  isDefaultConfig={isDefaultConfig}
                  loadingConfigs={loadingConfigs}
                  onNameChange={(name) => updateFields("name", name)}
                  onEditStart={() => setEditName(true)}
                  onEditEnd={() => setEditName(false)}
                />

                {/* Configuration Actions */}
                <ConfigActions
                  changedConfig={changedConfig}
                  matchingConfig={matchingConfig}
                  isNewConfig={isNewConfig}
                  isDefaultConfig={isDefaultConfig}
                  isConfigValid={isConfigValid}
                  nameExists={nameExists}
                  nameIsEmpty={nameIsEmpty}
                  loadingConfig={loadingConfig}
                  loadingConfigs={loadingConfigs}
                  savingConfig={savingConfig}
                  saveAsDefault={saveAsDefault}
                  userConfigId={userConfig?.backend?.id}
                  onSaveAsDefaultChange={setSaveAsDefault}
                  onSaveConfig={handleSaveConfig}
                  onCancelConfig={cancelConfig}
                  onDeleteConfig={() => {
                    if (id && userConfig?.backend?.id) {
                      handleDeleteConfig(id, userConfig.backend.id, true);
                    }
                  }}
                />
              </motion.div>
            )}

            {/* Scrollable Configuration Sections */}
            {userConfig ? (
              <div
                className={`flex flex-col gap-6 overflow-y-auto pb-8 flex-1 min-h-0 fade-in transition-opacity mb-8 ${
                  loadingConfig ? "opacity-70" : "opacity-100"
                }`}
              >
                <div className="flex flex-col gap-2">
                  {/* Weaviate Cluster Configuration */}
                  <WeaviateSection
                    currentUserConfig={currentUserConfig}
                    currentFrontendConfig={currentFrontendConfig}
                    weaviateIssues={getWeaviateIssues()}
                    wcdUrlValid={currentValidation.wcd_url}
                    wcdApiKeyValid={currentValidation.wcd_api_key}
                    onUpdateSettings={updateSettingsFields}
                    onUpdateFrontend={updateFrontendFields}
                  />

                  {/* Elysia Storage Configuration */}
                  <StorageSection
                    currentFrontendConfig={currentFrontendConfig}
                    storageIssues={getStorageIssues}
                    shouldHighlightUseSameCluster={shouldHighlight}
                    onUpdateFrontend={updateFrontendFields}
                    onCopyWeaviateValues={copyWeaviateValuesToConfigStorage}
                  />

                  {/* Agent Configuration */}
                  <AgentSection
                    currentUserConfig={currentUserConfig}
                    onUpdateFields={updateFields}
                    onUpdateSettings={updateSettingsFields}
                  />

                  {/* Models Configuration */}
                  <ModelsSection
                    currentUserConfig={currentUserConfig}
                    modelsData={modelsData}
                    loadingModels={loadingModels}
                    modelsIssues={getModelsIssues()}
                    baseProviderValid={currentValidation.base_provider}
                    baseModelValid={currentValidation.base_model}
                    complexProviderValid={currentValidation.complex_provider}
                    complexModelValid={currentValidation.complex_model}
                    onUpdateSettings={updateSettingsFields}
                    onUpdateConfig={setCurrentUserConfig}
                    setChangedConfig={setChangedConfig}
                  />

                  {/* API Keys Configuration */}
                  <ApiKeysSection
                    currentUserConfig={currentUserConfig}
                    apiKeysIssues={getApiKeysIssues()}
                    onAddAPIKey={addAPIKey}
                    onAddAllMissingAPIKeys={addAllMissingAPIKeys}
                    onUpdateAPIKeys={updateAPIKeys}
                    onRemoveAPIKey={removeAPIKey}
                    onOpenEnvModal={() => setIsEnvModalOpen(true)}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <p className="text-primary shine">Loading config...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Environment Import Modal */}
      <EnvImportModal
        isOpen={isEnvModalOpen}
        envContent={envContent}
        onOpenChange={setIsEnvModalOpen}
        onEnvContentChange={setEnvContent}
        onSubmit={handleEnvSubmit}
        onCancel={() => {
          setIsEnvModalOpen(false);
          setEnvContent("");
        }}
      />
    </div>
  );
}
