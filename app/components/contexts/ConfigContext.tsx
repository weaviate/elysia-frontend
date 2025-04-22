"use client";

import { Collection } from "@/app/types/objects";
import { getWebsocketHost } from "../host";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ToasterToast, useToast } from "@/hooks/use-toast";
import { ProcessingSocketPayload } from "@/app/types/socket_payloads";
import { CollectionContext } from "./CollectionContext";
import { SessionContext } from "./SessionContext";
import { setDefaultConfig } from "@/app/api/set_default_config";
import { ToastAction } from "@/components/ui/toast";

export const ConfigContext = createContext<{
  analyzeCollection: (collection: Collection) => void;
}>({
  analyzeCollection: () => {},
});

type Toast = {
  collection_name: string;
  toast: {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
};

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();

  const { fetchCollections } = useContext(CollectionContext);
  const { id } = useContext(SessionContext);

  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);
  const [socket, setSocket] = useState<WebSocket>();
  const [reconnect, setReconnect] = useState(false);

  const initialRef = useRef(false);

  const analyzeCollection = (collection: Collection) => {
    // Check if collection is already being processed
    const isProcessing = currentToasts.some(
      (toast) => toast.collection_name === collection.name
    );

    if (isProcessing) {
      toast({
        title: "Already analyzing " + collection.name + "...",
        description: "Please wait for it to finish before analyzing again.",
      });
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Starting analysis of " + collection.name + "...");
    }

    const _toast = toast({
      title: "Starting analysis of " + collection.name + "...",
      description: "Connecting to server...",
      progress: 0,
      duration: 1000000,
    });

    // Add the new toast to the processing queue
    setCurrentToasts((prev) => [
      ...prev,
      {
        collection_name: collection.name,
        toast: _toast,
      },
    ]);

    if (socket && id) {
      if (process.env.NODE_ENV === "development") {
        console.log("Sending message to processing socket...");
        console.log("Socket ready state:", socket.readyState);
        console.log("Socket OPEN constant:", socket.OPEN);
        console.log("Socket is healthy:", socket.readyState === socket.OPEN);
        console.log("Socket URL:", socket.url);
        console.log("Socket protocol:", socket.protocol);
        console.log("Socket buffered amount:", socket.bufferedAmount);
      }

      socket.send(
        JSON.stringify({
          user_id: id,
          collection_name: collection.name,
        })
      );
    } else {
      if (process.env.NODE_ENV === "development") {
        console.log("Processing socket not connected");
      }
    }
  };

  const updateProcessingSocket = (
    collection_name: string,
    progress: number
  ) => {
    const currentToast = currentToasts.find(
      (toast) => toast.collection_name === collection_name
    );

    if (!currentToast) {
      return;
    }

    currentToast.toast.update({
      id: currentToast.toast.id,
      title: "Analyzing " + currentToast.collection_name + "...",
      description: "This may take a while...",
      progress: progress,
    });
  };

  const finishProcessingSocket = (collection_name: string, error: string) => {
    const currentToast = currentToasts.find(
      (toast) => toast.collection_name === collection_name
    );

    if (!currentToast) {
      return;
    }

    if (error) {
      currentToast.toast.update({
        id: currentToast.toast.id,
        title: "Error analyzing " + currentToast.collection_name + "...",
        variant: "destructive",
        description: error,
        progress: 100,
        action: (
          <ToastAction
            altText="Close"
            onClick={() => currentToast.toast.dismiss()}
          >
            Close
          </ToastAction>
        ),
      });
    } else {
      currentToast.toast.update({
        id: currentToast.toast.id,
        title: "Done!",
        description: "Collection analyzed successfully",
        progress: 100,
        action: (
          <ToastAction
            altText="Close"
            onClick={() => currentToast.toast.dismiss()}
          >
            Close
          </ToastAction>
        ),
      });
      fetchCollections();
    }

    setCurrentToasts(
      currentToasts.filter((toast) => toast.collection_name !== collection_name)
    );
  };

  useEffect(() => {
    //TODO: This is temporarily setting the default config everytime. Waiting until load_config is implemented.
    setDefaultConfig(id);
    setReconnect(true);
  }, [id]);

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
        return;
      }

      if (data.type === "update") {
        updateProcessingSocket(data.collection_name, data.progress);
      } else if (data.type === "completed") {
        finishProcessingSocket(data.collection_name, "");
      } else {
        finishProcessingSocket(data.collection_name, data.error);
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
    <ConfigContext.Provider value={{ analyzeCollection }}>
      {children}
    </ConfigContext.Provider>
  );
};
