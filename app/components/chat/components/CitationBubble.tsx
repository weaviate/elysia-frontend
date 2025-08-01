"use client";
import { CitationPreview } from "@/app/types/displays";
import { Button } from "@/components/ui/button";

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

  return (
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button
          size="icon"
          className="inline-flex items-center justify-center bg-foreground hover:bg-accent hover:text-background transition-colors duration-200 rounded-full h-5 w-5 text-xs font-medium text-primary cursor-pointer"
        >
          <span className="text-xs font-bold">{citationPreview.index + 1}</span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col gap-0">
          <div className="flex flex-row justify-start items-center gap-2">
            {getDisplayIcon(citationPreview.type)}
            <p
              onClick={() => {
                if (citationPreview.object) {
                  handleResultPayloadChange(
                    citationPreview.type,
                    citationPreview.object,
                    currentCollectionName
                  );
                }
              }}
              className={`text-sm font-bold cursor-pointer w-64 truncate ${citationPreview.object ? "underline" : ""}`}
            >
              {citationPreview.title}
            </p>
          </div>
          <p className="text-xs line-clamp-2 w-72">{citationPreview.text}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CitationBubble;
