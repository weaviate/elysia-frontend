"use client";

import React, { useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CollectionContext } from "../contexts/CollectionContext";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "./DataTable";
import { SessionContext } from "../contexts/SessionContext";
import { usePathname, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import { Collection, Vectorizer } from "@/app/types/objects";
import { Input } from "@/components/ui/input";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { RouterContext } from "../contexts/RouterContext";

import { useCollectionData } from "./hooks/useCollectionData";
import { useCollectionMetadata } from "./hooks/useCollectionMetadata";
import { useCollectionMetadataEditor } from "./hooks/useCollectionMetadataEditor";
import CollectionBreadcrumb from "./components/CollectionBreadcrumb";
import ViewToggleMenu from "./components/ViewToggleMenu";
import DataConfig from "./DataConfig";
import DataMetadata from "./DataMetadata";

const DataExplorer = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { changePage } = useContext(RouterContext);

  const [collection, setCollection] = useState<Collection | null>(null);
  const { collections } = useContext(CollectionContext);
  const { id } = useContext(SessionContext);

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
  const [vectorizerNoteVisible, setVectorizerNoteVisible] = useState(true);

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
          vectorizerNoteVisible &&
          (!vectorizationModels ||
            Object.keys(vectorizationModels).length === 0) && (
            <div className="flex flex-row justify-between items-center w-full border border-highlight bg-highlight/10 p-2 rounded-md">
              <div className="flex flex-col gap-1 items-start justify-start">
                <div className="flex flex-row gap-1 items-center justify-between w-full">
                  <p className="text-sm font-bold text-highlight">Note</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVectorizerNoteVisible(false)}
                    className="h-auto p-1 text-highlight hover:text-highlight hover:bg-highlight/20"
                    aria-label="Close note"
                  >
                    <IoClose size={16} />
                  </Button>
                </div>
                <p className="text-sm ">
                  No global vectorizers could be detected for this collection.
                  Vector search might be limited which could lead to issues.
                  Please verify that your collection is using one of
                  Weaviate&apos;s supported embedding model providers.{" "}
                </p>
                <a
                  href="https://docs.weaviate.io/weaviate/model-providers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-highlight underline hover:no-underline text-sm"
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
              <div className="flex-1 min-h-0 min-w-0 overflow-auto mb-16">
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
            <DataMetadata
              collectionMetadata={collectionMetadata}
              metadataEditor={metadataEditor}
              metadataRows={metadataRows}
            />
          )}
          {/* Configuration */}
          {view === "configuration" && collection && (
            <DataConfig
              collection={collection}
              collectionMetadata={collectionMetadata}
              metadataEditor={metadataEditor}
              vectorizationModels={vectorizationModels}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DataExplorer;
