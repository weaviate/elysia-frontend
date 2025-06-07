"use client";

import React from "react";
import { TbPackageImport } from "react-icons/tb";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import { MdOutlineSpaceDashboard } from "react-icons/md";

import { useRouter, usePathname } from "next/navigation";

const DataSubMenu: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const toDashboard = () => {
    router.push("/data");
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <p>Data</p>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenuItem className="list-none" key={"dashboard"}>
          <SidebarMenuButton
            variant={
              pathname.startsWith("/data") || pathname.startsWith("/collection")
                ? "active"
                : "default"
            }
            onClick={toDashboard}
          >
            <MdOutlineSpaceDashboard />
            <p>Dashboard</p>
          </SidebarMenuButton>
          <SidebarMenuButton variant="default">
            <TbPackageImport />
            <p>Import Data</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default DataSubMenu;
