"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { cn } from "@/lib/utils";

interface SettingInputProps<T extends string | number> {
  isProtected: boolean;
  value: T;
  onChange: (value: T) => void;
  isInvalid?: boolean;
}

const SettingInput = <T extends string | number>({
  isProtected,
  value,
  onChange,
  isInvalid = false,
}: SettingInputProps<T>) => {
  const [visible, setVisible] = useState(isProtected);

  const isNumberType = typeof value === "number";

  const handleChange = (inputValue: string) => {
    if (isNumberType) {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        onChange(numValue as T);
      } else if (inputValue === "") {
        // Handle empty string for number inputs
        onChange(0 as T);
      }
    } else {
      onChange(inputValue as T);
    }
  };

  // Determine input type: number inputs are always visible, only string inputs can be protected
  const inputType = isNumberType ? "number" : visible ? "password" : "text";

  return (
    <div className="flex flex-1 items-center justify-start gap-1 w-full sm:w-2/3">
      <Input
        type={inputType}
        value={value.toString()}
        onChange={(e) => handleChange(e.target.value)}
        className={cn(
          isInvalid &&
            "border-warning ring-warning/20 focus-visible:ring-warning"
        )}
      />
      {!isNumberType && (
        <Button
          variant="ghost"
          className="h-8 w-8 text-secondary flex-shrink-0"
          onClick={() => setVisible(!visible)}
        >
          {visible ? <IoMdEye /> : <IoMdEyeOff />}
        </Button>
      )}
    </div>
  );
};

export default SettingInput;
