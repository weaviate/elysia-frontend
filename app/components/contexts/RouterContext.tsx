/* eslint-disable */

"use client";

import { createContext, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ToastContext } from "./ToastContext";

export const RouterContext = createContext<{
  currentPage: string;
  changePage: (
    route: string,
    params: Record<string, any>,
    replace: boolean
  ) => void;
  // Navigation methods will go here
}>({
  currentPage: "home",
  changePage: () => {},
  // Default method implementations will go here
});

export const RouterProvider = ({ children }: { children: React.ReactNode }) => {
  const { showSuccessToast } = useContext(ToastContext);
  const [currentPage, setCurrentPage] = useState<string>("home");
  const searchParams = useSearchParams();

  const changePage = (
    route: string,
    params: Record<string, any>,
    replace: boolean = false
  ) => {
    let finalParams: Record<string, any>;

    if (replace) {
      // Replace: just use the incoming params
      finalParams = params;
    } else {
      // Append: merge current search params with new ones
      const currentParams: Record<string, any> = {};
      searchParams.forEach((value, key) => {
        currentParams[key] = value;
      });
      finalParams = { ...currentParams, ...params };
    }

    const url = `${route}?${new URLSearchParams(finalParams).toString()}`;

    if (replace) {
      window.history.replaceState(null, "", url);
    } else {
      window.history.pushState(null, "", url);
    }

    setCurrentPage(route);

    // COMMENT OUT WHEN PRODUCTION
    showSuccessToast("Page changed to " + url);
  };

  return (
    <RouterContext.Provider
      value={{
        currentPage,
        changePage,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};
