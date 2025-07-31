"use client";

import { Collection } from "@/app/types/objects";
import { getWebsocketHost } from "../host";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ProcessingSocketPayload } from "@/app/types/socketPayloads";
import { CollectionContext } from "./CollectionContext";
import { ToastContext } from "./ToastContext";

export const ProcessingContext = createContext<{
  triggerAnalysis: (collection: Collection, user_id: string) => void;
}>({
  triggerAnalysis: () => {},
});

export const ProcessingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { fetchCollections } = useContext(CollectionContext);
  const {
    showErrorToast,
    finishProcessingSocket,
    updateProcessingSocket,
    analyzeCollection,
  } = useContext(ToastContext);

  const [socket, setSocket] = useState<WebSocket>();
  const [reconnect, setReconnect] = useState(false);

  const initialRef = useRef(false);

  const triggerAnalysis = (collection: Collection, user_id: string) => {
    if (socket) {
      analyzeCollection(collection, user_id, socket);
    } else {
      showErrorToast(
        "Error analyzing " + collection.name + "...",
        "Connection to Elysia lost (Socket: " +
          socket +
          ") (ID: " +
          user_id +
          ")"
      );
    }
  };

  useEffect(() => {
    setReconnect(true);
  }, []);

  useEffect(() => {
    if (initialRef.current) {
      return;
    }

    initialRef.current = true;

    const socketHost = getWebsocketHost() + "process_collection";
    const localSocket = new WebSocket(socketHost);
    setSocket(localSocket);

    localSocket.onopen = () => {
      if (process.env.NODE_ENV === "development") {
        console.log("Processing Socket opened");
      }
    };
    localSocket.onerror = (error) => {
      setSocket(undefined);
      if (process.env.NODE_ENV === "development") {
        console.log("Socket closed unexpectedly: " + error);
      }
    };

    localSocket.onclose = () => {
      setSocket(undefined);
      if (process.env.NODE_ENV === "development") {
        console.log("Socket closed");
      }
    };

    localSocket.onmessage = (event) => {
      const data: ProcessingSocketPayload = JSON.parse(event.data);

      if (data.type && data.type === "heartbeat") {
        return;
      }

      if (!data.type || !data.collection_name) {
        console.warn(
          "Received invalid message from processing socket: " + event.data
        );
        if (data.type === "error") {
          showErrorToast(
            "Error analyzing " + data.collection_name + "...",
            data.error || "Unknown error"
          );
          finishProcessingSocket(data.collection_name, data.error || "");
        }
        return;
      }

      if (data.error) {
        finishProcessingSocket(data.collection_name, data.error || "");
      } else if (data.type === "update") {
        updateProcessingSocket(
          data.collection_name,
          data.progress,
          data.message
        );
      } else if (data.type === "completed") {
        finishProcessingSocket(data.collection_name, "");
        fetchCollections();
      } else {
        finishProcessingSocket(data.collection_name, data.error || "");
        fetchCollections();
      }
    };
  }, [reconnect]);

  useEffect(() => {
    if (!initialRef.current) {
      return;
    }

    const interval = setInterval(() => {
      if (socket?.readyState === WebSocket.CLOSED || !socket) {
        initialRef.current = false;
        console.log("Processing Socket not online, reconnecting...");
        setReconnect((prev) => !prev);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [socket]);

  return (
    <ProcessingContext.Provider
      value={{
        triggerAnalysis,
      }}
    >
      {children}
    </ProcessingContext.Provider>
  );
};
