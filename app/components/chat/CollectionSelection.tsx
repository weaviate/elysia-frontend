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
import { CollectionContext } from "../contexts/CollectionContext";

const CollectionSelection: React.FC = () => {
  const {
    triggerAllCollections,
    toggleCollectionEnabled,
    conversations,
    currentConversation,
  } = useContext(ConversationContext);

  const { collections } = useContext(CollectionContext);

  const [selections, setSelections] = useState<{ [key: string]: boolean }>({});
  const [modified, setModified] = useState(false);

  useEffect(() => {
    const enabled_collections =
      conversations.find((c) => c.id === currentConversation)
        ?.enabled_collections || {};

    // Filter out collections that are not processed
    const processedCollectionNames = new Set(
      collections.filter((col) => col.processed).map((col) => col.name),
    );

    const processedSelections = Object.fromEntries(
      Object.entries(enabled_collections).filter(([name]) =>
        processedCollectionNames.has(name),
      ),
    );

    setSelections(processedSelections);
  }, [conversations, currentConversation, collections]);

  useEffect(() => {
    const allTrue = Object.values(selections).every((value) => value === true);
    setModified(!allTrue);
  }, [selections]);

  if (!currentConversation) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          <GoDatabase
            className={`${modified ? "text-alt_color_b" : "text-primary"}`}
          />
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
