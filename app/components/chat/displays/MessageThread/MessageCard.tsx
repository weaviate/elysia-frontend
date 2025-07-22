"use client";

import React from "react";
import { SingleMessagePayload } from "@/app/types/displays";
import MarkdownFormat from "../../components/MarkdownFormat";
import { HiMiniSparkles } from "react-icons/hi2";

interface MessageCardProps {
  message: SingleMessagePayload;
  id?: string;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, id }) => {
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
    <div className="flex flex-col gap-2" id={id}>
      <div className="flex flex-row">
        {message.relevant && (
          <p className="bg-transparent hover:bg-transparent text-accent justify-center items-center flex flex-row">
            <HiMiniSparkles />
          </p>
        )}
        <p className="text-md text-primary font-bold pl-2">{message.author}</p>
      </div>
      <div className={`flex flex-col gap-2 rounded-lg bg-background_alt`}>
        <p className="text-primary text-xs p-5">
          <MarkdownFormat text={message.content} />
        </p>
      </div>
      <div className="flex flex-row gap-2 justify-end">
        <p className="text-secondary text-sm">
          {formatDate(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageCard;
