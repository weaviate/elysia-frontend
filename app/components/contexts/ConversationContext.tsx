"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Conversation, initialConversation } from "../types";

import {
  Query,
  NERPayload,
  TitlePayload,
  SuggestionPayload,
  Message,
  TextPayload,
  UserPromptPayload,
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
    queryId: string
  ) => void;
  initializeEnabledCollections: (
    collections: { [key: string]: boolean },
    collection_id: string
  ) => void;
  toggleCollectionEnabled: (
    collection_id: string,
    conversationId: string
  ) => void;
  updateTree: (tree_update_message: Message) => void;
  addTreeToConversation: (conversationId: string) => void;
  changeBaseToQuery: (conversationId: string, query: string) => void;
  addQueryToConversation: (
    conversationId: string,
    query: string,
    query_id: string
  ) => void;
  finishQuery: (conversationId: string, queryId: string) => void;
  updateNERForQuery: (
    conversationId: string,
    queryId: string,
    NER: NERPayload
  ) => void;
  updateFeedbackForQuery: (
    conversationId: string,
    queryId: string,
    feedback: number
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
    user_id: string
  ) => void;
  loadConversationsFromDB: () => void;
  handleWebsocketMessage: (message: Message) => void;
  loadingConversation: boolean;
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
  updateTree: () => {},
  addTreeToConversation: () => {},
  changeBaseToQuery: () => {},
  addQueryToConversation: () => {},
  finishQuery: () => {},
  updateNERForQuery: () => {},
  updateFeedbackForQuery: () => {},
  triggerAllCollections: () => {},
  handleAllConversationsError: () => {},
  addSuggestionToConversation: () => {},
  getAllEnabledCollections: () => [],
  loadConversationsFromDB: () => {},
});

export const ConversationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { collections } = useContext(CollectionContext);
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
    null
  );
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [creatingNewConversation, setCreatingNewConversation] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);

  const getDecisionTree = async (user_id: string, conversation_id: string) => {
    if (user_id === "") return null;
    const data: DecisionTreePayload = await initializeTree(
      user_id,
      conversation_id
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
    timestamp: Date
  ) => {
    setLoadingConversation(true);
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversationId);
    } else {
      const data: ConversationPayload = await loadConversation(
        id || "",
        conversationId
      );
      setCreatingNewConversation(true);
      const tree = await getDecisionTree(id || "", conversationId);

      if (tree != null && collections != null && tree.tree != null) {
        const queries = data.rebuild.filter(
          (m) => m && m.type === "user_prompt"
        );
        const prebuiltQueries: { [key: string]: Query } = {};

        for (const query of queries) {
          const newQuery: Query = createNewQuery(
            conversationId,
            (query.payload as UserPromptPayload).prompt,
            query.query_id,
            conversations
          );
          prebuiltQueries[query.query_id] = newQuery;
        }

        const newConversation: Conversation = {
          enabled_collections: collections.reduce(
            (acc, c) => ({ ...acc, [c.name]: true }),
            {}
          ),
          id: conversationId,
          name: conversationName,
          tree_updates: [],
          // Create a new tree for each query with the query name, plus one base tree
          tree: tree.tree
            ? [
                ...queries.map((query) => ({
                  ...tree.tree!,
                  name: (query.payload as UserPromptPayload).prompt,
                })),
                tree.tree,
              ]
            : [],
          base_tree: tree.tree || null,
          queries: prebuiltQueries,
          current: "",
          initialized: true,
          error: false,
          timestamp: timestamp,
        };
        // Set tree names to match the user prompts for each query
        queries.forEach((query) => {
          const prompt = (query.payload as UserPromptPayload).prompt;
          changeBaseToQuery(conversationId, prompt);
        });

        setConversations((prevConversations) => [
          ...prevConversations,
          newConversation,
        ]);

        for (const message of data.rebuild) {
          handleWebsocketMessage(message);
        }
      }

      setCreatingNewConversation(false);
    }
    setLoadingConversation(false);
  };

  const addConversation = async (
    user_id: string
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

    if (tree === null || collections === null || tree.tree === null) {
      setCreatingNewConversation(false);
      return null;
    }

    const newConversation: Conversation = {
      ...initialConversation,
      id: conversation_id,
      timestamp: new Date(),
      tree: [tree.tree],
      base_tree: tree.tree,
      enabled_collections: collections.reduce(
        (acc, c) => ({ ...acc, [c.name]: true }),
        {}
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
      })
    );
  };

  const setConversationTitle = async (
    title: string,
    conversationId: string
  ) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId) {
          return { ...c, name: title };
        }
        return c;
      })
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
      prevConversations.map((c) => ({ ...c, current: status }))
    );
  };

  const addSuggestionToConversation = async (
    conversationId: string,
    queryId: string,
    user_id: string
  ) => {
    if (!user_id) return;
    const auth_key = "";
    const data: SuggestionPayload = await getSuggestions(
      user_id,
      conversationId,
      auth_key
    );
    const newMessage: Message = {
      type: "suggestion",
      id: uuidv4(),
      conversation_id: conversationId,
      query_id: queryId,
      user_id: user_id,
      payload: {
        error: "",
        suggestions: data.suggestions,
      },
    };
    addMessageToConversation([newMessage], conversationId, queryId);
  };

  const addMessageToConversation = (
    messages: Message[],
    conversationId: string,
    queryId: string
  ) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId) {
          if (!c.queries[queryId]) {
            console.warn(
              `Query ${queryId} not found in conversation ${conversationId} ${JSON.stringify(
                Object.keys(c.queries)
              )}`
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
      })
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
    collection_id: string
  ) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === collection_id) {
          return { ...c, enabled_collections: collections };
        }
        return c;
      })
    );
  };

  const toggleCollectionEnabled = (
    collection_id: string,
    conversationId: string
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
      })
    );
  };

  const triggerAllCollections = (conversationId: string, enable: boolean) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId) {
          const new_enabled_collections = Object.keys(
            c.enabled_collections
          ).reduce(
            (acc, key) => {
              acc[key] = enable;
              return acc;
            },
            {} as { [key: string]: boolean }
          );
          return { ...c, enabled_collections: new_enabled_collections };
        }
        return c;
      })
    );
  };

  const updateTree = (tree_update_message: Message) => {
    const _payload = tree_update_message.payload as TreeUpdatePayload;

    const findAndUpdateNode = (
      tree: DecisionTreeNode | null,
      base_tree: DecisionTreeNode | null,
      payload: TreeUpdatePayload
    ): DecisionTreeNode | null => {
      if (!tree) {
        return null;
      }

      // If this is the node we're looking for
      if (tree.id === payload.node && !tree.blocked) {
        // Update the specific option within tree.options where option.name === payload.decision
        const updatedOptions = Object.entries(tree.options).reduce(
          (acc, [key, option]) => {
            if (key === payload.decision) {
              acc[key] = {
                ...option,
                choosen: true,
                reasoning: payload.reasoning,
                options: payload.reset
                  ? base_tree
                    ? { base: base_tree }
                    : {}
                  : option.options || {},
              };
            } else {
              acc[key] = option;
            }
            return acc;
          },
          {} as { [key: string]: DecisionTreeNode }
        );
        return { ...tree, options: updatedOptions, blocked: true };
      } else if (tree.options && Object.keys(tree.options).length > 0) {
        // Recurse into options
        const updatedOptions = Object.entries(tree.options).reduce(
          (acc, [key, option]) => {
            const updatedNode = findAndUpdateNode(option, base_tree, _payload);
            if (updatedNode) {
              acc[key] = updatedNode;
            }
            return acc;
          },
          {} as { [key: string]: DecisionTreeNode }
        );
        return { ...tree, options: updatedOptions, blocked: true };
      } else {
        return tree;
      }
    };

    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === tree_update_message.conversation_id) {
          const trees = c.tree;
          const tree = trees[_payload.tree_index];
          const updatedTree = findAndUpdateNode(tree, c.base_tree, _payload);

          const newTrees = [...(c.tree || [])];
          if (updatedTree) {
            newTrees[_payload.tree_index] = updatedTree;
          }
          return {
            ...c,
            tree: newTrees,
            tree_updates: [...c.tree_updates, _payload],
          };
        }
        return c;
      })
    );
  };

  const addTreeToConversation = (conversationId: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId && c.base_tree) {
          return {
            ...c,
            tree: [...c.tree, { ...c.base_tree }],
          };
        }
        return c;
      })
    );
  };

  const changeBaseToQuery = (conversationId: string, query: string) => {
    const treeIndex =
      conversations.find((c) => c.id === conversationId)?.tree?.length || 1;

    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId) {
          const newTrees = [...c.tree];
          if (newTrees[treeIndex - 1]) {
            newTrees[treeIndex - 1] = {
              ...newTrees[treeIndex - 1],
              name: query,
            };
          }
          return {
            ...c,
            tree: newTrees,
          };
        }
        return c;
      })
    );
  };

  const createNewQuery = (
    conversationId: string,
    query: string,
    query_id: string,
    prevConversations: Conversation[],
    messages: Message[] = []
  ) => {
    const newMessage: Message = {
      type: "User",
      id: uuidv4(),
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
    };

    return newQuery;
  };

  const addQueryToConversation = (
    conversationId: string,
    query: string,
    query_id: string
  ) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        const newQuery = createNewQuery(
          conversationId,
          query,
          query_id,
          prevConversations
        );
        if (c.id === conversationId) {
          return { ...c, queries: { ...c.queries, [query_id]: newQuery } };
        }
        return c;
      })
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
      })
    );
  };

  const updateNERForQuery = (
    conversationId: string,
    queryId: string,
    NER: NERPayload
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
      })
    );
  };

  const updateFeedbackForQuery = async (
    conversationId: string,
    queryId: string,
    feedback: number
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
    feedback: number
  ) => {
    const data: BasePayload = await addFeedback(
      user_id,
      conversation_id,
      query_id,
      feedback
    );
    return data;
  };

  const handleAllConversationsError = () => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => ({ ...c, error: true }))
    );
  };

  const handleConversationError = (conversationId: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId) {
          return { ...c, error: true };
        }
        return c;
      })
    );
  };

  const handleWebsocketMessage = (message: Message) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Handling message type:", message.type);
    }
    if (message.type === "status") {
      const payload = message.payload as TextPayload;
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
        message.user_id
      );
    } else if (message.type === "tree_update") {
      updateTree(message);
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
      addMessageToConversation(
        [message],
        message.conversation_id,
        message.query_id
      );
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
              {}
            ),
          };
        }
        return c;
      })
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

    if (process.env.NODE_ENV === "development") {
      console.log("Conversation selection logic:", {
        isChatPageOrRoot,
        initial_ref: initial_ref.current,
        conversationPreviews: Object.keys(conversationPreviews).length,
        id: !!id,
        currentConversation,
      });
    }

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
            conversationPreviews
          ).sort(
            ([, a], [, b]) =>
              new Date(b.last_update_time).getTime() -
              new Date(a.last_update_time).getTime()
          )[0][0];
          changePage("chat", { conversation: latestConversationId }, true);
          return;
        }
        const conversation = conversations.find((c) => c.id === conversationId);
        const conversationName = conversationPreviews[conversationId].title;

        if (!conversation) {
          retrieveConversation(
            conversationId,
            conversationName,
            new Date(conversationPreviews[conversationId].last_update_time)
          );
        }
        setCurrentConversation(conversationId);
      } else {
        // No conversation ID in URL - auto-select latest
        const latestConversationId = Object.entries(conversationPreviews).sort(
          ([, a], [, b]) =>
            new Date(b.last_update_time).getTime() -
            new Date(a.last_update_time).getTime()
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
        updateTree,
        addTreeToConversation,
        startNewConversation,
        changeBaseToQuery,
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
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
