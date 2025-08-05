"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Collection } from "@/app/types/objects";
import { getCollections } from "@/app/api/getCollections";
import { SessionContext } from "./SessionContext";
import { deleteCollectionMetadata } from "@/app/api/deleteCollectionMetadata";
import { ToastContext } from "./ToastContext";

export const CollectionContext = createContext<{
  collections: Collection[];
  fetchCollections: () => void;
  loadingCollections: boolean;
  deleteCollection: (collection_name: string) => void;
  getRandomPrompts: (amount: number) => string[];
}>({
  collections: [],
  fetchCollections: () => {},
  loadingCollections: false,
  deleteCollection: () => {},
  getRandomPrompts: () => [],
});

export const CollectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { id, fetchCollectionFlag, initialized } = useContext(SessionContext);
  const { showErrorToast, showSuccessToast } = useContext(ToastContext);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(false);

  const idRef = useRef(id);
  const initialFetch = useRef(false);

  useEffect(() => {
    if (initialFetch.current || !id || !initialized) return;
    initialFetch.current = true;
    idRef.current = id;
    fetchCollections();
  }, [id, initialized]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollectionFlag]);

  const fetchCollections = async () => {
    if (!idRef.current) return;
    setCollections([]);
    setLoadingCollections(true);
    const collections: Collection[] = await getCollections(idRef.current);
    setCollections(collections);
    setLoadingCollections(false);
    showSuccessToast(`${collections.length} Collections Loaded`);
  };

  const deleteCollection = async (collection_name: string) => {
    if (!idRef.current) return;
    const result = await deleteCollectionMetadata(
      idRef.current,
      collection_name
    );

    if (result.error) {
      showErrorToast("Failed to Remove Analysis", result.error);
    } else {
      showSuccessToast(
        "Analysis Removed",
        `Analysis for "${collection_name}" has been removed successfully.`
      );
      fetchCollections();
    }
  };

  const getRandomPrompts = (amount: number = 4) => {
    // Merge all prompts from all collections into a single array
    const allPrompts = collections.reduce((acc: string[], collection) => {
      return acc.concat(collection.prompts || []);
    }, []);

    // Shuffle the array and return requested amount
    const shuffled = allPrompts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, amount);
  };

  return (
    <CollectionContext.Provider
      value={{
        collections,
        fetchCollections,
        loadingCollections,
        deleteCollection,
        getRandomPrompts,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};
