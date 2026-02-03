"use client";

import { TextObject, TextPayload } from "@/app/types/chat";
import MarkdownFormat from "../../components/MarkdownFormat";
import { Separator } from "@/components/ui/separator";
import { FaCircle } from "react-icons/fa";

interface CitationDisplayProps {
  payload: TextPayload;
}

const CitationDisplay: React.FC<CitationDisplayProps> = ({ payload }) => {
  // Build combined text with inline citation markers at the right positions
  const { combinedText, allRefIds } = payload.objects.reduce(
    (acc, obj) => {
      const textObj = obj as TextObject;
      const refs = textObj.ref_ids || [];
      
      // Append the text
      let segment = obj.text;
      
      // Add inline citation markers for this segment's refs
      if (refs.length > 0) {
        const markers = refs.map((_, i) => `[${acc.citationCounter + i + 1}]`).join("");
        segment += markers;
      }
      
      return {
        combinedText: acc.combinedText + segment,
        allRefIds: [...acc.allRefIds, ...refs],
        citationCounter: acc.citationCounter + refs.length,
      };
    },
    { combinedText: "", allRefIds: [] as string[], citationCounter: 0 }
  );

  return (
    <div className="w-full flex chat-animation flex-col justify-start items-start">
      <div className="flex flex-col w-full justify-start items-start">
        {payload.metadata?.title && (
          <div className="flex items-center gap-2 w-full">
            <FaCircle scale={0.2} className="text-lg pulsing_color" />
            <p className="text-primary text-lg font-bold">
              {payload.metadata?.title}
            </p>
          </div>
        )}
      </div>

      {payload.metadata?.title && <Separator className="my-2" />}

      <div className="text-sm text-white flex flex-col gap-1 w-full">
        <div className="flex-1">
          <MarkdownFormat
            text={combinedText}
            ref_ids={allRefIds}
            inlineCitations={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CitationDisplay;
