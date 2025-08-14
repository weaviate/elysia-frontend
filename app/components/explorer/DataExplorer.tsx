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
import { MetadataPayload } from "@/app/types/payloads";
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
import { motion } from "framer-motion";

const DataExplorer = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { changePage } = useContext(RouterContext);

  const [collection, setCollection] = useState<Collection | null>(null);
  const { collections } = useContext(CollectionContext);
  const { id } = useContext(SessionContext);

  const {
    collectionData,
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
    loadingData,
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
  const [globalVectorizer, setGlobalVectorizer] = useState<{
    vectorizer: string;
    model: string;
  } | null>(null);
  const [vectorizerNoteVisible, setVectorizerNoteVisible] = useState(true);
  const [vectorizerChecked, setVectorizerChecked] = useState(false);

  const metadataEditor = useCollectionMetadataEditor({
    collection,
    id: typeof id === "string" ? id : null,
    collectionMetadata,
    metadataRows,
    collectionDataProperties: collectionData?.properties || {},
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

  const processGlobalVectorizer = (
    vectorizer: Vectorizer,
    metadata: MetadataPayload | null
  ) => {
    // Process global vectorizer
    if (
      vectorizer.global &&
      vectorizer.global.model &&
      vectorizer.global.vectorizer
    ) {
      setGlobalVectorizer({
        vectorizer: vectorizer.global.vectorizer,
        model: vectorizer.global.model,
      });
    } else if (
      metadata?.metadata?.vectorizer?.vectorizer &&
      metadata?.metadata?.vectorizer?.model
    ) {
      // Fallback to metadata global vectorizer if collection vectorizer doesn't have global
      setGlobalVectorizer({
        vectorizer: metadata.metadata.vectorizer.vectorizer,
        model: metadata.metadata.vectorizer.model,
      });
    } else {
      setGlobalVectorizer(null);
    }
    // Mark that we've completed the vectorizer check
    setVectorizerChecked(true);
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
        processGlobalVectorizer(collection.vectorizer, collectionMetadata);
      } else {
        // If no vectorizer, mark as checked with null result
        setGlobalVectorizer(null);
        setVectorizerChecked(true);
      }
    } else {
      // Reset when no collection
      setVectorizerChecked(false);
    }
  }, [collection, collectionMetadata]);

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
          <div className="flex flex-row justify-between items-center w-full bg-warning/10 text-warning border border-warning p-2 rounded-md">
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
          (!globalVectorizer || !globalVectorizer.vectorizer) &&
          (!collectionMetadata?.metadata.named_vectors ||
            collectionMetadata.metadata.named_vectors.length === 0) &&
          vectorizerChecked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                type: "tween",
                delay: 0.2,
              }}
              className="flex flex-row justify-between items-center w-full border border-highlight bg-highlight/10 p-2 rounded-md"
            >
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
                  No vectorizers could be detected for this collection (neither
                  global nor named vectors). Vector search might be limited
                  which could lead to issues. Please verify that your collection
                  is using one of Weaviate&apos;s supported embedding model
                  providers.{" "}
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
            </motion.div>
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
                    className="text-sm placeholder:text-secondary placeholder:text-sm"
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <Button
                    className="bg-accent/10 border border-accent hover:bg-accent/20 w-9 h-9"
                    onClick={() => loadCollectionData()}
                  >
                    <FaSearch className="text-accent" />
                  </Button>
                </div>
                {/* Bottom Menu */}
                <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-1 w-full">
                  <div className="hidden md:block w-1/3"></div>
                  {/* Pagination */}
                  <div className="flex items-center justify-center w-full md:w-1/3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        disabled={page === 1}
                        onClick={() => pageDown()}
                        className="w-8 h-8"
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
                        variant="ghost"
                        disabled={page === maxPage}
                        onClick={() => pageUp()}
                        className="w-8 h-8"
                      >
                        <MdOutlineKeyboardArrowRight />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <motion.div
                className="flex-1 min-h-0 min-w-0 mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  type: "tween",
                  delay: 0.2,
                }}
              >
                {loadingCollection && !collectionData && !loadingData ? (
                  <div className="flex flex-col gap-2 items-start justify-start w-full h-full fade-in overflow-auto">
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
                    stickyHeaders={true}
                    maxHeight="100%"
                    loadingData={loadingData}
                  />
                )}
              </motion.div>
            </>
          )}
          {view === "metadata" && (
            <DataMetadata
              collectionMetadata={collectionMetadata}
              metadataEditor={metadataEditor}
              collectionDataProperties={collectionData?.properties || {}}
            />
          )}
          {/* Configuration */}
          {view === "configuration" && collection && (
            <DataConfig
              collection={collection}
              collectionMetadata={collectionMetadata}
              metadataEditor={metadataEditor}
              globalVectorizer={globalVectorizer}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DataExplorer;
