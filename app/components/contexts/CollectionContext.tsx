"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Collection } from "@/app/types/objects";
import { getCollections } from "@/app/api/getCollections";
import { SessionContext } from "./SessionContext";
import { deleteCollectionMetadata } from "@/app/api/deleteCollectionMetadata";

export const CollectionContext = createContext<{
  collections: Collection[];
  fetchCollections: () => void;
  loadingCollections: boolean;
  deleteCollection: (collection_name: string) => void;
}>({
  collections: [],
  fetchCollections: () => {},
  loadingCollections: false,
  deleteCollection: () => {},
});

export const CollectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { id } = useContext(SessionContext);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(false);

  const idRef = useRef(id);
  const initialFetch = useRef(false);

  useEffect(() => {
    if (initialFetch.current || !id) return;
    initialFetch.current = true;
    idRef.current = id;
    fetchCollections();
  }, [id]);

  const fetchCollections = async () => {
    if (!idRef.current) return;
    setCollections([]);
    setLoadingCollections(true);
    const collections: Collection[] = await getCollections(idRef.current);
    setCollections(collections);
    setLoadingCollections(false);
  };

  const deleteCollection = async (collection_name: string) => {
    if (!idRef.current) return;
    await deleteCollectionMetadata(idRef.current, collection_name);
    fetchCollections();
  };

  return (
    <CollectionContext.Provider
      value={{
        collections,
        fetchCollections,
        loadingCollections,
        deleteCollection,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};
