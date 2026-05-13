"use client";

import React, { useContext } from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { GiAbstract053 } from "react-icons/gi";
import { FaRegUser } from "react-icons/fa";

import { RouterContext } from "../contexts/RouterContext";
import { SessionContext } from "../contexts/SessionContext";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslations } from "next-intl";

const SettingsSubMenu: React.FC = () => {
  const tSidebar = useTranslations('sidebar');
  const tConfig = useTranslations('config');
  const { changePage, currentPage } = useContext(RouterContext);
  const { unsavedChanges } = useContext(SessionContext);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <p>{tSidebar('settings')}</p>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenuItem className="list-none" key={"settings"}>
          <SidebarMenuButton
            variant={currentPage === "profile" ? "active" : "default"}
            onClick={() => changePage("profile", {}, true, unsavedChanges)}
          >
            <FaRegUser />
            <p>{tSidebar('profile')}</p>
          </SidebarMenuButton>
          <SidebarMenuButton
            variant={currentPage === "elysia" ? "active" : "default"}
            onClick={() => changePage("elysia", {}, true, unsavedChanges)}
          >
            <GiAbstract053 />
            <p>{tConfig('blob')}</p>
          </SidebarMenuButton>
          <ThemeToggle />
        </SidebarMenuItem>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SettingsSubMenu;
