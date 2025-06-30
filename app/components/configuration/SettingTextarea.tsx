"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { cn } from "@/lib/utils";

interface SettingTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const SettingTextarea: React.FC<SettingTextareaProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
}) => {
  const [editable, setEditable] = useState(false);

  const toggleEditable = () => {
    if (editable) {
      onSave();
      setEditable(false);
    } else {
      setEditable(true);
    }
  };

  const handleCancel = () => {
    setEditable(false);
    onCancel();
  };

  return (
    <div className="flex flex-1 items-start justify-start gap-1 w-2/3">
      <textarea
        value={value}
        className={cn(
          "flex w-full rounded-md border text-sm border-foreground_alt bg-transparent px-3 py-2 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          "resize-y min-h-16 max-h-48"
        )}
        onChange={(e) => onChange(e.target.value)}
        disabled={!editable}
        rows={3} // Default to 3 rows
      />
      <div className="flex flex-col gap-1">
        <Button
          variant={editable ? "accept" : "ghost"}
          className={`h-8 w-8 ${editable ? "text-primary" : "text-secondary"} flex-shrink-0`}
          onClick={() => toggleEditable()}
        >
          {editable ? <FaCheck /> : <MdEdit />}
        </Button>
        {editable && (
          <Button
            variant="destructive"
            className={`h-8 w-8 ${editable ? "text-primary" : "text-secondary"} flex-shrink-0`}
            onClick={() => handleCancel()}
          >
            <IoClose />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SettingTextarea;
