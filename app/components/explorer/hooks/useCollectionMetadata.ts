import { useState, useEffect } from "react";
import { getCollectionMetadata } from "@/app/api/getCollectionMetadata";
import { Collection } from "@/app/types/objects";
import { MetadataPayload } from "@/app/types/payloads";

interface UseCollectionMetadataProps {
  collection: Collection | null;
  id: string | null;
}

export function useCollectionMetadata({
  collection,
  id,
}: UseCollectionMetadataProps) {
  const [collectionMetadata, setCollectionMetadata] =
    useState<MetadataPayload | null>(null);
  const [metadataRows, setMetadataRows] = useState<{
    properties: { [key: string]: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: { [key: string]: any }[];
  }>({ properties: {}, items: [] });

  const metadataToRows = (metadata: MetadataPayload) => {
    const properties: Record<string, string> = {};
    const columns: Record<string, string[]> = {};
    let maxLength = 0;
    for (const fieldKey in metadata.metadata.fields) {
      const _field = metadata.metadata.fields[fieldKey];
      const field = {
        type: _field?.type || "",
        groups: _field?.groups || [],
        mean: _field?.mean || 0,
        range: _field?.range || [0, 0],
      };
      properties[fieldKey] = field.type;
      if (field.type === "number") {
        columns[fieldKey] = [
          "Min: " + field.range[0].toString(),
          "Max: " + field.range[1].toString(),
        ];
      } else {
        columns[fieldKey] = [...field.groups];
      }
      maxLength = Math.max(maxLength, columns[fieldKey].length);
    }
    const items = Array.from({ length: maxLength }, (_, i) =>
      Object.keys(columns).reduce(
        (obj, fieldKey) => {
          obj[fieldKey] = columns[fieldKey][i] || "";
          return obj;
        },
        {} as Record<string, string>
      )
    );
    setMetadataRows({ properties, items });
  };

  const loadCollectionMetadata = async () => {
    if (!collection || !id) return;
    const data = await getCollectionMetadata(id, collection.name);
    setCollectionMetadata(data);
    metadataToRows(data);
  };

  useEffect(() => {
    loadCollectionMetadata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, id]);

  return {
    collectionMetadata,
    setCollectionMetadata,
    metadataRows,
    setMetadataRows,
    loadCollectionMetadata,
    metadataToRows,
  };
}
