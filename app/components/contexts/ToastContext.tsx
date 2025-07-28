"use client";

import { Collection } from "@/app/types/objects";
import { getWebsocketHost } from "../host";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useToast } from "@/hooks/useToast";
import { ProcessingSocketPayload } from "@/app/types/socketPayloads";
import { CollectionContext } from "./CollectionContext";
import { SessionContext } from "./SessionContext";
import { ToastAction } from "@/components/ui/toast";
import { Toast } from "@/app/types/objects";

export const ToastContext = createContext<{
  analyzeCollection: (collection: Collection, user_id: string) => void;
  currentToasts: Toast[];
  showErrorToast: (title: string, description?: string) => void;
  showSuccessToast: (title: string, description?: string) => void;
}>({
  analyzeCollection: () => {},
  currentToasts: [],
  showErrorToast: () => {},
  showSuccessToast: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();

  const { fetchCollections } = useContext(CollectionContext);
  const { id } = useContext(SessionContext);

  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);
  const [socket, setSocket] = useState<WebSocket>();
  const [reconnect, setReconnect] = useState(false);

  const initialRef = useRef(false);

  const showErrorToast = useCallback(
    (title: string, description?: string) => {
      toast({
        title,
        description: description || "An error occurred. Please try again.",
        variant: "destructive",
        action: <ToastAction altText="Close">Close</ToastAction>,
      });
    },
    [toast]
  );

  const showSuccessToast = useCallback(
    (title: string, description?: string) => {
      toast({
        title,
        description,
        variant: "default",
      });
    },
    [toast]
  );

  const analyzeCollection = useCallback(
    (collection: Collection, user_id: string) => {
      if (process.env.NODE_ENV === "development") {
        console.log("Starting analysis of " + collection.name + "...");
      }

      const isProcessing = currentToasts.some(
        (toast) => toast.collection_name === collection.name
      );

      if (isProcessing) {
        setTimeout(() => {
          toast({
            title: "Already analyzing " + collection.name + "...",
            description: "Please wait for it to finish before analyzing again.",
          });
        }, 0);
        return;
      }

      setTimeout(() => {
        const _toast = toast({
          title: "Starting analysis of " + collection.name + "...",
          description: "Connecting to server...",
          progress: 0,
          duration: 1000000,
        });

        setCurrentToasts((prev) => {
          const newToasts = [
            ...prev,
            {
              collection_name: collection.name,
              toast: _toast,
              progress: 0,
            },
          ];

          if (socket && user_id) {
            const payload = {
              user_id: user_id,
              collection_name: collection.name,
            };
            socket.send(JSON.stringify(payload));
          } else {
            showErrorToast(
              "Error analyzing " + collection.name + "...",
              "Connection to Elysia lost (Socket: " +
                socket +
                ") (ID: " +
                user_id +
                ")"
            );
            setCurrentToasts((prev) =>
              prev.filter((toast) => toast.collection_name !== collection.name)
            );
            return prev;
          }

          return newToasts;
        });
      }, 0);
    },
    [currentToasts, socket, toast]
  );

  const updateProcessingSocket = (
    collection_name: string,
    progress: number
  ) => {
    setCurrentToasts((prev) => {
      const currentToast = prev.find(
        (toast) => toast.collection_name === collection_name
      );

      if (!currentToast) {
        return prev;
      }

      const newProgress = Number((progress * 100).toFixed(2));

      currentToast.toast.update({
        id: currentToast.toast.id,
        title: "Analyzing " + currentToast.collection_name + "...",
        description: "This may take a while...",
        progress: newProgress,
      });

      // Return updated array with the new progress
      return prev.map((toast) =>
        toast.collection_name === collection_name
          ? { ...toast, progress: newProgress }
          : toast
      );
    });
  };

  const finishProcessingSocket = (collection_name: string, error: string) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "Finished analysis of " + collection_name + " with error: " + error
      );
    }
    setCurrentToasts((prev) => {
      const currentToast = prev.find(
        (toast) => toast.collection_name === collection_name
      );

      if (!currentToast) {
        return prev;
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
      }
      return prev.filter((toast) => toast.collection_name !== collection_name);
    });
    fetchCollections();
  };

  useEffect(() => {
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
        if (data.type === "error") {
          showErrorToast(
            "Error analyzing " + data.collection_name + "...",
            data.error || "Unknown error"
          );
          finishProcessingSocket(data.collection_name, data.error || "");
        }
        return;
      }

      if (data.type === "update") {
        updateProcessingSocket(data.collection_name, data.progress);
      } else if (data.type === "completed") {
        finishProcessingSocket(data.collection_name, "");
      } else {
        finishProcessingSocket(data.collection_name, data.error || "");
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
    <ToastContext.Provider
      value={{
        analyzeCollection,
        currentToasts,
        showErrorToast,
        showSuccessToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};
