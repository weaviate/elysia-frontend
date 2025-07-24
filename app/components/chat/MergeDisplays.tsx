import React, { useState } from "react";
import { ResultPayload } from "@/app/types/chat";
import RenderDisplay from "./RenderDisplay";
import CodeDisplay from "./components/ViewCodeButton";
import MergedDisplayTabs from "./components/MergedDisplayTabs";

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
  const [activeTab, setActiveTab] = useState(`${baseKey}-tab-0`);

  if (!payloadsToMerge || payloadsToMerge.length === 0) {
    return null;
  }

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
            const tabValue = `${baseKey}-tab-${idx}`;
            const tabTitle =
              payload.metadata?.collection_name || `Collection ${idx + 1}`;
            return (
              <MergedDisplayTabs
                key={`${baseKey}-tab-${idx}`}
                baseKey={baseKey}
                tabValue={tabValue}
                idx={idx}
                tabTitle={tabTitle}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
              />
            );
          })}
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-4">
        {payloadsToMerge.map((payload, idx) => {
          const tabValue = `${baseKey}-tab-${idx}`;
          if (activeTab !== tabValue) return null;

          return (
            <div key={`${baseKey}-content-${idx}`}>
              <RenderDisplay
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
