import React from "react";
import { BsDatabase } from "react-icons/bs";
import {
  FaHashtag,
  FaFont,
  FaCalendarAlt,
  FaCheck,
  FaDatabase,
  FaList,
} from "react-icons/fa";
import { MetadataField } from "@/app/types/objects";

interface MetadataFieldsDisplayProps {
  fields: { [key: string]: MetadataField };
}

const MetadataFieldsDisplay: React.FC<MetadataFieldsDisplayProps> = ({
  fields,
}) => {
  const formatNumber = (num: number): string => {
    if (num === 0) return "0";
    if (Math.abs(num) >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (Math.abs(num) >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toFixed(2);
  };

  const getFieldTypeIcon = (type: string) => {
    const iconClass = "w-4 h-4";
    switch (type.toLowerCase()) {
      case "number":
        return <FaHashtag className={iconClass} />;
      case "text":
      case "string":
        return <FaFont className={iconClass} />;
      case "text[]":
      case "string[]":
        return <FaList className={iconClass} />;
      case "date":
      case "datetime":
        return <FaCalendarAlt className={iconClass} />;
      case "boolean":
        return <FaCheck className={iconClass} />;
      default:
        return <FaDatabase className={iconClass} />;
    }
  };

  const getFieldTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "number":
        return "text-accent bg-accent/10 border-accent/20";
      case "text":
      case "string":
        return "text-primary bg-primary/10 border-primary/20";
      case "text[]":
      case "string[]":
        return "text-highlight bg-highlight/10 border-highlight/20";
      case "date":
      case "datetime":
        return "text-secondary bg-secondary/10 border-secondary/20";
      case "boolean":
        return "text-foreground bg-foreground/10 border-foreground/20";
      default:
        return "text-primary bg-foreground/10 border-foreground/20";
    }
  };

  return (
    <div className="flex flex-col gap-2 border border-foreground p-4 rounded-md">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-highlight/10 border border-highlight rounded-md p-1">
            <BsDatabase className="text-highlight" />
          </div>
          <p className="font-bold text-sm sm:text-base">Field Metadata</p>
          <div className="bg-secondary/10 border border-secondary/20 rounded-full px-2 py-1">
            <p className="text-xs text-secondary font-medium">
              {Object.keys(fields).length} fields
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {Object.entries(fields).map(([fieldKey, field]) => (
          <div
            key={fieldKey}
            className="flex flex-col gap-3 p-4 bg-background_alt rounded-lg border border-border shadow-sm"
          >
            {/* Field Header */}
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className={`p-2 rounded-md ${getFieldTypeColor(field.type).split(" ").slice(1).join(" ")}`}
                >
                  <div className={getFieldTypeColor(field.type).split(" ")[0]}>
                    {getFieldTypeIcon(field.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <p
                      className="font-bold text-primary truncate text-sm sm:text-base"
                      title={field.name}
                    >
                      {field.name}
                    </p>
                    <div
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getFieldTypeColor(field.type)} w-fit`}
                    >
                      {field.type}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Field Description */}
            {field.description && (
              <div className="text-sm text-secondary border-l-2 border-border pl-3">
                {field.description}
              </div>
            )}

            {/* Field Statistics */}
            <div className="flex flex-col gap-2 text-sm">
              {field.type === "number" && (
                <>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                    <span className="text-secondary text-xs sm:text-sm">
                      Range:
                    </span>
                    <span className="font-medium text-sm">
                      {formatNumber(field.range[0])} -{" "}
                      {formatNumber(field.range[1])}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                    <span className="text-secondary text-xs sm:text-sm">
                      Mean:
                    </span>
                    <span className="font-medium text-sm">
                      {formatNumber(field.mean)}
                    </span>
                  </div>
                </>
              )}

              {(field.type === "date" || field.type === "datetime") &&
                field.date_range && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary text-xs sm:text-sm">
                        Date Range:
                      </span>
                    </div>
                    <div className="text-xs bg-background rounded p-2">
                      <div>From: {field.date_range[0] || "N/A"}</div>
                      <div>To: {field.date_range[1] || "N/A"}</div>
                    </div>
                    {field.date_mean && (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-secondary text-xs sm:text-sm">
                          Mean Date:
                        </span>
                        <span className="font-medium text-xs">
                          {field.date_mean}
                        </span>
                      </div>
                    )}
                  </>
                )}

              {field.groups && field.groups.length > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                    <span className="text-secondary text-xs sm:text-sm">
                      Unique Values:
                    </span>
                    <span className="font-medium text-sm">
                      {field.groups.length}
                    </span>
                  </div>
                  <div className="max-h-24 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {field.groups.slice(0, 8).map((group, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 bg-background rounded text-xs border border-border"
                          title={group}
                        >
                          {group.length > 10
                            ? `${group.slice(0, 10)}...`
                            : group}
                        </span>
                      ))}
                      {field.groups.length > 8 && (
                        <span className="inline-flex px-2 py-1 bg-highlight/10 border border-highlight/20 rounded text-xs text-highlight">
                          +{field.groups.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetadataFieldsDisplay;
