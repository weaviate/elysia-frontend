"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SettingDropdownProps {
  value: string;
  values: string[];
  onChange: (value: string) => void;
  onSave: () => void;
}

const SettingDropdown: React.FC<SettingDropdownProps> = ({
  value,
  values,
  onChange,
  onSave,
}) => {
  return (
    <div className="flex flex-1 items-center justify-start gap-1 w-2/3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{value}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {values.map((v) => (
            <DropdownMenuItem key={v} onClick={() => onChange(v)}>
              {v}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SettingDropdown;
