"use client";

import { createContext, useEffect, useRef, useState } from "react";
import { generateIdFromIp } from "../../util";
import { usePathname } from "next/navigation";
import { initializeUser } from "@/app/api/initializeUser";
import { UserConfig } from "@/app/types/objects";
export const SessionContext = createContext<{
  mode: string;
  id: string | undefined;
  showRateLimitDialog: boolean;
  enableRateLimitDialog: () => void;
}>({
  mode: "home",
  id: "",
  showRateLimitDialog: false,
  enableRateLimitDialog: () => {},
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
  const initialized = useRef(false);

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

    setUserConfig(user_object.config);
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
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
