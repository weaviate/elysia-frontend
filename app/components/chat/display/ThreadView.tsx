"use client";

import React, { useState } from "react";
import { ThreadPayload } from "@/app/types/displays";
import FullScreenOverlay from "../FullScreenOverlay";
import { IoMdArrowUp } from "react-icons/io";
import { Button } from "@/components/ui/button";
import MessageCard from "./MessageCard";
import { BsGridFill } from "react-icons/bs";
import { IoDocumentText } from "react-icons/io5";

interface ThreadViewProps {
  thread: ThreadPayload;
  onClose: () => void;
  isOpen: boolean;
}

const ThreadView: React.FC<ThreadViewProps> = ({ thread, isOpen, onClose }) => {
  const authors = thread.messages.map((message) => message.author);
  const uniqueAuthors = [...new Set(authors)];
  const authorsTitle =
    uniqueAuthors.length > 4
      ? `${uniqueAuthors[0]} & others`
      : uniqueAuthors.join(", ");
  const chunks = thread.messages.filter((message) => message.relevant === true);

  console.log("chunks", chunks);
  const [showChunksOnly, setShowChunksOnly] = useState(false);

  const scrollToTop = () => {
    const container = global.document.querySelector(".document-container");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToChunk = (index: number) => {
    const element = global.document.getElementById(`chunk-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  return (
    <FullScreenOverlay isOpen={isOpen} onClose={onClose}>
      <div className="w-full md:w-2/3 max-w-6xl mx-auto relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-50 bg-background/80"
        >
          <IoMdArrowUp />
        </Button>

        <div className="w-2/3 flex flex-col gap-3 justify-start items-start p-8 bg-background rounded-lg fixed top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-row w-full justify-between gap-2">
            <div className="flex flex-col gap-2">
              <p className="text-2xl font-bold text-primary">{authorsTitle}</p>
              {thread.summary && (
                <p className="text-sm text-secondary font-normal">
                  {thread.summary}
                </p>
              )}
            </div>
          </div>
          {chunks && chunks.length > 0 && (
            <div className="flex flex-row gap-2">
              <Button
                variant="default"
                className="bg-foreground text-primary"
                onClick={() => setShowChunksOnly(!showChunksOnly)}
              >
                {showChunksOnly ? (
                  <>
                    <IoDocumentText />
                    <span>Show Full Document</span>
                  </>
                ) : (
                  <>
                    <BsGridFill />
                    <span>Only Show Relevant</span>
                  </>
                )}
              </Button>
              {chunks.map((chunk, index) => (
                <Button
                  key={index}
                  variant="default"
                  className="bg-foreground text-primary"
                  onClick={() => scrollToChunk(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-[150px] flex flex-col gap-4 bg-background_alt rounded-lg p-8">
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
    </FullScreenOverlay>
  );
};

export default ThreadView;
