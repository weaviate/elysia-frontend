"use client";

import React, { useContext, useEffect } from "react";

import { RouterContext } from "./components/contexts/RouterContext";
import ChatPage from "./pages/ChatPage";
import DataPage from "./pages/DataPage";
import CollectionPage from "./pages/CollectionPage";
import SettingsPage from "./pages/SettingsPage";
import EvalPage from "./pages/EvalPage";
import FeedbackPage from "./pages/FeedbackPage";
import ElysiaPage from "./pages/ElysiaPage";
import DisplayPage from "./pages/DisplayPage";
import ReportisticaPage from "./pages/ReportisticaPage";
import PromptEnhancerPage from "./pages/PromptEnhancerPage";
import ProfilePage from "./pages/ProfilePage";
import { ToastContext } from "./components/contexts/ToastContext";
import ConfirmationModal from "./components/dialog/ConfirmationModal";
import { useUserRoles } from "@/hooks/useUserRoles";

export default function Home() {
  const { currentPage, changePage } = useContext(RouterContext);
  const { isConfirmModalOpen } = useContext(ToastContext);
  const { canAccessRoute, rolesLoaded } = useUserRoles();

  // Route guard: if the user lands on a page their role doesn't allow
  // (e.g. via direct URL ?page=settings as a non-ADMIN), redirect to chat.
  useEffect(() => {
    if (!rolesLoaded) return;
    if (!canAccessRoute(currentPage)) {
      changePage("chat", {}, true);
    }
  }, [currentPage, rolesLoaded, canAccessRoute, changePage]);

  // Hide page content while we don't yet know what the user is allowed to see,
  // to avoid flashing a forbidden page before the redirect fires.
  const allowed = rolesLoaded && canAccessRoute(currentPage);

  return (
    <div className="flex flex-1 min-w-0 min-h-0 flex-col md:flex-row w-full gap-2 md:gap-6 items-start justify-start p-2 md:p-6 overflow-hidden">
      {isConfirmModalOpen && <ConfirmationModal />}
      {allowed && currentPage === "chat" && <ChatPage />}
      {allowed && currentPage === "data" && <DataPage />}
      {allowed && currentPage === "collection" && <CollectionPage />}
      {allowed && currentPage === "settings" && <SettingsPage />}
      {allowed && currentPage === "eval" && <EvalPage />}
      {allowed && currentPage === "feedback" && <FeedbackPage />}
      {allowed && currentPage === "elysia" && <ElysiaPage />}
      {allowed && currentPage === "display" && <DisplayPage />}
      {allowed && currentPage === "reportistica" && <ReportisticaPage />}
      {allowed && currentPage === "prompt-enhancer" && <PromptEnhancerPage />}
      {allowed && currentPage === "profile" && <ProfilePage />}
    </div>
  );
}
