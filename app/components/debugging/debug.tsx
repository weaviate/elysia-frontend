"use client";

import React, { useEffect, useState } from "react";
import { DebugMessage, DebugResponse } from "./types";
import { Conversation } from "../types";
import DebugChat from "./debug-chat";
import { Badge } from "@/components/ui/badge";

interface DebugViewProps {
  fetchDebug: (conversation_id: string) => Promise<DebugResponse>;
  currentConversation: string;
  conversations: Conversation[];
}

const DebugView: React.FC<DebugViewProps> = ({
  fetchDebug,
  currentConversation,
  conversations,
}) => {
  const [debug, setDebug] = useState<DebugResponse | null>(null);

  const updateDebug = async (conversation_id: string) => {
    const debug = await fetchDebug(conversation_id);
    setDebug(debug);
  };

  useEffect(() => {
    updateDebug(currentConversation);
  }, [currentConversation, conversations]);

  if (!debug) return null;

  return (
    <div className="w-full p-0 lg:p-8 flex flex-col gap-4 items-center justify-start lg:h-[90vh] overflow-y-auto lg:mt-0 mt-4">
      <div className="w-full lg:w-[60vw] flex flex-col gap-4">
        <p className="text-xs text-secondary">
          Conversation: {currentConversation}
        </p>
        {Object.keys(debug).map((key) => (
          <div
            key={key}
            className="flex gap-2 flex-col bg-background_alt p-4 rounded-md"
          >
            <div className="flex gap-2">
              <p className="text-primary">{debug[key].model}</p>
              <Badge>{key}</Badge>
            </div>
            {debug[key].chat &&
              debug[key].chat.map((chat: DebugMessage[], chatIndex: number) => (
                <DebugChat
                  key={key + "chat" + chatIndex}
                  chat={chat}
                  chatIndex={chatIndex}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugView;
