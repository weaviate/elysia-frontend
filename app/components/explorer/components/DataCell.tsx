"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CopyIcon,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataCellProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  selectedCell: { [key: string]: any } | null;
  onClose?: () => void;
}

type DataType =
  | "text"
  | "number"
  | "json"
  | "array"
  | "boolean"
  | "null"
  | "undefined";

const DataCell: React.FC<DataCellProps> = ({ selectedCell, onClose }) => {
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});

  if (!selectedCell) return null;

  const detectDataType = (value: any): DataType => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number") return "number";
    if (typeof value === "string") {
      // Check if string represents a JSON object or array
      const trimmed = value.trim();
      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
      ) {
        try {
          const parsed = JSON.parse(trimmed);
          return Array.isArray(parsed) ? "array" : "json";
        } catch {
          return "text";
        }
      }
      return "text";
    }
    if (Array.isArray(value)) return "array";
    if (typeof value === "object") return "json";
    return "text";
  };

  const getTypeColor = (type: DataType) => {
    switch (type) {
      case "number":
        return "text-highlight bg-highlight/10 border-highlight/20";
      case "text":
        return "text-accent bg-accent/10 border-accent/20";
      case "json":
        return "text-alt_color_b bg-alt_color_b/10 border-alt_color_b/20";
      case "array":
        return "text-alt_color_a bg-alt_color_a/10 border-alt_color_a/20";
      case "boolean":
        return "text-primary bg-primary/10 border-primary/20";
      case "null":
      case "undefined":
        return "text-secondary bg-secondary/10 border-secondary/20";
      default:
        return "text-secondary bg-secondary/10 border-secondary/20";
    }
  };

  const formatValue = (value: any, type: DataType): string => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (type === "json" || type === "array") {
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          return JSON.stringify(parsed, null, 2);
        } catch {
          return value;
        }
      }
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const toggleFieldExpansion = (key: string) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedFields(newExpanded);
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ ...copyStatus, [key]: true });
      setTimeout(() => {
        setCopyStatus({ ...copyStatus, [key]: false });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const renderContent = (value: any, type: DataType, key: string) => {
    const formattedValue = formatValue(value, type);
    const isLongContent = formattedValue.length > 200;
    const isExpanded = expandedFields.has(key);

    if (type === "json" || type === "array") {
      return (
        <Collapsible
          open={isExpanded}
          onOpenChange={() => toggleFieldExpansion(key)}
        >
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto font-normal"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 mr-1" />
                )}
                <span className="text-secondary text-sm">
                  {type === "array"
                    ? `Array (${Array.isArray(value) ? value.length : "items"})`
                    : "Object"}
                </span>
              </Button>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(formattedValue, key)}
              className="h-6 w-6 p-0"
            >
              {copyStatus[key] ? (
                <span className="text-green-500 text-xs">✓</span>
              ) : (
                <CopyIcon className="w-3 h-3" />
              )}
            </Button>
          </div>
          <CollapsibleContent>
            <pre className="bg-background_alt border border-border rounded-md p-3 mt-2 text-sm overflow-x-auto whitespace-pre-wrap break-words max-h-[300px] overflow-y-auto">
              {formattedValue}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    if (isLongContent) {
      return (
        <Collapsible
          open={isExpanded}
          onOpenChange={() => toggleFieldExpansion(key)}
        >
          <div className="flex items-center justify-between mb-2">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto font-normal"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 mr-1" />
                )}
                <span className="text-secondary text-sm">
                  {isExpanded
                    ? "Show less"
                    : `Show more (${formattedValue.length} chars)`}
                </span>
              </Button>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(formattedValue, key)}
              className="h-6 w-6 p-0"
            >
              {copyStatus[key] ? (
                <span className="text-green-500 text-xs">✓</span>
              ) : (
                <CopyIcon className="w-3 h-3" />
              )}
            </Button>
          </div>

          {!isExpanded && (
            <div className="text-primary whitespace-pre-wrap break-words line-clamp-3">
              <ReactMarkdown>
                {formattedValue.slice(0, 200) + "..."}
              </ReactMarkdown>
            </div>
          )}

          <CollapsibleContent>
            <div className="text-primary whitespace-pre-wrap break-words">
              <ReactMarkdown>{formattedValue}</ReactMarkdown>
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <div className="flex items-start justify-between gap-2">
        <div className="text-primary whitespace-pre-wrap break-words flex-1">
          <ReactMarkdown>{formattedValue}</ReactMarkdown>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(formattedValue, key)}
          className="h-6 w-6 p-0 flex-shrink-0"
        >
          {copyStatus[key] ? (
            <span className="text-green-500 text-xs">✓</span>
          ) : (
            <CopyIcon className="w-3 h-3" />
          )}
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full fade-in">
      <div className="sticky top-0 z-20 bg-background flex items-center justify-between py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">Data Details</h3>
          <Badge
            variant="default"
            className="bg-background_alt border border-border"
          >
            {Object.keys(selectedCell).length} fields
          </Badge>
        </div>
        {onClose && (
          <Button
            className="h-8 bg-error/10 hover:bg-error/20 text-error border-error border rounded-md flex items-center gap-2 px-3 whitespace-nowrap"
            onClick={onClose}
          >
            <XIcon className="w-4 h-4 flex-shrink-0" />
            <span className="text-error text-xs">Close</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {Object.entries(selectedCell).map(([key, value]) => {
          const dataType = detectDataType(value);

          return (
            <Card key={key} className="border border-border bg-background_alt">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span
                    className="font-medium text-primary truncate"
                    title={key}
                  >
                    {key}
                  </span>
                  <Badge
                    variant="default"
                    className={cn("text-xs border", getTypeColor(dataType))}
                  >
                    {dataType}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                {renderContent(value, dataType, key)}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DataCell;
