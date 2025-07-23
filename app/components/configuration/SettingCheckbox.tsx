"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface SettingCheckboxProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const SettingCheckbox: React.FC<SettingCheckboxProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-1 items-center justify-start gap-1 w-2/3">
      <Checkbox checked={value} onCheckedChange={onChange} />
    </div>
  );
};

export default SettingCheckbox;
