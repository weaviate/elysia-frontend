"use client";

import React from "react";
import { ThreadPayload } from "@/app/types/displays";
import ThreadPreviewCard from "./ThreadPreviewCard";
import ResultDisplay from "./ResultDisplay";

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
    <ResultDisplay>
      {payload.map((message, idx) => (
        <ThreadPreviewCard
          thread={message}
          key={`${idx}-thread`}
          handleOpen={() => handleResultPayloadChange("thread", message)}
        />
      ))}
    </ResultDisplay>
  );
};

export default ThreadDisplay;
