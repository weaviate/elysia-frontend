"use client";

import React, { useEffect, useState } from "react";
import { AggregationPayload } from "@/app/types/displays";
import DataTable from "@/app/components/explorer/DataTable";

interface AggregationDisplayProps {
  aggregation: AggregationPayload[];
}

interface TableData {
  header: { [key: string]: string };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  data: { [key: string]: any }[];
}

interface TableDataPerField {
  [key: string]: TableData;
}

interface CollectionData {
  [collectionName: string]: TableDataPerField;
}

const AggregationDisplay: React.FC<AggregationDisplayProps> = ({
  aggregation,
}) => {
  const [collectionData, setCollectionData] = useState<CollectionData>({});

  const createTableDataPerCollection = (aggregation: AggregationPayload[]) => {
    const collectionData: CollectionData = {};

    for (const payload of aggregation) {
      for (const _collection of payload.collections) {
        for (const [collectionName, collection] of Object.entries(
          _collection
        )) {
          // Initialize collection data if it doesn't exist
          if (!collectionData[collectionName]) {
            collectionData[collectionName] = {};
          }

          for (const [fieldName, field] of Object.entries(collection)) {
            // Initialize table data for this field if it doesn't exist
            if (!collectionData[collectionName][fieldName]) {
              collectionData[collectionName][fieldName] = {
                header: {},
                data: [],
              };
            }

            // Create a map to store rows by field value to avoid duplicates
            const rowMap = new Map();

            // Process each aggregation value
            for (const aggValue of field.values) {
              const fieldValue = aggValue.field || "null";

              // Get or create row for this field value
              if (!rowMap.has(fieldValue)) {
                rowMap.set(fieldValue, {
                  [fieldName]: fieldValue,
                });
              }

              const row = rowMap.get(fieldValue);

              // Add the aggregation value
              row[aggValue.aggregation] = aggValue.value;

              // Add aggregation column to header
              if (
                !collectionData[collectionName][fieldName].header[
                  aggValue.aggregation
                ]
              ) {
                collectionData[collectionName][fieldName].header[
                  aggValue.aggregation
                ] = "number";
              }

              // Process groups if they exist for this field value
              if (
                field.groups &&
                aggValue.field &&
                field.groups[aggValue.field]
              ) {
                const groupData = field.groups[aggValue.field];

                for (const [groupFieldName, groupField] of Object.entries(
                  groupData
                )) {
                  for (const groupValue of groupField.values) {
                    const columnName = `${groupFieldName}_${groupValue.aggregation}`;
                    row[columnName] = groupValue.value;

                    // Add group column to header
                    if (
                      !collectionData[collectionName][fieldName].header[
                        columnName
                      ]
                    ) {
                      collectionData[collectionName][fieldName].header[
                        columnName
                      ] = groupField.type;
                    }
                  }
                }
              }
            }

            // Add field name column to header
            if (!collectionData[collectionName][fieldName].header[fieldName]) {
              collectionData[collectionName][fieldName].header[fieldName] =
                field.type;
            }

            // Convert map values to array and add to data
            collectionData[collectionName][fieldName].data = Array.from(
              rowMap.values()
            );
          }
        }
      }
    }

    return collectionData;
  };

  useEffect(() => {
    const tableData = createTableDataPerCollection(aggregation);
    console.log("collectionData", tableData);
    setCollectionData(tableData);
  }, [aggregation]);

  return (
    <div className="w-full flex flex-col justify-start items-start gap-6">
      {Object.entries(collectionData).map(([collectionName, fields]) => (
        <div key={collectionName} className="w-full flex flex-col gap-4">
          {/* Tables for each field in this collection */}
          <div className="w-full flex flex-col gap-2">
            {Object.entries(fields).map(([fieldName, tableData], index) => (
              <div
                key={`${collectionName}-${fieldName}-${index}`}
                className="w-full"
              >
                {/* Field subheading */}
                <div className="mb-2">
                  <h4 className="text-sm font-medium text-secondary">
                    {fieldName}
                  </h4>
                </div>

                {/* Data table */}
                <div className="w-full max-h-[30vh] overflow-y-auto rounded-md">
                  {tableData.data.length > 0 ? (
                    <DataTable
                      key={`${collectionName}-${fieldName}`}
                      header={tableData.header}
                      data={tableData.data}
                    />
                  ) : (
                    <div className="p-4 text-secondary">
                      No data available for {fieldName}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AggregationDisplay;
