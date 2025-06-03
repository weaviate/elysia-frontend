"use client";

import React from "react";
import { ThreadPayload } from "@/app/types/displays";
import ThreadPreviewCard from "./ThreadPreviewCard";

interface ThreadDisplayProps {
  payload: ThreadPayload[];
  handleResultPayloadChange: (
    type: string,
    payload: /* eslint-disable @typescript-eslint/no-explicit-any */ any
  ) => void;
}

const ThreadDisplay: React.FC<ThreadDisplayProps> = ({
  payload,
  handleResultPayloadChange,
}) => {
  return (
    <div className="w-full flex flex-col max-h-[21vh] overflow-y-auto rounded-md gap-2">
      {payload.map((message, idx) => (
        <ThreadPreviewCard
          thread={message}
          key={`${idx}-thread`}
          handleOpen={() => handleResultPayloadChange("thread", message)}
        />
      ))}
    </div>
  );
};

export default ThreadDisplay;
