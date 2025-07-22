"use client";

import { createContext, useEffect, useRef, useState } from "react";
import { generateIdFromIp } from "../../util";
import { usePathname } from "next/navigation";
import { initializeUser } from "@/app/api/initializeUser";
import { saveConfig } from "@/app/api/saveConfig";
import { BackendConfig, FrontendConfig, UserConfig } from "@/app/types/objects";
import { getConfigList } from "@/app/api/getConfigList";
import { getConfig } from "@/app/api/getConfig";
import {
  BasePayload,
  ConfigListEntry,
  ConfigPayload,
} from "@/app/types/payloads";
import { createConfig } from "@/app/api/createConfig";
import { loadConfig } from "@/app/api/loadConfig";
import { deleteConfig } from "@/app/api/deleteConfig";

interface SessionContextType {
  mode: string;
  id: string | undefined;
  userLimit: UserLimitResponse | null;
  getUserLimit: () => void;
  showRateLimitDialog: boolean;
  enableRateLimitDialog: () => void;
}

export const SessionContext = createContext<{
  mode: string;
  id: string | undefined;
  showRateLimitDialog: boolean;
  enableRateLimitDialog: () => void;
  userConfig: UserConfig | null;
  fetchCurrentConfig: () => void;
  configIDs: ConfigListEntry[];
  updateConfig: (config: UserConfig, setDefault: boolean) => void;
  handleCreateConfig: (user_id: string) => void;
  getConfigIDs: (user_id: string) => void;
  handleLoadConfig: (user_id: string, config_id: string) => void;
  handleDeleteConfig: (
    user_id: string,
    config_id: string,
    selectedConfig: boolean
  ) => void;
  loadingConfig: boolean;
  loadingConfigs: boolean;
}>({
  mode: "home",
  id: "",
  showRateLimitDialog: false,
  enableRateLimitDialog: () => {},
  userConfig: null,
  fetchCurrentConfig: () => {},
  configIDs: [],
  updateConfig: (config: UserConfig, setDefault: boolean) => {},
  handleCreateConfig: () => {},
  getConfigIDs: () => {},
  handleLoadConfig: () => {},
  handleDeleteConfig: () => {},
  loadingConfig: false,
  loadingConfigs: false,
});

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setMode] = useState<string>("home");

  const pathname = usePathname();

  const [showRateLimitDialog, setShowRateLimitDialog] =
    useState<boolean>(false);

  const [id, setId] = useState<string>();
  const [userConfig, setUserConfig] = useState<UserConfig | null>(null);
  const [configIDs, setConfigIDs] = useState<ConfigListEntry[]>([]);
  const [loadingConfig, setLoadingConfig] = useState<boolean>(false);
  const [loadingConfigs, setLoadingConfigs] = useState<boolean>(false);
  const initialized = useRef(false);

  const getConfigIDs = async (user_id: string) => {
    setLoadingConfigs(true);
    setConfigIDs([]);
    if (!user_id) {
      return;
    }
    console.log("Getting config IDs for user", user_id);
    const configList = await getConfigList(user_id);
    // Sort configs by last_used date in descending order (most recent first)
    const sortedConfigs = configList.configs.sort((a, b) => {
      return (
        new Date(b.last_update_time).getTime() -
        new Date(a.last_update_time).getTime()
      );
    });
    setConfigIDs(sortedConfigs);
    setLoadingConfigs(false);
  };

  // TODO : Add fetching all possible model names from the API

  const fetchCurrentConfig = async () => {
    setLoadingConfig(true);
    if (!id) {
      return;
    }
    const config = await getConfig(id);
    if (config.error) {
      console.error(config.error);
      return;
    }
    setUserConfig({
      backend: config.config,
      frontend: config.frontend_config,
    });
    setLoadingConfig(false);
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    initUser();
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      setMode("home");
    } else if (
      pathname.startsWith("/data") ||
      pathname.startsWith("/collection")
    ) {
      setMode("data-explorer");
    } else if (pathname.startsWith("/eval")) {
      setMode("evaluation");
    } else if (pathname.startsWith("/about/data")) {
      setMode("about-data");
    } else if (pathname.startsWith("/about")) {
      setMode("about");
    } else if (pathname.startsWith("/settings")) {
      setMode("settings");
    }
  }, [pathname]);

  const initUser = async () => {
    const id = await generateIdFromIp();
    const user_object = await initializeUser(id);
    setLoadingConfig(true);

    if (user_object.error) {
      console.error(user_object.error);
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Initialized user with id: " + id);
    }

    getConfigIDs(id);
    setUserConfig({
      backend: user_object.config,
      frontend: user_object.frontend_config,
    });

    setId(id);
    console.log("USER CONFIG", user_object.config);
    console.log("FRONTEND CONFIG", user_object.frontend_config);
    console.log("User ID", id);
    console.log("User exists", user_object.user_exists);
    setLoadingConfig(false);
  };

  const enableRateLimitDialog = () => {
    setShowRateLimitDialog(true);
  };

  const updateConfig = async (
    config: UserConfig,
    setDefault: boolean = false
  ) => {
    console.log("UPDATING CONFIG", config);
    setLoadingConfig(true);
    const response: ConfigPayload = await saveConfig(
      id,
      config.backend,
      config.frontend,
      setDefault
    );
    if (response.error) {
      console.error(response.error);
    }
    setUserConfig({
      backend: response.config,
      frontend: response.frontend_config,
    });
    getConfigIDs(id || "");
    setLoadingConfig(false);
  };

  const handleLoadConfig = async (user_id: string, config_id: string) => {
    if (!user_id || !config_id) {
      return;
    }
    setLoadingConfig(true);
    const response: ConfigPayload = await loadConfig(user_id, config_id);
    if (response.error) {
      console.error(response.error);
    }
    setUserConfig({
      backend: response.config,
      frontend: response.frontend_config,
    });
    getConfigIDs(user_id);
    setLoadingConfig(false);
  };

  const handleCreateConfig = async (user_id: string) => {
    if (!user_id) {
      return;
    }
    setLoadingConfig(true);
    const response: ConfigPayload = await createConfig(user_id);
    if (response.error) {
      console.error(response.error);
    } else {
      console.log("CREATED CONFIG", response.config);
    }
    setUserConfig({
      backend: response.config,
      frontend: response.frontend_config,
    });
    getConfigIDs(user_id);
    setLoadingConfig(false);
  };

  const handleDeleteConfig = async (
    user_id: string,
    config_id: string,
    selectedConfig: boolean
  ) => {
    if (!user_id || !config_id) {
      return;
    }
    setLoadingConfig(true);
    const response: BasePayload = await deleteConfig(user_id, config_id);
    if (response.error) {
      console.error(response.error);
    } else {
      if (selectedConfig) {
        // Find another config to load
        const otherConfig = configIDs.find(
          (config) => config.config_id !== config_id
        );
        if (otherConfig) {
          handleLoadConfig(user_id, otherConfig.config_id);
        } else {
          setUserConfig(null);
        }
      }
    }
    getConfigIDs(user_id);
    setLoadingConfig(false);
  };

  return (
    <SessionContext.Provider
      value={{
        mode,
        id,
        showRateLimitDialog,
        enableRateLimitDialog,
        userConfig,
        fetchCurrentConfig,
        configIDs,
        updateConfig,
        handleCreateConfig,
        getConfigIDs,
        handleLoadConfig,
        handleDeleteConfig,
        loadingConfig,
        loadingConfigs,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
