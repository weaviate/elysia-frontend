"use client";

import React, { useContext } from "react";

import { Button } from "@/components/ui/button";
import { CollectionContext } from "../contexts/CollectionContext";
import { SessionContext } from "../contexts/SessionContext";
import { PiVectorThreeFill, PiMagicWandFill } from "react-icons/pi";
import { GoTrash } from "react-icons/go";

import { Collection } from "@/app/types/objects";
import { Separator } from "@/components/ui/separator";
import { RouterContext } from "../contexts/RouterContext";

import NamedVectorsEditor from "./components/NamedVectorsEditor";
import { ProcessingContext } from "../contexts/ProcessingContext";
import { MetadataPayload } from "@/app/types/payloads";
import { UseCollectionMetadataEditorReturn } from "./hooks/useCollectionMetadataEditor";

interface DataConfigProps {
  collection: Collection;
  collectionMetadata: MetadataPayload | null;
  metadataEditor: UseCollectionMetadataEditorReturn;
  vectorizationModels: { [key: string]: string[] } | null;
}

const DataConfig: React.FC<DataConfigProps> = ({
  collection,
  collectionMetadata,
  metadataEditor,
  vectorizationModels,
}) => {
  const { deleteCollection } = useContext(CollectionContext);
  const { id } = useContext(SessionContext);
  const { triggerAnalysis } = useContext(ProcessingContext);
  const { changePage } = useContext(RouterContext);

  const clearAnalysis = () => {
    if (!collection) return;
    deleteCollection(collection.name);
    changePage("data", {}, true);
  };

  if (!collection) {
    return null;
  }

  return (
    <div className="flex flex-1 min-h-0 min-w-0 overflow-auto flex-col w-full gap-4">
      {/* Buttons */}
      <div className="flex flex-wrap gap-4 w-full">
        <Button
          variant="default"
          className="flex-1"
          onClick={() => triggerAnalysis(collection, id ?? "")}
        >
          <PiMagicWandFill className="text-primary" />
          Re-Analyze Collection
        </Button>
        <Button
          variant="default"
          className="flex-1"
          onClick={() => clearAnalysis()}
        >
          <GoTrash className="text-error" />
          Clear Analysis
        </Button>
      </div>
      <Separator />
      {/* Vectorization */}
      <div className="flex flex-col gap-4 mb-2">
        <div className="flex flex-row gap-2 items-center">
          <p className="font-bold">
            {collection?.name} is vectorized using{" "}
            {Object.keys(vectorizationModels || {}).length}
            {Object.keys(vectorizationModels || {}).length === 1
              ? " embedding model"
              : " embedding models"}
          </p>
        </div>
        {vectorizationModels && (
          <div className="flex flex-col gap-2 w-full">
            {Object.keys(vectorizationModels).map((model) => (
              <div
                key={model}
                className="flex flex-row gap-4 w-full items-start justify-start"
              >
                <div className="flex flex-row flex-0 gap-2 items-center">
                  <div className="flex flex-row gap-2 items-center justify-center bg-alt_color_a rounded-md p-1 h-9 w-9">
                    <PiVectorThreeFill className="text-primary" />
                  </div>
                  <div className="flex flex-col items-start justify-start">
                    <p className="text-primary">{model}</p>
                    <p className="text-secondary text-xs font-light">
                      {vectorizationModels[model].length} fields
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 w-full flex-1 items-center justify-start">
                  {vectorizationModels[model].map((field) => (
                    <div
                      key={field}
                      className="flex flex-row gap-2 items-center"
                    >
                      <p className="text-sm text-secondary">{field}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Separator />
      {/* Named Vectors */}
      <NamedVectorsEditor
        namedVectors={collectionMetadata?.metadata.named_vectors || []}
        editing={metadataEditor.editingNamedVectors}
        namedVectorsDraft={metadataEditor.namedVectorsDraft}
        saving={metadataEditor.savingNamedVectors}
        hasChanges={metadataEditor.hasNamedVectorsChanges}
        onEdit={() => metadataEditor.setEditingNamedVectors(true)}
        onSave={metadataEditor.handleSaveNamedVectors}
        onCancel={() => {
          metadataEditor.setEditingNamedVectors(false);
          if (collectionMetadata?.metadata.named_vectors) {
            metadataEditor.setNamedVectorsDraft(
              collectionMetadata.metadata.named_vectors
            );
          }
        }}
        onDescriptionChange={metadataEditor.handleNamedVectorDescriptionChange}
      />
    </div>
  );
};

export default DataConfig;
