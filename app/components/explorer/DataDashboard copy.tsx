"use client";

import React, { useContext, useEffect, useState } from "react";
import { MetadataPayload } from "@/app/types/payloads";
import DashboardDetails from "./DashboardDetails";
import { CollectionContext } from "../contexts/CollectionContext";

import { MdOutlineClose, MdOutlineDataset } from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton";

import { FaCircle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { useRouter, usePathname } from "next/navigation";
import { Collection } from "@/app/types/objects";
import DashboardButton from "./DataDashboardButton";

interface DashboardProps {
  metadata: MetadataPayload | null;
  loading: boolean;
  selectedMetadata: string | null;
  collections: Collection[];
}

const Dashboard: React.FC<DashboardProps> = ({
  metadata,
  loading,
  selectedMetadata,
  collections,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const { routerSelectCollection } = useContext(CollectionContext);
  const [processedCollections, setProcessedCollections] = useState(0);
  const [processedObjects, setProcessedObjects] = useState(0);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  const selectMetadata = (key: string) => {
    if (selectedMetadata === key) {
      router.push(`${pathname}`);
    } else {
      router.push(`${pathname}?metadata=${key}`);
    }
  };

  useEffect(() => {
    setProcessedCollections(
      collections.filter((collection) => collection.processed).length,
    );
    setProcessedObjects(
      collections
        .filter((collection) => collection.processed)
        .reduce((acc, collection) => acc + collection.total, 0),
    );
  }, [collections]);

  useEffect(() => {
    const collection = collections.find(
      (collection) => collection.name === selectedMetadata,
    );
    if (collection) {
      setSelectedCollection(collection);
    }
  }, [selectedMetadata]);

  return (
    <div
      className="flex flex-col w-full gap-2 items-start justify-start"
      tabIndex={0}
    >
      <div className="flex flex-col md:flex-row w-full gap-4">
        <div className="flex flex-col w-full md:w-1/3 gap-4">
          <div className="flex items-center justify-start gap-2">
            <p className="text-xl font-bold text-primary">Data Dashboard</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex flex-col items-start justify-start flex-grow bg-background_alt border-secondary border p-3 rounded-md">
              <p className=" text-secondary text-xs">Data Sources</p>
              {loading ? (
                <FaCircle className="text-secondary mt-2 pulsing" />
              ) : (
                <p className="text-primary text-xl font-bold">
                  {processedCollections}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start justify-start flex-grow bg-background_alt border-secondary border p-3 rounded-md">
              <p className=" text-secondary text-xs">Data Objects</p>
              {loading ? (
                <FaCircle className="text-secondary mt-2 pulsing" />
              ) : (
                <p className="text-primary text-xl font-bold">
                  {processedObjects}
                </p>
              )}
            </div>
            {collections.length - processedCollections > 0 && (
              <div className="flex flex-col items-start justify-start flex-grow bg-background_alt border-secondary border p-3 rounded-md">
                <p className=" text-secondary text-xs flex items-center justify-start gap-2">
                  Not analyzed
                </p>
                {loading ? (
                  <FaCircle className="text-secondary mt-2 pulsing" />
                ) : (
                  <p className="text-primary text-xl font-bold">
                    {collections.length - processedCollections}
                  </p>
                )}
              </div>
            )}
          </div>
          <Separator />
        </div>
        <div className="flex w-full md:w-2/3">
          {metadata && !loading && selectedMetadata && (
            <div className="flex flex-col w-full gap-2 items-start justify-end h-full">
              <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2">
                <p className="font-bold text-xl">
                  {selectedCollection && selectedCollection.name}
                </p>
                <div className="flex flex-row gap-2 items-center justify-end">
                  <Button
                    variant={"outline"}
                    onClick={() => routerSelectCollection(selectedMetadata)}
                  >
                    <MdOutlineDataset />
                    <p>View Data</p>
                  </Button>
                  {selectedMetadata && (
                    <Button onClick={() => router.push("/data")}>
                      <MdOutlineClose />
                      <p>Close</p>
                    </Button>
                  )}
                </div>
              </div>
              <Separator />
            </div>
          )}
        </div>
      </div>
      <div className={`flex flex-col md:flex-row w-full gap-4`}>
        <div
          className={`flex flex-col ${
            selectedMetadata ? "hidden lg:flex" : "flex"
          } items-start justify-start w-full md:w-1/4 gap-3`}
        >
          <div className="flex flex-col gap-1 h-[80vh] overflow-y-auto rounded-lg w-full">
            {loading && (
              <div className="flex flex-col gap-2 w-full fade-in">
                <Skeleton className="w-full h-[45px] rounded-md" />
                <Skeleton className="w-full h-[45px] rounded-md" />
                <Skeleton className="w-full h-[45px] rounded-md" />
                <Skeleton className="w-full h-[45px] rounded-md" />
              </div>
            )}
            {collections &&
              !loading &&
              collections
                .filter((collection) => collection.processed)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((collection) => (
                  <DashboardButton
                    key={collection.name}
                    collection={collection}
                    selectMetadata={selectMetadata}
                    selectedMetadata={selectedMetadata}
                  />
                ))}
            <Separator className="my-4" />
            {collections &&
              !loading &&
              collections
                .filter((collection) => !collection.processed)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((collection) => (
                  <DashboardButton
                    key={collection.name}
                    collection={collection}
                    selectMetadata={selectMetadata}
                    selectedMetadata={selectedMetadata}
                  />
                ))}
          </div>
        </div>
        <div
          className={`w-full md:w-2/3 h-[80vh] overflow-y-auto ${
            selectedMetadata ? "flex" : "hidden lg:flex"
          }`}
        >
          {metadata && collections && !loading && selectedMetadata && (
            <DashboardDetails
              key={selectedMetadata}
              metadata={metadata}
              selectedCollection={selectedCollection}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
