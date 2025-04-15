"use client";

import { useState } from "react";
import { SuggestionPayload } from "@/app/components/types";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
interface SuggestionDisplayProps {
  payload: SuggestionPayload;
  handleSendQuery: (query: string, route?: string, mimick?: boolean) => void;
}

const SuggestionDisplay: React.FC<SuggestionDisplayProps> = ({
  payload,
  handleSendQuery,
}) => {
  const [clickedSuggestion, setClickedSuggestion] = useState<string | null>(
    null
  );

  return (
    <div className="w-full flex flex-col items-start justify-start gap-3 fade-in">
      <div className="flex items-center gap-2">
        <MdFormatListBulletedAdd className="text-lg" />
        <p className="text-lg">Related Questions</p>
      </div>
      <Separator />
      <div className="w-full flex flex-col items-start justify-start gap-3">
        {payload.suggestions.map((suggestion) => (
          <div
            key={suggestion}
            onClick={() => {
              setClickedSuggestion(suggestion);
              handleSendQuery(suggestion, "", false);
            }}
            className={`rounded-lg flex flex-col gap-3 w-full cursor-pointer transition-all duration-300 
            ${
              clickedSuggestion === suggestion
                ? "text-primary"
                : "text-secondary hover:text-primary"
            }`}
          >
            <div className="flex w-full justify-between items-center gap-2">
              <p className="text-sm">{suggestion}</p>
              <IoMdAdd />
            </div>
            <Separator />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionDisplay;
