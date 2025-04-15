"use client";

import host from "./components/host";
export const getWebsocketHost = () => {
  if (process.env.NODE_ENV === "development") {
    return `ws://${host}/ws/query`;
  } else {
    return `wss://${host}/ws/query`;
  }
};
