"use client";

import React, { useEffect, useState } from "react";
import { SingleMessageType } from "@/app/types/displays";
import SingleMessageCard from "./SingleMessageCard";
import { Badge } from "@/components/ui/badge";

interface SingleMessageProps {
  payload: SingleMessageType[];
}

const SingleMessageDisplay: React.FC<SingleMessageProps> = ({
  payload,
}) => {
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="w-full flex flex-col max-h-[35vh] overflow-y-auto gap-2 rounded-md p-4 ">
      {payload.map((message, idx) => (
        <div
          key={`${idx}-${message.message_id}`}
          className={`flex flex-col gap-2 w-full`}
        >
          <div className="flex flex-row gap-2">
            <p className="text-accent text-sm font-bold pl-1">
              {message.author}
            </p>
          </div>
          <div className="flex flex-col gap-2 border border-secondary p-2 rounded-lg hover:bg-foreground cursor-pointer transition-all duration-300">
            <p className="text-primary text-xs overflow-hidden text-ellipsis line-clamp-2">
              {message.content}
            </p>
          </div>
          <div className="flex flex-row gap-2 justify-end">
            <p className="text-secondary text-xs pr-1">
              {formatDate(message.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SingleMessageDisplay;
