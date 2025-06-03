import React, { useState } from "react";
import { ResultPayload } from "@/app/types/chat";
import ResultPayloadRenderer from "./ResultPayloadRenderer";
import CodeDisplay from "./display/CodeDisplay";

interface MergeDisplaysProps {
  payloadsToMerge: ResultPayload[];
  baseKey: string;
  messageId: string;
  handleViewChange: (
    view: "chat" | "code" | "result",
    payload: ResultPayload[] | null
  ) => void;
  handleResultPayloadChange: (
    type: string,
    payload: /* eslint-disable @typescript-eslint/no-explicit-any */ any
  ) => void;
}

const MergeDisplays: React.FC<MergeDisplaysProps> = ({
  payloadsToMerge,
  baseKey,
  messageId,
  handleViewChange,
  handleResultPayloadChange,
}) => {
  if (!payloadsToMerge || payloadsToMerge.length === 0) {
    return null;
  }

  const defaultTabValue =
    payloadsToMerge[0].metadata?.collection_name || `${baseKey}-tab-0`;
  const [activeTab, setActiveTab] = useState(defaultTabValue);

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center gap-2 mb-1 w-full">
        <CodeDisplay
          payload={payloadsToMerge}
          merged={true}
          handleViewChange={handleViewChange}
        />
        <div className="flex overflow-x-auto gap-2 flex-nowrap scrollbar-thin scrollbar-thumb-foreground scrollbar-track-background_alt">
          {payloadsToMerge.map((payload, idx) => {
            const tabValue =
              payload.metadata?.collection_name || `${baseKey}-tab-${idx}`;
            const tabTitle =
              payload.metadata?.collection_name || `Collection ${idx + 1}`;
            return (
              <button
                key={`${baseKey}-trigger-${idx}`}
                onClick={() => setActiveTab(tabValue)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-md transition-colors
                  hover:bg-background_alt text-sm
                  ${activeTab === tabValue ? "text-primary" : "text-secondary"}
                `}
              >
                {tabTitle}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-2">
        {payloadsToMerge.map((payload, idx) => {
          const tabValue =
            payload.metadata?.collection_name || `${baseKey}-tab-${idx}`;
          if (activeTab !== tabValue) return null;

          return (
            <div key={`${baseKey}-content-${idx}`}>
              <ResultPayloadRenderer
                payload={payload}
                index={idx}
                handleResultPayloadChange={handleResultPayloadChange}
                messageId={messageId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MergeDisplays;
