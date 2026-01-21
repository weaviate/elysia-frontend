"use client";
import { CitationPreview } from "@/app/types/displays";
import { useState } from "react";

interface CitationBubbleProps {
  citationPreview: CitationPreview;
}

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getDisplayIcon } from "@/app/types/displayIcons";
import { useContext } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import { DisplayContext } from "../../contexts/DisplayContext";

const CitationBubble: React.FC<CitationBubbleProps> = ({ citationPreview }) => {
  const { handleResultPayloadChange } = useContext(ChatContext);
  const { currentCollectionName } = useContext(DisplayContext);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <HoverCard openDelay={0} closeDelay={150}>
      <HoverCardTrigger asChild>
        <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            inline-flex items-center justify-center
            h-5 w-5 rounded-full text-xs font-bold
            bg-highlight
            text-background
            transition-all duration-300 ease-out
            cursor-pointer
            hover:scale-110 hover:shadow-lg hover:shadow-accent/30
            hover:from-accent hover:to-accent/80
          `}
        >
          {citationPreview.index + 1}
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        className="
          p-0 overflow-hidden
          bg-background/95 backdrop-blur-md
          border border-foreground/20
          shadow-2xl
          rounded-xl
        "
      >
        <div className="flex flex-col">
          {/* Header with type badge */}
          <div className="flex items-center gap-2 px-3 py-2 bg-accent/10">
              {getDisplayIcon(citationPreview.type)}
            <span className="text-[9px] uppercase font-semibold tracking-wider text-accent">
              {citationPreview.type}
            </span>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2 px-3 py-3">
            {/* Title */}
            <span
              onClick={() => {
                if (citationPreview.object) {
                  handleResultPayloadChange(
                    citationPreview.type,
                    citationPreview.object,
                    currentCollectionName
                  );
                }
              }}
              className={`
                text-sm font-medium text-primary w-64 truncate
                transition-colors duration-200
                ${citationPreview.object ? "cursor-pointer hover:text-accent" : ""}
              `}
            >
              {citationPreview.title}
            </span>

            {/* Preview text */}
            {citationPreview.type === "aggregation" ? (
              <span className="text-xs text-secondary/80 line-clamp-2 w-72 leading-relaxed">
                Referencing multiple aggregation results
              </span>
            ) : (
              <span className="text-xs text-secondary/80 line-clamp-2 w-72 leading-relaxed">
                {citationPreview.text}
              </span>
            )}

            {/* Click hint for clickable items */}
            {citationPreview.object && (
              <span className="text-[10px] text-accent/60 mt-1">
                Click title to view details →
              </span>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CitationBubble;
