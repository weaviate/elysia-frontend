"use client";

import React, { useContext, useState } from "react";
import { useEffect } from "react";

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

import { RouterContext } from "../contexts/RouterContext";
import { useSearchParams } from "next/navigation";

const EvalSubMenu: React.FC = () => {
  const searchParams = useSearchParams();

  const [currentDisplay, setCurrentDisplay] = useState<string | null>(null);

  const { changeEvalPage } = useContext(EvaluationContext);

  const { changePage, currentPage } = useContext(RouterContext);

  const toDashboard = () => {
    changePage("eval", {}, true);
  };

  const toDisplay = (display: string) => {
    changeEvalPage(null);
    changePage("display", { type: display }, true);
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
    { name: "Chart", path: "chart" },
    { name: "Bar Chart", path: "bar_chart" },
  ];

  useEffect(() => {
    const displayParam = searchParams.get("type");
    if (displayParam) {
      setCurrentDisplay(displayParam);
    }
  }, [searchParams]);

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>
          <p>Evaluation</p>
        </SidebarGroupLabel>
        <SidebarMenuItem className="list-none" key={"dashboard"}>
          <SidebarMenuButton
            variant={currentPage === "eval" ? "active" : "default"}
            onClick={toDashboard}
          >
            <MdOutlineSpaceDashboard />
            <p>Dashboard</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem className="list-none" key={"Feedback Button"}>
          <SidebarMenuButton
            variant={currentPage === "feedback" ? "active" : "default"}
            onClick={() => changePage("feedback", {}, true)}
          >
            <MdOutlineFeedback />
            <p>Feedback</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem className="list-none" key={"elysia"}>
          <SidebarMenuButton
            variant={currentPage === "elysia" ? "active" : "default"}
            onClick={() => changePage("elysia", {}, true)}
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
                  variant={
                    currentDisplay === display.path ? "active" : "default"
                  }
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
    </>
  );
};

export default EvalSubMenu;
