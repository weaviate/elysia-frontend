"use client";

import { createContext, useEffect, useRef, useState } from "react";
import { generateIdFromIp } from "../../util";
import { usePathname } from "next/navigation";
import { initializeUser } from "@/app/api/initializeUser";
import { UserConfig } from "@/app/types/objects";
import { getConfigList } from "@/app/api/getConfigList";
import { getConfig } from "@/app/api/getConfig";

export const SessionContext = createContext<{
  mode: string;
  id: string | undefined;
  showRateLimitDialog: boolean;
  enableRateLimitDialog: () => void;
  userConfig: UserConfig | null;
  fetchCurrentConfig: () => void;
}>({
  mode: "home",
  id: "",
  showRateLimitDialog: false,
  enableRateLimitDialog: () => {},
  userConfig: null,
  fetchCurrentConfig: () => {},
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
  const [configIDs, setConfigIDs] = useState<string[]>([]);
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
    setUserConfig(null);
    setUserConfig(config.config);
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
    setUserConfig(user_object.config);
    console.log("CONFIG", user_object.config);
    setId(id);
  };

  const enableRateLimitDialog = () => {
    setShowRateLimitDialog(true);
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
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
