"use client";

import React, { useEffect, useRef, useState } from "react";
import { Query } from "@/app/types/chat";
import RenderChat from "@/app/components/chat/RenderChat";
import { TextResponse } from "@/app/types/display/textExample";
import { InitialResponseQuery } from "@/app/types/display/initialResponse";
import { usePathname, useSearchParams } from "next/navigation";
import { tableResponse } from "@/app/types/display/tableExample";
import { ticketResponse } from "@/app/types/display/ticketsExample";
import { productResponse } from "@/app/types/display/productExample";
import { documentResponse } from "@/app/types/display/documentExample";
import { threadResponse } from "@/app/types/display/threadExample";
import { singleMessageResponse } from "@/app/types/display/singleMessageExample";
import { AggregationResponse } from "@/app/types/display/aggregationExample";
import { chartResponse } from "@/app/types/display/chartExample";
import { ChatProvider } from "@/app/components/contexts/ChatContext";
import { BarChartResponse } from "@/app/types/display/barChartExample";

export default function Home() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentConversation = "12345";
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
    aggregation: [AggregationResponse],
    chart: [chartResponse],
    bar_chart: [BarChartResponse],
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
            <ChatProvider key={queryId}>
              <RenderChat
                isLastQuery={index === array.length - 1}
                handleSendQuery={() => {}}
                key={queryId}
                messages={query.messages}
                conversationID={currentConversation || ""}
                queryID={queryId + index}
                finished={query.finished}
                query_start={query.query_start}
                query_end={query.query_end}
                _collapsed={index !== array.length - 1}
                messagesEndRef={messagesEndRef}
                NER={query.NER}
                feedback={query.feedback}
                updateFeedback={updateFeedbackForQuery}
                addDisplacement={() => {}}
                addDistortion={() => {}}
              />
            </ChatProvider>
          ))}
      </div>
    </div>
  );
}
