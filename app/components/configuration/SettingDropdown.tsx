"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { cn } from "@/lib/utils";

interface SettingDropdownProps {
  value: string;
  values: string[];
  onChange: (value: string) => void;
  isInvalid?: boolean;
}

const SettingDropdown: React.FC<SettingDropdownProps> = ({
  value,
  values,
  onChange,
  isInvalid = false,
}) => {
  const [editable, setEditable] = useState(false);

  const toggleEditable = () => {
    if (editable) {
      onChange(currentValue);
      setEditable(false);
    } else {
      setEditable(true);
    }
  };

  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <div className="flex flex-1 items-center justify-start gap-1 w-2/3">
      {editable ? (
        <Input
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          className={cn(
            isInvalid &&
              "border-warning ring-warning/20 focus-visible:ring-warning"
          )}
        />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={cn(
                "w-full",
                isInvalid && "border-warning ring-warning/20 border"
              )}
            >
              {value}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            {values.map((v) => (
              <DropdownMenuItem
                key={v}
                onClick={() => onChange(v)}
                className="w-full"
              >
                {v}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
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
          onClick={() => {
            toggleEditable();
          }}
        >
          <IoClose />
        </Button>
      )}
    </div>
  );
};

export default SettingDropdown;
