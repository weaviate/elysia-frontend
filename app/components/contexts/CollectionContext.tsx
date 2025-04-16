"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { CollectionData } from "../types";
import { Collection } from "@/app/types/objects";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getCollection } from "@/app/components/explorer/hooks";
import { getCollections } from "@/app/api/get_collections";
import { SessionContext } from "./SessionContext";

export const CollectionContext = createContext<{
  collections: Collection[];
  fetchCollections: () => void;
  selectCollection: (collection: string | null) => void;
  selectedCollection: string | null;
  loadingCollections: boolean;
  loadingCollection: boolean;
  collectionData: CollectionData | null;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  maxPage: number;
  sortOn: string | null;
  setSortOn: (sortOn: string | null) => void;
  ascending: boolean;
  triggerAscending: () => void;
  handleAscending: (ascending: boolean) => void;
  routerSelectCollection: (collection_id: string) => void;
  pageUp: () => void;
  pageUpMax: () => void;
  pageDown: () => void;
  pageDownMax: () => void;
  currentCollection: Collection | null;
  routerSetSortOn: (sort_on: string) => void;
}>({
  collections: [],
  fetchCollections: () => {},
  selectCollection: () => {},
  selectedCollection: null,
  loadingCollections: false,
  loadingCollection: false,
  collectionData: null,
  page: 0,
  setPage: () => {},
  pageSize: 50,
  setPageSize: () => {},
  maxPage: 0,
  sortOn: null,
  setSortOn: () => {},
  ascending: true,
  triggerAscending: () => {},
  handleAscending: () => {},
  routerSelectCollection: () => {},
  pageUp: () => {},
  pageUpMax: () => {},
  pageDown: () => {},
  pageDownMax: () => {},
  currentCollection: null,
  routerSetSortOn: () => {},
});

export const CollectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { id } = useContext(SessionContext);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(
    null
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [collectionData, setCollectionData] = useState<CollectionData | null>(
    null
  );

  const [loadingCollection, setLoadingCollection] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [maxPage, setMaxPage] = useState(0);

  const [sortOn, setSortOn] = useState<string | null>(null);
  const [ascending, setAscending] = useState(true);

  const initialFetch = useRef(false);

  useEffect(() => {
    if (initialFetch.current) return;
    fetchCollections();
    initialFetch.current = true;
  }, []);

  useEffect(() => {
    if (!selectedCollection) return;
    fetchCollectionData();
  }, [selectedCollection, page, sortOn, ascending]);

  useEffect(() => {
    if (!initialFetch.current || loadingCollections) return;

    if (pathname === "/data") {
      const collection_id = searchParams.get("collection_id");
      if (collection_id) {
        selectCollection(collection_id);
      } else {
        selectCollection(null);
      }

      const page = searchParams.get("page");
      if (page) {
        setPage(parseInt(page) - 1);
      }

      const sort_on = searchParams.get("sort_on");
      if (sort_on) {
        setSortOn(sort_on);
      }
    }
  }, [searchParams, pathname, initialFetch.current, loadingCollections]);

  useEffect(() => {
    const currentCollection = collections.find(
      (c) => c.name === selectedCollection
    );
    if (!currentCollection) return;
    setMaxPage(Math.ceil(currentCollection.total / pageSize) - 1);
  }, [collections, pageSize, selectedCollection]);

  useEffect(() => {
    setCurrentCollection(
      collections.find((c) => c.name === selectedCollection) || null
    );
  }, [selectedCollection]);

  const fetchCollections = async () => {
    setSelectedCollection(null);
    setCollections([]);
    setCollectionData(null);
    setLoadingCollections(true);
    if (!id) return;
    const collections: Collection[] = await getCollections(id);
    setCollections(collections);
    setLoadingCollections(false);
  };

  const fetchCollectionData = async () => {
    if (!selectedCollection) return;
    setLoadingCollection(true);
    const collectionData = await getCollection(
      selectedCollection,
      page,
      pageSize,
      sortOn,
      ascending
    );
    setCollectionData(collectionData);
    setLoadingCollection(false);
  };

  const routerSelectCollection = (collection_id: string) => {
    const params = new URLSearchParams();
    const path = pathname;
    params.set("collection_id", collection_id);
    params.set("page", "1");
    params.delete("sort_on");
    router.push(`${path}?${params.toString()}`);
    handleAscending(true);
    setSortOn(null);
  };

  const selectCollection = async (collection: string | null) => {
    if (collection && !collections.some((c) => c.name === collection)) {
      return;
    }
    setSelectedCollection(collection);
    setPage(0);
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
    if (!selectedCollection || !currentCollection) return;
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

  return (
    <CollectionContext.Provider
      value={{
        collections,
        fetchCollections,
        selectCollection,
        selectedCollection,
        loadingCollections,
        loadingCollection,
        collectionData,
        page,
        setPage,
        pageSize,
        setPageSize,
        maxPage,
        sortOn,
        setSortOn,
        ascending,
        triggerAscending,
        handleAscending,
        routerSelectCollection,
        pageUp,
        pageUpMax,
        pageDown,
        pageDownMax,
        currentCollection,
        routerSetSortOn,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};
