"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AllCommunityModule,
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
  Theme,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface ReportDataGridProps {
  columns: string[];
  data: Record<string, unknown>[];
  loading?: boolean;
  onGridReady?: (event: GridReadyEvent) => void;
}

const hslVar = (name: string): string | undefined => {
  if (typeof window === "undefined") return undefined;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v ? `hsl(${v})` : undefined;
};

const buildTheme = (isDark: boolean): Theme => {
  const accent = hslVar("--accent") ?? "#2a5d8f";
  const background = hslVar("--background") ?? (isDark ? "#0b0d10" : "#ffffff");
  const foreground = hslVar("--primary") ?? (isDark ? "#e6eaf0" : "#1f242c");
  const headerBg = hslVar("--background_alt") ?? (isDark ? "#11151a" : "#f1f4f8");

  return themeQuartz.withParams({
    backgroundColor: background,
    foregroundColor: foreground,
    accentColor: accent,
    headerBackgroundColor: headerBg,
    headerTextColor: foreground,
    headerFontWeight: 600,
    borderColor: { ref: "foregroundColor", mix: 0.15 },
    rowBorder: { style: "solid", width: 1, color: { ref: "borderColor" } },
    oddRowBackgroundColor: { ref: "foregroundColor", mix: 0.03 },
    rowHoverColor: { ref: "accentColor", mix: 0.08 },
    selectedRowBackgroundColor: { ref: "accentColor", mix: 0.18 },
    fontFamily: "var(--font-text), system-ui, sans-serif",
    fontSize: 13,
    headerFontSize: 13,
    spacing: 6,
    borderRadius: 8,
    wrapperBorder: false,
    browserColorScheme: isDark ? "dark" : "light",
  });
};

export default function ReportDataGrid({
  columns,
  data,
  loading,
  onGridReady,
}: ReportDataGridProps) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const html = document.documentElement;
    const update = () => setIsDark(html.classList.contains("dark"));
    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const theme = useMemo(() => buildTheme(isDark), [isDark]);

  const colDefs = useMemo<ColDef[]>(
    () =>
      columns.map((c) => ({
        field: c,
        headerName: c,
        sortable: true,
        filter: true,
        resizable: true,
        minWidth: 120,
      })),
    [columns]
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 120,
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        minHeight: "320px",
        width: "100%",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <AgGridReact
          theme={theme}
          rowData={data}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          loading={loading}
          pagination
          paginationPageSize={50}
          paginationPageSizeSelector={[25, 50, 100, 200]}
          animateRows
          suppressCellFocus
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}
