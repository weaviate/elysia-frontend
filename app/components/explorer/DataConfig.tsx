"use client";

import React, { useContext } from "react";

import { Button } from "@/components/ui/button";
import { CollectionContext } from "../contexts/CollectionContext";
import { SessionContext } from "../contexts/SessionContext";
import { PiVectorThreeFill, PiMagicWandFill } from "react-icons/pi";
import { GoTrash } from "react-icons/go";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";

import { Collection } from "@/app/types/objects";
import { RouterContext } from "../contexts/RouterContext";

import SaveCancelButtons from "./components/SaveCancelButtons";
import { ProcessingContext } from "../contexts/ProcessingContext";
import { MetadataPayload } from "@/app/types/payloads";
import { UseCollectionMetadataEditorReturn } from "./hooks/useCollectionMetadataEditor";
import { motion } from "framer-motion";

interface DataConfigProps {
  collection: Collection;
  collectionMetadata: MetadataPayload | null;
  metadataEditor: UseCollectionMetadataEditorReturn;
  globalVectorizer: { vectorizer: string; model: string } | null;
}

const DataConfig: React.FC<DataConfigProps> = ({
  collection,
  collectionMetadata,
  metadataEditor,
  globalVectorizer,
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
      {/* Global Vectorizer */}
      {globalVectorizer && globalVectorizer.vectorizer && (
        <motion.div
          className="flex flex-col gap-2 border border-foreground p-4 rounded-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.3,
            type: "tween",
            delay: 0.4,
          }}
        >
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 border border-primary rounded-md p-1">
              <PiVectorThreeFill className="text-primary" />
            </div>
            <p className="font-bold">Global Vectorizer</p>
          </div>

          <div className="flex flex-col gap-3 p-4 bg-background_alt rounded-lg border border-border shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="p-2 rounded-md bg-primary/10 border-primary/20">
                  <PiVectorThreeFill className="text-primary w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <p
                      className="font-bold text-primary truncate text-sm sm:text-base"
                      title={globalVectorizer.model}
                    >
                      {globalVectorizer.model}
                    </p>
                    <div className="inline-flex px-2 py-1 rounded-full text-xs font-medium border text-accent bg-accent/10 border-accent/20 w-fit">
                      {globalVectorizer.vectorizer}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Named Vectors */}
      {collectionMetadata?.metadata.named_vectors &&
        collectionMetadata.metadata.named_vectors.length > 0 && (
          <motion.div
            className="flex flex-col gap-2 border border-foreground p-4 rounded-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              type: "tween",
              delay: 0.4,
            }}
          >
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="bg-highlight/10 border border-highlight rounded-md p-1">
                  <PiVectorThreeFill className="text-highlight" />
                </div>
                <p className="font-bold">Named Vectors</p>
                <div className="bg-secondary/10 border border-secondary/20 rounded-full px-2 py-1">
                  <p className="text-xs text-secondary font-medium">
                    {collectionMetadata.metadata.named_vectors.length}{" "}
                    {collectionMetadata.metadata.named_vectors.length === 1
                      ? "vector"
                      : "vectors"}
                  </p>
                </div>
              </div>

              {!metadataEditor.editingNamedVectors && (
                <Button
                  onClick={() => metadataEditor.setEditingNamedVectors(true)}
                  className=""
                >
                  <FaEdit className="text-secondary" />
                  <p className="text-secondary">Edit</p>
                </Button>
              )}
            </div>

            {metadataEditor.editingNamedVectors ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {collectionMetadata.metadata.named_vectors.map(
                    (namedVector) => (
                      <div
                        key={namedVector.name}
                        className="flex flex-col gap-3 p-4 bg-background_alt rounded-lg border border-border shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="p-2 rounded-md bg-highlight/10 border-highlight/20">
                              <PiVectorThreeFill className="text-highlight w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <div className="flex items-center gap-2">
                                  {namedVector.enabled ? (
                                    <FaCheck className="text-accent w-3 h-3" />
                                  ) : (
                                    <FaTimes className="text-error w-3 h-3" />
                                  )}
                                  <p
                                    className="font-bold text-primary truncate text-sm sm:text-base"
                                    title={namedVector.name}
                                  >
                                    {namedVector.name}
                                  </p>
                                </div>
                                <div className="inline-flex px-2 py-1 rounded-full text-xs font-medium border text-alt_color_a bg-alt_color_a/10 border-alt_color_a/20 w-fit">
                                  {namedVector.vectorizer}
                                </div>
                              </div>
                              <p className="text-xs text-secondary mt-1">
                                {namedVector.model}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-medium text-primary">
                            Description:
                          </p>
                          <textarea
                            className="w-full border rounded p-2 bg-background text-sm"
                            rows={3}
                            value={
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              (metadataEditor.namedVectorsDraft as any)[
                                namedVector.name
                              ]?.description || ""
                            }
                            onChange={(e) =>
                              metadataEditor.handleNamedVectorDescriptionChange(
                                namedVector.name,
                                e.target.value
                              )
                            }
                            disabled={metadataEditor.savingNamedVectors}
                            placeholder="Enter description..."
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-medium text-primary">
                            Source Properties:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {namedVector.source_properties?.map((property) => (
                              <div
                                key={property}
                                className="inline-flex px-2 py-1 rounded text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20"
                              >
                                {property}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <SaveCancelButtons
                  saving={metadataEditor.savingNamedVectors}
                  hasChanges={metadataEditor.hasNamedVectorsChanges}
                  onSave={metadataEditor.handleSaveNamedVectors}
                  onCancel={() => {
                    metadataEditor.setEditingNamedVectors(false);
                    if (collectionMetadata?.metadata.named_vectors) {
                      metadataEditor.setNamedVectorsDraft(
                        collectionMetadata.metadata.named_vectors
                      );
                    }
                  }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {collectionMetadata.metadata.named_vectors.map(
                  (namedVector) => (
                    <div
                      key={namedVector.name}
                      className="flex flex-col gap-3 p-4 bg-background_alt rounded-lg border border-border shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="p-2 rounded-md bg-highlight/10 border-highlight/20">
                            <PiVectorThreeFill className="text-highlight w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <div className="flex items-center gap-2">
                                {namedVector.enabled ? (
                                  <FaCheck className="text-accent w-3 h-3" />
                                ) : (
                                  <FaTimes className="text-error w-3 h-3" />
                                )}
                                <p
                                  className="font-bold text-primary truncate text-sm sm:text-base"
                                  title={namedVector.name}
                                >
                                  {namedVector.name}
                                </p>
                              </div>
                              <div className="inline-flex px-2 py-1 rounded-full text-xs font-medium border text-alt_color_a bg-alt_color_a/10 border-alt_color_a/20 w-fit">
                                {namedVector.vectorizer}
                              </div>
                            </div>
                            <p className="text-xs text-secondary mt-1">
                              {namedVector.model}
                            </p>
                          </div>
                        </div>
                      </div>
                      {namedVector.description && (
                        <div className="text-sm text-secondary border-l-2 border-border pl-3">
                          {namedVector.description}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {namedVector.source_properties?.map((property) => (
                          <div
                            key={property}
                            className="inline-flex px-2 py-1 rounded text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20"
                          >
                            {property}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </motion.div>
        )}

      <div className="flex flex-wrap gap-4 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            type: "tween",
            delay: 0.2,
          }}
        >
          <Button
            className="flex-1 bg-primary/10 border border-primary hover:bg-primary/20"
            onClick={() => triggerAnalysis(collection, id ?? "")}
          >
            <PiMagicWandFill className="text-primary" />
            <p className="text-primary">Re-Analyze Collection</p>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            type: "tween",
            delay: 0.3,
          }}
        >
          <Button
            className="flex-1 bg-error/10 border border-error hover:bg-error/20"
            onClick={() => clearAnalysis()}
          >
            <GoTrash className="text-error" />
            <p className="text-error">Clear Analysis</p>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default DataConfig;
