"use client";

import React, { useContext, useEffect, useState } from "react";
import { CollectionContext } from "../contexts/CollectionContext";

import { Skeleton } from "@/components/ui/skeleton";

import { IoWarningOutline } from "react-icons/io5";
import { Separator } from "@/components/ui/separator";
import { LuDatabase } from "react-icons/lu";
import { RiFilePaperLine } from "react-icons/ri";

import { FaSortAlphaDown } from "react-icons/fa";
import { FaSortAlphaUp } from "react-icons/fa";
import { FaSortNumericDown } from "react-icons/fa";
import { FaSortNumericUp } from "react-icons/fa";

import { useRouter } from "next/navigation";
import { Collection } from "@/app/types/objects";
import DashboardButton from "./DataDashboardButton";
import { ConfigContext } from "../contexts/ConfigContext";
import DataKPI from "./DataKPI";
import { Button } from "@/components/ui/button";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const { collections } = useContext(CollectionContext);
  const { analyzeCollection, currentToasts } = useContext(ConfigContext);

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [processedCollections, setProcessedCollections] = useState(0);
  const [unprocessedCollections, setUnprocessedCollections] = useState(0);
  const [processedObjects, setProcessedObjects] = useState(0);
  const [unprocessedObjects, setUnprocessedObjects] = useState(0);

  const [collapsedUnknownSources, setCollapsedUnknownSources] = useState(true);

  const [sortBy, setSortBy] = useState<"name" | "total">("name");
  const [sortASC, setSortASC] = useState(true);

  useEffect(() => {
    if (collections.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
    setProcessedCollections(
      collections.filter((collection) => collection.processed).length
    );
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
  }, [collections]);

  const selectCollection = (collection: Collection) => {
    router.push(`/collection?source=${collection.name}`);
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

        <div className="flex flex-col gap-3 w-full flex-1 min-h-0">
          <div className="flex flex-col flex-1 gap-1 overflow-y-auto rounded-lg w-full">
            {loading ? (
              <div className="flex flex-col gap-2 w-full fade-in">
                <Skeleton className="w-full h-[45px] rounded-md" />
                <Skeleton className="w-full h-[45px] rounded-md" />
                <Skeleton className="w-full h-[45px] rounded-md" />
                <Skeleton className="w-full h-[45px] rounded-md" />
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {/* Sorting */}
                <div className="flex w-full items-center justify-between mb-2">
                  <p className="text-primary text-sm mb-2">
                    Available Sources ({processedCollections})
                  </p>
                  <div className="flex flex-row gap-2 items-center px-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => triggerSort("name")}
                      className={`${sortBy === "name" ? "bg-highlight" : ""}`}
                    >
                      {sortBy === "name" && sortASC ? (
                        <FaSortAlphaDown size={20} />
                      ) : (
                        <FaSortAlphaUp size={20} />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => triggerSort("total")}
                      className={`${sortBy === "total" ? "bg-highlight" : ""}`}
                    >
                      {sortBy === "total" && sortASC ? (
                        <FaSortNumericDown size={20} />
                      ) : (
                        <FaSortNumericUp size={20} />
                      )}
                    </Button>
                  </div>
                </div>
                {processedCollections === 0 && (
                  <div className="flex flex-row gap-2 items-center border border-warning p-4 rounded-md">
                    <IoWarningOutline className="text-warning" size={50} />
                    <p className="text-primary text-sm">
                      You currently have no data sources analyzed by Elysia. To
                      use Elysia please analyze a data source from the list
                      below. If no collections are available, please verify if
                      your Weaviate instance contains any collections.
                    </p>
                  </div>
                )}
                {collections &&
                  !loading &&
                  sortCollections(
                    collections.filter((collection) => collection.processed)
                  ).map((collection) => (
                    <DashboardButton
                      key={collection.name}
                      collection={collection}
                      selectCollection={selectCollection}
                      analyzeCollection={analyzeCollection}
                      currentToasts={currentToasts}
                      unprocessed={!collection.processed}
                    />
                  ))}
                <Separator className="my-4" />
                <p
                  className={`${collapsedUnknownSources ? "text-secondary" : "text-primary"} text-sm mb-2 cursor-pointer hover:text-primary`}
                  onClick={() => setCollapsedUnknownSources((prev) => !prev)}
                >
                  Analyzable Sources ({unprocessedCollections})
                </p>
                {collections &&
                  !collapsedUnknownSources &&
                  !loading &&
                  sortCollections(
                    collections.filter((collection) => !collection.processed)
                  ).map((collection) => (
                    <DashboardButton
                      key={collection.name}
                      collection={collection}
                      selectCollection={selectCollection}
                      analyzeCollection={analyzeCollection}
                      currentToasts={currentToasts}
                      unprocessed={!collection.processed}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
