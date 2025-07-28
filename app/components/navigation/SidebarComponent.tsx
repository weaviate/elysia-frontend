"use client";

import React, { useContext } from "react";

import { SocketContext } from "../contexts/SocketContext";

import { MdChatBubbleOutline } from "react-icons/md";
import { GoDatabase } from "react-icons/go";
import { AiOutlineExperiment } from "react-icons/ai";
import { FaCircle, FaSquareXTwitter } from "react-icons/fa6";
import { MdOutlineSettingsInputComponent } from "react-icons/md";

import HomeSubMenu from "@/app/components/navigation/HomeSubMenu";
import DataSubMenu from "@/app/components/navigation/DataSubMenu";
import EvalSubMenu from "@/app/components/navigation/EvalSubMenu";

import { CgWebsite } from "react-icons/cg";
import { IoNewspaperOutline } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

import { RiRobot2Line } from "react-icons/ri";

import { public_path } from "@/app/components/host";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SettingsSubMenu from "./SettingsSubMenu";
import { RouterContext } from "../contexts/RouterContext";
import { Button } from "@/components/ui/button";

const SidebarComponent: React.FC = () => {
  const { socketOnline } = useContext(SocketContext);
  const { changePage, currentPage } = useContext(RouterContext);

  const items = [
    {
      title: "Chat",
      mode: ["chat"],
      icon: <MdChatBubbleOutline />,
      onClick: () => changePage("chat", {}, true),
    },
    {
      title: "Data",
      mode: ["data", "collection"],
      icon: <GoDatabase />,
      onClick: () => changePage("data", {}, true),
    },
    {
      title: "Settings",
      mode: ["settings"],
      icon: <MdOutlineSettingsInputComponent />,
      onClick: () => changePage("settings", {}, true),
    },
    {
      title: "Evaluation",
      mode: ["eval", "feedback", "elysia", "display"],
      icon: <AiOutlineExperiment />,
      onClick: () => changePage("eval", {}, true),
    },
  ];

  const openNewTab = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className={`flex items-center gap-2 w-full justify-between p-2`}>
          <div className="flex items-center gap-2">
            <img
              src={`${public_path}logo.svg`}
              alt="Elysia"
              className="w-5 h-5 stext-primary"
            />
            <p className="text-sm font-bold text-primary">Elysia</p>
          </div>
          <div className="flex items-center justify-center">
            {socketOnline ? (
              <FaCircle scale={0.2} className="text-lg pulsing_color w-5 h-5" />
            ) : (
              <FaCircle scale={0.2} className="text-lg pulsing w-5 h-5" />
            )}
            {process.env.NODE_ENV === "development" ? (
              <p className="text-xs text-secondary">vBeta</p>
            ) : (
              <p className="text-xs text-secondary">Open Source Release</p>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    variant={
                      item.mode.includes(currentPage) ? "active" : "default"
                    }
                    onClick={item.onClick}
                  >
                    <p className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.title}</span>
                    </p>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {currentPage === "chat" && <HomeSubMenu />}
        {(currentPage === "data" || currentPage === "collection") && (
          <DataSubMenu />
        )}
        {(currentPage === "eval" ||
          currentPage === "feedback" ||
          currentPage === "elysia" ||
          currentPage === "display") && <EvalSubMenu />}
        {currentPage === "settings" && <SettingsSubMenu />}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="w-full justify-start items-center"
              onClick={() => openNewTab("https://github.com/weaviate/elysia")}
            >
              <FaGithub />
              <span>Github</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <img
                    src={`${public_path}weaviate-logo.svg`}
                    alt="Weaviate"
                    className="w-4 h-4"
                  />
                  <p>Powered by Weaviate</p>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem
                  onClick={() => openNewTab("https://weaviate.io/")}
                >
                  <CgWebsite />
                  <span>Website</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    openNewTab("https://weaviate.io/product/query-agent")
                  }
                >
                  <RiRobot2Line />
                  <span>Weaviate Query Agent</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openNewTab("https://newsletter.weaviate.io/")}
                >
                  <IoNewspaperOutline />
                  <span>Newsletter</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    openNewTab("https://github.com/weaviate/weaviate")
                  }
                >
                  <FaGithub />
                  <span>GitHub</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    openNewTab(
                      "https://www.linkedin.com/company/weaviate-io/posts/?feedView=all"
                    )
                  }
                >
                  <FaLinkedin />
                  <span>LinkedIn</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openNewTab("https://x.com/weaviate_io")}
                >
                  <FaSquareXTwitter />
                  <span>X</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    openNewTab("https://www.youtube.com/@Weaviate")
                  }
                >
                  <FaYoutube />
                  <span>YouTube</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarComponent;
