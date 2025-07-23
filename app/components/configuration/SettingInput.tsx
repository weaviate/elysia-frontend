"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

interface SettingInputProps<T extends string | number> {
  isProtected: boolean;
  value: T;
  onChange: (value: T) => void;
}

const SettingInput = <T extends string | number>({
  isProtected,
  value,
  onChange,
}: SettingInputProps<T>) => {
  const [visible, setVisible] = useState(isProtected);
  const [editable, setEditable] = useState(false);

  const [textValue, setTextValue] = useState(value.toString());

  useEffect(() => {
    setTextValue(value.toString());
  }, [value]);

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

  const toggleEditable = () => {
    if (editable) {
      handleSave();
      setEditable(false);
      if (isProtected && !isNumberType) {
        setVisible(true);
      }
    } else {
      setEditable(true);
      if (!isNumberType) {
        setVisible(false);
      }
    }
  };

  const handleSave = () => {
    handleChange(textValue);
    setEditable(false);
  };

  const handleCancel = () => {
    setTextValue(value.toString());
    toggleEditable();
  };

  // Determine input type: number inputs are always visible, only string inputs can be protected
  const inputType = isNumberType ? "number" : visible ? "password" : "text";

  return (
    <div className="flex flex-1 items-center justify-start gap-1 w-2/3">
      <Input
        type={inputType}
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        disabled={!editable}
      />
      {!editable && !isNumberType && (
        <Button
          variant="ghost"
          className="h-8 w-8 text-secondary flex-shrink-0"
          onClick={() => setVisible(!visible)}
        >
          {visible ? <IoMdEye /> : <IoMdEyeOff />}
        </Button>
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
            handleCancel();
            toggleEditable();
          }}
        >
          <IoClose />
        </Button>
      )}
    </div>
  );
};

export default SettingInput;
