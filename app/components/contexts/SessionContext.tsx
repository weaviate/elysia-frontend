"use client";

import { createContext, useEffect, useRef, useState } from "react";
import { generateIdFromIp } from "../../util";
import { UserLimitResponse } from "../types";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

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
  userLimit: UserLimitResponse | null;
  getUserLimit: () => void;
  showRateLimitDialog: boolean;
  enableRateLimitDialog: () => void;
}>({
  mode: "home",
  id: "",
  userLimit: null,
  getUserLimit: () => {},
  showRateLimitDialog: false,
  enableRateLimitDialog: () => {},
});

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setMode] = useState<string>("home");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [userLimit, setUserLimit] = useState<UserLimitResponse | null>(null);
  const [showRateLimitDialog, setShowRateLimitDialog] =
    useState<boolean>(false);

  const [id, setId] = useState<string>();
  const initialized = useRef(false);

  const getUserLimit = async () => {
    if (!id) return;
    const res = await fetch("/api/get_user_limit", {
      method: "POST",
      body: JSON.stringify({ user_id: id }),
    });
    const data: UserLimitResponse = await res.json();
    setUserLimit(data);
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    getIp();
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

  const getIp = async () => {
    const id = await generateIdFromIp();
    setId(id);
  };

  const enableRateLimitDialog = () => {
    setShowRateLimitDialog(true);
  };

  return (
    <SessionContext.Provider
      value={{
        mode,
        getUserLimit,
        userLimit,
        id,
        showRateLimitDialog,
        enableRateLimitDialog,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
