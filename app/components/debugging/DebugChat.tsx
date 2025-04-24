"use client";

import React from "react";
import { DebugMessage } from "./types";
import DebugMessageDisplay from "./DebugMessage";
import { Separator } from "@/components/ui/separator";
interface DebugChatProps {
  chat: DebugMessage[];
  chatIndex: number;
}

const DebugChat: React.FC<DebugChatProps> = ({ chat, chatIndex }) => {
  return (
    <div key={"chat" + chatIndex} className="flex flex-col gap-6 p-4">
      <p>Chat {chatIndex + 1}</p>
      <div className="bg-foreground max-h-[40vh] overflow-y-auto p-4 rounded-md gap-4 flex flex-col">
        {chat.map((message: DebugMessage, messageIndex: number) => (
          <div key={"message" + messageIndex} className="flex flex-col gap-4">
            <DebugMessageDisplay
              message={message}
              messageIndex={messageIndex}
            />
            <Separator />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugChat;
