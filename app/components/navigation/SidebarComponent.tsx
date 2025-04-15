"use client";

import React, { useContext } from "react";

import { SessionContext } from "../contexts/SessionContext";
import { SocketContext } from "../contexts/SocketContext";
import { RouterContext } from "../contexts/RouterContext";
import { NewsletterContext } from "../contexts/NewsletterContext";

import { RiHomeLine } from "react-icons/ri";
import { GoDatabase } from "react-icons/go";
import { AiOutlineExperiment } from "react-icons/ai";
import { FaSquareXTwitter } from "react-icons/fa6";

import HomeSubMenu from "@/app/components/navigation/HomeSubMenu";
import DataSubMenu from "@/app/components/navigation/DataSubMenu";
import EvalSubMenu from "@/app/components/navigation/EvalSubMenu";

import { CgWebsite } from "react-icons/cg";
import { IoNewspaperOutline } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

import { RiRobot2Line } from "react-icons/ri";

import { useRouter, usePathname } from "next/navigation";

import { FaCircleNotch } from "react-icons/fa";

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

const SidebarComponent: React.FC = () => {
  const { mode } = useContext(SessionContext);
  const { handleOpenDialog } = useContext(NewsletterContext);
  const { socketOnline } = useContext(SocketContext);
  const { routerChangeToChat, routerChangeToData, routerChangeToEval } =
    useContext(RouterContext);

  const router = useRouter();
  const pathname = usePathname();

  const items = [
    {
      title: "Home",
      mode: "home",
      icon: <RiHomeLine />,
      onClick: routerChangeToChat,
    },
    {
      title: "Data",
      mode: "data-explorer",
      icon: <GoDatabase />,
      onClick: routerChangeToData,
    },
    {
      title: "Evaluation",
      mode: "evaluation",
      icon: <AiOutlineExperiment />,
      onClick: routerChangeToEval,
    },
  ];

  const handleAboutClick = () => {
    router.push("/about");
  };

  const openNewTab = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className={`flex items-center gap-2 w-full justify-between p-2`}>
          <div className="flex items-center gap-2">
            <div
              className={`rounded-full border-2 transition-all duration-200 w-5 h-5 ${
                socketOnline
                  ? "border-accent animate-spin shadow-[0_0_5px_#A5FF90,0_0_5px_#A5FF90]"
                  : "border-secondary shadow-[0_0_5px_#4e4e4e,0_0_5px_#4e4e4e]"
              }`}
            />
            <p className="text-sm font-bold text-primary">Elysia</p>
          </div>
          <p className="text-xs text-secondary">Alpha Version</p>
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
                    variant={mode === item.mode ? "active" : "default"}
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

        {mode === "home" && <HomeSubMenu />}
        {mode === "data-explorer" && <DataSubMenu />}
        {mode === "evaluation" && <EvalSubMenu />}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              variant={pathname === "/about" ? "active" : "default"}
              onClick={handleAboutClick}
            >
              <FaCircleNotch />
              <p>What is Elysia?</p>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleOpenDialog}>
              <IoNewspaperOutline />
              <p>Elysia Newsletter</p>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <img
                    src="/weaviate-logo.svg"
                    alt="Weaviate"
                    className="w-4 h-4"
                  />
                  <p>Powered by Weaviate Agents</p>
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
