"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import React from "react";
import { IoAdd } from "react-icons/io5";

export const SettingCard: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex flex-col gap-6 border border-foreground rounded-md p-4">
      {children}
    </div>
  );
};

export const SettingHeader: React.FC<{
  className?: string;
  icon: React.ReactNode;
  header: string;
  onClick?: () => void;
  buttonIcon?: React.ReactNode;
  buttonText?: string;
}> = ({ className, icon, header, onClick, buttonIcon, buttonText }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center w-full justify-between gap-3">
      <div className="flex items-center gap-2">
        <div
          className={`h-7 w-7 ${className} rounded-md flex items-center justify-center`}
        >
          {icon}
        </div>
        <p className="text-primary text-lg">{header}</p>
      </div>
      {onClick && (
        <div className="flex items-center justify-end w-full sm:w-auto">
          <Button
            variant="default"
            onClick={onClick}
            className="flex items-center gap-2 w-full sm:w-[10rem]"
          >
            {buttonIcon || <IoAdd />}
            {buttonText && (
              <span className="text-sm font-base">{buttonText}</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export const SettingGroup: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div className="flex flex-col gap-4">{children}</div>;
};

export const SettingItem: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      {children}
    </div>
  );
};

interface SettingTitleProps {
  title: string;
  description: string;
}

export const SettingTitle: React.FC<SettingTitleProps> = ({
  title,
  description,
}) => {
  return (
    <div className="flex flex-col w-full sm:w-1/3 sm:flex-0">
      <div className="flex items-center justify-start gap-2">
        <p className="text-primary font-bold">{title}</p>
      </div>
      <p className="text-sm text-secondary">{description}</p>
    </div>
  );
};

//switch button
export const SettingSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ checked, onChange }) => {
  return <Checkbox checked={checked} onCheckedChange={onChange} className="data-[state=checked]:bg-accent data-[state=checked]:text-primary" />;
};

