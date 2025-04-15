"use client";

import React, { useContext } from "react";
import { FaCircle } from "react-icons/fa";

import { CollectionContext } from "../contexts/CollectionContext";
import { IoMdRefresh } from "react-icons/io";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupAction,
} from "@/components/ui/sidebar";

import { MdOutlineSpaceDashboard } from "react-icons/md";

import { useRouter } from "next/navigation";

const DataSubMenu: React.FC = () => {
  const {
    collections,
    selectedCollection,
    fetchCollections,
    loadingCollections,
    routerSelectCollection,
  } = useContext(CollectionContext);

  const router = useRouter();

  const toDashboard = () => {
    router.push("/data");
  };

  return (
    <SidebarGroup>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenuItem className="list-none" key={"dashboard"}>
            <SidebarMenuButton
              variant={selectedCollection === null ? "active" : "default"}
              onClick={toDashboard}
            >
              <MdOutlineSpaceDashboard />
              <p>Dashboard</p>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>
          <div className="flex items-center gap-2">
            {loadingCollections && (
              <FaCircle className="text-secondary pulsing" />
            )}
            <p className={`${loadingCollections ? "shine" : ""}`}>
              {loadingCollections ? "Loading sources..." : "Data Sources"}
            </p>
          </div>
        </SidebarGroupLabel>
        <SidebarGroupAction
          title="Refresh"
          onClick={() => fetchCollections()}
          disabled={loadingCollections}
        >
          <IoMdRefresh /> <span className="sr-only">Refresh</span>
        </SidebarGroupAction>
        <SidebarGroupContent>
          {collections?.map((c) => (
            <SidebarMenuItem className="list-none" key={c.name}>
              <SidebarMenuButton
                variant={selectedCollection === c.name ? "active" : "default"}
                onClick={() => routerSelectCollection(c.name)}
              >
                <p>{c.name}</p>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarGroup>
  );
};

export default DataSubMenu;
