"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SettingTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

const SettingTextarea: React.FC<SettingTextareaProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-1 items-start justify-start gap-1 w-full sm:w-2/3">
      <textarea
        value={value}
        className={cn(
          "flex w-full rounded-md border text-sm border-foreground_alt bg-transparent px-3 py-2 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "resize-y min-h-16 max-h-48"
        )}
        onChange={(e) => onChange(e.target.value)}
        rows={3} // Default to 3 rows
      />
    </div>
  );
};

export default SettingTextarea;
