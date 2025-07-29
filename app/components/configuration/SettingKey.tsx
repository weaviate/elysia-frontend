"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

interface SettingInputProps {
  isProtected: boolean;
  startEditable: boolean;
  title: string;
  value: string;
  onChange: (key: string, newKey: string, value: string) => void;
  onRemove: () => void;
}

const SettingKey: React.FC<SettingInputProps> = ({
  isProtected,
  startEditable,
  title,
  value,
  onChange,
  onRemove,
}) => {
  const [visible, setVisible] = useState(isProtected && !startEditable);
  const [editable, setEditable] = useState(startEditable);

  const toggleEditable = () => {
    if (editable) {
      setEditable(false);
      if (isProtected) {
        setVisible(true);
      }
      onChange(title, currentKey, currentValue);
    } else {
      setEditable(true);
      setVisible(false);
    }
  };

  const [currentKey, setCurrentKey] = useState(title);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentKey(title);
    setCurrentValue(value);
  }, [title, value]);

  const handleCancel = () => {
    setCurrentKey(title);
    setCurrentValue(value);
    setEditable(false);
    if (isProtected) {
      setVisible(true);
    }
  };

  return (
    <div className="flex flex-row items-center gap-2 w-full">
      {/* Key Name Input */}
      <div className="w-1/3">
        <Input
          type="text"
          value={currentKey}
          onChange={(e) => setCurrentKey(e.target.value)}
          disabled={!editable}
          placeholder="Key name"
        />
      </div>

      {/* Value Input + Buttons */}
      <div className="flex flex-1 items-center gap-1">
        <Input
          type={visible ? "password" : "text"}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          disabled={!editable}
          placeholder="Key value"
          className="flex-1"
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
          <>
            <Button
              variant="destructive"
              className="h-8 w-8 text-primary flex-shrink-0"
              onClick={handleCancel}
            >
              <IoClose />
            </Button>
            <Button
              variant="destructive"
              className="h-8 w-8 text-primary flex-shrink-0"
              onClick={onRemove}
            >
              <FaRegTrashAlt />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingKey;
