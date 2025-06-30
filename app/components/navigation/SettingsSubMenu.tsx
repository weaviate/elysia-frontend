"use client";

import React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { IoSettingsOutline } from "react-icons/io5";
import { CgDarkMode } from "react-icons/cg";

import { useRouter, usePathname } from "next/navigation";

const SettingsSubMenu: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <p>Settings</p>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenuItem className="list-none" key={"settings"}>
          <SidebarMenuButton
            variant={pathname === "/settings" ? "active" : "default"}
            onClick={() => router.push("/settings")}
          >
            <IoSettingsOutline />
            <p>Configuration</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem className="list-none" key={"theme"}>
          <SidebarMenuButton
            variant={pathname === "/settings/theme" ? "active" : "default"}
            onClick={() => router.push("/settings/theme")}
          >
            <CgDarkMode />
            <p>Theme</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SettingsSubMenu;
