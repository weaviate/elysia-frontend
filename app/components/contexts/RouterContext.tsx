/* eslint-disable */

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ToastContext } from "./ToastContext";

export const RouterContext = createContext<{
  currentPage: string;
  changePage: (
    page: string,
    params?: Record<string, any>,
    replace?: boolean
  ) => void;
}>({
  currentPage: "chat",
  changePage: () => {},
});

export const RouterProvider = ({ children }: { children: React.ReactNode }) => {
  const { showSuccessToast } = useContext(ToastContext);
  const [currentPage, setCurrentPage] = useState<string>("chat");

  const searchParams = useSearchParams();

  const changePage = (
    page: string,
    params: Record<string, any> = {},
    replace: boolean = false
  ) => {
    let finalParams: Record<string, any>;

    if (replace) {
      finalParams = { page, ...params };
    } else {
      const currentParams: Record<string, any> = {};
      searchParams.forEach((value, key) => {
        currentParams[key] = value;
      });
      finalParams = { ...currentParams, page, ...params };
    }

    const url = `/?${new URLSearchParams(finalParams).toString()}`;

    if (replace) {
      window.history.replaceState(null, "", url);
    } else {
      window.history.pushState(null, "", url);
    }
    //showSuccessToast("Page changed to " + url);
  };

  useEffect(() => {
    // Get page from URL parameter
    const pageParam = searchParams.get("page");

    // If no page parameter exists, redirect to chat page
    if (!pageParam) {
      // Preserve any existing query parameters (like conversation)
      const currentParams: Record<string, any> = {};
      searchParams.forEach((value, key) => {
        currentParams[key] = value;
      });

      // Add page=chat to the URL
      const url = `/?${new URLSearchParams({ page: "chat", ...currentParams }).toString()}`;
      window.history.replaceState(null, "", url);
      setCurrentPage("chat");
      return;
    }

    // Validate page parameter against known pages
    const validPages = [
      "chat",
      "data",
      "collection",
      "settings",
      "eval",
      "feedback",
      "elysia",
      "display",
    ];
    const validatedPage = validPages.includes(pageParam) ? pageParam : "chat";

    // If invalid page, redirect to chat
    if (pageParam !== validatedPage) {
      const currentParams: Record<string, any> = {};
      searchParams.forEach((value, key) => {
        if (key !== "page") {
          currentParams[key] = value;
        }
      });

      const url = `/?${new URLSearchParams({ page: "chat", ...currentParams }).toString()}`;
      window.history.replaceState(null, "", url);
    }

    setCurrentPage(validatedPage);
  }, [searchParams]);

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
