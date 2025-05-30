"use client";

import React, { useContext, useEffect, useState } from "react";
import { CollectionContext } from "../contexts/CollectionContext";

import { Skeleton } from "@/components/ui/skeleton";

import { FaCircle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

import { useRouter } from "next/navigation";
import { Collection } from "@/app/types/objects";
import DashboardButton from "./DataDashboardButton";
import { Button } from "@/components/ui/button";
import { ConfigContext } from "../contexts/ConfigContext";

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

  useEffect(() => {
    setProcessedCollections(
      collections.filter((collection) => collection.processed).length,
    );
    setProcessedObjects(
      collections
        .filter((collection) => collection.processed)
        .reduce((acc, collection) => acc + collection.total, 0),
    );
    setUnprocessedCollections(
      collections.filter((collection) => !collection.processed).length,
    );
    setUnprocessedObjects(
      collections
        .filter((collection) => !collection.processed)
        .reduce((acc, collection) => acc + collection.total, 0),
    );
  }, [collections]);

  useEffect(() => {
    if (collections.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [collections]);

  const selectCollection = (collection: Collection) => {
    router.push(`/collection?source=${collection.name}`);
  };

  return (
    <div className="flex flex-col w-full gap-2 min-h-0 items-start justify-start h-full">
      {/* Title */}
      <div className="flex mb-2">
        <p className="text-xl font-bold text-primary">Data Dashboard</p>
      </div>
      {/* KPI */}
      <div className="flex flex-col gap-3 w-full rounded-md bg-gradient-to-br from-foreground to-background p-6 shadow-md">
        <div className="flex flex-row gap-3 w-full">
          <div className="flex flex-col items-start justify-start w-1/2 border-secondary border p-3 rounded-md">
            {loading ? (
              <FaCircle className="text-secondary mt-2 pulsing" />
            ) : (
              <p className="text-accent text-2xl font-bold">
                {processedCollections}
              </p>
            )}
            <p className=" text-secondary text-xs">Data Sources</p>
          </div>
          <div className="flex flex-col items-start justify-start w-1/2 bg-background_alt border-secondary border p-3 rounded-md">
            {loading ? (
              <FaCircle className="text-secondary mt-2 pulsing" />
            ) : (
              <p className="text-primary text-2xl font-bold">
                {processedObjects}
              </p>
            )}
            <p className=" text-secondary text-xs">Data Objects</p>
          </div>
        </div>
        {unprocessedCollections > 0 && (
          <div className="flex flex-row gap-3 w-full">
            <div className="flex flex-col items-start justify-start w-1/2 border-secondary border p-3 rounded-md">
              {loading ? (
                <FaCircle className="text-secondary mt-2 pulsing" />
              ) : (
                <p className="text-warning text-2xl font-bold">
                  {unprocessedCollections}
                </p>
              )}
              <p className=" text-secondary text-xs">Not analyzed</p>
            </div>
            <div className="flex flex-col items-start justify-start w-1/2 bg-background_alt border-secondary border p-3 rounded-md">
              {loading ? (
                <FaCircle className="text-secondary mt-2 pulsing" />
              ) : (
                <p className="text-secondary text-2xl font-bold">
                  {unprocessedObjects}
                </p>
              )}
              <p className=" text-secondary text-xs">Unanalyzed Objects</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 w-full rounded-md bg-background_alt p-6 shadow-md flex-1 min-h-0">
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
              <p className="text-secondary text-sm mb-2">
                Processed Collections
              </p>
              {collections &&
                !loading &&
                collections
                  .filter((collection) => collection.processed)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((collection) => (
                    <DashboardButton
                      key={collection.name}
                      collection={collection}
                      selectCollection={selectCollection}
                      analyzeCollection={analyzeCollection}
                      currentToasts={currentToasts}
                    />
                  ))}
              <Separator className="my-4" />
              <p className="text-secondary text-sm mb-2">
                Unprocessed Collections
              </p>
              {collections &&
                !loading &&
                collections
                  .filter((collection) => !collection.processed)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((collection) => (
                    <DashboardButton
                      key={collection.name}
                      collection={collection}
                      selectCollection={selectCollection}
                      analyzeCollection={analyzeCollection}
                      currentToasts={currentToasts}
                    />
                  ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
