"use client";

import { ResponsePayload, TextWithCitationsPayload } from "@/app/types/chat";
import MarkdownFormat from "./MarkdownFormat";
import { Separator } from "@/components/ui/separator";
import { FaCircle } from "react-icons/fa";

interface CitationDisplayProps {
  payload: ResponsePayload;
}

const CitationDisplay: React.FC<CitationDisplayProps> = ({ payload }) => {
  return (
    <div className="w-full flex chat-animation flex-col justify-start items-start">
      <div className="flex flex-col w-full justify-start items-start">
        <div className="flex items-center gap-2 w-full">
          <FaCircle scale={0.2} className="text-lg pulsing_color" />
          <p className="text-primary text-lg font-bold">
            {payload.metadata?.title}
          </p>
        </div>
      </div>

      <Separator className="my-2" />

      {payload.objects.map((text, idx) => {
        const textObj = text as TextWithCitationsPayload;
        return (
          <div
            key={idx}
            className="text-sm text-white flex flex-col gap-1 w-full"
          >
            <div className="flex-1">
              <MarkdownFormat
                text={text.text}
                ref_ids={textObj.ref_ids || []}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CitationDisplay;
