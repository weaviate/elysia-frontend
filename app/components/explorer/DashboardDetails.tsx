"use client";

import React from "react";
import { MetadataPayload } from "../types";
import { Badge } from "@/components/ui/badge";

interface DashboardDetailsProps {
  metadata: MetadataPayload;
  selectedMetadata: string;
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardDetails: React.FC<DashboardDetailsProps> = ({
  metadata,
  selectedMetadata,
}) => {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="fields">Fields</TabsTrigger>
      </TabsList>
      <TabsContent value="summary">
        <div className="flex flex-col gap-2 rounded-md bg-background_alt p-3">
          <p className="text-primary text-md">
            {metadata.metadata[selectedMetadata].summary}
          </p>
          <div className="flex flex-row gap-2 justify-start items-center">
            {metadata.metadata[selectedMetadata].mappings &&
              Object.keys(metadata.metadata[selectedMetadata].mappings).map(
                (mapping) => (
                  <Badge key={mapping} variant="outline">
                    {mapping}
                  </Badge>
                )
              )}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="fields">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.keys(metadata.metadata[selectedMetadata].fields).map(
            (field) => (
              <div
                key={field}
                className="flex flex-col gap-1 p-3 rounded-md bg-background_alt"
              >
                <div className="flex gap-2 items-center justify-start">
                  <p className="text-primary text-sm font-bold">{field}</p>
                  <p className="text-secondary text-xs">
                    {metadata.metadata[selectedMetadata].fields[field].type}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {metadata.metadata[selectedMetadata].fields[
                    field
                  ].groups?.map((group, index) => (
                    <p key={index} className="text-secondary text-sm">
                      {group}
                    </p>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardDetails;
