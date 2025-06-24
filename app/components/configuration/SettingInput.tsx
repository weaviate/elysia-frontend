"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

interface SettingInputProps {
  isProtected: boolean;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const SettingInput: React.FC<SettingInputProps> = ({
  isProtected,
  value,
  onChange,
  onSave,
  onCancel,
}) => {
  const [visible, setVisible] = useState(isProtected);
  const [editable, setEditable] = useState(false);

  const toggleEditable = () => {
    if (editable) {
      onSave();
      setEditable(false);
      if (isProtected) {
        setVisible(true);
      }
    } else {
      setEditable(true);
      setVisible(false);
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
      {!editable && (
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
            onCancel();
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
