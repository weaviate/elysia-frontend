"use client";

import React, { useEffect, useRef, useState } from "react";
import { Query } from "@/app/types/chat";
import ChatDisplay from "@/app/components/chat/ChatDisplay";
import { TextResponse } from "./textExample";
import { InitialResponseQuery } from "./initialResponse";
import { usePathname, useSearchParams } from "next/navigation";
import { tableResponse } from "./tableExample";
import { ticketResponse } from "./ticketsExample";
import { productResponse } from "./productExample";
import { documentResponse } from "./documentExample";
import { threadResponse } from "./threadExample";
import { singleMessageResponse } from "./singleMessageExample";

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
    text_response: [TextResponse],
    initial_response: [InitialResponseQuery],
    table: [tableResponse],
    tickets: [ticketResponse],
    product: [productResponse],
    document: [documentResponse],
    thread: [threadResponse],
    singleMessage: [singleMessageResponse],
  };

  const textResponseQuery = [TextResponse];

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
            <ChatDisplay
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
