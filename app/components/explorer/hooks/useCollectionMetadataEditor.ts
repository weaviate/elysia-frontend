import { useState, useEffect } from "react";
import { patchCollectionMetadata } from "@/app/api/patchCollectionMetadata";
import { Collection } from "@/app/types/objects";
import { MetadataPayload } from "@/app/types/payloads";

interface UseCollectionMetadataEditorProps {
  collection: Collection | null;
  id: string | null;
  collectionMetadata: MetadataPayload | null;
  metadataRows: {
    properties: { [key: string]: string };
    items: { [key: string]: any }[];
  };
  reloadMetadata: () => Promise<void>;
}

export function useCollectionMetadataEditor({
  collection,
  id,
  collectionMetadata,
  metadataRows,
  reloadMetadata,
}: UseCollectionMetadataEditorProps) {
  // Summary editing
  const [editingSummary, setEditingSummary] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState("");
  const [savingSummary, setSavingSummary] = useState(false);

  useEffect(() => {
    if (collectionMetadata?.metadata.summary) {
      setSummaryDraft(collectionMetadata.metadata.summary);
    }
  }, [collectionMetadata?.metadata.summary]);

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
          converted[group][subkey] = Array.isArray(val)
            ? val[0] || ""
            : val || "";
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
    value: string,
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
    mappingTypes: Record<string, Record<string, string>>,
  ) => {
    const fields = Object.keys(mappingTypes[displayType] || []);
    const availableProperties = Object.keys(metadataRows.properties);
    const autoMappedFields = Object.fromEntries(
      fields.map((field) => [
        field,
        availableProperties.includes(field) ? field : "",
      ]),
    );
    setMappingsDraft((prev) => ({
      ...prev,
      [displayType]: autoMappedFields,
    }));
    setShowAddGroupDropdown(false);
  };

  const handleChangeGroupType = (
    oldGroup: string,
    newType: string,
    mappingTypes: Record<string, Record<string, string>>,
  ) => {
    const fields = Object.keys(mappingTypes[newType] || []);
    const availableProperties = Object.keys(metadataRows.properties);
    const autoMappedFields = Object.fromEntries(
      fields.map((field) => [
        field,
        availableProperties.includes(field) ? field : "",
      ]),
    );
    setMappingsDraft((prev) => {
      const copy = { ...prev };
      copy[newType] = autoMappedFields;
      delete copy[oldGroup];
      return copy;
    });
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
    Record<
      string,
      { description: string; enabled: boolean; source_properties: string[] }
    >
  >({});
  const [savingNamedVectors, setSavingNamedVectors] = useState(false);

  useEffect(() => {
    if (editingNamedVectors && collectionMetadata?.metadata.named_vectors) {
      setNamedVectorsDraft(collectionMetadata.metadata.named_vectors);
    }
    if (!editingNamedVectors) {
      setNamedVectorsDraft({});
    }
  }, [editingNamedVectors, collectionMetadata]);

  const handleNamedVectorDescriptionChange = (
    vectorName: string,
    description: string,
  ) => {
    setNamedVectorsDraft((prev) => ({
      ...prev,
      [vectorName]: {
        ...prev[vectorName],
        description,
      },
    }));
  };

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
        }),
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
    handleSaveSummary,
    // Mappings
    editingMappings,
    setEditingMappings,
    mappingsDraft,
    setMappingsDraft,
    savingMappings,
    showAddGroupDropdown,
    setShowAddGroupDropdown,
    handleMappingChange,
    handleAddGroup,
    handleChangeGroupType,
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
    handleNamedVectorDescriptionChange,
    handleSaveNamedVectors,
  };
}
