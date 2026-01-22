"use client";

import { Message, ResultPayload } from "@/app/types/chat";
import { createContext, useState, useCallback, useRef } from "react";
import { CitationPreview } from "@/app/types/displays";

export const ChatContext = createContext<{
  getCitationPreview: (id: string) => CitationPreview | null;
  buildRefMap: (messages: Message[]) => void;
  currentView: "chat" | "code" | "result";
  currentPayload: ResultPayload[] | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentResultPayload: any | null;
  currentResultType: string;
  handleViewChange: (
    view: "chat" | "code" | "result",
    payload: ResultPayload[] | null
  ) => void;
  handleResultPayloadChange: (
    type: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any,
    collection_name: string
  ) => void;
  currentCollectionName: string;
}>({
  getCitationPreview: () => null,
  buildRefMap: () => {},
  currentView: "chat",
  currentPayload: null,
  currentResultPayload: null,
  currentResultType: "",
  handleViewChange: () => {},
  handleResultPayloadChange: () => {},
  currentCollectionName: "",
});

// Helper to create citation preview (outside component to avoid recreating)
const createCitationPreview = (
  type: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    case "table":
      return {
        type: "table" as const,
        title: "Table Results",
        text: JSON.stringify(object),
        index,
        object: null,
      };
  }
  return null;
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [ref_map, setRefMap] = useState<{ [key: string]: CitationPreview }>({});
  const lastRefMapKeysRef = useRef<string>("");

  const getCitationPreview = useCallback((id: string) => {
    if (ref_map[id]) {
      return ref_map[id];
    }
    return null;
  }, [ref_map]);

  const buildRefMap = useCallback((messages: Message[]) => {
    const new_ref_map: { [key: string]: CitationPreview } = {};
    for (const message of messages) {
      if (message.type === "result") {
        const result = message.payload as ResultPayload;
        for (const [index, object] of result.objects.entries()) {
          if (object && typeof object === "object" && "_REF_ID" in object) {
            const citationPreview = createCitationPreview(
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
    
    // Only update state if the keys have changed (simple comparison to avoid infinite loops)
    const newKeys = Object.keys(new_ref_map).sort().join(",");
    if (newKeys !== lastRefMapKeysRef.current) {
      lastRefMapKeysRef.current = newKeys;
      setRefMap(new_ref_map);
    }
  }, []);

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
  const [currentCollectionName, setCurrentCollectionName] =
    useState<string>("");
  const handleViewChange = useCallback((
    view: "chat" | "code" | "result",
    payload: ResultPayload[] | null
  ) => {
    setCurrentView(view);
    setCurrentPayload(payload);
  }, []);

  const handleResultPayloadChange = useCallback((
    type: string,
    payload: /* eslint-disable @typescript-eslint/no-explicit-any */ any,
    collection_name: string
  ) => {
    setCurrentResultType(type);
    setCurrentResultPayload(payload);
    setCurrentView("result");
    setCurrentCollectionName(collection_name);
  }, []);

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
        currentCollectionName,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
