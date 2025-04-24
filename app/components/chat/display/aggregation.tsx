"use client";

import React, { useEffect, useState } from "react";
import { AggregationPayload } from "@/app/components/types";
import DataTable from "@/app/components/explorer/DataTable";

interface AggregationDisplayProps {
  aggregation: AggregationPayload[];
}

interface TableData {
  header: string[];
  /* eslint-disable @typescript-eslint/no-explicit-any */
  data: { [key: string]: any }[];
}

interface TableDataPerField {
  [key: string]: TableData;
}

const AggregationDisplay: React.FC<AggregationDisplayProps> = ({
  aggregation,
}) => {
  const [tableDataPerField, setTableDataPerField] = useState<TableDataPerField>(
    {}
  );

  const createTableDataPerField = (aggregation: AggregationPayload[]) => {
    const tableData: TableDataPerField = {};

    for (const payload of aggregation) {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      for (const [collectionName, collection] of Object.entries(payload)) {
        for (const [fieldName, field] of Object.entries(collection)) {
          if (!tableData[fieldName]) {
            // Initialize table data for this field
            tableData[fieldName] = {
              header: [fieldName], // Start with 'Value' column
              data: [],
            };
          }

          // Process each value
          for (const aggValue of field.values) {
            const row = {
              [fieldName]: aggValue.field,
              [aggValue.aggregation]: aggValue.value,
            };

            // Add group data if available
            if (field.groups && aggValue.field) {
              const groupData = field.groups[aggValue.field];
              if (groupData) {
                // Add each field from the group
                for (const [groupFieldName, groupField] of Object.entries(
                  groupData
                )) {
                  for (const groupValue of groupField.values) {
                    row[`${groupFieldName}_${groupValue.aggregation}`] =
                      groupValue.value;

                    // Add column header if it doesn't exist
                    const columnName = `${groupFieldName}_${groupValue.aggregation}`;
                    if (!tableData[fieldName].header.includes(columnName)) {
                      tableData[fieldName].header.push(columnName);
                    }
                  }
                }
              }
            }

            tableData[fieldName].data.push(row);

            // Add aggregation column if it doesn't exist
            const columnName = aggValue.aggregation;
            if (!tableData[fieldName].header.includes(columnName)) {
              tableData[fieldName].header.push(columnName);
            }
          }
        }
      }
    }

    return tableData;
  };

  useEffect(() => {
    const tableData = createTableDataPerField(aggregation);
    setTableDataPerField(tableData);
  }, [aggregation]);

  return (
    <div className="w-full flex flex-col justify-start items-start gap-2">
      {Object.entries(tableDataPerField).map(
        ([fieldName, tableData], index) => (
          <div
            key={`${fieldName}-${index}`}
            className="w-full max-h-[30vh] overflow-y-auto"
          >
            <DataTable
              key={fieldName}
              header={tableData.header}
              data={tableData.data}
              setSelectedCell={() => {}}
            />
          </div>
        )
      )}
    </div>
  );
};

export default AggregationDisplay;
