"use client";

import React, { useState } from "react";
import { ThreadPayload } from "@/app/types/displays";
import { Button } from "@/components/ui/button";
import MessageCard from "./MessageCard";
import { BsGridFill } from "react-icons/bs";
import { IoDocumentText } from "react-icons/io5";
import { LuMessageSquareText } from "react-icons/lu";

interface ThreadViewProps {
  thread: ThreadPayload;
}

const ThreadView: React.FC<ThreadViewProps> = ({ thread }) => {
  const authors = thread.messages.map((message) => message.author);
  const uniqueAuthors = [...new Set(authors)];
  const authorsTitle =
    uniqueAuthors.length > 4
      ? `${uniqueAuthors[0]} & others`
      : uniqueAuthors.join(", ");
  const chunks = thread.messages.filter((message) => message.relevant === true);

  const [showChunksOnly, setShowChunksOnly] = useState(false);

  const scrollToChunk = (index: number) => {
    const element = global.document.getElementById(`chunk-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-3 justify-start items-start">
        <div className="flex flex-row w-full justify-between gap-2">
          <div className="flex flex-col gap-2">
            <p className="text-xl font-bold text-primary">{authorsTitle}</p>
            {thread.ELYSIA_SUMMARY && (
              <p className="text-sm text-secondary">{thread.ELYSIA_SUMMARY}</p>
            )}
          </div>
        </div>
        {chunks && chunks.length > 0 && (
          <div className="flex flex-row gap-2">
            <Button
              variant="default"
              size="sm"
              className="bg-foreground text-primary text-sm"
              onClick={() => setShowChunksOnly(!showChunksOnly)}
            >
              {showChunksOnly ? (
                <>
                  <LuMessageSquareText />
                  <span>Show All</span>
                </>
              ) : (
                <>
                  <LuMessageSquareText />
                  <span>Show Relevant Messages</span>
                </>
              )}
            </Button>
            {chunks.map((chunk, index) => (
              <Button
                key={index}
                variant="default"
                size="sm"
                className="bg-foreground text-primary text-sm"
                onClick={() => scrollToChunk(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {showChunksOnly
          ? chunks?.map((chunk, index) => (
              <MessageCard key={chunk.message_id || index} message={chunk} />
            ))
          : thread.messages.map((message, index) => {
              const chunkIndex = message.relevant
                ? chunks.indexOf(message)
                : null;
              return (
                <div
                  key={message.message_id || index}
                  id={message.relevant ? `chunk-${chunkIndex}` : undefined}
                >
                  <MessageCard message={message} />
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default ThreadView;
