"use client";

import React, { useContext, useEffect, useState } from "react";
import { MetadataPayload } from "../types";
import DashboardDetails from "./DashboardDetails";
import { CollectionContext } from "../contexts/CollectionContext";

import { MdOutlineClose, MdOutlineDataset } from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton";

import { FaCircle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface DashboardProps {
  metadata: MetadataPayload | null;
  loading: boolean;
  selectedMetadata: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({
  metadata,
  loading,
  selectedMetadata,
}) => {
  const router = useRouter();

  const { routerSelectCollection } = useContext(CollectionContext);
  const [total_objects, setTotalObjects] = useState(0);
  const [collection_count, setCollectionCount] = useState(0);

  const selectMetadata = (key: string) => {
    if (selectedMetadata === key) {
      router.push(`/data`);
    } else {
      router.push(`/data?metadata=${key}`);
    }
  };

  useEffect(() => {
    setCollectionCount(Object.keys(metadata?.metadata || {}).length);
    let count = 0;

    Object.values(metadata?.metadata || {}).forEach((collection) => {
      count += collection.length;
    });

    setTotalObjects(count);
  }, [metadata]);

  return (
    <div
      className="flex flex-col w-full gap-2 items-start justify-start"
      tabIndex={0}
    >
      <div className="flex flex-col md:flex-row w-full gap-4">
        <div className="flex flex-col w-full md:w-1/3 gap-4">
          <div className="flex items-center justify-start gap-2">
            <p className="text-xl font-bold font-heading text-primary">
              Data Dashboard
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex flex-col items-start justify-start flex-grow bg-background_alt border-secondary border p-3 rounded-md">
              <p className=" text-secondary text-xs">Data Sources</p>
              {loading ? (
                <FaCircle className="text-secondary mt-2 pulsing" />
              ) : (
                <p className="text-primary text-xl font-bold">
                  {collection_count}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start justify-start flex-grow bg-background_alt border-secondary border p-3 rounded-md">
              <p className=" text-secondary text-xs">Data Objects</p>
              {loading ? (
                <FaCircle className="text-secondary mt-2 pulsing" />
              ) : (
                <p className="text-primary text-xl font-bold">
                  {total_objects}
                </p>
              )}
            </div>
          </div>
          <Separator />
        </div>
        <div className="flex w-full md:w-2/3">
          {metadata && !loading && selectedMetadata && (
            <div className="flex flex-col w-full gap-2 items-start justify-end h-full">
              <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2">
                <p className="font-bold text-xl">
                  {metadata.metadata[selectedMetadata].name}
                </p>
                <div className="flex flex-row gap-2 items-center justify-end">
                  <Button
                    variant={"outline"}
                    onClick={() => routerSelectCollection(selectedMetadata)}
                  >
                    <MdOutlineDataset />
                    <p>Explore Data</p>
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
          } items-start justify-start w-full md:w-1/3 gap-3`}
        >
          <div className="flex flex-col gap-1 h-[70vh] overflow-y-auto rounded-lg p-3 w-full">
            {loading && (
              <div className="flex flex-col gap-2 w-full fade-in">
                <Skeleton className="w-full h-[45px] rounded-md" />
                <Skeleton className="w-full h-[45px] rounded-md" />
                <Skeleton className="w-full h-[45px] rounded-md" />
                <Skeleton className="w-full h-[45px] rounded-md" />
              </div>
            )}
            {metadata &&
              !loading &&
              Object.keys(metadata.metadata || {}).map((key) => (
                <div
                  key={key}
                  onClick={() => selectMetadata(key)}
                  className={`flex cursor-pointer border border-secondary rounded-lg justify-between gap-2 p-4 transition-all duration-300 w-full ${
                    selectedMetadata === key
                      ? "bg-foreground hover:bg-foreground_alt border-primary"
                      : "hover:bg-foreground bg-background_alt"
                  }`}
                >
                  <p className="text-primary font-heading truncate w-3/5 font-bold">
                    {metadata.metadata[key].name}
                  </p>
                  <div className="flex gap-2 items-center justify-start">
                    <Badge variant="outline">
                      {metadata.metadata[key].length} objects
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div
          className={`w-full md:w-2/3 h-[80vh] overflow-y-auto ${
            selectedMetadata ? "flex" : "hidden lg:flex"
          }`}
        >
          {metadata && !loading && selectedMetadata && (
            <DashboardDetails
              key={selectedMetadata}
              metadata={metadata}
              selectedMetadata={selectedMetadata}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
