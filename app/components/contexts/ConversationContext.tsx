"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  Conversation,
  ErrorResponse,
  initialConversation,
  Message,
  NERResponse,
  Query,
  TitleResponse,
  TreeUpdatePayload,
  SuggestionPayload,
} from "../types";
import { DecisionTreePayload } from "@/app/types/payloads";
import { DecisionTreeNode } from "@/app/types/objects";
import { Collection } from "@/app/types/objects";
import { v4 as uuidv4 } from "uuid";
import { CollectionContext } from "./CollectionContext";

import { SessionContext } from "./SessionContext";

import { initializeTree } from "@/app/api/InitializeTree";

export const ConversationContext = createContext<{
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  currentConversation: string | null;
  setCurrentConversation: (currentConversation: string | null) => void;
  creatingNewConversation: boolean;
  setCreatingNewConversation: (creatingNewConversation: boolean) => void;
  addConversation: (user_id: string) => void;
  removeConversation: (id: string) => void;
  selectConversation: (id: string) => void;
  setConversationStatus: (status: string, conversationId: string) => void;
  setConversationTitle: (title: string, conversationId: string) => void;
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
    NER: NERResponse
  ) => void;
  updateFeedbackForQuery: (
    conversationId: string,
    queryId: string,
    feedback: number
  ) => void;
  setAllConversationStatuses: (status: string) => void;
  triggerAllCollections: (conversationId: string, enable: boolean) => void;
  handleAllConversationsError: () => void;
  addSuggestionToConversation: (
    conversationId: string,
    queryId: string,
    user_id: string
  ) => void;
}>({
  conversations: [],
  setConversations: () => {},
  currentConversation: null,
  setCurrentConversation: () => {},
  creatingNewConversation: false,
  setCreatingNewConversation: () => {},
  addConversation: () => {},
  removeConversation: () => {},
  selectConversation: () => {},
  setConversationStatus: () => {},
  setAllConversationStatuses: () => {},
  setConversationTitle: () => {},
  addMessageToConversation: () => {},
  initializeEnabledCollections: () => {},
  handleConversationError: () => {},
  toggleCollectionEnabled: () => {},
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
});

export const ConversationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { id } = useContext(SessionContext);
  const { collections } = useContext(CollectionContext);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    null
  );
  const [creatingNewConversation, setCreatingNewConversation] = useState(false);

  const addConversation = async (user_id: string) => {
    if (!user_id?.trim()) {
      return;
    }

    if (creatingNewConversation) return;

    const uninitialized_conversations = conversations.filter(
      (c) => !c.initialized
    );

    if (uninitialized_conversations.length > 0) {
      setCurrentConversation(uninitialized_conversations[0].id);
      return;
    }

    const conversation_id = uuidv4();
    setCreatingNewConversation(true);
    const [tree] = await Promise.all([
      getDecisionTree(user_id, conversation_id),
    ]);

    if (tree === null || collections === null || tree.tree === null) {
      setCreatingNewConversation(false);
      return;
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
    setCurrentConversation(newConversation.id);
    setCreatingNewConversation(false);
  };

  const getDecisionTree = async (user_id: string, conversation_id: string) => {
    const debug = process.env.NODE_ENV === "development";
    const data: DecisionTreePayload = await initializeTree(
      user_id,
      conversation_id,
      debug
    );
    return data;
  };

  const removeConversation = (id: string) => {
    if (currentConversation === id) {
      setCurrentConversation(null);
    }
    setConversations(conversations?.filter((c) => c.id !== id));
  };

  const selectConversation = (id: string) => {
    setCurrentConversation(id);
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
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation || conversation.name !== "New Conversation") return;
    handleConversationTitleGeneration(title, conversationId).then((data) => {
      setConversations((prevConversations) =>
        prevConversations.map((c) => {
          if (c.id === conversationId && c.name === "New Conversation") {
            return { ...c, name: data.title };
          }
          return c;
        })
      );
    });
  };

  const handleConversationTitleGeneration = async (
    text: string,
    conversationId: string
  ) => {
    // TODO: Remove this once we have a real auth key
    const auth_key = "";
    const response = await fetch("/api/get_title", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        auth_key,
        user_id: id || "",
        conversation_id: conversationId,
      }),
    });
    const data: TitleResponse = await response.json();
    return data;
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
    // TODO: Remove this once we have a real auth key
    const auth_key = "";
    const response = await fetch("/api/get_suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        conversation_id: conversationId,
        auth_key,
      }),
    });
    const data: SuggestionPayload = await response.json();
    if (data.error) {
      console.error(data.error);
      return;
    }
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
    if (process.env.NODE_ENV === "development") {
      console.log("created suggestion message", newMessage);
    }
    addMessageToConversation([newMessage], conversationId, queryId);
  };

  const addMessageToConversation = (
    messages: Message[],
    conversationId: string,
    queryId: string
  ) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId && c.queries[queryId]) {
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
          // Updating in Backend
          const active_collections = Object.entries(new_enabled_collections)
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            .filter(([_, enabled]) => enabled)
            .map(([name]) => name);
          setCollectionEnabled(active_collections, false, c.id, id || "");
          return {
            ...c,
            enabled_collections: new_enabled_collections,
          };
        }
        return c;
      })
    );
  };

  const setCollectionEnabled = async (
    collection_names: string[],
    remove_data: boolean,
    conversation_id: string,
    user_id: string
  ) => {
    const response = await fetch("/api/set_collection_enabled", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection_names,
        remove_data,
        conversation_id,
        user_id,
      }),
    });
    const data: ErrorResponse = await response.json();
    return data;
  };

  const triggerAllCollections = (conversationId: string, enable: boolean) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
        if (c.id === conversationId) {
          const new_enabled_collections = Object.keys(
            c.enabled_collections
          ).reduce((acc, key) => {
            acc[key] = enable;
            return acc;
          }, {} as { [key: string]: boolean });
          const active_collections = Object.entries(new_enabled_collections)
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            .filter(([_, enabled]) => enabled)
            .map(([name]) => name);
          setCollectionEnabled(active_collections, false, c.id, id || "");
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

  const addQueryToConversation = (
    conversationId: string,
    query: string,
    query_id: string
  ) => {
    setConversations((prevConversations) =>
      prevConversations.map((c) => {
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
          messages: [newMessage],
        };
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
    NER: NERResponse
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
      fetch("/api/delete_feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: id || "",
          query_id: queryId,
          conversation_id: conversationId,
        }),
      });
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
      addFeedback(id || "", conversationId, queryId, feedback);
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

  const addFeedback = async (
    user_id: string,
    conversation_id: string,
    query_id: string,
    feedback: number
  ) => {
    const response = await fetch("/api/add_feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        query_id,
        conversation_id,
        feedback,
      }),
    });
    const data: ErrorResponse = await response.json();
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
    if (collections.length < 1 && id !== "" && id !== undefined) {
      addConversation(id);
    }
  }, [id, collections]);

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
        setConversationTitle,
        addMessageToConversation,
        initializeEnabledCollections,
        toggleCollectionEnabled,
        updateTree,
        addTreeToConversation,
        changeBaseToQuery,
        addQueryToConversation,
        creatingNewConversation,
        setCreatingNewConversation,
        finishQuery,
        updateNERForQuery,
        updateFeedbackForQuery,
        triggerAllCollections,
        handleConversationError,
        handleAllConversationsError,
        addSuggestionToConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
