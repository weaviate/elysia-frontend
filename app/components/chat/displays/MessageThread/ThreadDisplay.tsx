"use client";

import React from "react";
import { ThreadPayload } from "@/app/types/displays";
import ThreadPreviewCard from "./ThreadPreviewCard";
import DisplayPagination from "../../components/DisplayPagination";

interface ThreadDisplayProps {
  payload: ThreadPayload[];
  handleResultPayloadChange: (
    type: string,
    payload: /* eslint-disable @typescript-eslint/no-explicit-any */ any,
  ) => void;
}

const ThreadDisplay: React.FC<ThreadDisplayProps> = ({
  payload,
  handleResultPayloadChange,
}) => {
  return (
    <DisplayPagination>
      {payload.map((message, idx) => (
        <ThreadPreviewCard
          thread={message}
          key={`${idx}-thread`}
          handleOpen={() => handleResultPayloadChange("thread", message)}
        />
      ))}
    </DisplayPagination>
  );
};

export default ThreadDisplay;
