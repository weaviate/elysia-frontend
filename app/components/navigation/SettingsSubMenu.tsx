"use client";

import React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { FaRegUser } from "react-icons/fa";

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
        <SidebarMenuItem className="list-none" key={"dashboard"}>
          <SidebarMenuButton
            variant={pathname === "/settings" ? "active" : "default"}
            onClick={() => router.push("/settings")}
          >
            <FaRegUser />
            <p>User</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SettingsSubMenu;
