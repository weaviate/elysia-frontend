"use client";

import React from "react";
import { ConversationDisplayType } from "@/app/components/types";
import ConversationMessageDisplay from "./ConversationMessage";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ConversationsDisplayProps {
  payload: ConversationDisplayType[];
}

const ConversationsDisplay: React.FC<ConversationsDisplayProps> = ({
  payload,
}) => {
  return (
    <Carousel className="w-full flex items-center justify-center gap-3">
      <CarouselPrevious variant="ghost" />
      <CarouselContent>
        {payload.map((conversation, idx) => (
          <CarouselItem key={`${idx}-${conversation.conversation_id}`}>
            {conversation.summary && (
              <div className="w-full flex flex-col gap-2">
                <p className="text-primary text-sm font-bold">
                  {conversation.summary}
                </p>
              </div>
            )}
            <ConversationMessageDisplay
              key={`${idx}-${conversation.conversation_id}`}
              payload={conversation.messages}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext variant="ghost" />
    </Carousel>
  );
};

export default ConversationsDisplay;
