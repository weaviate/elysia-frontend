"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Conversation, initialConversation } from "../types";

import {
  Query,
  NERPayload,
  TitlePayload,
  GraphPayload,
  SuggestionPayload,
  Message,
  TextPayload,
  UserPromptPayload,
  EdgePayload,
  TextPayloadStreamed,
  TextMetadata,
  SystemTextPayload,
  EndPayloadStreamed,
} from "@/app/types/chat";
import { TreeUpdatePayload } from "@/app/components/types";

import {
  DecisionTreePayload,
  SavedConversationPayload,
  ConversationPayload,
  SavedTreeData,
  BasePayload,
} from "@/app/types/payloads";
import { DecisionTreeNode } from "@/app/types/objects";
import { v4 as uuidv4 } from "uuid";
import { CollectionContext } from "./CollectionContext";

import { SessionContext } from "./SessionContext";

import { loadConversations } from "@/app/api/loadConversations";
import { loadConversation } from "@/app/api/loadConversation";
import { initializeTree } from "@/app/api/InitializeTree";
import { getSuggestions } from "@/app/api/getSuggestions";
import { deleteConversation } from "@/app/api/deleteConversation";
import { addFeedback } from "@/app/api/addFeedback";
import { deleteFeedback } from "@/app/api/deleteFeedback";
import { RouterContext } from "./RouterContext";
import { usePathname, useSearchParams } from "next/navigation";
import { TreeContext } from "./TreeContext";

export const ConversationContext = createContext<{
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  currentConversation: string | null;
  setCurrentConversation: (currentConversation: string | null) => void;
  creatingNewConversation: boolean;
  setCreatingNewConversation: (creatingNewConversation: boolean) => void;
  loadingConversations: boolean;
  addConversation: (user_id: string) => Promise<Conversation | null>;
  removeConversation: (conversation_id: string) => void;
  selectConversation: (id: string) => void;
  setConversationStatus: (status: string, conversationId: string) => void;
  handleConversationError: (conversationId: string) => void;
  addMessageToConversation: (
    messages: Message[],
    conversationId: string,
    queryId: string,
  ) => void;
  initializeEnabledCollections: (
    collections: { [key: string]: boolean },
    collection_id: string,
  ) => void;
  toggleCollectionEnabled: (
    collection_id: string,
    conversationId: string,
  ) => void;
  addQueryToConversation: (
    conversationId: string,
    query: string,
    query_id: string,
  ) => void;
  finishQuery: (conversationId: string, queryId: string) => void;
  updateNERForQuery: (
    conversationId: string,
    queryId: string,
    NER: NERPayload,
  ) => void;
  updateFeedbackForQuery: (
    conversationId: string,
    queryId: string,
    feedback: number,
  ) => void;
  setAllConversationStatuses: (status: string) => void;
  startNewConversation: () => void;
  getAllEnabledCollections: () => string[];
  triggerAllCollections: (conversationId: string, enable: boolean) => void;
  handleAllConversationsError: () => void;
  conversationPreviews: { [key: string]: SavedTreeData };
  addSuggestionToConversation: (
    conversationId: string,
    queryId: string,
    user_id: string,
  ) => void;
  loadConversationsFromDB: () => void;
  handleWebsocketMessage: (message: Message) => void;
  loadingConversation: boolean;
  changePresetID: (conversationId: string, preset_name: string) => void;
}>({
  conversations: [],
  setConversations: () => {},
  currentConversation: null,
  setCurrentConversation: () => {},
  creatingNewConversation: false,
  setCreatingNewConversation: () => {},
  loadingConversations: false,
  loadingConversation: false,
  startNewConversation: () => {},
  conversationPreviews: {},
  addConversation: () => Promise.resolve(null),
  removeConversation: () => {},
  selectConversation: () => {},
  setConversationStatus: () => {},
  setAllConversationStatuses: () => {},
  addMessageToConversation: () => {},
  initializeEnabledCollections: () => {},
  handleConversationError: () => {},
  toggleCollectionEnabled: () => {},
  handleWebsocketMessage: () => {},
  addQueryToConversation: () => {},
  finishQuery: () => {},
  updateNERForQuery: () => {},
  updateFeedbackForQuery: () => {},
  triggerAllCollections: () => {},
  handleAllConversationsError: () => {},
  addSuggestionToConversation: () => {},
  getAllEnabledCollections: () => [],
  loadConversationsFromDB: () => {},
  changePresetID: () => {},
});

export const ConversationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { collections } = useContext(CollectionContext);
  const { getCurrentDefaultId, toolPresets, selectPresetId } =
    useContext(TreeContext);
  const { id, enableRateLimitDialog, initialized, fetchConversationFlag } =
    useContext(SessionContext);

  const { changePage, currentPage } = useContext(RouterContext);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initial_ref = useRef<boolean>(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationPreviews, setConversationPreviews] = useState<{
    [key: string]: SavedTreeData;
  }>({});
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    null,
  );
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [creatingNewConversation, setCreatingNewConversation] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);

  const getDecisionTree = async (user_id: string, conversation_id: string) => {
    if (user_id === "") return null;
    const data: DecisionTreePayload = await initializeTree(
      user_id,
      conversation_id,
    );
    return data;
  };

  const loadConversationsFromDB = async () => {
    if (!id) return;
    setLoadingConversations(true);
    const data: SavedConversationPayload = await loadConversations(id || "");

    let hasConversations = false;
    for (const [key, value] of Object.entries(data.trees)) {
      if (value && value.title && value.last_update_time) {
        setConversationPreviews((prev) => ({ ...prev, [key]: value }));
        hasConversations = true;
      }
    }

    setLoadingConversations(false);

    // If no conversations were loaded, automatically create a new one
    if (!hasConversations && !creatingNewConversation) {
      await startNewConversation();
    }
  };

  const retrieveConversation = async (
    conversationId: string,
    conversationName: string,
    timestamp: Date,
  ) => {
    setLoadingConversation(true);

    const data: ConversationPayload = await loadConversation(
      id || "",
      conversationId,
    );
    setCreatingNewConversation(true);
    const tree = await getDecisionTree(id || "", conversationId);

    if (tree != null && collections != null) {
      const queries = data.rebuild.filter((m) => m && m.type === "user_prompt");
      const prebuiltQueries: { [key: string]: Query } = {};

      for (const query of queries) {
        const newQuery: Query = createNewQuery(
          conversationId,
          (query.payload as UserPromptPayload).prompt,
          query.query_id,
          conversations,
        );
        prebuiltQueries[query.query_id] = newQuery;
      }

      const newConversation: Conversation = {
        enabled_collections: collections.reduce(
          (acc, c) => ({ ...acc, [c.name]: true }),
          {},
        ),
        id: conversationId,
        name: conversationName,
        queries: prebuiltQueries,
        current: "",
        tree_preset_id: data.metadata.preset_id,
        initialized: true,
        error: false,
        timestamp: timestamp,
      };
      setConversations((prevConversations) => [
        ...prevConversations,
        newConversation,
      ]);

      for (const message of data.rebuild) {
        // Skip user_prompt messages - they're already handled above as "User" messages in prebuiltQueries
        if (message && message.type === "user_prompt") {
          continue;
        }
        // Rebuild reasoning from edges
        if (message && message.type === "edge") {
          const edgePayload = message.payload as EdgePayload;
          const newTextPayload: TextPayload = {
            metadata: {
              title: edgePayload.from + " -> " + edgePayload.to,
              reasoning: true,
              tool_name: "Edge",
            },
            type: "text",
            objects: [{ text: edgePayload.reasoning, ref_ids: [] }],
          };
          const newMessage: Message = {
            type: "text",
            id: uuidv4(),
            streamed: false,
            user_id: message.user_id,
            conversation_id: message.conversation_id,
            query_id: message.query_id,
            payload: newTextPayload,
          };
          handleWebsocketMessage(newMessage);
        } else {
          handleWebsocketMessage(message);
        }
      }
    }

    const preset_id = data.metadata.preset_id;
    const preset_name = toolPresets.find((p) => p.id === preset_id)?.name;
    if (preset_name) {
      selectPresetId(preset_name);
    }

    setCreatingNewConversation(false);
    setLoadingConversation(false);
  };

  const addConversation = async (
    user_id: string,
  ): Promise<Conversation | null> => {
    if (!user_id?.trim()) {
      return null;
    }

    if (creatingNewConversation) return null;

    const conversation_id = uuidv4();
    setCreatingNewConversation(true);
    const [tree] = await Promise.all([
      getDecisionTree(user_id, conversation_id),
    ]);

    if (tree === null || collections === null) {
      setCreatingNewConversation(false);
      return null;
    }

    const preset_id = getCurrentDefaultId();
    const preset_name = toolPresets.find((p) => p.id === preset_id)?.name;
    if (preset_name) {
      selectPresetId(preset_name);
    }

    const newConversation: Conversation = {
      ...initialConversation,
      id: conversation_id,
      tree_preset_id: preset_id || null,
      timestamp: new Date(),
      enabled_collections: collections.reduce(
        (acc, c) => ({ ...acc, [c.name]: true }),
        {},
      ),
    };
    setConversations([...(conversations || []), newConversation]);
    setCurrentConversation(conversation_id);
    setCreatingNewConversation(false);
    setConversationPreviews((prev) => ({
      ...prev,
      [conversation_id]: {
        title: newConversation.name,
        last_update_time: new Date().toISOString(),
      },
    }));
    if (currentPage === "chat") {
      changePage("chat", { conversation: conversation_id }, true);
    }
    return newConversation;
  };

  const removeConversation = (conversation_id: string) => {
    if (currentConversation === conversation_id) {
      setCurrentConversation(null);
    }
    setConversations([]);
    setConversationPreviews({});
    deleteConversation(id || "", conversation_id);
    loadConversationsFromDB();
  };

  const selectConversation = (id: string) => {
    changePage("chat", { conversation: id }, true);
  };

  const setConversationStatus = (status: string, conversationId: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId) {
          return { ...c, current: status };
        }
        return c;
      }),
    );
  };

  const setConversationTitle = async (
    title: string,
    conversationId: string,
  ) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId) {
          return { ...c, name: title };
        }
        return c;
      }),
    );
    setConversationPreviews((prev) => ({
      ...prev,
      [conversationId]: {
        title: title,
        last_update_time: new Date().toISOString(),
      },
    }));
  };

  const setAllConversationStatuses = (status: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => ({ ...c, current: status })),
    );
  };

  const addSuggestionToConversation = async (
    conversationId: string,
    queryId: string,
    user_id: string,
  ) => {
    if (!user_id) return;
    const auth_key = "";
    const data: SuggestionPayload = await getSuggestions(
      user_id,
      conversationId,
      auth_key,
    );
    const newMessage: Message = {
      type: "suggestion",
      id: uuidv4(),
      conversation_id: conversationId,
      streamed: false,
      query_id: queryId,
      user_id: user_id,
      payload: {
        error: "",
        suggestions: data.suggestions,
      },
    };
    addMessageToConversation([newMessage], conversationId, queryId);
  };

  const addStreamedMessageToConversation = (message: Message) => {
    if (message.type === "text") {
      if (process.env.NODE_ENV === "development") {
        console.log("Adding streamed text payload to conversation:", message);
      }
      addStreamedTextPayloadToConversation(message);
    } else {
      console.warn("Unsupported streamed message type:", message.type);
    }
    return;
  };

  const addStreamedTextPayloadToConversation = (message: Message) => {
    // First check whether a Message with TextPayload exists in the conversation/query
    // If not, create a new Message with an empty TextPayload
    // Check what type of streamed message it is (metadata - replace, text - concat, citation - append)
    // Add the data to the TextPayload
    // Replace or add the Message in the conversation/query

    const streamedPayload = message.payload as TextPayloadStreamed;

    if (process.env.NODE_ENV === "development") {
      console.log(message.id, streamedPayload.type);
    }

    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id !== message.conversation_id) {
          return c;
        }

        const query = c.queries[message.query_id];
        if (!query) {
          console.warn("Query not found for message:", message.query_id);
          return c;
        }

        // Find existing message by id
        const existingMessageIndex = query.messages.findIndex(
          (m) => m.id === message.id,
        );
        const existingMessage =
          existingMessageIndex !== -1
            ? query.messages[existingMessageIndex]
            : null;

        // Get the existing TextPayload or create a new one
        let textPayload: TextPayload;
        if (existingMessage && existingMessage.payload) {
          // Clone the existing payload to avoid mutation
          const existingPayload = existingMessage.payload as TextPayload;
          textPayload = {
            type: "text",
            objects: existingPayload.objects.map((obj) => ({
              text: obj.text,
              ref_ids: [...obj.ref_ids],
            })),
            metadata: { ...existingPayload.metadata },
          };
        } else {
          // Create a new empty TextPayload
          textPayload = {
            objects: [],
            metadata: {
              title: "",
              reasoning: false,
              tool_name: "",
            },
            type: "text",
          };
        }

        // Handle the different types of streamed messages
        if (streamedPayload.type === "metadata") {
          // Metadata - replace the existing metadata
          textPayload.metadata = streamedPayload.chunk as TextMetadata;
        } else if (
          streamedPayload.type === "text" ||
          streamedPayload.type === "citation"
        ) {
          // Handle text and citation types
          const index = streamedPayload.index;

          // Ensure the objects array has enough elements
          while (textPayload.objects.length <= index) {
            textPayload.objects.push({ text: "", ref_ids: [] });
          }

          // Concat the text or append the citation
          if (streamedPayload.type === "text") {
            textPayload.objects[index].text += streamedPayload.chunk as string;
          } else if (streamedPayload.type === "citation") {
            textPayload.objects[index].ref_ids.push(
              streamedPayload.chunk as string,
            );
          }

          // End payload - replace the existing text and metadata with the final payload
        } else if (streamedPayload.type === "end") {
          const endPayload = message.payload as EndPayloadStreamed;
          // Handle both cited_text (regular) and reasoning payloads
          if (endPayload.chunk.cited_text) {
            textPayload.objects = endPayload.chunk.cited_text.map((obj) => ({
              text: obj.text,
              ref_ids: [...obj.ref_ids],
            }));
          } else if (endPayload.chunk.reasoning) {
            textPayload.objects = [
              { text: endPayload.chunk.reasoning, ref_ids: [] },
            ];
          }
        }

        const streamingEnding = streamedPayload.type === "end";

        // Create the updated message with the TextPayload
        // Use existing message ID if available to maintain consistency across chunks
        const updatedMessage: Message = {
          type: "text",
          id: existingMessage?.id ?? message.id,
          streamed: !streamingEnding,
          user_id: message.user_id,
          conversation_id: message.conversation_id,
          query_id: message.query_id,
          payload: textPayload,
        };

        // Update the messages array - replace if exists, otherwise add
        let updatedMessages: Message[];
        if (existingMessageIndex !== -1) {
          // Replace the existing message
          updatedMessages = [...query.messages];
          updatedMessages[existingMessageIndex] = updatedMessage;
        } else {
          // Add as new message
          updatedMessages = [...query.messages, updatedMessage];
        }

        return {
          ...c,
          queries: {
            ...c.queries,
            [message.query_id]: {
              ...query,
              messages: updatedMessages,
            },
          },
        };
      }),
    );
  };

  const addMessageToConversation = (
    messages: Message[],
    conversationId: string,
    queryId: string,
  ) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId) {
          if (!c.queries[queryId]) {
            console.warn(
              `Query ${queryId} not found in conversation ${conversationId} ${JSON.stringify(
                Object.keys(c.queries),
              )}`,
            );
            return c;
          }
          return {
            ...c,
            initialized: true,
            queries: {
              ...c.queries,
              [queryId]: {
                ...c.queries[queryId],
                messages: [...c.queries[queryId].messages, ...messages],
              },
            },
          };
        }
        return c;
      }),
    );
  };

  const getAllEnabledCollections = () => {
    return conversations.reduce((acc, c) => {
      const enabledCollectionNames = Object.entries(c.enabled_collections || {})
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([key, value]) => value === true)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(([key, value]) => key);
      return [...acc, ...enabledCollectionNames];
    }, [] as string[]);
  };

  const initializeEnabledCollections = (
    collections: { [key: string]: boolean },
    collection_id: string,
  ) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === collection_id) {
          return { ...c, enabled_collections: collections };
        }
        return c;
      }),
    );
  };

  const toggleCollectionEnabled = (
    collection_id: string,
    conversationId: string,
  ) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId) {
          const new_enabled_collections = {
            ...c.enabled_collections,
            [collection_id]: !c.enabled_collections[collection_id],
          };
          return {
            ...c,
            enabled_collections: new_enabled_collections,
          };
        }
        return c;
      }),
    );
  };

  const triggerAllCollections = (conversationId: string, enable: boolean) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId) {
          const new_enabled_collections = Object.keys(
            c.enabled_collections,
          ).reduce(
            (acc, key) => {
              acc[key] = enable;
              return acc;
            },
            {} as { [key: string]: boolean },
          );
          return { ...c, enabled_collections: new_enabled_collections };
        }
        return c;
      }),
    );
  };

  const changePresetID = (conversationId: string, preset_name: string) => {
    const preset_id = toolPresets.find((p) => p.name === preset_name)?.id;
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId) {
          return { ...c, tree_preset_id: preset_id || null };
        }
        return c;
      }),
    );
  };

  const createNewQuery = (
    conversationId: string,
    query: string,
    query_id: string,
    prevConversations: Conversation[],
    messages: Message[] = [],
  ) => {
    const newMessage: Message = {
      type: "User",
      id: uuidv4(),
      streamed: false,
      query_id: query_id,
      conversation_id: conversationId,
      user_id: id || "",
      payload: {
        type: "text",
        metadata: {},
        code: {
          language: "",
          title: "",
          text: "",
        },
        objects: [query],
      },
    };
    const newQuery: Query = {
      id: query_id,
      query: query,
      finished: false,
      query_start: new Date(),
      query_end: null,
      feedback: null,
      NER: null,
      index:
        prevConversations.find((c) => c.id === conversationId)?.queries[
          query_id
        ]?.index || 0,
      messages: [newMessage, ...messages],
      graph: { nodes: {}, edges: [] },
      edges: [],
    };

    return newQuery;
  };

  const addQueryToConversation = (
    conversationId: string,
    query: string,
    query_id: string,
  ) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        const newQuery = createNewQuery(
          conversationId,
          query,
          query_id,
          prevConversations,
        );
        if (c.id === conversationId) {
          return { ...c, queries: { ...c.queries, [query_id]: newQuery } };
        }
        return c;
      }),
    );
  };

  const finishQuery = (conversationId: string, queryId: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId && c.queries[queryId]) {
          return {
            ...c,
            queries: {
              ...c.queries,
              [queryId]: {
                ...c.queries[queryId],
                finished: true,
                query_end: new Date(),
              },
            },
          };
        }
        return c;
      }),
    );
  };

  const updateNERForQuery = (
    conversationId: string,
    queryId: string,
    NER: NERPayload,
  ) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId && c.queries[queryId]) {
          return {
            ...c,
            queries: {
              ...c.queries,
              [queryId]: { ...c.queries[queryId], NER: NER },
            },
          };
        }
        return c;
      }),
    );
  };

  const updateFeedbackForQuery = async (
    conversationId: string,
    queryId: string,
    feedback: number,
  ) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation || conversation.error) return;

    if (conversation.queries[queryId].feedback === feedback) {
      await deleteFeedback(id || "", conversationId, queryId);
      setConversations((prevConversations) => {
        const newConversations = prevConversations.map((c) => {
          if (c.id === conversationId && c.queries[queryId]) {
            return {
              ...c,
              queries: {
                ...c.queries,
                [queryId]: { ...c.queries[queryId], feedback: null },
              },
            };
          }
          return c;
        });
        return newConversations;
      });
    } else {
      handleAddFeedback(id || "", conversationId, queryId, feedback);
      setConversations((prevConversations) => {
        const newConversations = prevConversations.map((c) => {
          if (c.id === conversationId && c.queries[queryId]) {
            return {
              ...c,
              queries: {
                ...c.queries,
                [queryId]: { ...c.queries[queryId], feedback },
              },
            };
          }
          return c;
        });
        return newConversations;
      });
    }
  };

  const handleAddFeedback = async (
    user_id: string,
    conversation_id: string,
    query_id: string,
    feedback: number,
  ) => {
    const data: BasePayload = await addFeedback(
      user_id,
      conversation_id,
      query_id,
      feedback,
    );
    return data;
  };

  const handleAllConversationsError = () => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => ({ ...c, error: true })),
    );
  };

  const handleConversationError = (conversationId: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId) {
          return { ...c, error: true };
        }
        return c;
      }),
    );
  };

  const handleWebsocketMessage = (message: Message | null | undefined) => {
    if (!message) return;
    if (process.env.NODE_ENV === "development") {
      console.log("Handling message type:", message.type);
    }
    if (message.type === "status") {
      const payload = message.payload as SystemTextPayload;
      setConversationStatus(payload.text, message.conversation_id);
    } else if (message.type === "title") {
      const payload = message.payload as TitlePayload;
      setConversationTitle(payload.title, message.conversation_id);
    } else if (message.type === "ner") {
      const payload = message.payload as NERPayload;
      updateNERForQuery(message.conversation_id, message.query_id, payload);
    } else if (message.type === "completed") {
      setConversationStatus("", message.conversation_id);
      finishQuery(message.conversation_id, message.query_id);
      addSuggestionToConversation(
        message.conversation_id,
        message.query_id,
        message.user_id,
      );
      // Receive Graph Payload containing the full tree graph of a conversation
    } else if (message.type === "graph") {
      const payload = message.payload as GraphPayload;
      const query_id = message.query_id;
      setConversations((prevConversations) => {
        const newConversations = prevConversations.map((c) => {
          if (c.id === message.conversation_id && c.queries[query_id]) {
            return {
              ...c,
              queries: {
                ...c.queries,
                [query_id]: { ...c.queries[query_id], graph: payload },
              },
            };
          }
          return c;
        });
        return newConversations;
      });
    } else if (message.type === "edge") {
      const payload = message.payload as EdgePayload;
      const query_id = message.query_id;
      setConversations((prevConversations) => {
        const newConversations = prevConversations.map((c) => {
          if (c.id === message.conversation_id && c.queries[query_id]) {
            return {
              ...c,
              queries: {
                ...c.queries,
                [query_id]: {
                  ...c.queries[query_id],
                  edges: [...c.queries[query_id].edges, payload],
                },
              },
            };
          }
          return c;
        });
        return newConversations;
      });
    } else {
      if (
        [
          "error",
          "tree_timeout_error",
          "rate_limit_error",
          "authentication_error",
        ].includes(message.type)
      ) {
        handleConversationError(message.conversation_id);
        finishQuery(message.conversation_id, message.query_id);
        setConversationStatus("", message.conversation_id);
      }

      if (message.type === "rate_limit_error") {
        enableRateLimitDialog();
      }

      if (message.streamed) {
        addStreamedMessageToConversation(message);
      } else {
        addMessageToConversation(
          [message],
          message.conversation_id,
          message.query_id,
        );
      }
    }
  };

  const startNewConversation = async () => {
    if (id) {
      const newConversation = await addConversation(id);
      if (newConversation) {
        setCurrentConversation(newConversation.id);
      }
    }
  };

  useEffect(() => {
    if (!collections) return;
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (
          !c.enabled_collections ||
          Object.keys(c.enabled_collections).length === 0
        ) {
          return {
            ...c,
            enabled_collections: collections.reduce(
              (acc, c) => ({ ...acc, [c.name]: true }),
              {},
            ),
          };
        }
        return c;
      }),
    );
  }, [collections]);

  useEffect(() => {
    if (id && !initial_ref.current && initialized) {
      initial_ref.current = true;
      loadConversationsFromDB();
    }
  }, [id, initialized]);

  useEffect(() => {
    loadConversationsFromDB();
  }, [fetchConversationFlag]);

  useEffect(() => {
    const pageParam = searchParams.get("page");
    const isChatPageOrRoot =
      pathname === "/" && (pageParam === "chat" || pageParam === null);
    if (
      isChatPageOrRoot &&
      initial_ref.current &&
      id &&
      Object.keys(conversationPreviews).length > 0
    ) {
      const conversationId = searchParams.get("conversation");

      if (conversationId) {
        // Handle specific conversation ID in URL
        if (conversationId === currentConversation) {
          return;
        }
        if (!conversationPreviews[conversationId]) {
          // Conversation not found - select latest existing one
          const latestConversationId = Object.entries(
            conversationPreviews,
          ).sort(
            ([, a], [, b]) =>
              new Date(b.last_update_time).getTime() -
              new Date(a.last_update_time).getTime(),
          )[0][0];
          changePage("chat", { conversation: latestConversationId }, true);
          return;
        }
        const conversation = conversations.find((c) => c.id === conversationId);
        const conversationName = conversationPreviews[conversationId].title;

        const preset_id = conversation?.tree_preset_id;
        const preset_name = toolPresets.find((p) => p.id === preset_id)?.name;
        if (preset_name) {
          selectPresetId(preset_name);
        }

        if (!conversation) {
          retrieveConversation(
            conversationId,
            conversationName,
            new Date(conversationPreviews[conversationId].last_update_time),
          );
        }
        setCurrentConversation(conversationId);
      } else {
        // No conversation ID in URL - auto-select latest
        const latestConversationId = Object.entries(conversationPreviews).sort(
          ([, a], [, b]) =>
            new Date(b.last_update_time).getTime() -
            new Date(a.last_update_time).getTime(),
        )[0][0];

        if (latestConversationId !== currentConversation) {
          changePage("chat", { conversation: latestConversationId }, true);
        }
      }
    }
  }, [searchParams, pathname, conversationPreviews, id, currentConversation]);

  return (
    <ConversationContext.Provider
      value={{
        setConversations,
        setCurrentConversation,
        conversations,
        currentConversation,
        addConversation,
        removeConversation,
        selectConversation,
        setConversationStatus,
        setAllConversationStatuses,
        addMessageToConversation,
        initializeEnabledCollections,
        toggleCollectionEnabled,
        startNewConversation,
        addQueryToConversation,
        creatingNewConversation,
        conversationPreviews,
        loadingConversations,
        setCreatingNewConversation,
        finishQuery,
        updateNERForQuery,
        updateFeedbackForQuery,
        triggerAllCollections,
        handleConversationError,
        handleAllConversationsError,
        addSuggestionToConversation,
        getAllEnabledCollections,
        loadConversationsFromDB,
        handleWebsocketMessage,
        loadingConversation,
        changePresetID,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
