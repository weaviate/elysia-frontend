import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { getDisplayIcon } from "@/app/types/displayIcons";
import { FaPlus } from "react-icons/fa";

interface DisplayTypeSelectProps {
  mappingTypes: Record<string, Record<string, string>>;
  mappingTypeDescriptions: Record<string, string>;
  onSelect: (type: string) => void;
}

const DisplayTypeSelect: React.FC<DisplayTypeSelectProps> = ({
  mappingTypes,
  mappingTypeDescriptions,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (type: string) => {
    onSelect(type);
    setOpen(false); // Close the popover when an item is selected
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>
          <FaPlus className="text-secondary" />
          <p className="text-secondary">Add Display</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-4 bg-foreground ">
        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
          {Object.keys(mappingTypes).map((type) => {
            const description = mappingTypeDescriptions[type] || "";
            return (
              <div
                key={type}
                className="flex items-start gap-3 p-3 rounded-md hover:bg-background cursor-pointer transition-colors"
                onClick={() => handleSelect(type)}
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
