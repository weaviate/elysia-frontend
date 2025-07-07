import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { getDisplayIcon } from "@/app/types/displayIcons";
import { FaPlus } from "react-icons/fa";

// TODO: when backend is updated, this should be removed
const displayTypeDescriptions: Record<string, string> = {
  conversation:
    "Full conversations, including all messages and message authors, with timestamps and context of other messages in the conversation.",
  message:
    "Individual messages, only including the author of each individual message and timestamp, without surrounding context of other messages by different people.",
  ticket:
    "Tickets, such as issues on Github, or support tickets on somewhere else, or anything similar to those.",
  ecommerce:
    "Products items, so usually involving descriptions, prices, ratings, reviews, etc, but not always.",
  document:
    "Text-based information, usually with a title, author, date, and content, but not always. Specifically for long text.",
  epic_generic:
    "Generic information with title, subtitle, content, URL, ID, author, timestamp, tags, category, and subcategory fields.",
  generic:
    "Any other type of information that does not fit into the other categories.",
};

interface DisplayTypeSelectProps {
  mappingTypes: Record<string, Record<string, string>>;
  onSelect: (type: string) => void;
}

const DisplayTypeSelect: React.FC<DisplayTypeSelectProps> = ({
  mappingTypes,
  onSelect,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="text-secondary hover:text-primary hover:bg-transparent"
        >
          <FaPlus />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-4 bg-foreground ">
        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
          {Object.keys(mappingTypes).map((type) => {
            const description = displayTypeDescriptions[type] || "";
            return (
              <div
                key={type}
                className="flex items-start gap-3 p-3 rounded-md hover:bg-background cursor-pointer transition-colors"
                onClick={() => onSelect(type)}
              >
                <div className="flex-shrink-0 mt-1">{getDisplayIcon(type)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-primary text-sm mb-1 capitalize">
                    {type.replace(/_/g, " ")}
                  </h4>
                  {description && (
                    <p className="text-secondary text-xs leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DisplayTypeSelect;
