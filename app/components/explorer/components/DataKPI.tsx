"use client";

import React from "react";
import { FaCircle } from "react-icons/fa";

interface DataKPIProps {
  loading: boolean;
  value: number;
  label: string;
  icon: React.ReactNode;
  color: "highlight" | "accent" | "muted";
  lines: boolean;
}

const DataKPI: React.FC<DataKPIProps> = ({
  loading,
  value,
  label,
  icon,
  color,
  lines,
}) => {
  const bgColorClass = {
    highlight: "bg-highlight",
    accent: "bg-accent",
    muted: "bg-foreground_alt",
  };
  const textColorClass = {
    highlight: "text-highlight",
    accent: "text-accent",
    muted: "text-foreground_alt",
  };

  return (
    <div
      className={`flex flex-row items-center justify-start flex-1 border-foreground ${lines ? "border border-dashed" : "border"} p-2 rounded-md gap-3`}
    >
      <div
        className={`flex items-center justify-center p-2 ${bgColorClass[color]} text-primary rounded-lg`}
      >
        {icon}
      </div>
      <div className="flex flex-col items-start justify-start">
        {loading ? (
          <FaCircle className="text-secondary pulsing" />
        ) : (
          <p className={`${textColorClass[color]} text-2xl font-bold`}>
            {value}
          </p>
        )}
        <p className="text-secondary text-xs">{label}</p>
      </div>
    </div>
  );
};

export default DataKPI;
