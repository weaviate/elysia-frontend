"use client";

import React from "react";
import { DebugMessage } from "./types";
import MarkdownFormat from "../chat/components/MarkdownFormat";

interface DebugMessageProps {
  message: DebugMessage;
  messageIndex: number;
}

const DebugMessageDisplay: React.FC<DebugMessageProps> = ({
  message,
  messageIndex,
}) => {
  return (
    <div key={"message" + messageIndex} className={`flex flex-col w-full`}>
      <div className="flex flex-col">
        <p
          className={`${
            message.role === "system"
              ? "text-accent"
              : message.role === "user"
                ? "text-primary"
                : "text-highlight"
          } text-xs`}
        >
          {message.role}
        </p>
        <MarkdownFormat text={message.content} />
      </div>
    </div>
  );
};

export default DebugMessageDisplay;
