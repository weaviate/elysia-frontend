"use client";

import { createContext, useEffect, useState } from "react";
import { Message, TextPayload } from "../types";
import { getWebsocketHost } from "../host";
import { useContext } from "react";
import { ConversationContext } from "./ConversationContext";
import { SessionContext } from "./SessionContext";
export const SocketContext = createContext<{
  socketOnline: boolean;
  sendQuery: (
    user_id: string,
    query: string,
    conversation_id: string,
    query_id: string,
    route?: string,
    mimick?: boolean,
    auth?: boolean
  ) => Promise<boolean>;
}>({
  socketOnline: false,
  sendQuery: async () => false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    addMessageToConversation,
    setConversationStatus,
    setAllConversationStatuses,
    updateTree,
    finishQuery,
    handleConversationError,
    handleAllConversationsError,
    addSuggestionToConversation,
  } = useContext(ConversationContext);

  const { enableRateLimitDialog, getUserLimit } = useContext(SessionContext);

  const [socketOnline, setSocketOnline] = useState(false);
  const [socket, setSocket] = useState<WebSocket>();
  const [reconnect, setReconnect] = useState(false);

  useEffect(() => {
    setReconnect(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!socketOnline || socket?.readyState === WebSocket.CLOSED || !socket) {
        console.log("Socket not online, reconnecting...");
        setReconnect((prev) => !prev);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [socketOnline, socket]);

  useEffect(() => {
    const socketHost = getWebsocketHost();
    const localSocket = new WebSocket(socketHost);

    localSocket.onopen = () => {
      setSocketOnline(true);
      if (process.env.NODE_ENV === "development") {
        console.log("Socket opened");
      }
    };

    localSocket.onmessage = (event) => {
      try {
        const message: Message = JSON.parse(event.data);
        if (process.env.NODE_ENV === "development") {
          console.log("Received message type:", message.type);
        }
        if (message.type === "status") {
          const payload = message.payload as TextPayload;
          setConversationStatus(payload.text, message.conversation_id);
        } else if (message.type === "completed") {
          getUserLimit();
          setConversationStatus("", message.conversation_id);
          finishQuery(message.conversation_id, message.query_id);
          addSuggestionToConversation(
            message.conversation_id,
            message.query_id,
            message.user_id
          );
        } else if (message.type === "tree_update") {
          updateTree(message);
        } else {
          if (
            [
              "error",
              "tree_timeout_error",
              "rate_limit_error",
              "authentication_error",
            ].includes(message.type)
          ) {
            handleConversationError(message.conversation_id);
            finishQuery(message.conversation_id, message.query_id);
            setConversationStatus("", message.conversation_id);
          }

          if (message.type === "rate_limit_error") {
            enableRateLimitDialog();
          }

          if (process.env.NODE_ENV === "development") {
            console.log("Received message:", message);
          }
          addMessageToConversation(
            [message],
            message.conversation_id,
            message.query_id
          );
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error(error);
        }
      }
    };

    localSocket.onerror = (error) => {
      if (process.env.NODE_ENV === "development") {
        console.log(error);
      }
      setSocketOnline(false);
      setAllConversationStatuses("");
      handleAllConversationsError();
    };

    localSocket.onclose = () => {
      setSocketOnline(false);
      setAllConversationStatuses("");
      handleAllConversationsError();
      if (process.env.NODE_ENV === "development") {
        console.log("Socket closed");
      }
    };

    setSocket(localSocket);

    return () => {
      if (localSocket.readyState !== WebSocket.CLOSED) {
        localSocket.close();
      }
    };
  }, [reconnect]);

  const sendQuery = async (
    user_id: string,
    query: string,
    conversation_id: string,
    query_id: string,
    route?: string,
    mimick?: boolean,
    // TODO: Remove this once we have a real auth key
    auth?: boolean
  ) => {
    // TODO: Remove this once we have a real auth key
    const auth_key = "";

    setConversationStatus("Thinking...", conversation_id);
    socket?.send(
      JSON.stringify({
        user_id,
        query,
        conversation_id,
        query_id,
        route,
        mimick,
        auth,
        auth_key,
      })
    );

    return Promise.resolve(true);
  };

  return (
    <SocketContext.Provider value={{ socketOnline, sendQuery }}>
      {children}
    </SocketContext.Provider>
  );
};
