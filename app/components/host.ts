"use client";

export const host =
  process.env.NEXT_PUBLIC_IS_STATIC !== "true" ? "http://localhost:8000" : "";

export const public_path =
  process.env.NEXT_PUBLIC_IS_STATIC !== "true" ? "/" : "/static";

export const getWebsocketHost = () => {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_IS_STATIC !== "true"
  ) {
    return `ws://localhost:8000/ws/query`;
  } else if (process.env.NEXT_PUBLIC_IS_STATIC === "true") {
    // If you're serving the app directly through FastAPI, generate the WebSocket URL based on the current location.
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const current_host = window.location.host;
    return `${protocol}//${current_host}/ws/query`;
  } else {
    return `wss://localhost:8000/ws/query`;
  }
};
