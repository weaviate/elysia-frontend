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
    <Table>
      <TableHeader>
        {header.map((key) => (
          <TableHead
            className="cursor-pointer hover:bg-foreground_alt hover:text-primary"
            onClick={() => setSortOn && setSortOn(key)}
            key={key}
          >
            {key === sortOn && ascending && <span>↑ </span>}
            {key === sortOn && !ascending && <span>↓ </span>}
            {key}
          </TableHead>
        ))}
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow
            key={index}
            className={`cursor-pointer ${
              index % 2 === 1 ? "bg-background_alt" : ""
            }`}
          >
            {header.map((key) => (
              <TableCell
                key={key}
                className="lg:max-w-[150px] max-w-[100px] truncate whitespace-nowrap"
                onClick={() => setSelectedCell(item)}
              >
                {item[key] !== undefined ? item[key] : ""}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
