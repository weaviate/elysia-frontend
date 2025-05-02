"use client";

import React from "react";
import MarkdownFormat from "./MarkdownFormat";
import { IoWarningOutline } from "react-icons/io5";
import { RateLimitPayload } from "@/app/components/types";
interface RateLimitMessageDisplayProps {
  payload: RateLimitPayload;
}

const RateLimitMessageDisplay: React.FC<RateLimitMessageDisplayProps> = ({
  payload,
}) => {
  return (
    <div className="w-full flex flex-col justify-start items-start ">
      <div className="max-w-3/5">
        <div className="flex flex-col justify-start items-start gap-2 chat-animation border border-secondary p-4 rounded-lg">
          <div className="flex gap-2 items-center">
            <IoWarningOutline className="text-primary text-lg" />
            <p className="text-primary text-sm font-bold">Rate Limit reached</p>
          </div>
          <MarkdownFormat
            text={
              payload.text +
              "\n (" +
              payload.time_left.hours +
              "h " +
              payload.time_left.minutes +
              "m " +
              payload.time_left.seconds +
              "s)"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default RateLimitMessageDisplay;
