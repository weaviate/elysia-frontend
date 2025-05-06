"use client";

import React from "react";
import { ThreadType } from "@/app/types/displays";
import { Badge } from "@/components/ui/badge";

interface ThreadPreviewCardProps {
  thread: ThreadType;
  handleOpen: (thread: ThreadType) => void;
}

const ThreadPreviewCard: React.FC<ThreadPreviewCardProps> = ({ thread, handleOpen }) => {
  const authors = thread.messages.map((message) => message.author);
  const uniqueAuthors = [...new Set(authors)];
  const authorsTitle = uniqueAuthors.length > 4 
    ? `${uniqueAuthors[0]} & others`
    : uniqueAuthors.join(", ");
  const threadLength = thread.messages.length;

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

  return (
    <div
      key={`${thread.conversation_id}`}
      className="flex flex-col gap-2 rounded-lg cursor-pointer cursor-pointer transition-all duration-300"
      onClick={() => handleOpen(thread)}
    >
        <div className="flex flex-row gap-2">
            <Badge className="border border-accent bg-background_alt text-accent">{threadLength}</Badge>
            <p className="text-primary text-sm font-bold">
                {authorsTitle}
            </p>
        </div>
        <div className="flex flex-col gap-2 border border-secondary p-2 rounded-lg hover:bg-foreground cursor-pointer transition-all duration-300">
            <p className="text-primary text-xs overflow-hidden text-ellipsis line-clamp-2">
                {thread.summary || thread.messages[0].content}
            </p>
        </div>
        <div className="flex flex-row gap-2 justify-end">
            <p className="text-secondary text-xs">
                {formatDate(thread.messages[0].timestamp)}
            </p>
        </div>
    </div>
  );
};

export default ThreadPreviewCard;