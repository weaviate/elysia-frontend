"use client";

import { ResponsePayload, TextWithCitationsPayload } from "@/app/types/chat";
import MarkdownFormat from "./MarkdownFormat";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { FaCircle } from "react-icons/fa";

interface CitationDisplayProps {
  payload: ResponsePayload;
}

const CitationDisplay: React.FC<CitationDisplayProps> = ({ payload }) => {
  // Create ref_map dynamically from all unique ref_ids
  const [ref_map, setRefMap] = useState<{ [key: string]: string }>({});
  const [total_refs, setTotalRefs] = useState(0);

  const buildRefMap = () => {
    const max_refs = 6;
    const newRefMap: { [key: string]: string } = {};
    let counter = 1;

    // First, collect all unique ref_ids
    const allUniqueRefs = new Set<string>();
    payload.objects.forEach((text) => {
      (text as TextWithCitationsPayload).ref_ids?.forEach((ref_id) => {
        allUniqueRefs.add(ref_id);
      });
    });

    // Then take only the first 6 for the ref_map
    Array.from(allUniqueRefs)
      .slice(0, max_refs)
      .forEach((ref_id) => {
        newRefMap[ref_id] = counter.toString();
        counter++;
      });

    setRefMap(newRefMap);
    setTotalRefs(allUniqueRefs.size);
  };

  useEffect(() => {
    buildRefMap();
  }, [payload]);

  const handleCitationClick = (ref_id: string) => {
    // TODO Make this work
    console.log("Looking for ref_id:", ref_id);
    const element = document.querySelector(`[data-ref-id="${ref_id}"]`);
    console.log("Found element:", element);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("bg-highlight/20");
      setTimeout(() => {
        element.classList.remove("bg-highlight/20");
      }, 2000);
    }
  };

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

      {/* TODO: Re-enable citation buttons once scrolling functionality is fixed */}
      {/* <div className="flex gap-2 w-full justify-end items-center">
        <div className="flex flex-row gap-2">
          {Object.entries(ref_map).map(([ref_id, number]) => (
            <button
              key={ref_id}
              onClick={() => handleCitationClick(ref_id)}
              className="flex text-xs h-6 w-6 bg-foreground rounded-full items-center justify-center hover:bg-foreground_alt transition-colors cursor-pointer"
            >
              {number}
            </button>
          ))}
          {total_refs > 6 && (
            <span className="text-xs text-secondary flex items-center">
              +{total_refs - 6} more
            </span>
          )}
        </div>
      </div> */}

      {payload.objects.map((text, idx) => {
        return (
          <div
            key={idx}
            className="text-sm text-white flex flex-col gap-1 w-full"
          >
            <div className="flex-1">
              <MarkdownFormat text={text.text} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CitationDisplay;
