"use client";

import { DocumentPayload } from "@/app/types/displays";
import { Card, CardTitle } from "@/components/ui/card";
import { BsGridFill } from "react-icons/bs";
import { FaBookmark } from "react-icons/fa6";

interface DocumentDisplayProps {
  payload: DocumentPayload[];
  handleResultPayloadChange: (
    type: string,
    payload: /* eslint-disable @typescript-eslint/no-explicit-any */ any
  ) => void;
}

const DocumentDisplay: React.FC<DocumentDisplayProps> = ({
  payload,
  handleResultPayloadChange,
}) => {
  if (payload.length === 0) return null;

  return (
    <div className="flex flex-col w-full justify-start items-start gap-1 max-h-[20vh] overflow-y-scroll pr-4">
      {payload.map((document, idx) => (
        <Card
          key={idx + document.title}
          className="w-full bg-background_alt py-2 px-4 rounded-lg border-none hover:bg-foreground cursor-pointer transition-all duration-200"
          onClick={() => handleResultPayloadChange("document", document)}
        >
          <CardTitle className="flex flex-col gap-1">
            <div className="flex flex-row justify-between">
              <p className="text-xs font-light text-secondary">
                {document.collection_name}
              </p>
              {document.chunk_spans && document.chunk_spans.length > 0 && (
                <div className="flex flex-row justify-center items-center gap-1 text-alt_color_a">
                  <FaBookmark className="text-xs" />
                  <p className="text-xs">{document.chunk_spans.length}</p>
                </div>
              )}
            </div>
            <h1 className="text-sm overflow-hidden text-ellipsis whitespace-nowra pb-1">
              {document.title}
            </h1>
          </CardTitle>
        </Card>
      ))}
    </div>
  );
};

export default DocumentDisplay;
