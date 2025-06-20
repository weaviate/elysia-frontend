"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";

interface SettingInputProps {
  isProtected: boolean;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

const SettingInput: React.FC<SettingInputProps> = ({
  isProtected,
  value,
  onChange,
  onSave,
}) => {
  const [visible, setVisible] = useState(isProtected);
  const [editable, setEditable] = useState(false);

  const toggleEditable = () => {
    if (editable) {
      onSave();
      setEditable(false);
    } else {
      setEditable(true);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-start gap-1 w-2/3">
      <Input
        type={visible ? "password" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!editable}
      />
      <Button
        variant="ghost"
        className="h-8 w-8 text-secondary flex-shrink-0"
        onClick={() => setVisible(!visible)}
      >
        {visible ? <IoMdEye /> : <IoMdEyeOff />}
      </Button>
      <Button
        variant={editable ? "destructive" : "ghost"}
        className={`h-8 w-8 ${editable ? "text-primary" : "text-secondary"} flex-shrink-0`}
        onClick={() => toggleEditable()}
      >
        {editable ? <IoClose /> : <MdEdit />}
      </Button>
    </div>
  );
};

export default SettingInput;
