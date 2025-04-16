"use client";

import { CollectionData, MetadataPayload, Filter } from "../types";

export async function getCollection(
  collection_name: string,
  page: number,
  page_size: number,
  sort_on: string | null = null,
  ascending: boolean = true,
  filter_config: { type: string; filters: Filter[] } = {
    type: "all",
    filters: [],
  },
  admin: boolean = false
) {
  const page_number = page + 1;
  const res = await fetch(`/api/get_collection`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      collection_name,
      page_number,
      page_size,
      sort_on,
      ascending,
      filter_config,
      admin,
    }),
  });
  const data: CollectionData = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}

export async function getCollectionMetadata(
  conversation_id: string,
  user_id: string
) {
  const res = await fetch(`api/get_collection_metadata`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ conversation_id, user_id }),
  });
  const data: MetadataPayload = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}
