"use client";

import React, { useContext, useEffect, useState } from "react";

import { getCollectionData } from "@/app/api/get_collection";
import { getCollectionMetadata } from "@/app/api/get_collection_metadata";
import { FaTable } from "react-icons/fa6";
import { HiMiniSquare3Stack3D } from "react-icons/hi2";
import { RiFilePaperLine } from "react-icons/ri";
import { LuSettings2 } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { CollectionContext } from "../contexts/CollectionContext";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "./DataTable";
import DataCell from "./DataCell";
import { SessionContext } from "../contexts/SessionContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { VscGraphLeft } from "react-icons/vsc";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Collection } from "@/app/types/objects";
import { CollectionDataPayload, MetadataPayload } from "@/app/types/payloads";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import MarkdownMessageDisplay from "../chat/display/markdown";
import { Separator } from "@/components/ui/separator";

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
  const { collections } = useContext(CollectionContext);
  const { id } = useContext(SessionContext);

  const [loadingCollection, setLoadingCollection] = useState(false);

  const [view, setView] = useState("table");

  const [ascending, setAscending] = useState(true);
  const [sortOn, setSortOn] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [maxPage, setMaxPage] = useState(0);

  const loadCollectionData = async () => {
    if (!collection || !id) return;
    const filter_config = {
      type: "and",
      filters: [],
    };
    const data = await getCollectionData(
      id,
      collection.name,
      page,
      pageSize,
      sortOn,
      ascending,
      filter_config
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
      Object.keys(columns).reduce((obj, fieldKey) => {
        obj[fieldKey] = columns[fieldKey][i] || "";
        return obj;
      }, {} as Record<string, string>)
    );

    console.log("Metadata to rows");
    console.log(metadata);

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

  const pageUp = () => {
    if (!collection) return;
    if (page + 1 > maxPage) return;
    routerSetPage(page + 1);
  };

  const pageDown = () => {
    if (page === 1) return;
    routerSetPage(page - 1);
  };

  useEffect(() => {
    const collection_param = searchParams.get("source");
    if (collection_param) {
      const collection = collections.find((c) => c.name === collection_param);
      if (collection) {
        setCollection(collection);
        const max_pages = Math.ceil(collection.total / pageSize);
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
    <div className="flex flex-col w-full gap-2 min-h-0 items-start justify-start h-full">
      {/* Breadcrumb Title */}
      <div className="flex mb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer text-xl"
                onClick={() => router.push(`/data`)}
              >
                Data Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="cursor-pointer">
              <BreadcrumbPage className="text-xl gap-2 flex items-center justify-center">
                {collection && collection.name}
                <Button size="sm">
                  {collection && collection.total && !loadingCollection ? (
                    `${collection.total} objects`
                  ) : (
                    <p className="text-xs shine">Loading...</p>
                  )}
                </Button>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Menu */}
      <div className="flex flex-row flex-wrap gap-3 w-full justify-end items-center rounded-md bg-background_alt p-2">
        <Button
          variant={view === "table" ? "outline" : "default"}
          onClick={() => setView("table")}
          className="flex flex-1"
        >
          <FaTable />
          Table
        </Button>
        <Button
          variant={view === "metadata" ? "outline" : "default"}
          onClick={() => setView("metadata")}
          className="flex flex-1"
        >
          <RiFilePaperLine />
          Metadata
        </Button>
        <Button
          variant={view === "plot" ? "outline" : "default"}
          onClick={() => setView("plot")}
          className="flex flex-1"
        >
          <HiMiniSquare3Stack3D />
          Visualization
        </Button>
        <Button
          variant={view === "configuration" ? "outline" : "default"}
          onClick={() => setView("configuration")}
          className="flex flex-1"
        >
          <LuSettings2 />
          Configuration
        </Button>
      </div>

      {/* Main */}
      <div className="flex flex-col gap-3 w-full rounded-md bg-gradient-to-br from-foreground to-background p-6 shadow-md flex-1 min-h-0 min-w-0">
        {view === "table" && (
          <>
            <div className="flex flex-col w-full gap-4">
              {/* Search */}
              <div className="flex flex-row gap-1 w-full">
                <Input
                  type="text"
                  disabled={showUniqueValues}
                  placeholder={"Search " + (collection?.name || "collection")}
                />
                <Button
                  disabled={showUniqueValues}
                  variant={sortOn ? "destructive" : "default"}
                  onClick={clearSort}
                >
                  <VscGraphLeft />
                  <p>Clear Sort</p>
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
                      Previous
                    </Button>
                    <p className="text-primary text-xs font-light">
                      {"Page " + page + " of " + maxPage}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={page === maxPage || showUniqueValues}
                      onClick={() => pageUp()}
                    >
                      Next
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
                    Show unique values
                  </label>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0 min-w-0 overflow-auto">
              {loadingCollection && !collectionData ? (
                <div className="flex flex-col gap-2 items-start justify-start w-full h-full fade-in">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="w-full h-[25px] rounded-sm" />
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
              <p className="text-base md:text-lg font-bold">Data Summary</p>
              <MarkdownMessageDisplay
                text={collectionMetadata?.metadata.summary || ""}
              />
            </div>
            <Separator />
            {/* Mappings */}
            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-lg font-bold">Display Mappings</p>
              {Object.keys(collectionMetadata?.metadata.mappings || {}).map(
                (key) => (
                  <div className="flex flex-row gap-4 w-fit p-2 border border-secondary rounded-md">
                    <div key={key}>
                      <p className="font-bold text-sm md:text-base">{key}</p>
                    </div>
                    <div>
                      {Object.keys(
                        collectionMetadata?.metadata.mappings[key] || {}
                      ).map((subkey) => (
                        <div className="flex flex-row gap-2 items-center">
                          <p className="w-[100px] md:w-[150px] truncate text-sm md:text-base">
                            {" "}
                            {collectionMetadata?.metadata.mappings[key][subkey]}
                          </p>
                          <FaLongArrowAltRight />
                          <p
                            className={`truncate text-sm md:text-base ${
                              !collectionMetadata?.metadata.mappings[key][
                                subkey
                              ]
                                ? "text-error font-bold"
                                : ""
                            }`}
                          >
                            {subkey}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataExplorer;
