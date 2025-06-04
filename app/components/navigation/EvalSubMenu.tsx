"use client";

import React, { useContext } from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import { MdOutlineSpaceDashboard } from "react-icons/md";
import { TbCube3dSphere } from "react-icons/tb";
import { MdOutlineFeedback } from "react-icons/md";

import { EvaluationContext } from "../contexts/EvaluationContext";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const EvalSubMenu: React.FC = () => {
  const { changeEvalPage } = useContext(EvaluationContext);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toDashboard = () => {
    router.push("/eval");
  };

  const toDisplay = (display: string) => {
    changeEvalPage(null);
    router.push(`/eval/display?type=${display}`);
  };

  const toElysia = () => {
    changeEvalPage(null);
    router.push(`/eval/elysia`);
  };

  const displays = [
    { name: "Text Response", path: "text_response" },
    { name: "Initial Response", path: "initial_response" },
    { name: "Table", path: "table" },
    { name: "Tickets", path: "tickets" },
    { name: "Products", path: "product" },
    { name: "Document", path: "document" },
    { name: "Thread", path: "thread" },
    { name: "Single Message", path: "singleMessage" },
    { name: "Aggregation", path: "aggregation" },
  ];

  return (
    <SidebarGroup>
      <SidebarGroup>
        <SidebarMenuItem className="list-none" key={"dashboard"}>
          <SidebarMenuButton
            variant={pathname === "/eval" ? "active" : "default"}
            onClick={toDashboard}
          >
            <MdOutlineSpaceDashboard />
            <p>Dashboard</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem className="list-none" key={"Feedback Button"}>
          <SidebarMenuButton
            variant={pathname.includes("feedback") ? "active" : "default"}
            onClick={() => changeEvalPage("feedback")}
          >
            <MdOutlineFeedback />
            <p>Feedback</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem className="list-none" key={"elysia"}>
          <SidebarMenuButton
            variant={pathname === "/eval/elysia" ? "active" : "default"}
            onClick={toElysia}
          >
            <TbCube3dSphere />
            <p>Elysia</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarGroup>
      {process.env.NODE_ENV === "development" && (
        <SidebarGroup>
          <SidebarGroupLabel>
            <p>Displays</p>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {displays.map((display) => (
              <SidebarMenuItem className="list-none" key={display.path}>
                <SidebarMenuButton
                  isActive={searchParams.get("type") === display.path}
                  className="text-secondary text-sm"
                  onClick={() => toDisplay(display.path)}
                >
                  {display.name}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </SidebarGroup>
  );
};

export default EvalSubMenu;
