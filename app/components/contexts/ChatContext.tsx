"use client";

import { Message, ResultPayload } from "@/app/types/chat";
import { createContext, useState } from "react";
import { CitationPreview } from "@/app/types/displays";

export const ChatContext = createContext<{
  getCitationPreview: (id: string) => CitationPreview | null;
  buildRefMap: (messages: Message[]) => void;
  currentView: "chat" | "code" | "result";
  currentPayload: ResultPayload[] | null;
  currentResultPayload: any | null;
  currentResultType: string;
  handleViewChange: (
    view: "chat" | "code" | "result",
    payload: ResultPayload[] | null
  ) => void;
  handleResultPayloadChange: (type: string, payload: any) => void;
}>({
  getCitationPreview: () => null,
  buildRefMap: () => {},
  currentView: "chat",
  currentPayload: null,
  currentResultPayload: null,
  currentResultType: "",
  handleViewChange: () => {},
  handleResultPayloadChange: () => {},
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [ref_map, setRefMap] = useState<{ [key: string]: CitationPreview }>({});

  const getCitationPreview = (id: string) => {
    if (ref_map[id]) {
      return ref_map[id];
    }
    return null;
  };

  const buildRefMap = (messages: Message[]) => {
    const new_ref_map: { [key: string]: CitationPreview } = {};
    for (const message of messages) {
      if (message.type === "result") {
        const result = message.payload as ResultPayload;
        for (const [index, object] of result.objects.entries()) {
          if (object && typeof object === "object" && "_REF_ID" in object) {
            const citationPreview = _createCitationPreview(
              result.type,
              object,
              index
            );
            if (citationPreview) {
              new_ref_map[object._REF_ID!] = citationPreview;
            }
          }
        }
      }
    }
    setRefMap(new_ref_map);
  };

  const [currentView, setCurrentView] = useState<"chat" | "code" | "result">(
    "chat"
  );
  const [currentPayload, setCurrentPayload] = useState<ResultPayload[] | null>(
    null
  );
  const [currentResultPayload, setCurrentResultPayload] = useState<
    /* eslint-disable @typescript-eslint/no-explicit-any */
    any | null
  >(null);
  const [currentResultType, setCurrentResultType] = useState<string>("");

  const handleViewChange = (
    view: "chat" | "code" | "result",
    payload: ResultPayload[] | null
  ) => {
    setCurrentView(view);
    setCurrentPayload(payload);
  };

  const handleResultPayloadChange = (
    type: string,
    payload: /* eslint-disable @typescript-eslint/no-explicit-any */ any
  ) => {
    setCurrentResultType(type);
    setCurrentResultPayload(payload);
    setCurrentView("result");
  };

  const _createCitationPreview = (
    type: string,
    object: any,
    index: number
  ): CitationPreview | null => {
    switch (type) {
      case "ticket":
        return {
          type: "ticket" as const,
          title: object.title,
          text: object.content,
          index,
          object,
        };
      case "document":
        return {
          type: "document" as const,
          title: object.title,
          text: object.content,
          index,
          object,
        };
      case "message":
        return {
          type: "message" as const,
          title: object.author,
          text: object.content,
          index,
          object,
        };
      case "conversation":
        return {
          type: "conversation" as const,
          title: object.conversation_id,
          text: "Thread with " + object.messages.length + " messages",
          index,
          object,
        };
      case "ecommerce":
        return {
          type: "ecommerce" as const,
          title: object.name,
          text: object.description,
          index,
          object,
        };
      case "aggregation":
        return {
          type: "aggregation" as const,
          title: "Aggregation Results",
          text: JSON.stringify(object),
          index,
          object: null,
        };
      case "boring_generic":
        return {
          type: "boring_generic" as const,
          title: "Table Results",
          text: JSON.stringify(object),
          index,
          object: null,
        };
    }
    return null;
  };

  return (
    <ChatContext.Provider
      value={{
        getCitationPreview,
        buildRefMap,
        currentView,
        currentPayload,
        currentResultPayload,
        currentResultType,
        handleViewChange,
        handleResultPayloadChange,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
