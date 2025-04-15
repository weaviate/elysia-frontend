"use client";

import React, { useContext, useEffect, useState } from "react";

import { GoDatabase } from "react-icons/go";

import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ConversationContext } from "../contexts/ConversationContext";

const CollectionSelection: React.FC = () => {
  const {
    triggerAllCollections,
    toggleCollectionEnabled,
    conversations,
    currentConversation,
  } = useContext(ConversationContext);

  const [selections, setSelections] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const new_selection =
      conversations.find((c) => c.id === currentConversation)
        ?.enabled_collections || {};
    setSelections(new_selection);
  }, [conversations, currentConversation]);

  if (!currentConversation) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          <GoDatabase />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-secondary">
          Select Data Sources
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex gap-2">
          <DropdownMenuItem className="flex flex-grow">
            <Button
              onClick={() => triggerAllCollections(currentConversation, true)}
              variant="ghost"
              size={"sm"}
              className="w-full flex-grow"
            >
              Select All
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-grow">
            <Button
              onClick={() => triggerAllCollections(currentConversation, false)}
              variant="ghost"
              size={"sm"}
              className="w-full flex-grow"
            >
              Deselect All
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {Object.entries(selections).map(([key, value]) => (
          <DropdownMenuCheckboxItem
            checked={value}
            onCheckedChange={() =>
              toggleCollectionEnabled(key, currentConversation)
            }
            className="flex items-center justify-start gap-4"
            key={key}
            onSelect={(event) => {
              event.preventDefault();
            }}
          >
            <p
              className={`${value ? "text-primary" : "text-secondary"} text-xs`}
            >
              {key}
            </p>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CollectionSelection;
