"use client";

import React, { useContext } from "react";
import { FaCircle } from "react-icons/fa";

import { SessionContext } from "../contexts/SessionContext";
import { ConversationContext } from "../contexts/ConversationContext";

import { FaPlus } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenuAction,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SlOptions } from "react-icons/sl";

const HomeSubMenu: React.FC = () => {
  const { id } = useContext(SessionContext);

  const {
    conversations,
    currentConversation,
    addConversation,
    removeConversation,
    selectConversation,
    creatingNewConversation,
  } = useContext(ConversationContext);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div className="flex items-center gap-2">
          {creatingNewConversation && (
            <FaCircle className="text-secondary pulsing" />
          )}
          <p className={`${creatingNewConversation ? "shine" : ""}`}>
            {creatingNewConversation
              ? "Creating new conversation..."
              : "Conversations"}
          </p>
        </div>
      </SidebarGroupLabel>
      <SidebarGroupAction
        title="Add Conversation"
        onClick={() => addConversation(id || "")}
        disabled={creatingNewConversation}
      >
        <FaPlus /> <span className="sr-only">Add Conversation</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        {conversations
          ?.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .map((c) => (
            <SidebarMenuItem className="list-none" key={c.id}>
              <SidebarMenuButton
                variant={currentConversation === c.id ? "active" : "default"}
                onClick={() => selectConversation(c.id)}
              >
                <p className="truncate max-w-[13rem]">{c.name}</p>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction>
                    <SlOptions />
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start">
                  <DropdownMenuItem onClick={() => removeConversation(c.id)}>
                    <GoTrash className="text-error" />
                    <span className="text-error">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default HomeSubMenu;
