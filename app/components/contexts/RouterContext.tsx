"use client";

import { createContext, useContext, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SessionContext } from "./SessionContext";

export const RouterContext = createContext<{
  routerChangeToLogin: () => void;
  routerChangeToChat: () => void;
  routerChangeToData: () => void;
  routerChangeToEval: () => void;
}>({
  routerChangeToLogin: () => {},
  routerChangeToChat: () => {},
  routerChangeToData: () => {},
  routerChangeToEval: () => {},
});

export const RouterProvider = ({ children }: { children: React.ReactNode }) => {
  const { handleModeChange } = useContext(SessionContext);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      handleModeChange("home");
    } else if (pathname === "/data") {
      handleModeChange("data-explorer");
    } else if (pathname.startsWith("/eval")) {
      handleModeChange("evaluation");
    } else if (pathname === "/about") {
      handleModeChange("about");
    } else if (pathname === "/about/data") {
      handleModeChange("about-data");
    }
  }, [searchParams, pathname]);

  const routerChangeToLogin = () => {
    router.push("/login");
  };

  const routerChangeToChat = () => {
    router.push(`/`);
  };

  const routerChangeToData = () => {
    router.push(`/data`);
  };

  const routerChangeToEval = () => {
    router.push(`/eval`);
  };

  return (
    <RouterContext.Provider
      value={{
        routerChangeToLogin,
        routerChangeToEval,
        routerChangeToChat,
        routerChangeToData,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};
