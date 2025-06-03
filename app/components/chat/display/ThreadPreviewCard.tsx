"use client";

import React from "react";
import { ThreadPayload } from "@/app/types/displays";
import { Badge } from "@/components/ui/badge";
import { IoChatboxEllipses } from "react-icons/io5";

interface ThreadPreviewCardProps {
  thread: ThreadPayload;
  handleOpen: (thread: ThreadPayload) => void;
}

const ThreadPreviewCard: React.FC<ThreadPreviewCardProps> = ({
  thread,
  handleOpen,
}) => {
  const authors = thread.messages.map((message) => message.author);
  const uniqueAuthors = [...new Set(authors)];
  const authorsTitle =
    uniqueAuthors.length > 3
      ? `${uniqueAuthors[0]} & others`
      : uniqueAuthors.join(", ");
  const threadLength = thread.messages.length;

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div
      key={`${thread.conversation_id}`}
      className="flex flex-col gap-2 rounded-lg cursor-pointer  transition-all duration-300 bg-background_alt p-3 hover:bg-foreground"
      onClick={() => handleOpen(thread)}
    >
      <div className="flex flex-row gap-2 ">
        <Badge className="bg-transparent min-w-1/6 hover:bg-transparent text-primary gap-1 justify-center items-center flex flex-row">
          <span className="text-md">{threadLength}</span>
          <IoChatboxEllipses className="text-sm" />
        </Badge>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-1 justify-between">
            <p className="text-primary text-sm font-bold">{authorsTitle}</p>
            <p className="text-secondary text-xs">
              {formatDate(thread.messages[0].timestamp)}
            </p>
          </div>
          <p className="text-primary text-xs overflow-hidden text-ellipsis line-clamp-1">
            {thread.ELYSIA_SUMMARY || thread.messages[0].content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreadPreviewCard;
