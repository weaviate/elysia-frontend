"use client";

import React, { useEffect, useState } from "react";

import { IoText } from "react-icons/io5";
import { PiListNumbers } from "react-icons/pi";
import { PiIdentificationBadge } from "react-icons/pi";
import DataCell from "./DataCell";
import { Button } from "@/components/ui/button";
import { FaBoxArchive } from "react-icons/fa6";
import { IoMdCloseCircleOutline } from "react-icons/io";

interface DataTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { [key: string]: any }[] | null;
  header: { [key: string]: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSortOn?: (sort_on: string) => void;
  ascending?: boolean;
  sortOn?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  header,
  setSortOn,
  ascending,
  sortOn,
}) => {
  if (!data) return null;

  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  useEffect(() => {
    setSelectedRow(null);
  }, [data, header]);

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-auto">
      {/* Scrollable wrapper */}
      <div className="overflow-x-auto w-full max-w-full">
        {selectedRow === null ? (
          <table className="table-auto w-full whitespace-nowrap">
            <thead>
              <tr className="text-left text-secondary text-sm">
                <th className="p-2">#</th>
                {Object.keys(header).map((key) => (
                  <th
                    key={key}
                    className="cursor-pointer p-2 items-center gap-2 min-w-[150px]"
                    onClick={() =>
                      setSortOn && header[key] != "uuid" && setSortOn(key)
                    }
                  >
                    <div className="flex flex-row items-center gap-2 text-secondary ">
                      {header[key] === "text" || header[key] === "text[]" ? (
                        <IoText className="w-4 h-4" />
                      ) : header[key] === "number" ? (
                        <PiListNumbers className="w-4 h-4" />
                      ) : header[key] === "uuid" ? (
                        <PiIdentificationBadge className="w-4 h-4" />
                      ) : header[key] === "object" ||
                        header[key] === "object[]" ? (
                        <FaBoxArchive className="w-4 h-4" />
                      ) : null}
                      <p className="text-sm text-primary">{key}</p>
                      {sortOn === key && <span>{ascending ? "↑" : "↓"}</span>}
                    </div>
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
                  <td className="px-2 py-2 text-sm text-secondary">
                    {rowIndex + 1}
                  </td>
                  {Object.keys(header).map((key, colIndex) => (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => setSelectedRow(rowIndex)}
                      className="truncate px-2 py-2 text-sm text-primary cursor-pointer max-w-[250px]"
                    >
                      {item[key] !== undefined
                        ? typeof item[key] === "object"
                          ? JSON.stringify(item[key], null, 0)
                          : item[key]
                        : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex w-full justify-end items-center">
              <Button
                variant="default"
                className="h-8 w-8"
                onClick={() => setSelectedRow(null)}
              >
                <IoMdCloseCircleOutline />
              </Button>
            </div>
            <DataCell selectedCell={data[selectedRow]} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
