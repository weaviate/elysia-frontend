"use client";

import React from "react";
import { SingleMessagePayload } from "@/app/types/displays";
import ResultDisplay from "./ResultDisplay";

interface SingleMessageProps {
  payload: SingleMessagePayload[];
}

const SingleMessageDisplay: React.FC<SingleMessageProps> = ({ payload }) => {
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <ResultDisplay>
      {payload.map((message, idx) => (
        <div
          key={`${idx}-${message.message_id}`}
          className="flex flex-col gap-2 rounded-lg transition-all duration-300 bg-background_alt p-3"
        >
          <div className="flex flex-col gap-1 p-1 w-full">
            <div className="flex flex-row gap-1 justify-between">
              <p className="text-primary text-sm font-bold">{message.author}</p>
              <p className="text-secondary text-xs">
                {formatDate(message.timestamp)}
              </p>
            </div>
            <p className="text-primary text-xs">{message.content}</p>
          </div>
        </div>
      ))}
    </ResultDisplay>
  );
};

export default SingleMessageDisplay;
