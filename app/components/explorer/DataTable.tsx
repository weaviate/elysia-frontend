"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { [key: string]: any }[] | null;
  header: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedCell: (cell: { [key: string]: any }) => void;
  setSortOn?: (sort_on: string) => void;
  ascending?: boolean;
  sortOn?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  header,
  setSelectedCell,
  setSortOn,
  ascending,
  sortOn,
}) => {
  if (!data) return null;

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-auto">
      {/* Scrollable wrapper */}
      <div className="overflow-x-auto w-full max-w-full">
        <table className="table-auto w-full whitespace-nowrap">
          <thead>
            <tr className="text-left text-secondary text-sm">
              {header.map((key) => (
                <th
                  key={key}
                  className="cursor-pointer p-2"
                  onClick={() => setSortOn && setSortOn(key)}
                >
                  {key}
                  {sortOn === key && (
                    <span className="ml-1">{ascending ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-foreground_alt ${
                  rowIndex % 2 === 1 ? "bg-background_alt" : ""
                }`}
              >
                {header.map((key, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => setSelectedCell(item)}
                    className="truncate px-2 py-2 text-sm text-foreground cursor-pointer max-w-[200px]"
                  >
                    {item[key] !== undefined ? item[key] : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
