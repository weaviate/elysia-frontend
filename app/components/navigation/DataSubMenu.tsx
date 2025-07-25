"use client";

import React, { useContext } from "react";
import { TbPackageImport } from "react-icons/tb";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import { MdOutlineSpaceDashboard } from "react-icons/md";

import { RouterContext } from "../contexts/RouterContext";

const DataSubMenu: React.FC = () => {
  const { changePage, currentPage } = useContext(RouterContext);

  const toDashboard = () => {
    changePage("data", {}, true);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <p>Data</p>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenuItem className="list-none" key={"dashboard"}>
          <SidebarMenuButton
            variant={currentPage === "data" ? "active" : "default"}
            onClick={toDashboard}
          >
            <MdOutlineSpaceDashboard />
            <p>Dashboard</p>
          </SidebarMenuButton>
          <SidebarMenuButton variant="default">
            <TbPackageImport />
            <p>Import Data (Coming Soon)</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default DataSubMenu;
