"use client";

import React, { useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Collection } from "@/app/types/objects";

import { CollectionContext } from "../contexts/CollectionContext";
import { SessionContext } from "../contexts/SessionContext";
import { ToastContext } from "../contexts/ToastContext";

import DashboardButton from "./components/DataDashboardButton";
import DataKPI from "./components/DataKPI";

import { IoTrash, IoWarningOutline } from "react-icons/io5";
import { LuDatabase } from "react-icons/lu";
import { RiFilePaperLine } from "react-icons/ri";
import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortNumericDown,
  FaSortNumericUp,
} from "react-icons/fa";
import { IoIosRefresh } from "react-icons/io";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { RouterContext } from "../contexts/RouterContext";
import { ProcessingContext } from "../contexts/ProcessingContext";
import { deleteAllCollectionMetadata } from "@/app/api/deleteAllCollectionMetadata";
import DeleteButton from "../navigation/DeleteButton";
import { motion } from "framer-motion";

const Dashboard: React.FC = () => {
  const {
    collections,
    deleteCollection,
    fetchCollections,
    loadingCollections,
  } = useContext(CollectionContext);
  const { id } = useContext(SessionContext);
  const { currentToasts, showErrorToast } = useContext(ToastContext);
  const { triggerAnalysis } = useContext(ProcessingContext);
  const { changePage } = useContext(RouterContext);

  const [loading, setLoading] = useState(true);

  const [processedCollections, setProcessedCollections] = useState(0);
  const [unprocessedCollections, setUnprocessedCollections] = useState(0);
  const [processedObjects, setProcessedObjects] = useState(0);
  const [unprocessedObjects, setUnprocessedObjects] = useState(0);

  const [collapsedUnknownSources, setCollapsedUnknownSources] = useState(true);
  const [collapsedAvailableSources, setCollapsedAvailableSources] =
    useState(false);

  const [sortBy, setSortBy] = useState<"name" | "total">("name");
  const [sortASC, setSortASC] = useState(true);

  useEffect(() => {
    const processedCount = collections.filter(
      (collection) => collection.processed
    ).length;
    setProcessedCollections(processedCount);
    setProcessedObjects(
      collections
        .filter((collection) => collection.processed)
        .reduce((acc, collection) => acc + collection.total, 0)
    );
    setUnprocessedCollections(
      collections.filter((collection) => !collection.processed).length
    );
    setUnprocessedObjects(
      collections
        .filter((collection) => !collection.processed)
        .reduce((acc, collection) => acc + collection.total, 0)
    );

    // Auto-expand unanalyzed collections when no processed collections exist
    setCollapsedUnknownSources(processedCount > 0);
  }, [collections]);

  useEffect(() => {
    setLoading(loadingCollections);
  }, [loadingCollections]);

  const selectCollection = (collection: Collection) => {
    changePage("collection", { source: collection.name }, true);
  };

  const triggerSort = (_sortBy: "name" | "total") => {
    if (_sortBy === "name") {
      if (sortBy === "name") {
        setSortASC((prev) => !prev);
      } else {
        setSortBy("name");
        setSortASC(true);
      }
    } else {
      if (sortBy === "total") {
        setSortASC((prev) => !prev);
      } else {
        setSortBy("total");
        setSortASC(true);
      }
    }
  };

  const sortCollections = (collections: Collection[]) => {
    return collections.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else {
        comparison = a.total - b.total;
      }

      return sortASC ? comparison : -comparison;
    });
  };

  const handleDeleteAllCollectionMetadata = async () => {
    const response = await deleteAllCollectionMetadata(id ?? "");
    if (response.error) {
      showErrorToast("Error deleting all collection metadata", response.error);
    }
    fetchCollections();
  };

  return (
    <div className="flex w-full flex-col gap-2 min-h-0 items-center justify-start h-full fade-in">
      {/* Title */}
      <div className="flex mb-2 w-full justify-start">
        <p className="text-lg text-primary">Data Dashboard</p>
      </div>
      <div className="flex flex-col w-full md:w-[60vw] lg:w-[40vw] gap-6 h-full">
        {/* KPI */}
        <div className="flex flex-col gap-2 w-full rounded-md">
          <div className="flex flex-row gap-2 w-full">
            <DataKPI
              loading={loading}
              value={processedCollections}
              label="Data Sources"
              icon={<LuDatabase size={20} />}
              color="accent"
              lines={false}
            />
            <DataKPI
              loading={loading}
              value={processedObjects}
              label="Data Objects"
              icon={<RiFilePaperLine size={20} />}
              color="highlight"
              lines={false}
            />
          </div>
          {unprocessedCollections > 0 && (
            <div className="flex flex-row gap-2 w-full">
              <DataKPI
                loading={loading}
                value={unprocessedCollections}
                label="Unknown Sources"
                icon={<LuDatabase size={20} />}
                color="muted"
                lines={true}
              />
              <DataKPI
                loading={loading}
                value={unprocessedObjects}
                label="Unknown Objects"
                icon={<RiFilePaperLine size={20} />}
                color="muted"
                lines={true}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full flex-1 min-h-0 mb-16 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col gap-2 w-full fade-in">
              <Skeleton className="w-full h-[45px] rounded-md" />
              <Skeleton className="w-full h-[45px] rounded-md" />
              <Skeleton className="w-full h-[45px] rounded-md" />
              <Skeleton className="w-full h-[45px] rounded-md" />
            </div>
          ) : (
            <div className="flex flex-col gap-3 flex-1 min-h-0">
              {/* Control Bar */}
              <div className="flex w-full items-center justify-between">
                <p className="text-primary text-sm">Collections</p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.3,
                    type: "tween",
                    stiffness: 250,
                  }}
                  className="flex flex-row gap-2 items-center px-1"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          onClick={() => fetchCollections()}
                          className={`border border-accent text-accent bg-accent/10 w-10 h-10`}
                        >
                          <IoIosRefresh size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refresh collections</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          onClick={() => triggerSort("name")}
                          className={`border w-10 h-10 ${sortBy === "name" ? "border-primary/80 bg-primary/10 text-primary" : "border-transparent text-secondary"}`}
                        >
                          {sortBy === "name" && sortASC ? (
                            <FaSortAlphaDown size={16} />
                          ) : (
                            <FaSortAlphaUp size={16} />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Sort by name{" "}
                          {sortBy === "name"
                            ? sortASC
                              ? "(A-Z)"
                              : "(Z-A)"
                            : ""}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          onClick={() => triggerSort("total")}
                          className={`border w-10 h-10 ${sortBy === "total" ? "border-primary/80 bg-primary/10 text-primary" : "border-transparent text-secondary"}`}
                        >
                          {sortBy === "total" && sortASC ? (
                            <FaSortNumericDown size={16} />
                          ) : (
                            <FaSortNumericUp size={16} />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Sort by total objects{" "}
                          {sortBy === "total"
                            ? sortASC
                              ? "(low to high)"
                              : "(high to low)"
                            : ""}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DeleteButton
                          variant="ghost"
                          onClick={handleDeleteAllCollectionMetadata}
                          classNameDefault={`border border-error text-error w-10 h-10`}
                          classNameConfirm={`border border-error text-error`}
                          icon={<IoTrash size={16} />}
                          confirmText="Clear all metadata?"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clear all collection metadata</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              </div>

              {/* Available Sources Section */}
              <div className="flex flex-col">
                <div className="flex w-full items-center justify-between mb-2">
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:text-primary"
                    onClick={() =>
                      setCollapsedAvailableSources((prev) => !prev)
                    }
                  >
                    <p
                      className={`${collapsedAvailableSources ? "text-secondary" : "text-primary"} text-sm font-medium`}
                    >
                      Available Sources ({processedCollections})
                    </p>
                    {collapsedAvailableSources ? (
                      <IoChevronDown size={16} className="text-secondary" />
                    ) : (
                      <IoChevronUp size={16} className="text-primary" />
                    )}
                  </div>
                </div>

                {processedCollections === 0 && !collapsedAvailableSources && (
                  <motion.div className="flex flex-row gap-2 items-center bg-warning/10 border border-warning p-4 rounded-md mb-2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.2,
                        duration: 0.3,
                        type: "spring",
                        stiffness: 150,
                      }}
                    >
                      <IoWarningOutline className="text-warning" size={20} />
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.4,
                        duration: 0.3,
                        type: "spring",
                        stiffness: 150,
                      }}
                      className="text-warning text-sm"
                    >
                      You currently have no data sources analyzed by Elysia. To
                      use Elysia please analyze a data source from the list
                      below. If no collections are available, please verify if
                      your Weaviate instance contains any collections.
                    </motion.p>
                  </motion.div>
                )}

                {!collapsedAvailableSources && (
                  <div className="overflow-y-auto rounded-lg border border-border/50 max-h-[30rem] mb-3">
                    <div className="flex flex-col gap-1 p-2">
                      {collections &&
                        !loading &&
                        sortCollections(
                          collections.filter(
                            (collection) => collection.processed
                          )
                        ).map((collection) => (
                          <DashboardButton
                            key={collection.name}
                            collection={collection}
                            selectCollection={selectCollection}
                            triggerAnalysis={triggerAnalysis}
                            user_id={id ?? ""}
                            currentToasts={currentToasts}
                            unprocessed={!collection.processed}
                            deleteCollection={deleteCollection}
                          />
                        ))}
                      {processedCollections === 0 && (
                        <div className="flex items-center justify-center h-32 text-secondary text-sm">
                          No available sources
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Analyzable Sources Section */}
              <div className="flex flex-col">
                <div className="flex w-full items-center justify-between mb-2">
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:text-primary"
                    onClick={() => setCollapsedUnknownSources((prev) => !prev)}
                  >
                    <p
                      className={`${collapsedUnknownSources ? "text-secondary" : "text-primary"} text-sm font-medium`}
                    >
                      Analyzable Sources ({unprocessedCollections})
                    </p>
                    {collapsedUnknownSources ? (
                      <IoChevronDown size={16} className="text-secondary" />
                    ) : (
                      <IoChevronUp size={16} className="text-primary" />
                    )}
                  </div>
                </div>

                {!collapsedUnknownSources && (
                  <div className="overflow-y-auto rounded-lg border border-border/50 max-h-[30rem] mb-16">
                    <div className="flex flex-col gap-1 p-2">
                      {collections &&
                        !loading &&
                        sortCollections(
                          collections.filter(
                            (collection) => !collection.processed
                          )
                        ).map((collection) => (
                          <DashboardButton
                            key={collection.name}
                            collection={collection}
                            selectCollection={selectCollection}
                            triggerAnalysis={triggerAnalysis}
                            user_id={id ?? ""}
                            currentToasts={currentToasts}
                            unprocessed={!collection.processed}
                            deleteCollection={deleteCollection}
                          />
                        ))}
                      {unprocessedCollections === 0 && (
                        <div className="flex items-center justify-center h-32 text-secondary text-sm">
                          No analyzable sources
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
