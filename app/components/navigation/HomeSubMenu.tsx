"use client";

import React, { useContext } from "react";
import { FaCircle } from "react-icons/fa";

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
  const {
    startNewConversation,
    currentConversation,
    removeConversation,
    selectConversation,
    conversationPreviews,
    loadingConversations,
    creatingNewConversation,
  } = useContext(ConversationContext);

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between">
        <SidebarGroupLabel className="flex items-center">
          <div
            className={`flex items-center ${loadingConversations || creatingNewConversation ? "shine" : ""}`}
          >
            {creatingNewConversation && (
              <FaCircle className="text-secondary pulsing mr-2" />
            )}
            {loadingConversations && <p>Loading conversations...</p>}
            {!loadingConversations && (
              <p>
                {creatingNewConversation
                  ? "Initializing conversation..."
                  : "Conversations"}
              </p>
            )}
          </div>
        </SidebarGroupLabel>
        <SidebarGroupAction
          title="Add Conversation"
          onClick={() => startNewConversation()}
          disabled={creatingNewConversation}
        >
          <FaPlus /> <span className="sr-only">Add Conversation</span>
        </SidebarGroupAction>
      </div>
      <SidebarGroupContent>
        {/* TODO Add Timestamp Sorting when backend supports it */}
        {Object.entries(conversationPreviews)
          ?.sort(
            ([, a], [, b]) =>
              new Date(b.last_update_time).getTime() -
              new Date(a.last_update_time).getTime()
          )
          .map(([key, value]) => (
            <SidebarMenuItem className="list-none fade-in" key={key}>
              <SidebarMenuButton
                variant={currentConversation === key ? "active" : "default"}
                onClick={() => selectConversation(key)}
              >
                <p className="truncate max-w-[13rem]">{value.title}</p>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction>
                    <SlOptions />
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start">
                  <DropdownMenuItem onClick={() => removeConversation(key)}>
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
