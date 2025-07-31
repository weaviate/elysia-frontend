"use client";

import React, { useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CollectionContext } from "../contexts/CollectionContext";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "./DataTable";
import { SessionContext } from "../contexts/SessionContext";
import { usePathname, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { PiVectorThreeFill, PiMagicWandFill } from "react-icons/pi";
import { GoTrash } from "react-icons/go";

import { Collection, Vectorizer } from "@/app/types/objects";
import { Input } from "@/components/ui/input";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Separator } from "@/components/ui/separator";
import { RouterContext } from "../contexts/RouterContext";

import { getMappingTypes } from "@/app/api/getMappingTypes";
import { useCollectionData } from "./hooks/useCollectionData";
import { useCollectionMetadata } from "./hooks/useCollectionMetadata";
import { useCollectionMetadataEditor } from "./hooks/useCollectionMetadataEditor";
import CollectionBreadcrumb from "./components/CollectionBreadcrumb";
import ViewToggleMenu from "./components/ViewToggleMenu";
import MetadataSummaryEditor from "./components/MetadataSummaryEditor";
import MetadataMappingsEditor from "./components/MetadataMappingsEditor";
import NamedVectorsEditor from "./components/NamedVectorsEditor";
import { MappingTypesPayload } from "@/app/types/payloads";
import { ProcessingContext } from "../contexts/ProcessingContext";

const DataExplorer = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { changePage } = useContext(RouterContext);

  const [collection, setCollection] = useState<Collection | null>(null);
  const { collections, deleteCollection } = useContext(CollectionContext);
  const { id } = useContext(SessionContext);
  const { triggerAnalysis } = useContext(ProcessingContext);

  const {
    collectionData,
    setCollectionData,
    ascending,
    setAscending,
    sortOn,
    setSortOn,
    page,
    setPage,
    pageSize,
    query,
    setQuery,
    usingQuery,
    loadCollectionData,
  } = useCollectionData({
    collection: collection ?? null,
    id: typeof id === "string" ? id : null,
  });

  const { collectionMetadata, metadataRows, loadCollectionMetadata } =
    useCollectionMetadata({
      collection: collection ?? null,
      id: typeof id === "string" ? id : null,
    });

  const [loadingCollection, setLoadingCollection] = useState(false);
  const [view, setView] = useState<"table" | "metadata" | "configuration">(
    "table"
  );
  const [maxPage, setMaxPage] = useState(0);
  const [vectorizationModels, setVectorizationModels] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [mappingTypes, setMappingTypes] = useState<
    Record<string, Record<string, string>>
  >({});
  const [mappingTypeDescriptions, setMappingTypeDescriptions] = useState<
    Record<string, string>
  >({});

  const metadataEditor = useCollectionMetadataEditor({
    collection,
    id: typeof id === "string" ? id : null,
    collectionMetadata,
    metadataRows,
    reloadMetadata: loadCollectionMetadata,
  });

  const triggerAscending = () => {
    setAscending((prev) => !prev);
  };

  const handleAscending = (ascending: boolean) => {
    setAscending(ascending);
  };

  const routerSetPage = (page: number) => {
    changePage("collection", { page_number: page.toString() }, false);
    setCollectionData(null);
  };

  const routerSetSortOn = (sort_on: string) => {
    if (sortOn === sort_on) {
      triggerAscending();
    } else {
      changePage("collection", { sort_on: sort_on }, false);
      handleAscending(true);
    }
  };

  const clearAnalysis = () => {
    if (!collection) return;
    deleteCollection(collection.name);
    changePage("data", {}, true);
  };

  const pageUp = () => {
    if (!collection) return;
    if (page + 1 > maxPage) return;
    if (usingQuery && collectionData?.items?.length !== pageSize) return;
    routerSetPage(page + 1);
  };

  const pageDown = () => {
    if (page === 1) return;
    routerSetPage(page - 1);
  };

  const groupVectorizationModels = (vectorizer: Vectorizer) => {
    const vectorizationModels: { [key: string]: string[] } = {};
    for (const field in vectorizer.fields) {
      for (const fieldData of vectorizer.fields[field]) {
        if (!vectorizationModels[fieldData.model]) {
          vectorizationModels[fieldData.model] = [];
        }
        vectorizationModels[fieldData.model].push(field);
      }
    }
    setVectorizationModels(vectorizationModels);
  };

  useEffect(() => {
    const collection_param = searchParams.get("source") ?? null;
    if (collection_param) {
      const _collection = collections.find((c) => c.name === collection_param);
      if (_collection) {
        setCollection(_collection);
        const max_pages = Math.ceil(_collection.total / pageSize);
        setMaxPage(max_pages);

        const page_param = searchParams.get("page_number");
        if (page_param) {
          const _page = parseInt(page_param);
          if (_page > max_pages) {
            setPage(max_pages);
          } else {
            setPage(Number.isNaN(_page) ? 1 : _page);
          }
        } else {
          setPage(1);
        }

        const sort_on_param = searchParams.get("sort_on");
        setSortOn(typeof sort_on_param === "string" ? sort_on_param : null);
      }
    }
  }, [pathname, searchParams, collections]);

  useEffect(() => {
    if (collection) {
      if (collection.vectorizer) {
        groupVectorizationModels(collection.vectorizer);
      }
    }
  }, [collection]);

  useEffect(() => {
    if (collections.length > 0 && collection) {
      setLoadingCollection(false);
    } else {
      setLoadingCollection(true);
    }
  }, [collection, collections]);

  useEffect(() => {
    loadCollectionData();
  }, [page, pageSize, ascending, sortOn, collection, id]);

  useEffect(() => {
    loadCollectionMetadata();
  }, [collection, id]);

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
    <div className="flex flex-col w-full gap-2 min-h-0 items-center justify-start h-full">
      {/* Breadcrumb Title */}
      <div className="flex mb-2 w-full justify-start">
        <CollectionBreadcrumb
          collectionName={collection ? collection.name : undefined}
        />
      </div>

      <div className="flex flex-col w-full gap-6 h-full">
        {collection && !collection.processed && !loadingCollection && (
          <div className="flex flex-row justify-between items-center w-full border border-warning p-2 rounded-md">
            <div className="flex flex-col gap-1 items-start justify-start">
              <p className="text-sm font-bold text-warning">Warning</p>
              <p className="text-sm ">
                This collection needs to be analyzed before it can be used in
                Elysia and to access its metadata.
              </p>
            </div>
          </div>
        )}

        {collection &&
          collection.processed &&
          !loadingCollection &&
          (!vectorizationModels ||
            Object.keys(vectorizationModels).length === 0) && (
            <div className="flex flex-row justify-between items-center w-full border border-warning p-2 rounded-md">
              <div className="flex flex-col gap-1 items-start justify-start">
                <p className="text-sm font-bold text-warning">Warning</p>
                <p className="text-sm ">
                  No vectorizers could be found for this collection. Vector
                  search might be limited which could lead to errors. Please
                  configure your collection to use one of Weaviate&apos;s
                  supported embedding model providers.{" "}
                </p>
                <a
                  href="https://docs.weaviate.io/weaviate/model-providers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warning underline hover:no-underline"
                >
                  View Weaviate documentation
                </a>
              </div>
            </div>
          )}

        {/* Menu */}
        <ViewToggleMenu
          view={view}
          setView={setView}
          processed={!!collection?.processed}
        />

        {/* Main */}
        <div className="flex flex-col gap-3 w-full pb-16 rounded-md flex-1 min-h-0 min-w-0">
          {view === "table" && (
            <>
              <div className="flex flex-col w-full gap-4">
                {/* Search */}
                <div
                  className="flex flex-row gap-1 w-full items-center justify-center"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      loadCollectionData();
                    }
                  }}
                >
                  <Input
                    type="text"
                    placeholder={"Search " + (collection?.name || "collection")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <Button
                    variant="default"
                    onClick={() => loadCollectionData()}
                  >
                    <FaSearch className="text-primary" />
                  </Button>
                </div>
                {/* Bottom Menu */}
                <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-1 w-full">
                  <div className="hidden md:block w-1/3"></div>
                  {/* Pagination */}
                  <div className="flex items-center justify-center w-full md:w-1/3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={page === 1}
                        onClick={() => pageDown()}
                      >
                        <MdOutlineKeyboardArrowLeft />
                      </Button>
                      {!usingQuery ? (
                        <p className="text-primary text-xs font-light">
                          {"Page " + page + " of " + maxPage}
                        </p>
                      ) : (
                        <p className="text-primary text-xs font-light">
                          {"Page " + page}
                        </p>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={page === maxPage}
                        onClick={() => pageUp()}
                      >
                        <MdOutlineKeyboardArrowRight />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-0 min-w-0 overflow-auto">
                {loadingCollection && !collectionData ? (
                  <div className="flex flex-col gap-2 items-start justify-start w-full h-full fade-in">
                    {[...Array(10)].map((_, i) => (
                      <Skeleton
                        key={i}
                        className="w-full h-[25px] rounded-sm"
                      />
                    ))}
                  </div>
                ) : (
                  <DataTable
                    data={collectionData?.items || []}
                    header={collectionData?.properties || {}}
                    setSortOn={routerSetSortOn}
                    ascending={ascending}
                    sortOn={sortOn || ""}
                  />
                )}
              </div>
            </>
          )}
          {view === "metadata" && (
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
          )}
          {/* Configuration */}
          {view === "configuration" && collection && (
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
                namedVectors={collectionMetadata?.metadata.named_vectors || {}}
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
                onDescriptionChange={
                  metadataEditor.handleNamedVectorDescriptionChange
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataExplorer;
