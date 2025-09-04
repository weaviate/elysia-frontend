"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import React from "react";
import { IoAdd } from "react-icons/io5";
import { motion } from "framer-motion";

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
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onChange}
      className="data-[state=checked]:bg-accent data-[state=checked]:text-primary"
    />
  );
};

// Enhanced Toggle Button with Animation
export const SettingToggle: React.FC<{
  onChange: (value: string) => void;
  value: string;
  labelA: string;
  labelB: string;
  iconA?: React.ReactNode;
  iconB?: React.ReactNode;
  disabled?: boolean;
}> = ({ onChange, value, labelA, labelB, iconA, iconB, disabled = false }) => {
  return (
    <div className="flex flex-1 items-center justify-start">
      <motion.div
        className={`relative flex items-center rounded-lg border-2 p-1 transition-all duration-300 ${
          disabled
            ? "border-muted bg-muted/20 cursor-not-allowed"
            : "border-foreground bg-background cursor-pointer hover:shadow-md"
        }`}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
      >
        {/* Background slider */}
        <motion.div
          className={`absolute top-1 bottom-1 rounded-md transition-all duration-300`}
          animate={{
            left: value ? "4px" : "50%",
            right: value ? "50%" : "4px",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        {/* Option A */}
        <motion.button
          type="button"
          className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
            value === labelA
              ? disabled
                ? "text-muted-foreground bg-muted/10 border border-muted"
                : "text-highlight bg-highlight/10 border border-highlight"
              : disabled
                ? "text-muted-foreground"
                : "text-secondary hover:text-highlight"
          }`}
          onClick={() => !disabled && onChange(labelA)}
          disabled={disabled}
          whileHover={!disabled && value === labelA ? { scale: 1.05 } : {}}
        >
          {iconA && (
            <motion.div
              animate={{
                rotate: value === labelA ? 0 : 180,
                scale: value === labelA ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
            >
              {iconA}
            </motion.div>
          )}
          <span>{labelA}</span>
        </motion.button>

        {/* Option B */}
        <motion.button
          type="button"
          className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
            value === labelB
              ? disabled
                ? "text-muted-foreground bg-muted/10 border border-muted"
                : "text-highlight bg-highlight/10 border border-highlight"
              : disabled
                ? "text-muted-foreground"
                : "text-secondary hover:text-highlight"
          }`}
          onClick={() => !disabled && onChange(labelB)}
          disabled={disabled}
          whileHover={!disabled && value === labelB ? { scale: 1.05 } : {}}
        >
          {iconB && (
            <motion.div
              animate={{
                rotate: value === labelB ? 0 : 180,
                scale: value === labelB ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
            >
              {iconB}
            </motion.div>
          )}
          <span>{labelB}</span>
        </motion.button>
      </motion.div>
    </div>
  );
};
