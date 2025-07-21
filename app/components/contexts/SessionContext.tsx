"use client";

import { createContext, useEffect, useRef, useState } from "react";
import { generateIdFromIp } from "../../util";
import { usePathname } from "next/navigation";
import { initializeUser } from "@/app/api/initializeUser";
import { saveConfig } from "@/app/api/saveConfig";
import { FrontendConfig, UserConfig } from "@/app/types/objects";
import { getConfigList } from "@/app/api/getConfigList";
import { getConfig } from "@/app/api/getConfig";
import { ConfigListEntry, ConfigPayload } from "@/app/types/payloads";
import { createConfig } from "@/app/api/createConfig";

export const SessionContext = createContext<{
  mode: string;
  id: string | undefined;
  showRateLimitDialog: boolean;
  enableRateLimitDialog: () => void;
  userConfig: UserConfig | null;
  frontendConfig: FrontendConfig | null;
  fetchCurrentConfig: () => void;
  configIDs: ConfigListEntry[];
  updateConfig: (config: UserConfig) => void;
  handleCreateConfig: (user_id: string) => void;
}>({
  mode: "home",
  id: "",
  showRateLimitDialog: false,
  enableRateLimitDialog: () => {},
  userConfig: null,
  frontendConfig: null,
  fetchCurrentConfig: () => {},
  configIDs: [],
  updateConfig: () => {},
  handleCreateConfig: () => {},
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
  const [frontendConfig, setFrontendConfig] = useState<FrontendConfig | null>(
    null
  );
  const [configIDs, setConfigIDs] = useState<ConfigListEntry[]>([]);
  const initialized = useRef(false);

  const getConfigIDs = async (user_id: string) => {
    if (!user_id) {
      return;
    }
    const configList = await getConfigList(user_id);
    setConfigIDs(configList.configs);
  };

  // TODO : Add fetching all possible model names from the API

  const fetchCurrentConfig = async () => {
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
  };

  const enableRateLimitDialog = () => {
    setShowRateLimitDialog(true);
  };

  const updateConfig = async (config: UserConfig) => {
    console.log("UPDATING CONFIG", config);

    const response: ConfigPayload = await saveConfig(
      id,
      config.backend,
      config.frontend
    );
    if (response.error) {
      console.error(response.error);
    }
    setUserConfig({
      backend: response.config,
      frontend: response.frontend_config,
    });
  };

  const handleCreateConfig = async (user_id: string) => {
    if (!user_id) {
      return;
    }
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
  };

  return (
    <SessionContext.Provider
      value={{
        mode,
        id,
        showRateLimitDialog,
        enableRateLimitDialog,
        userConfig,
        frontendConfig,
        fetchCurrentConfig,
        configIDs,
        updateConfig,
        handleCreateConfig,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
