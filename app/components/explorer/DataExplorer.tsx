"use client";

import React, { useContext, useEffect, useState } from "react";

import { getCollectionData } from "@/app/api/getCollection";
import { getCollectionMetadata } from "@/app/api/getCollectionMetadata";
import { FaTable } from "react-icons/fa6";
import { RiFilePaperLine } from "react-icons/ri";
import { LuDatabase, LuSettings2 } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { CollectionContext } from "../contexts/CollectionContext";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "./DataTable";
import { SessionContext } from "../contexts/SessionContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaLongArrowAltRight, FaSearch } from "react-icons/fa";
import { getDisplayIcon } from "@/app/types/displayIcons";
import { PiVectorThreeFill } from "react-icons/pi";
import { PiMagicWandFill } from "react-icons/pi";
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
import { CollectionDataPayload, MetadataPayload } from "@/app/types/payloads";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import MarkdownFormat from "../chat/display/MarkdownFormat";
import { Separator } from "@/components/ui/separator";
import { ToastContext } from "../contexts/ToastContext";

const DataExplorer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [collectionData, setCollectionData] =
    useState<CollectionDataPayload | null>(null);
  const [collectionMetadata, setCollectionMetadata] =
    useState<MetadataPayload | null>(null);
  const [metadataRows, setMetadataRows] = useState<{
    properties: { [key: string]: string };
    /* eslint-disable @typescript-eslint/no-explicit-any */
    items: { [key: string]: any }[];
  }>({ properties: {}, items: [] });

  const { collections, deleteCollection } = useContext(CollectionContext);
  const { id } = useContext(SessionContext);
  const { analyzeCollection } = useContext(ToastContext);

  const [loadingCollection, setLoadingCollection] = useState(false);

  const [view, setView] = useState("table");

  const [ascending, setAscending] = useState(true);
  const [sortOn, setSortOn] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [maxPage, setMaxPage] = useState(0);
  const [query, setQuery] = useState("");
  const [usingQuery, setUsingQuery] = useState(false);

  const [vectorizationModels, setVectorizationModels] = useState<{
    [key: string]: string[];
  } | null>(null);

  const loadCollectionData = async () => {
    if (!collection || !id) return;
    const filter_config = {
      type: "and",
      filters: [],
    };

    if (query.length > 0) {
      if (!usingQuery) {
        setPage(1);
        setUsingQuery(true);
      }
    } else {
      setUsingQuery(false);
    }

    const data = await getCollectionData(
      id,
      collection.name,
      page,
      pageSize,
      sortOn,
      ascending,
      filter_config,
      query
    );
    setCollectionData(data);
  };

  const loadCollectionMetadata = async () => {
    if (!collection || !id) return;
    const data = await getCollectionMetadata(id, collection.name);
    setCollectionMetadata(data);
    metadataToRows(data);
  };

  const metadataToRows = (metadata: MetadataPayload) => {
    const properties: Record<string, string> = {};
    const columns: Record<string, string[]> = {};

    // First pass: Build columns and find max length
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

    // Second pass: Create rows with pre-allocated length
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

  const [showUniqueValues, setShowUniqueValues] = useState(false);

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
    const collection_param = searchParams.get("source");
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
            setPage(_page);
          }
        } else {
          setPage(1);
        }

        const sort_on_param = searchParams.get("sort_on");
        if (sort_on_param) {
          setSortOn(sort_on_param);
        } else {
          setSortOn(null);
        }
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
                    disabled={showUniqueValues}
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
                        disabled={page === 1 || showUniqueValues}
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
                        disabled={page === maxPage || showUniqueValues}
                        onClick={() => pageUp()}
                      >
                        <MdOutlineKeyboardArrowRight />
                      </Button>
                    </div>
                  </div>
                  {/* Show unique values */}
                  <div className="flex items-center w-full md:w-1/3 justify-center md:justify-end gap-2">
                    <Checkbox
                      id="unique_values"
                      checked={showUniqueValues}
                      onCheckedChange={() =>
                        setShowUniqueValues(!showUniqueValues)
                      }
                    />
                    <label className="text-xs md:text-sm text-primary">
                      Show grouped values
                    </label>
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
                    data={
                      showUniqueValues
                        ? metadataRows.items
                        : collectionData?.items || []
                    }
                    header={
                      showUniqueValues
                        ? metadataRows.properties || {}
                        : collectionData?.properties || {}
                    }
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
                <p className="font-bold">Summary</p>
                <MarkdownFormat
                  text={collectionMetadata?.metadata.summary || ""}
                />
              </div>
              <Separator />
              {/* Mappings */}
              <div className="flex flex-col gap-2">
                <p className="font-bold">Display Mappings</p>
                {Object.keys(collectionMetadata?.metadata.mappings || {}).map(
                  (key) => {
                    const mappings: { [key: string]: [key: string] } =
                      collectionMetadata?.metadata.mappings[key] || {};
                    const totalMappings = Object.keys(mappings).length;
                    const matchingMappings = Object.values(mappings).filter(
                      (value) => value && value.length > 0
                    ).length;

                    return (
                      <div
                        key={key}
                        className="flex flex-col gap-4 w-fit p-3 bg-background_alt rounded-md"
                      >
                        <div className="flex flex-row gap-2 items-center">
                          {getDisplayIcon(key || "")}
                          <p className="font-bold text-sm md:text-base">
                            {key}
                          </p>
                          <p className="text-secondary">
                            ({matchingMappings}/{totalMappings})
                          </p>
                        </div>
                        <div>
                          {Object.keys(mappings).map((subkey) => (
                            <div className="flex flex-row gap-2 items-center">
                              <p
                                className={`w-[100px] md:w-[150px] truncate text-sm md:text-base ${
                                  !mappings[subkey] ? "text-secondary" : ""
                                }`}
                              >
                                {mappings[subkey] || "missing"}
                              </p>
                              <FaLongArrowAltRight
                                className={`${
                                  !mappings[subkey]
                                    ? "text-secondary"
                                    : "text-primary"
                                }`}
                              />
                              <p
                                className={`truncate text-sm md:text-base ${
                                  !mappings[subkey] ? "text-secondary" : ""
                                }`}
                              >
                                {subkey}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
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
