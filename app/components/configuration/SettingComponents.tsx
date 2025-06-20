"use client";

import React from "react";

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
}> = ({ className, icon, header }) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-7 w-7 ${className} rounded-md flex items-center justify-center`}
      >
        {icon}
      </div>
      <p className="text-primary text-lg">{header}</p>
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
  return <div className="flex items-center gap-4">{children}</div>;
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
    <div className="flex flex-col flex-0 w-1/3">
      <div className="flex items-center justify-start gap-2">
        <p className="text-primary font-bold">{title}</p>
      </div>
      <p className="text-sm text-secondary">{description}</p>
    </div>
  );
};
