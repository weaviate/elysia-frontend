"use client";

import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useState,
} from "react";

import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ConnectionLineType,
  Background,
  useReactFlow,
  Panel,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { ConversationContext } from "../contexts/ConversationContext";
import { Conversation } from "../types";
import { TreeContext } from "../contexts/TreeContext";
import { TreeGraph } from "@/app/types/objects";
import { viewerNodeTypes } from "./nodes/ViewerNode";
import { traversalEdgeTypes } from "./nodes/TraversalEdge";
import { useTraversalTree } from "@/hooks/useTraversalTree";
import { Query } from "@/app/types/chat";
import { Checkbox } from "@/components/ui/checkbox";

const FlowDisplayInner: React.FC = () => {
  const { currentConversation, conversations } =
    useContext(ConversationContext);
  const { toolPresets, conversationPresetID, toolMetadata } =
    useContext(TreeContext);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [hideUnusedNodes, setHideUnusedNodes] = useState(false);

  // Refs for stable updates without flickering
  const prevNodesRef = useRef<Node[]>([]);
  const prevEdgesRef = useRef<Edge[]>([]);
  const initialFitDoneRef = useRef<boolean>(false);
  const lastUpdateKeyRef = useRef<string>("");

  const { fitView } = useReactFlow();

  const { buildTraversalTree, buildPresetTree } = useTraversalTree({
    toolMetadata,
    hideUnusedNodes,
  });

  // Get current conversation object
  const conversationObject = useMemo<Conversation | null>(() => {
    return (
      conversations.find(
        (conversation) => conversation.id === currentConversation
      ) || null
    );
  }, [conversations, currentConversation]);

  // Get tool preset for uninitialized conversations
  const toolPreset = useMemo<TreeGraph | null>(() => {
    return (
      toolPresets.find((preset) => preset.name === conversationPresetID) || null
    );
  }, [toolPresets, conversationPresetID]);

  // Extract sorted queries from conversation
  const { queries, sortedQueryIds } = useMemo(() => {
    if (!conversationObject?.queries) {
      return { queries: [] as Query[], sortedQueryIds: [] as string[] };
    }

    const queriesArray = Object.values(conversationObject.queries);
    const sorted = queriesArray
      .sort((a, b) => a.index - b.index)
      .map((q) => q.id);

    return { queries: queriesArray, sortedQueryIds: sorted };
  }, [conversationObject?.queries]);

  // Check if conversation has any queries with graph data
  const hasGraphData = useMemo(() => {
    return queries.some(
      (query) => query.graph && Object.keys(query.graph.nodes).length > 0
    );
  }, [queries]);

  // Create a stable update key to prevent unnecessary updates
  const updateKey = useMemo(() => {
    if (hasGraphData && conversationObject?.initialized) {
      // Key based on query edges (the actual traversal data) + hideUnusedNodes setting
      const edgeData = queries.map((q) => ({
        id: q.id,
        edges: q.edges
          .map((e) => `${e.from}-${e.to}-${e.tree_index}`)
          .join(","),
        finished: q.finished,
      }));
      return `traversal:${JSON.stringify(edgeData)}:hide=${hideUnusedNodes}`;
    }
    if (toolPreset) {
      return `preset:${toolPreset.name}`;
    }
    return "empty";
  }, [
    hasGraphData,
    conversationObject?.initialized,
    queries,
    toolPreset,
    hideUnusedNodes,
  ]);

  // Apply updates with position preservation
  const applyUpdate = useCallback(
    (newNodes: Node[], newEdges: Edge[], shouldFitView: boolean = false) => {
      // Preserve positions for existing nodes
      const updatedNodes = newNodes.map((newNode) => {
        const existingNode = prevNodesRef.current.find(
          (n) => n.id === newNode.id
        );
        if (existingNode) {
          return {
            ...newNode,
            position: existingNode.position,
          };
        }
        return newNode;
      });

      setNodes(updatedNodes);
      setEdges(newEdges);

      prevNodesRef.current = updatedNodes;
      prevEdgesRef.current = newEdges;

      // Fit view on significant changes
      const nodesCountChanged =
        prevNodesRef.current.length !== updatedNodes.length;
      if (nodesCountChanged || shouldFitView || !initialFitDoneRef.current) {
        initialFitDoneRef.current = true;
        setTimeout(() => fitView({ padding: 0.15, duration: 400 }), 50);
      }
    },
    [setNodes, setEdges, fitView]
  );

  // Build and update tree when data changes
  useEffect(() => {
    // Skip if update key hasn't changed
    if (lastUpdateKeyRef.current === updateKey) {
      return;
    }
    lastUpdateKeyRef.current = updateKey;

    if (!currentConversation) {
      setNodes([]);
      setEdges([]);
      prevNodesRef.current = [];
      prevEdgesRef.current = [];
      initialFitDoneRef.current = false;
      return;
    }

    // Case 1: Conversation has graph data from queries - show traversal tree
    if (hasGraphData && conversationObject?.initialized) {
      const { nodes: treeNodes, edges: treeEdges } = buildTraversalTree(
        queries,
        sortedQueryIds
      );

      if (treeNodes.length > 0) {
        applyUpdate(treeNodes, treeEdges, true);
        return;
      }
    }

    // Case 2: Show selected preset tree (when no queries with graphs exist)
    if (toolPreset) {
      const { nodes: presetNodes, edges: presetEdges } =
        buildPresetTree(toolPreset);

      if (presetNodes.length > 0) {
        applyUpdate(presetNodes, presetEdges, true);
        return;
      }
    }

    // Fallback: clear the view
    setNodes([]);
    setEdges([]);
    prevNodesRef.current = [];
    prevEdgesRef.current = [];
    initialFitDoneRef.current = false;
  }, [
    updateKey,
    currentConversation,
    conversationObject?.initialized,
    hasGraphData,
    queries,
    sortedQueryIds,
    toolPreset,
    buildTraversalTree,
    buildPresetTree,
    applyUpdate,
    setNodes,
    setEdges,
  ]);

  // Reset initial fit when conversation changes
  useEffect(() => {
    initialFitDoneRef.current = false;
    lastUpdateKeyRef.current = "";
  }, [currentConversation]);

  return (
    <div className="flex justify-center w-full items-center overflow-hidden transition-all duration-300 relative">
      <div style={{ width: "100vw", height: "calc(100vh - 200px)" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={viewerNodeTypes}
          edgeTypes={traversalEdgeTypes}
          snapToGrid
          snapGrid={[10, 10]}
          connectionLineType={ConnectionLineType.Step}
          noWheelClassName="no-wheel"
          defaultEdgeOptions={{
            style: { strokeWidth: 2 },
            animated: false,
          }}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.1}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          selectNodesOnDrag={false}
          deleteKeyCode={null}
          onNodesDelete={() => {}} // Prevent node deletion
          onEdgesDelete={() => {}} // Prevent edge deletion
          panOnDrag
          zoomOnScroll
          zoomOnPinch
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} size={2} color="hsl(var(--foreground) / 0.3)" />
          <Panel
            position="top-right"
            className="bg-background/80 backdrop-blur-sm border border-foreground/20 rounded-lg px-3 py-2"
          >
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox
                checked={hideUnusedNodes}
                onCheckedChange={(checked) =>
                  setHideUnusedNodes(checked === true)
                }
                className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
              />
              <span className="text-xs text-secondary">Hide unused nodes</span>
            </label>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

// Wrapper component to provide ReactFlow context
const FlowDisplay: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FlowDisplayInner />
    </ReactFlowProvider>
  );
};

export default FlowDisplay;
