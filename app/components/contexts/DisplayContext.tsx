"use client";

import { createContext, useEffect, useState } from "react";
import { ResultPayload } from "@/app/types/chat";

export const DisplayContext = createContext<{
  currentCollectionName: string;
  handleCollectionNameChange: (collection_name: string) => void;
  payload: ResultPayload | null;
}>({
  currentCollectionName: "",
  handleCollectionNameChange: () => {},
  payload: null,
});

export const DisplayProvider = ({
  children,
  _payload,
}: {
  children: React.ReactNode;
  _payload: ResultPayload | null;
}) => {
  const [currentCollectionName, setCurrentCollectionName] =
    useState<string>("");

  const [payload, setPayload] = useState<ResultPayload | null>(_payload);

  const handleCollectionNameChange = (collection_name: string) => {
    setCurrentCollectionName(collection_name || "");
  };

  useEffect(() => {
    if (_payload && _payload.metadata?.collection_name) {
      setCurrentCollectionName(_payload.metadata?.collection_name || "");
    }
    setPayload(_payload);
  }, [_payload]);

  return (
    <DisplayContext.Provider
      value={{
        currentCollectionName,
        handleCollectionNameChange,
        payload,
      }}
    >
      {children}
    </DisplayContext.Provider>
  );
};
