"use client";

import React, { useContext, useEffect, useState } from "react";

import { getCollectionData } from "@/app/api/get_collection";
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

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Collection } from "@/app/types/objects";
import { CollectionDataPayload } from "@/app/types/payloads";

const DataExplorer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [collectionData, setCollectionData] =
    useState<CollectionDataPayload | null>(null);
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

  const triggerAscending = () => {
    setAscending((prev) => !prev);
  };

  const handleAscending = (ascending: boolean) => {
    setAscending(ascending);
  };

  const routerSetPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const path = pathname;
    params.set("page", (page + 1).toString());
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

  const pageUp = () => {
    if (!collection) return;
    if (page + 1 > maxPage) return;
    routerSetPage(page + 1);
  };

  const pageUpMax = () => {
    routerSetPage(maxPage);
  };

  const pageDown = () => {
    if (page === 0) return;
    routerSetPage(page - 1);
  };

  const pageDownMax = () => {
    routerSetPage(0);
  };

  useEffect(() => {
    const collection_param = searchParams.get("source");
    if (collection_param) {
      const collection = collections.find((c) => c.name === collection_param);
      if (collection) {
        setCollection(collection);
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

  return (
    <div className="flex flex-col w-full gap-2 min-h-0 items-start justify-start h-full">
      {/* Breadcrumb Title */}
      <div className="flex">
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
          variant={view === "plot" ? "outline" : "default"}
          onClick={() => setView("plot")}
          className="flex flex-1"
        >
          <HiMiniSquare3Stack3D />
          Visualization
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
        <div className="flex-1 min-h-0 min-w-0 overflow-auto">
          {view === "table" && (
            <>
              {loadingCollection && !collectionData ? (
                <div className="flex flex-col gap-2 items-start justify-start w-full h-full fade-in">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="w-full h-[25px] rounded-sm" />
                  ))}
                </div>
              ) : (
                <DataTable
                  data={collectionData?.items || []}
                  header={Object.keys(collectionData?.properties || {})}
                  setSelectedCell={() => {}}
                  setSortOn={routerSetSortOn}
                  ascending={ascending}
                  sortOn={sortOn || ""}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataExplorer;
