"use client";

import React, { useEffect, useRef, useState } from "react";
import { Query } from "@/app/components/types";
import MessageDisplay from "@/app/components/chat/message-display";
import { TextResponseQuery } from "./text_response";
import { VerbaResponseQuery } from "./verba_response";
import { InitialResponseQuery } from "./initial_response";
import { usePathname, useSearchParams } from "next/navigation";
import { WhoIsMarkRobsonQuery } from "./mark_robson";
import { HighestWindQuery } from "./highest_wind";
import { ticketResponse } from "./tickets";
import { ecommerceResponse } from "./ecommerce";
import { conversationResponse } from "./conversation";
export default function Home() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentConversation = "12345";
  const updateNERForQuery = () => {};
  const updateFeedbackForQuery = () => {};

  const queries: {
    [key: string]: Query[];
  } = {
    text_response: [TextResponseQuery],
    what_is_verba: [VerbaResponseQuery],
    initial_response: [InitialResponseQuery],
    who_is_mark_robson: [WhoIsMarkRobsonQuery],
    highest_wind: [HighestWindQuery],
    tickets: [ticketResponse],
    ecommerce: [ecommerceResponse],
    conversation: [conversationResponse],
  };

  const textResponseQuery = [TextResponseQuery];

  const [currentQuery, setCurrentQuery] = useState(textResponseQuery);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [currentQuery]);

  useEffect(() => {
    const type = searchParams.get("type");
    if (type) {
      if (type in queries) {
        setCurrentQuery(queries[type as keyof typeof queries]);
      }
    }
  }, [pathname, searchParams]);

  return (
    <div className="flex flex-col w-full overflow-scroll justify-center items-center">
      <div className="flex flex-col w-full md:w-[60vw] lg:w-[40vw] h-[90vh] ">
        {" "}
        {Object.entries(currentQuery)
          .sort((a, b) => a[1].index - b[1].index)
          .map(([queryId, query], index, array) => (
            <MessageDisplay
              isLastQuery={index === array.length - 1}
              handleSendQuery={() => {}}
              key={queryId}
              messages={query.messages}
              conversationID={currentConversation || ""}
              queryID={queryId}
              finished={query.finished}
              query_start={query.query_start}
              query_end={query.query_end}
              _collapsed={index !== array.length - 1}
              messagesEndRef={messagesEndRef}
              NER={query.NER}
              updateNER={updateNERForQuery}
              feedback={query.feedback}
              updateFeedback={updateFeedbackForQuery}
              addDisplacement={() => {}}
              addDistortion={() => {}}
            />
          ))}
      </div>
    </div>
  );
}
