"use client";

import React, { useEffect, useState } from "react";

import { Separator } from "@/components/ui/separator";

import { getMappingTypes } from "@/app/api/getMappingTypes";
import { UseCollectionMetadataEditorReturn } from "./hooks/useCollectionMetadataEditor";
import MetadataSummaryEditor from "./components/MetadataSummaryEditor";
import MetadataMappingsEditor from "./components/MetadataMappingsEditor";
import { MappingTypesPayload, MetadataPayload } from "@/app/types/payloads";

interface DataMetadataProps {
  collectionMetadata: MetadataPayload | null;
  metadataEditor: UseCollectionMetadataEditorReturn;
  metadataRows: {
    properties: { [key: string]: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: { [key: string]: any }[];
  };
}

const DataMetadata: React.FC<DataMetadataProps> = ({
  collectionMetadata,
  metadataRows,
  metadataEditor,
}) => {
  const [mappingTypes, setMappingTypes] = useState<
    Record<string, Record<string, string>>
  >({});
  const [mappingTypeDescriptions, setMappingTypeDescriptions] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    // Fetch mapping types on mount
    getMappingTypes().then((res: MappingTypesPayload) => {
      if (!res.error) {
        setMappingTypes(
          res.mapping_types.reduce(
            (acc, curr) => {
              acc[curr.name] = curr.fields;
              return acc;
            },
            {} as Record<string, Record<string, string>>
          )
        );
        setMappingTypeDescriptions(
          res.mapping_types.reduce(
            (acc, curr) => {
              acc[curr.name] = curr.description;
              return acc;
            },
            {} as Record<string, string>
          )
        );
      }
    });
  }, []);

  return (
    <div className="flex flex-1 min-h-0 min-w-0 overflow-auto flex-col w-full gap-4">
      {/* Summary */}
      <MetadataSummaryEditor
        summary={collectionMetadata?.metadata.summary || ""}
        editing={metadataEditor.editingSummary}
        summaryDraft={metadataEditor.summaryDraft}
        saving={metadataEditor.savingSummary}
        hasChanges={metadataEditor.hasSummaryChanges}
        onEdit={() => metadataEditor.setEditingSummary(true)}
        onChange={metadataEditor.setSummaryDraft}
        onSave={metadataEditor.handleSaveSummary}
        onCancel={() => {
          metadataEditor.setEditingSummary(false);
          metadataEditor.setSummaryDraft(
            collectionMetadata?.metadata.summary || ""
          );
        }}
      />
      <Separator />
      {/* Mappings */}
      <MetadataMappingsEditor
        editing={metadataEditor.editingMappings}
        mappingsDraft={metadataEditor.mappingsDraft}
        mappingTypes={mappingTypes}
        mappingTypeDescriptions={mappingTypeDescriptions}
        metadataRows={metadataRows}
        onEdit={() => metadataEditor.setEditingMappings(true)}
        onSave={metadataEditor.handleSaveMappings}
        onCancel={() => metadataEditor.setEditingMappings(false)}
        onAddGroup={metadataEditor.handleAddGroup}
        onRemoveGroup={metadataEditor.handleRemoveGroup}
        onMappingChange={metadataEditor.handleMappingChange}
        saving={metadataEditor.savingMappings}
        hasChanges={metadataEditor.hasMappingsChanges}
        currentMappings={collectionMetadata?.metadata.mappings || {}}
      />
    </div>
  );
};

export default DataMetadata;
