"use client";

import { DocumentPayload } from "@/app/types/displays";
import { Card, CardTitle } from "@/components/ui/card";
import { FaBookmark } from "react-icons/fa6";
import DisplayPagination from "../../components/DisplayPagination";

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
    <DisplayPagination>
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
                <div className="flex flex-row justify-center items-center gap-1 text-primary">
                  <FaBookmark className="text-xs text-alt_color_a" />
                  <p className="text-xs text-alt_color_a">
                    {document.chunk_spans.length}
                  </p>
                </div>
              )}
            </div>
            <h1 className="text-sm overflow-hidden text-ellipsis whitespace-nowra pb-1">
              {document.title}
            </h1>
          </CardTitle>
        </Card>
      ))}
    </DisplayPagination>
  );
};

export default DocumentDisplay;
