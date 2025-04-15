"use client";

import React, { useContext, useEffect, useState } from "react";

import { MdOutlineDataset } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

import { IoMdCloseCircle } from "react-icons/io";

import { Button } from "@/components/ui/button";

import { CollectionContext } from "../contexts/CollectionContext";

import { PiVectorThree } from "react-icons/pi";

import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "./DataTable";
import DataCell from "./DataCell";

import { useRouter } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const DataExplorer: React.FC = () => {
  const {
    selectedCollection,
    collectionData,
    loadingCollection,
    maxPage,
    page,
    sortOn,
    ascending,
    pageDown,
    pageUp,
    currentCollection,
    routerSetSortOn,
  } = useContext(CollectionContext);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [selectedCell, setSelectedCell] = useState<{
    [key: string]: any;
  } | null>(null);

  useEffect(() => {
    setSelectedCell(null);
  }, [selectedCollection]);

  const router = useRouter();

  const backToDashboard = () => {
    if (selectedCollection) {
      router.push(`/data?metadata=${selectedCollection}`);
    } else {
      router.push(`/data`);
    }
  };

  if (!currentCollection) return null;

  return (
    <div
      className="flex flex-col items-start justify-start outline-none w-full h-full gap-4"
      onKeyDown={(e) => e.key === "Escape" && setSelectedCell(null)}
      tabIndex={0}
    >
      <div className="flex flex-col gap-3 items-start justify-start w-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer"
                onClick={backToDashboard}
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem
              className="cursor-pointer"
              onClick={() => setSelectedCell(null)}
            >
              <BreadcrumbPage>Explorer</BreadcrumbPage>
            </BreadcrumbItem>
            {selectedCell && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="cursor-pointer">
                  <BreadcrumbPage>Object</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex w-full gap-4 justify-between items-center">
          <div className="flex lg:flex-row flex-col gap-4">
            <div className="flex items-center justify-start gap-2">
              <p className={`text-primary text-lg font-heading font-bold`}>
                {selectedCollection}
              </p>
            </div>
            <div className="flex items-center justify-start gap-2">
              <Button size="sm" variant="outline" onClick={backToDashboard}>
                <MdOutlineDataset />
                Explore Metadata
              </Button>
              <div className="flex items-center justify-start gap-2">
                <Button size="sm">{currentCollection.total} objects</Button>
                {currentCollection.vectorizer &&
                  currentCollection.vectorizer != "" && (
                    <Button size="sm">
                      <PiVectorThree />
                      {currentCollection.vectorizer}
                    </Button>
                  )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end justify-end h-full gap-2">
            {selectedCell && (
              <Button size="sm" onClick={() => setSelectedCell(null)}>
                <p>Close</p>
                <IoMdCloseCircle />
              </Button>
            )}
          </div>
        </div>
        {!selectedCell && (
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center justify-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => pageDown()}>
                <MdOutlineKeyboardArrowLeft />
                Previous
              </Button>
              <p className="text-primary text-xs font-light">
                {"Page " + (page + 1) + " of " + (maxPage + 1)}
              </p>
              <Button size="sm" variant="ghost" onClick={() => pageUp()}>
                Next
                <MdOutlineKeyboardArrowRight />
              </Button>
            </div>
          </div>
        )}
      </div>

      {loadingCollection && !collectionData && (
        <div className="flex flex-col gap-2 items-start justify-start w-full h-full mt-16 fade-in">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="w-full h-[25px] rounded-sm" />
          ))}
        </div>
      )}

      {!selectedCell && collectionData ? (
        <div className="overflow-auto h-[80vh] w-full">
          <DataTable
            data={collectionData?.items || []}
            header={Object.keys(collectionData?.properties || {})}
            setSelectedCell={setSelectedCell}
            setSortOn={routerSetSortOn}
            ascending={ascending}
            sortOn={sortOn || ""}
          />
        </div>
      ) : (
        <div className="overflow-auto h-[80vh] w-full">
          <DataCell selectedCell={selectedCell} />
        </div>
      )}
    </div>
  );
};

export default DataExplorer;
