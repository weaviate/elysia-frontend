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

import { IoSettingsOutline } from "react-icons/io5";

import { RouterContext } from "../contexts/RouterContext";
import { SessionContext } from "../contexts/SessionContext";

const SettingsSubMenu: React.FC = () => {
  const { changePage, currentPage } = useContext(RouterContext);
  const { unsavedChanges } = useContext(SessionContext);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <p>Settings</p>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenuItem className="list-none" key={"settings"}>
          <SidebarMenuButton
            variant={currentPage === "settings" ? "active" : "default"}
            onClick={() => changePage("settings", {}, true, unsavedChanges)}
          >
            <IoSettingsOutline />
            <p>Configuration</p>
          </SidebarMenuButton>
          <SidebarMenuButton
            variant={currentPage === "elysia" ? "active" : "default"}
            onClick={() => changePage("elysia", {}, true, unsavedChanges)}
          >
            <GiAbstract053 />
            <p>Blob</p>
          </SidebarMenuButton>
          <SidebarMenuButton>
            <IoSettingsOutline />
            <p>Theme (Coming Soon)</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SettingsSubMenu;
