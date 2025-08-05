import React, { useState, useEffect } from "react";
import { patchCollectionMetadata } from "@/app/api/patchCollectionMetadata";
import { Collection, MetadataNamedVector } from "@/app/types/objects";
import { MetadataPayload } from "@/app/types/payloads";

export interface UseCollectionMetadataEditorProps {
  collection: Collection | null;
  id: string | null;
  collectionMetadata: MetadataPayload | null;
  metadataRows: {
    properties: { [key: string]: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: { [key: string]: any }[];
  };
  reloadMetadata: () => Promise<void>;
}

export interface UseCollectionMetadataEditorReturn {
  // Summary
  editingSummary: boolean;
  setEditingSummary: React.Dispatch<React.SetStateAction<boolean>>;
  summaryDraft: string;
  setSummaryDraft: React.Dispatch<React.SetStateAction<string>>;
  savingSummary: boolean;
  hasSummaryChanges: boolean;
  handleSaveSummary: () => Promise<void>;

  // Mappings
  editingMappings: boolean;
  setEditingMappings: React.Dispatch<React.SetStateAction<boolean>>;
  mappingsDraft: Record<string, Record<string, string>>;
  setMappingsDraft: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, string>>>
  >;
  savingMappings: boolean;
  hasMappingsChanges: boolean;
  showAddGroupDropdown: boolean;
  setShowAddGroupDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  handleMappingChange: (group: string, subkey: string, value: string) => void;
  handleAddGroup: (
    displayType: string,
    mappingTypes: Record<string, Record<string, string>>
  ) => void;
  handleRemoveGroup: (group: string) => void;
  handleAddSubkey: (group: string) => void;
  handleRemoveSubkey: (group: string, subkey: string) => void;
  handleSaveMappings: () => Promise<void>;

  // Named vectors
  editingNamedVectors: boolean;
  setEditingNamedVectors: React.Dispatch<React.SetStateAction<boolean>>;
  namedVectorsDraft: MetadataNamedVector[];
  setNamedVectorsDraft: React.Dispatch<
    React.SetStateAction<MetadataNamedVector[]>
  >;
  savingNamedVectors: boolean;
  hasNamedVectorsChanges: boolean;
  handleNamedVectorDescriptionChange: (
    vectorName: string,
    description: string
  ) => void;
  handleSaveNamedVectors: () => Promise<void>;
}

export function useCollectionMetadataEditor({
  collection,
  id,
  collectionMetadata,
  metadataRows,
  reloadMetadata,
}: UseCollectionMetadataEditorProps): UseCollectionMetadataEditorReturn {
  // Summary editing
  const [editingSummary, setEditingSummary] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState("");
  const [savingSummary, setSavingSummary] = useState(false);

  useEffect(() => {
    if (collectionMetadata?.metadata.summary) {
      setSummaryDraft(collectionMetadata.metadata.summary);
    }
  }, [collectionMetadata?.metadata.summary]);

  const hasSummaryChanges =
    summaryDraft !== (collectionMetadata?.metadata.summary || "");

  const handleSaveSummary = async () => {
    if (!collection || !id) return;
    setSavingSummary(true);
    try {
      await patchCollectionMetadata(id, collection.name, {
        summary: summaryDraft,
      });
      setEditingSummary(false);
      await reloadMetadata();
    } finally {
      setSavingSummary(false);
    }
  };

  // Mappings editing
  const [editingMappings, setEditingMappings] = useState(false);
  const [mappingsDraft, setMappingsDraft] = useState<
    Record<string, Record<string, string>>
  >({});
  const [savingMappings, setSavingMappings] = useState(false);
  const [showAddGroupDropdown, setShowAddGroupDropdown] = useState(false);

  useEffect(() => {
    if (editingMappings && collectionMetadata?.metadata.mappings) {
      const converted: Record<string, Record<string, string>> = {};
      for (const group in collectionMetadata.metadata.mappings) {
        converted[group] = {};
        for (const subkey in collectionMetadata.metadata.mappings[group]) {
          const val = collectionMetadata.metadata.mappings[group][subkey];
          const stringVal = Array.isArray(val) ? val[0] || "" : val || "";
          converted[group][subkey] = stringVal;
        }
      }
      setMappingsDraft(converted);
    }
    if (!editingMappings) {
      setMappingsDraft({});
    }
  }, [editingMappings, collectionMetadata]);

  const handleMappingChange = (
    group: string,
    subkey: string,
    value: string
  ) => {
    setMappingsDraft((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [subkey]: value,
      },
    }));
  };

  const handleAddGroup = (
    displayType: string,
    mappingTypes: Record<string, Record<string, string>>
  ) => {
    const fields = Object.keys(mappingTypes[displayType] || []);
    const availableProperties = Object.keys(metadataRows.properties);
    const autoMappedFields = Object.fromEntries(
      fields.map((field) => [
        field,
        availableProperties.includes(field) ? field : "",
      ])
    );
    setMappingsDraft((prev) => ({
      ...prev,
      [displayType]: autoMappedFields,
    }));
    setShowAddGroupDropdown(false);
  };

  const handleRemoveGroup = (group: string) => {
    setMappingsDraft((prev) => {
      const copy = { ...prev };
      delete copy[group];
      return copy;
    });
  };

  const handleAddSubkey = (group: string) => {
    let newSubkey = "new_key";
    let i = 1;
    while (mappingsDraft[group][newSubkey]) {
      newSubkey = `new_key${i++}`;
    }
    setMappingsDraft((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [newSubkey]: "",
      },
    }));
  };

  const handleRemoveSubkey = (group: string, subkey: string) => {
    setMappingsDraft((prev) => {
      const groupCopy = { ...prev[group] };
      delete groupCopy[subkey];
      return { ...prev, [group]: groupCopy };
    });
  };

  const hasMappingsChanges =
    JSON.stringify(mappingsDraft) !==
    JSON.stringify(collectionMetadata?.metadata.mappings || {});

  const handleSaveMappings = async () => {
    if (!collection || !id) return;
    setSavingMappings(true);
    try {
      await patchCollectionMetadata(id, collection.name, {
        mappings: mappingsDraft,
      });
      setEditingMappings(false);
      await reloadMetadata();
    } finally {
      setSavingMappings(false);
    }
  };

  // Named vectors editing
  const [editingNamedVectors, setEditingNamedVectors] = useState(false);
  const [namedVectorsDraft, setNamedVectorsDraft] = useState<
    MetadataNamedVector[]
  >([]);
  const [savingNamedVectors, setSavingNamedVectors] = useState(false);

  useEffect(() => {
    if (editingNamedVectors && collectionMetadata?.metadata.named_vectors) {
      setNamedVectorsDraft(collectionMetadata.metadata.named_vectors);
    }
    if (!editingNamedVectors) {
      setNamedVectorsDraft([]);
    }
  }, [editingNamedVectors, collectionMetadata]);

  const handleNamedVectorDescriptionChange = (
    vectorName: string,
    description: string
  ) => {
    setNamedVectorsDraft((prev) =>
      prev.map((vector) =>
        vector.name === vectorName ? { ...vector, description } : vector
      )
    );
  };

  const hasNamedVectorsChanges =
    JSON.stringify(namedVectorsDraft) !==
    JSON.stringify(collectionMetadata?.metadata.named_vectors || {});

  const handleSaveNamedVectors = async () => {
    if (!collection || !id) return;
    setSavingNamedVectors(true);
    try {
      // Convert the object format to array format for the API
      const namedVectorsArray = Object.entries(namedVectorsDraft).map(
        ([name, vector]) => ({
          name,
          description: vector.description,
          enabled: vector.enabled,
        })
      );

      await patchCollectionMetadata(id, collection.name, {
        named_vectors: namedVectorsArray,
      });
      setEditingNamedVectors(false);
      await reloadMetadata();
    } finally {
      setSavingNamedVectors(false);
    }
  };

  return {
    // Summary
    editingSummary,
    setEditingSummary,
    summaryDraft,
    setSummaryDraft,
    savingSummary,
    hasSummaryChanges,
    handleSaveSummary,
    // Mappings
    editingMappings,
    setEditingMappings,
    mappingsDraft,
    setMappingsDraft,
    savingMappings,
    hasMappingsChanges,
    showAddGroupDropdown,
    setShowAddGroupDropdown,
    handleMappingChange,
    handleAddGroup,
    handleRemoveGroup,
    handleAddSubkey,
    handleRemoveSubkey,
    handleSaveMappings,
    // Named vectors
    editingNamedVectors,
    setEditingNamedVectors,
    namedVectorsDraft,
    setNamedVectorsDraft,
    savingNamedVectors,
    hasNamedVectorsChanges,
    handleNamedVectorDescriptionChange,
    handleSaveNamedVectors,
  };
}
