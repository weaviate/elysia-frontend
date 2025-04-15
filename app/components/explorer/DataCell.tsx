"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

interface DataCellProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  selectedCell: { [key: string]: any } | null;
}

const DataCell: React.FC<DataCellProps> = ({ selectedCell }) => {
  if (!selectedCell) return null;

  return (
    <div className="items-start justify-start gap-5 overflow-scroll w-full flex flex-col p-4 rounded-lg fade-in bg-background_alt">
      <div className="flex flex-col gap-2 w-full">
        {Object.keys(selectedCell).map((key) => (
          <div
            className="flex flex-col flex-grow gap-1 border-b border-secondary overflow-scroll p-5 text-wrap break-words max-h-[40vh] min-w-[48%] max-w-[100%]"
            key={key}
          >
            <p className="text-secondary text-xs font-light">{key}</p>
            <div className="text-base text-primary whitespace-pre-wrap">
              <ReactMarkdown>{String(selectedCell[key])}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataCell;
