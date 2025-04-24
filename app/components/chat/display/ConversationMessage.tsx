"use client";

import React, { useEffect, useState } from "react";
import MarkdownMessageDisplay from "./Markdown";
import { ConversationMessage } from "@/app/components/types";

interface ConversationMessageProps {
  payload: ConversationMessage[];
}

const AUTHOR_COLORS = [
  "text-accent",
  "text-highlight",
  "text-warning",
  "text-error",
];

const ConversationMessageDisplay: React.FC<ConversationMessageProps> = ({
  payload,
}) => {
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const [authorColors, setAuthorColors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get unique authors
    const uniqueAuthors = Array.from(new Set(payload.map((msg) => msg.author)));

    // Create color and position assignments
    const colorMap: Record<string, string> = {};
    const positionMap: Record<string, number> = {};
    uniqueAuthors.forEach((author, index) => {
      const colorIndex = index % AUTHOR_COLORS.length;
      colorMap[author] = AUTHOR_COLORS[colorIndex];
      positionMap[author] = index;
    });

    setAuthorColors(colorMap);
  }, [payload]);

  return (
    <div className="w-full flex flex-col max-h-[35vh] overflow-y-auto gap-5 bg-background_alt rounded-md p-4 ">
      {payload.map((message, idx) => (
        <div
          key={`${idx}-${message.conversation_id}`}
          className={`flex w-full`}
        >
          <div className="flex flex-col w-full border border-secondary gap-3 bg-foreground p-4 rounded-lg chat-animation text-primary">
            <p className={`${authorColors[message.author]} text-sm font-bold`}>
              {message.author}
            </p>
            <MarkdownMessageDisplay text={message.content} />
            <div className={`flex w-full gap-2`}>
              <p className="text-secondary text-xs">
                {formatDate(message.timestamp)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationMessageDisplay;
