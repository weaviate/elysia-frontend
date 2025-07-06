"use client";

import React, { useContext, useEffect, useState } from "react";

import { FaCheck, FaTable } from "react-icons/fa6";
import { RiFilePaperLine } from "react-icons/ri";
import { LuDatabase, LuSettings2 } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { CollectionContext } from "../contexts/CollectionContext";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "./DataTable";
import { SessionContext } from "../contexts/SessionContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  FaEdit,
  FaLongArrowAltRight,
  FaSearch,
  FaPlus,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import { getDisplayIcon } from "@/app/types/displayIcons";
import { PiVectorThreeFill, PiMagicWandFill } from "react-icons/pi";
import { GoTrash } from "react-icons/go";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Collection, Vectorizer } from "@/app/types/objects";
import { Input } from "@/components/ui/input";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import MarkdownFormat from "../chat/display/MarkdownFormat";
import { Separator } from "@/components/ui/separator";
import { ConfigContext } from "../contexts/ConfigContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getMappingTypes,
  MappingTypesResponse,
} from "@/app/api/getMappingTypes";
import { useCollectionData } from "./hooks/useCollectionData";
import { useCollectionMetadata } from "./hooks/useCollectionMetadata";
import { useCollectionMetadataEditor } from "./hooks/useCollectionMetadataEditor";

const DataExplorer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [collection, setCollection] = useState<Collection | null>(null);
  const { collections, deleteCollection } = useContext(CollectionContext);
  const { id } = useContext(SessionContext);
  const { analyzeCollection } = useContext(ConfigContext);

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
    setPageSize,
    query,
    setQuery,
    usingQuery,
    setUsingQuery,
    loadCollectionData,
  } = useCollectionData({
    collection: collection ?? null,
    id: typeof id === "string" ? id : null,
  });

  const {
    collectionMetadata,
    setCollectionMetadata,
    metadataRows,
    setMetadataRows,
    loadCollectionMetadata,
    metadataToRows,
  } = useCollectionMetadata({
    collection: collection ?? null,
    id: typeof id === "string" ? id : null,
  });

  const [loadingCollection, setLoadingCollection] = useState(false);
  const [view, setView] = useState<"table" | "metadata" | "configuration">(
    "table",
  );
  const [maxPage, setMaxPage] = useState(0);
  const [vectorizationModels, setVectorizationModels] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [mappingTypes, setMappingTypes] = useState<
    Record<string, Record<string, string>>
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
    const params = new URLSearchParams(searchParams.toString());
    const path = pathname;
    params.set("page", page.toString());
    router.push(`${path}?${params.toString()}`);
    setCollectionData(null);
  };

  const routerSetSortOn = (sort_on: string) => {
    if (sortOn === sort_on) {
      triggerAscending();
    } else {
      const params = new URLSearchParams(searchParams.toString());
      const path = pathname;
      params.set("sort_on", sort_on);
      router.push(`${path}?${params.toString()}`);
      handleAscending(true);
    }
  };

  const clearSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    const path = pathname;
    params.delete("sort_on");
    router.push(`${path}?${params.toString()}`);
  };

  const clearAnalysis = () => {
    if (!collection) return;
    deleteCollection(collection.name);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("source");
    router.push(`/data`);
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

        const page_param = searchParams.get("page");
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
    getMappingTypes().then((res: MappingTypesResponse) => {
      if (!res.error) {
        setMappingTypes(res.mapping_types);
      }
    });
  }, []);

  return (
    <div className="flex flex-col w-full gap-2 min-h-0 items-center justify-start h-full">
      {/* Breadcrumb Title */}
      <div className="flex mb-2 w-full justify-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer text-lg flex items-center gap-2"
                onClick={() => router.push(`/data`)}
              >
                Data Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="cursor-pointer">
              <BreadcrumbPage className="text-lg gap-2 flex items-center justify-center">
                <div className="flex items-center justify-center shrink-0 w-8 h-8 bg-accent rounded-md">
                  <LuDatabase size={18} />
                </div>
                {collection ? collection.name : "Loading..."}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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

        {/* Menu */}
        <div className="flex flex-row flex-wrap gap-1 w-full justify-end items-center rounded-md bg-background mb-2">
          <Button
            variant={view === "table" ? "outline" : "ghost"}
            onClick={() => setView("table")}
            className="flex flex-1"
          >
            <FaTable className="text-accent" />
            Table
          </Button>
          <Button
            variant={view === "metadata" ? "outline" : "ghost"}
            onClick={() => setView("metadata")}
            disabled={!collection?.processed}
            className={`flex flex-1`}
          >
            <RiFilePaperLine className="text-highlight" />
            Metadata
          </Button>
          <Button
            variant={view === "configuration" ? "outline" : "ghost"}
            onClick={() => setView("configuration")}
            disabled={!collection?.processed}
            className="flex flex-1"
          >
            <LuSettings2 className="text-alt_color_a" />
            Configuration
          </Button>
        </div>

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
                    variant="outline"
                    size="icon"
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
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="font-bold">Summary</p>
                  {!metadataEditor.editingSummary && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => metadataEditor.setEditingSummary(true)}
                      className="text-secondary hover:text-primary hover:bg-transparent font-normal mr-2"
                    >
                      <FaEdit />
                    </Button>
                  )}
                </div>
                {metadataEditor.editingSummary ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      className="w-full border rounded p-2 bg-background_alt"
                      rows={4}
                      value={metadataEditor.summaryDraft}
                      onChange={(e) =>
                        metadataEditor.setSummaryDraft(e.target.value)
                      }
                      disabled={metadataEditor.savingSummary}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        onClick={metadataEditor.handleSaveSummary}
                        disabled={metadataEditor.savingSummary}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          metadataEditor.setEditingSummary(false);
                          metadataEditor.setSummaryDraft(
                            collectionMetadata?.metadata.summary || "",
                          );
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <MarkdownFormat
                    text={collectionMetadata?.metadata.summary || ""}
                  />
                )}
              </div>
              <Separator />
              {/* Mappings */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row items-center gap-2">
                  <p className="font-bold">Display Mappings</p>
                  {!metadataEditor.editingMappings && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => metadataEditor.setEditingMappings(true)}
                      className="text-secondary hover:text-primary hover:bg-transparent font-normal mr-2"
                    >
                      <FaEdit />
                    </Button>
                  )}
                  {metadataEditor.editingMappings && (
                    <DropdownMenu
                      open={metadataEditor.showAddGroupDropdown}
                      onOpenChange={metadataEditor.setShowAddGroupDropdown}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-secondary hover:text-primary hover:bg-transparent font-normal mr-2"
                        >
                          <FaPlus /> Add Display Type
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {Object.keys(mappingTypes).map((type) => (
                          <DropdownMenuItem
                            key={type}
                            onClick={() =>
                              metadataEditor.handleAddGroup(type, mappingTypes)
                            }
                          >
                            {type}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <div className="flex flex-row gap-4">
                  {metadataEditor.editingMappings ? (
                    <div className="flex flex-col gap-4 w-full">
                      <div className="flex flex-col lg:flex-row gap-10">
                        {Object.keys(metadataEditor.mappingsDraft).map(
                          (group) => (
                            <div
                              key={group}
                              className="flex flex-col gap-2 bg-background rounded-md p-2"
                            >
                              <div className="flex flex-row items-center gap-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="font-bold text-sm md:text-base border rounded p-1 bg-background_alt"
                                      disabled={metadataEditor.savingMappings}
                                    >
                                      {group}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    {Object.keys(mappingTypes).map((type) => (
                                      <DropdownMenuItem
                                        key={type}
                                        onClick={() =>
                                          metadataEditor.handleChangeGroupType(
                                            group,
                                            type,
                                            mappingTypes,
                                          )
                                        }
                                      >
                                        {type}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    metadataEditor.handleRemoveGroup(group)
                                  }
                                  className="text-error"
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                              <div className="flex flex-col gap-1">
                                {(
                                  Object.keys(
                                    mappingTypes[group] || {},
                                  ) as string[]
                                ).map((subkey: string) => (
                                  <div
                                    key={subkey}
                                    className="flex flex-row gap-2 items-center"
                                  >
                                    <p className="w-[100px] md:w-[150px] truncate text-sm md:text-base font-medium">
                                      {subkey}
                                    </p>
                                    <FaLongArrowAltRight />
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="outline"
                                          className="w-[100px] md:w-[150px] h-8 bg-background_alt justify-between"
                                          disabled={
                                            metadataEditor.savingMappings
                                          }
                                        >
                                          {metadataEditor.mappingsDraft[group][
                                            subkey
                                          ] || "Select field"}
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            metadataEditor.handleMappingChange(
                                              group,
                                              subkey,
                                              "",
                                            )
                                          }
                                        >
                                          (empty)
                                        </DropdownMenuItem>
                                        {Object.keys(
                                          metadataRows.properties,
                                        ).map((field) => (
                                          <DropdownMenuItem
                                            key={field}
                                            onClick={() =>
                                              metadataEditor.handleMappingChange(
                                                group,
                                                subkey,
                                                field,
                                              )
                                            }
                                          >
                                            {field}
                                          </DropdownMenuItem>
                                        ))}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                      <div className="flex gap-2 justify-end mt-2">
                        <Button
                          size="sm"
                          onClick={metadataEditor.handleSaveMappings}
                          disabled={metadataEditor.savingMappings}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            metadataEditor.setEditingMappings(false)
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    Object.keys(
                      collectionMetadata?.metadata.mappings || {},
                    ).map((key) => {
                      const mappings: { [key: string]: [key: string] } =
                        collectionMetadata?.metadata.mappings[key] || {};
                      const totalMappings = Object.keys(mappings).length;
                      const matchingMappings = Object.values(mappings).filter(
                        (value) => value && value.length > 0,
                      ).length;

                      // Use the display type key directly as the label
                      const displayLabel = key;

                      return (
                        <div
                          key={key}
                          className="flex flex-col gap-4 w-fit h-fit p-3 bg-background_alt rounded-md mb-5"
                        >
                          <div className="flex flex-row gap-2 items-center">
                            {getDisplayIcon(key || "")}
                            <p className="font-bold text-sm md:text-base">
                              {displayLabel}
                            </p>
                            <p className="text-secondary">
                              ({matchingMappings}/{totalMappings})
                            </p>
                          </div>
                          <div>
                            {Object.keys(mappings).map((subkey) => (
                              <div
                                key={subkey}
                                className="flex flex-row gap-2 items-center"
                              >
                                <p
                                  className={`w-[100px] md:w-[150px] truncate text-sm md:text-base font-medium ${!mappings[subkey] ? "text-secondary" : ""}`}
                                >
                                  {subkey}
                                </p>
                                <FaLongArrowAltRight
                                  className={`${
                                    !mappings[subkey]
                                      ? "text-secondary"
                                      : "text-primary"
                                  }`}
                                />
                                <p
                                  className={`truncate text-sm md:text-base ${!mappings[subkey] ? "text-secondary" : ""}`}
                                >
                                  {mappings[subkey] || "(empty)"}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <Separator />
              {/* Metadata Editor */}
              <div className="flex flex-col gap-2 w-full mb-5">
                {Object.keys(collectionMetadata?.metadata.named_vectors || {})
                  .length > 0 && (
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-row items-center gap-2">
                      <p className="font-bold">Named Vectors</p>
                      {!metadataEditor.editingNamedVectors && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            metadataEditor.setEditingNamedVectors(true)
                          }
                          className="text-secondary hover:text-primary hover:bg-transparent font-normal mr-2"
                        >
                          <FaEdit />
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-row gap-2 flex-wrap">
                      {Object.keys(
                        collectionMetadata?.metadata.named_vectors || {},
                      ).map((key) => {
                        const namedVector =
                          collectionMetadata?.metadata.named_vectors?.[key];
                        return (
                          <div
                            key={key}
                            className="flex flex-col gap-2 bg-background_alt rounded-md p-4 w-full lg:w-1/3"
                          >
                            <div className="flex flex-row justify-between w-full">
                              <div className="flex flex-row gap-2 items-center">
                                <p className="text-secondary text-sm font-light text-wrap">
                                  {namedVector?.enabled ? (
                                    <FaCheck className="text-green-500" />
                                  ) : (
                                    <FaTimes className="text-red-500" />
                                  )}
                                </p>
                                <p className="font-bold">{key}</p>
                              </div>
                            </div>
                            <div className="flex flex-row gap-2">
                              <p className="text-primary text-sm font-bold">
                                Description:
                              </p>
                              {metadataEditor.editingNamedVectors ? (
                                <div className="flex flex-col gap-2 w-full">
                                  <textarea
                                    className="w-full border rounded p-2 bg-background text-sm"
                                    rows={3}
                                    value={
                                      metadataEditor.namedVectorsDraft[key]
                                        ?.description || ""
                                    }
                                    onChange={(e) =>
                                      metadataEditor.handleNamedVectorDescriptionChange(
                                        key,
                                        e.target.value,
                                      )
                                    }
                                    disabled={metadataEditor.savingNamedVectors}
                                    placeholder="Enter description..."
                                  />
                                </div>
                              ) : (
                                <p className="text-secondary text-sm font-light text-wrap">
                                  {namedVector?.description || "No description"}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-row gap-2">
                              <p className="text-primary text-sm font-bold">
                                Source Properties:
                              </p>
                              <p className="text-secondary text-sm font-light text-wrap">
                                {namedVector?.source_properties?.join(", ") ||
                                  "No source properties"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {metadataEditor.editingNamedVectors && (
                      <div className="flex gap-2 justify-end mt-2">
                        <Button
                          size="sm"
                          onClick={metadataEditor.handleSaveNamedVectors}
                          disabled={metadataEditor.savingNamedVectors}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            metadataEditor.setEditingNamedVectors(false);
                            // Reset the draft to original values
                            if (collectionMetadata?.metadata.named_vectors) {
                              metadataEditor.setNamedVectorsDraft(
                                collectionMetadata.metadata.named_vectors,
                              );
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
                  onClick={() => analyzeCollection(collection)}
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
              <div className="flex flex-col gap-4">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataExplorer;
