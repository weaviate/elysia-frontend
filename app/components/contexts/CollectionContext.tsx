"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Collection } from "@/app/types/objects";
import { getCollections } from "@/app/api/getCollections";
import { SessionContext } from "./SessionContext";

export const CollectionContext = createContext<{
  collections: Collection[];
  fetchCollections: () => void;
  loadingCollections: boolean;
}>({
  collections: [],
  fetchCollections: () => {},
  loadingCollections: false,
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
    if (process.env.NODE_ENV === "development") {
      console.log("Fetching collections with id: " + idRef.current);
    }
    if (!idRef.current) return;
    setCollections([]);
    setLoadingCollections(true);
    const collections: Collection[] = await getCollections(idRef.current);
    setCollections(collections);
    setLoadingCollections(false);
  };

  return (
    <CollectionContext.Provider
      value={{
        collections,
        fetchCollections,
        loadingCollections,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};
