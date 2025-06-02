import React from "react";
import { ResultPayload } from "@/app/types/chat";
import ResultPayloadRenderer from "./ResultPayloadRenderer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CodeDisplay from "./display/CodeDisplay";
import DisplayIcon from "./DisplayIcon";

interface MergeDisplaysProps {
  payloadsToMerge: ResultPayload[];
  baseKey: string;
  messageId: string;
}

const MergeDisplays: React.FC<MergeDisplaysProps> = ({
  payloadsToMerge,
  baseKey,
  messageId,
}) => {
  if (!payloadsToMerge || payloadsToMerge.length === 0) {
    return null;
  }

  const defaultTabValue =
    payloadsToMerge[0].metadata?.collection_name || `${baseKey}-tab-0`;

  return (
    <div className="w-full">
      <Tabs defaultValue={defaultTabValue} className="w-full">
        <div className="flex items-center gap-2 mb-1">
          <DisplayIcon payload={payloadsToMerge} />
          <CodeDisplay payload={payloadsToMerge} merged={true}></CodeDisplay>
          <TabsList className="overflow-x-auto max-w-full">
            {payloadsToMerge.map((payload, idx) => {
              const tabValue =
                payload.metadata?.collection_name || `${baseKey}-tab-${idx}`;
              const tabTitle =
                payload.metadata?.collection_name || `Collection ${idx + 1}`;
              return (
                <TabsTrigger
                  key={`${baseKey}-trigger-${idx}`}
                  value={tabValue}
                  className="text-xs" // Style to be similar to CodeDisplay button
                >
                  {tabTitle}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
        {payloadsToMerge.map((payload, idx) => {
          const tabValue =
            payload.metadata?.collection_name || `${baseKey}-tab-${idx}`;
          return (
            <TabsContent
              key={`${baseKey}-content-${idx}`}
              value={tabValue}
              className="mt-2" // Add some margin for content
            >
              {/* The index for ResultPayloadRenderer here is relative to the merged group */}
              <ResultPayloadRenderer
                payload={payload}
                index={idx}
                messageId={messageId} // Pass the original messageId
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default MergeDisplays;
