"use client";

import DataExplorer from "../components/explorer/DataExplorer";
import { CollectionContext } from "../components/contexts/CollectionContext";
import { useContext, useEffect, useState } from "react";
import Dashboard from "../components/explorer/DataDashboard";
import { MetadataPayload } from "../components/types";
import { ConversationContext } from "../components/contexts/ConversationContext";
import { SessionContext } from "../components/contexts/SessionContext";
import { getCollectionMetadata } from "../components/explorer/hooks";
import { useSearchParams, usePathname } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { selectedCollection, collections } = useContext(CollectionContext);
  const { currentConversation } = useContext(ConversationContext);
  const { id } = useContext(SessionContext);
  const [metadata, setMetadata] = useState<MetadataPayload | null>(null);
  const [selectedMetadata, setSelectedMetadata] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchMetadata = async () => {
    if (!currentConversation || !id) return;
    setLoading(true);
    const metadata = await getCollectionMetadata(currentConversation, id);

    if (metadata && metadata.metadata) {
      // Sort metadata by name in ascending order
      metadata.metadata = Object.fromEntries(
        Object.entries(metadata.metadata).sort(([a], [b]) => a.localeCompare(b))
      );
      setMetadata(metadata);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMetadata();
  }, [id, currentConversation, collections]);

  useEffect(() => {
    if (pathname === "/data") {
      const metadata = searchParams.get("metadata");
      if (metadata) {
        setSelectedMetadata(metadata);
      } else {
        setSelectedMetadata(null);
      }
    }
  }, [pathname, searchParams]);

  return (
    <div className="w-full h-full flex">
      {selectedCollection ? (
        <DataExplorer />
      ) : (
        <Dashboard
          metadata={metadata}
          loading={loading}
          selectedMetadata={selectedMetadata}
        />
      )}
    </div>
  );
}
