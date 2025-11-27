"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TreeGraph, TreeNode } from "@/app/types/objects";
import { ToolMetadataList } from "@/app/types/objects";
import { SessionContext } from "./SessionContext";
import { getToolPresets } from "@/app/api/getToolPresets";
import {
  ToolMetadataListPayload,
  ToolPresetPayload,
} from "@/app/types/payloads";
import { getToolMetadata } from "@/app/api/getToolMetadata";
import { ToastContext } from "./ToastContext";
import {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Connection,
  useReactFlow,
  useStoreApi,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
} from "@xyflow/react";
import { useAutoLayout } from "@/hooks/useAutoLayout";

const MIN_DISTANCE = 300; // Proximity threshold for auto-connect
const MAX_HISTORY_STEPS = 50; // Maximum number of undo steps to track

// Action types for history tracking
export type HistoryAction = {
  id: string;
  type: "ADD_NODE" | "REMOVE_NODE" | "ADD_EDGE" | "REMOVE_EDGE";
  timestamp: number;
  description: string;
  data: {
    nodeData?: Node;
    edgeData?: Edge;
  };
  // Store complete state snapshots for reliable undo/redo
  beforeState: {
    nodes: Node[];
    edges: Edge[];
    presetName: string;
  };
  afterState: {
    nodes: Node[];
    edges: Edge[];
    presetName: string;
  };
};

export type HistoryState = {
  actions: HistoryAction[];
  currentIndex: number; // -1 means at the latest state
};

export const TreeContext = createContext<{
  toolPresets: TreeGraph[];
  toolMetadata: ToolMetadataList;
  fetchToolPresets: () => void;
  fetchToolMetadata: () => void;
  selectToolPreset: (id: string) => void;
  selectedToolPreset: TreeGraph | null;
  updateSelectedToolPreset: (preset: TreeGraph) => void;
  // React Flow state
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  // Node operations
  duplicateNode: (treeNode: TreeNode) => void;
  onConnect: (connection: Connection) => void;
  isValidConnection: (connection: Connection) => boolean;
  createNodeFromTool: (
    toolData: {
      name: string;
      description: string | null;
      instruction?: string | null;
      is_branch: boolean;
    },
    position: { x: number; y: number }
  ) => void;
  handleAutoLayout: () => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  reactFlowWrapper: React.RefObject<HTMLDivElement>;
  // Proximity connect
  onNodeDrag: (event: any, node: Node) => void;
  onNodeDragStop: (event: any, node: Node) => void;
  // Node deletion with reconnection
  onNodesDelete: (deleted: Node[]) => void;
  currentPresetName: string;
  updateCurrentPresetName: (name: string) => void;
  // Validation
  warningMessages: string[];
  validateTree: () => boolean;
  saveTree: () => void;
  // History and changes
  historyState: HistoryState;
  canUndo: boolean;
  canRedo: boolean;
  unsavedChanges: boolean;
  undo: () => void;
  redo: () => void;
}>({
  toolPresets: [],
  toolMetadata: {},
  fetchToolPresets: () => {},
  fetchToolMetadata: () => {},
  selectToolPreset: () => {},
  selectedToolPreset: null,
  updateSelectedToolPreset: () => {},
  nodes: [],
  edges: [],
  onNodesChange: () => {},
  onEdgesChange: () => {},
  duplicateNode: () => {},
  onConnect: () => {},
  isValidConnection: () => false,
  createNodeFromTool: () => {},
  handleAutoLayout: () => {},
  onDragOver: () => {},
  onDrop: () => {},
  saveTree: () => {},
  reactFlowWrapper: { current: null },
  onNodeDrag: () => {},
  onNodeDragStop: () => {},
  onNodesDelete: () => {},
  currentPresetName: "",
  updateCurrentPresetName: () => {},
  warningMessages: [],
  validateTree: () => false,
  historyState: { actions: [], currentIndex: -1 },
  canUndo: false,
  canRedo: false,
  undo: () => {},
  redo: () => {},
  unsavedChanges: false,
});

export const TreeProvider = ({ children }: { children: React.ReactNode }) => {
  const { id, initialized } = useContext(SessionContext);
  const { showErrorToast, showWarningToast } = useContext(ToastContext);

  const [toolPresets, setToolPresets] = useState<TreeGraph[]>([]);
  const [selectedToolPreset, setSelectedToolPreset] =
    useState<TreeGraph | null>(null);
  const [toolMetadata, setToolMetadata] = useState<ToolMetadataList>({});
  const [currentPresetName, setCurrentPresetName] = useState<string>("");

  // Validation state
  const [warningMessages, setWarningMessages] = useState<string[]>([]);

  // History and changes state
  const [historyState, setHistoryState] = useState<HistoryState>({
    actions: [],
    currentIndex: -1,
  });

  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  // Computed values for undo/redo
  const canUndo =
    historyState.actions.length > 0 && historyState.currentIndex > -2;
  const canRedo =
    historyState.currentIndex >= -1 &&
    historyState.currentIndex < historyState.actions.length - 1;

  // Reset history
  const resetHistory = useCallback(() => {
    setHistoryState({ actions: [], currentIndex: -1 });
  }, []);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Helper function to add action to history
  const addHistoryAction = useCallback(
    (
      actionType: HistoryAction["type"],
      description: string,
      data: HistoryAction["data"] = {},
      afterStateOverride?: {
        nodes?: Node[];
        edges?: Edge[];
        presetName?: string;
      }
    ) => {
      const beforeState = {
        nodes: [...nodes],
        edges: [...edges],
        presetName: currentPresetName,
      };

      // For after state, use override if provided, otherwise use current state
      const afterState = {
        nodes: afterStateOverride?.nodes || [...nodes],
        edges: afterStateOverride?.edges || [...edges],
        presetName: afterStateOverride?.presetName || currentPresetName,
      };

      const newAction: HistoryAction = {
        id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: actionType,
        timestamp: Date.now(),
        description,
        data,
        beforeState,
        afterState,
      };

      setHistoryState((prev) => {
        // If we're not at the latest state, remove all actions after current index
        const actionsToKeep =
          prev.currentIndex === -1
            ? prev.actions
            : prev.actions.slice(0, prev.currentIndex + 1);

        // Add new action
        const newActions = [...actionsToKeep, newAction];

        // Limit history size
        const limitedActions =
          newActions.length > MAX_HISTORY_STEPS
            ? newActions.slice(-MAX_HISTORY_STEPS)
            : newActions;

        return {
          actions: limitedActions,
          currentIndex: -1, // Always at latest after new action
        };
      });
    },
    [nodes, edges, currentPresetName]
  );

  // Undo function
  const undo = useCallback(() => {
    if (!canUndo) return;

    if (historyState.currentIndex === -1) {
      // If at latest state, undo the last action
      const lastAction = historyState.actions[historyState.actions.length - 1];
      setNodes(lastAction.beforeState.nodes);
      setEdges(lastAction.beforeState.edges);
      setCurrentPresetName(lastAction.beforeState.presetName);
      setHistoryState((prev) => ({
        ...prev,
        currentIndex: historyState.actions.length - 2,
      }));
    } else if (historyState.currentIndex === 0) {
      // If at first action, go to initial state (before first action)
      const firstAction = historyState.actions[0];
      setNodes(firstAction.beforeState.nodes);
      setEdges(firstAction.beforeState.edges);
      setCurrentPresetName(firstAction.beforeState.presetName);
      setHistoryState((prev) => ({
        ...prev,
        currentIndex: -2, // Special state meaning "before first action"
      }));
    } else {
      // Undo the current action
      const currentAction = historyState.actions[historyState.currentIndex];
      setNodes(currentAction.beforeState.nodes);
      setEdges(currentAction.beforeState.edges);
      setCurrentPresetName(currentAction.beforeState.presetName);
      setHistoryState((prev) => ({
        ...prev,
        currentIndex: historyState.currentIndex - 1,
      }));
    }
  }, [
    canUndo,
    historyState.currentIndex,
    historyState.actions,
    setNodes,
    setEdges,
  ]);

  // Redo function
  const redo = useCallback(() => {
    if (!canRedo) return;

    if (historyState.currentIndex === -2) {
      // If we're before the first action, redo to the first action
      const firstAction = historyState.actions[0];
      setNodes(firstAction.afterState.nodes);
      setEdges(firstAction.afterState.edges);
      setCurrentPresetName(firstAction.afterState.presetName);
      setHistoryState((prev) => ({ ...prev, currentIndex: 0 }));
    } else {
      const newIndex = historyState.currentIndex + 1;
      const actionToRedo = historyState.actions[newIndex];

      setNodes(actionToRedo.afterState.nodes);
      setEdges(actionToRedo.afterState.edges);
      setCurrentPresetName(actionToRedo.afterState.presetName);

      // If we're redoing to the latest action, set currentIndex to -1
      if (newIndex === historyState.actions.length - 1) {
        setHistoryState((prev) => ({ ...prev, currentIndex: -1 }));
      } else {
        setHistoryState((prev) => ({ ...prev, currentIndex: newIndex }));
      }
    }
  }, [
    canRedo,
    historyState.currentIndex,
    historyState.actions,
    setNodes,
    setEdges,
  ]);

  const { screenToFlowPosition, getInternalNode } = useReactFlow();
  const store = useStoreApi();

  // Auto-layout hook
  const { getLayoutedElements } = useAutoLayout({
    direction: "TB", // Top to Bottom layout for decision trees
    nodeWidth: 280,
    nodeHeight: 120,
    rankSeparation: 200, // More space between levels
    nodeSeparation: 150, // More space between siblings
  });

  const onConnect = useCallback(
    (params: Connection) => {
      const { target, source } = params;

      if (source === target) {
        showWarningToast("Invalid Connection", "Cannot connect node to itself");
        return;
      }

      const newEdge: Edge = {
        ...params,
        id: `${params.source}-${params.target}`,
        type: "smoothstep", // Match your current edge type
        animated: true,
      };

      // Track edge addition in history BEFORE updating the state
      addHistoryAction(
        "ADD_EDGE",
        `Connected nodes`,
        { edgeData: newEdge },
        { edges: [...edges, newEdge] }
      );

      onEdgesChange([{ type: "add", item: newEdge }]);
    },
    [onEdgesChange, addHistoryAction, showWarningToast, edges]
  );

  // Validation function: only one incoming edge per node
  const isValidConnection = useCallback(
    (connection: Connection) => {
      const { target, source } = connection;

      // Prevent self-connections
      if (source === target) {
        return false;
      }

      return true;
    },
    [edges]
  );

  const getClosestEdge = useCallback(
    (node: Node) => {
      const { nodeLookup } = store.getState();
      const internalNode = getInternalNode(node.id);

      if (!internalNode) return null;

      const closestNode = Array.from(nodeLookup.values()).reduce(
        (res: { distance: number; node: any }, n: any) => {
          if (n.id !== internalNode.id) {
            const dx =
              n.internals.positionAbsolute.x -
              internalNode.internals.positionAbsolute.x;
            const dy =
              n.internals.positionAbsolute.y -
              internalNode.internals.positionAbsolute.y;
            const d = Math.sqrt(dx * dx + dy * dy);

            if (d < res.distance && d < MIN_DISTANCE) {
              res.distance = d;
              res.node = n;
            }
          }

          return res;
        },
        {
          distance: Number.MAX_VALUE,
          node: null,
        }
      );

      if (!closestNode.node) {
        return null;
      }

      // Determine source/target based on vertical position (top-to-bottom flow)
      const closeNodeIsSource =
        closestNode.node.internals.positionAbsolute.y <
        internalNode.internals.positionAbsolute.y;

      return {
        id: closeNodeIsSource
          ? `${closestNode.node.id}-${node.id}`
          : `${node.id}-${closestNode.node.id}`,
        source: closeNodeIsSource ? closestNode.node.id : node.id,
        target: closeNodeIsSource ? node.id : closestNode.node.id,
        type: "smoothstep",
        animated: true,
      };
    },
    [store, getInternalNode]
  );

  const onNodeDrag = useCallback(
    (_event: any, node: Node) => {
      const closeEdge = getClosestEdge(node);

      setEdges((es) => {
        const nextEdges = es.filter((e: any) => e.className !== "temp");

        if (
          closeEdge &&
          !nextEdges.find(
            (ne: any) =>
              ne.source === closeEdge.source && ne.target === closeEdge.target
          )
        ) {
          const tempEdge = { ...closeEdge, className: "temp" };
          nextEdges.push(tempEdge);
        }

        return nextEdges;
      });
    },
    [getClosestEdge, setEdges]
  );

  const onNodeDragStop = useCallback(
    (_event: any, node: Node) => {
      const closeEdge = getClosestEdge(node);

      setEdges((es) => {
        const nextEdges = es.filter((e: any) => e.className !== "temp");

        if (
          closeEdge &&
          !nextEdges.find(
            (ne: any) =>
              ne.source === closeEdge.source && ne.target === closeEdge.target
          )
        ) {
          // Validate: no self-connections and no existing incoming edges
          const isValidConnection = closeEdge.source !== closeEdge.target;

          if (isValidConnection) {
            nextEdges.push(closeEdge);
          }
        }

        return nextEdges;
      });
    },
    [getClosestEdge, setEdges]
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      // Track deleted nodes in history (we'll capture the final state after all deletions)
      const nodeNames = deleted
        .map((node) => {
          const nodeData = node.data as any;
          return nodeData?.tree_node?.name || "node";
        })
        .join(", ");

      let remainingNodes = [...nodes];
      let newEdges = [...edges];

      // Process each deleted node
      deleted.forEach((node) => {
        const incomers = getIncomers(node, remainingNodes, newEdges);
        const outgoers = getOutgoers(node, remainingNodes, newEdges);
        const connectedEdges = getConnectedEdges([node], newEdges);

        // Remove all edges connected to this node
        newEdges = newEdges.filter((edge) => !connectedEdges.includes(edge));

        // Create new edges connecting incomers to outgoers
        const createdEdges = incomers.flatMap(({ id: source }) =>
          outgoers.map(({ id: target }) => ({
            id: `${source}->${target}`,
            source,
            target,
            type: "smoothstep",
            animated: true,
          }))
        );

        // Add the new connecting edges
        newEdges = [...newEdges, ...createdEdges];

        // Remove the node from remaining nodes for next iteration
        remainingNodes = remainingNodes.filter((rn) => rn.id !== node.id);
      });

      // Track the deletion in history with final state
      addHistoryAction(
        "REMOVE_NODE",
        `Removed ${nodeNames}`,
        {},
        { nodes: remainingNodes, edges: newEdges }
      );

      // Update edges state - keep changes only in React Flow state
      setEdges(newEdges);
    },
    [nodes, edges, setEdges, addHistoryAction]
  );

  // Helper function to get tool metadata
  const getToolInfo = (tool_name: string) => {
    return toolMetadata[tool_name] || null;
  };

  // Parse TreeGraph into React Flow nodes and edges
  const parsePresetIntoTree = (
    treeGraph: TreeGraph
  ): { nodes: Node[]; edges: Edge[] } => {
    console.log("parsePresetIntoTree received:", treeGraph);

    if (
      !treeGraph ||
      !treeGraph.nodes ||
      typeof treeGraph.nodes !== "object" ||
      Object.keys(treeGraph.nodes).length === 0
    ) {
      console.log("Invalid treeGraph structure or empty nodes");
      return { nodes: [], edges: [] };
    }

    const parsedNodes: Node[] = [];
    const parsedEdges: Edge[] = [];

    // Create a map of edges for easier lookup
    const edgeMap = new Map<string, string[]>(); // target -> [sources]
    treeGraph.edges.forEach(([source, target]) => {
      if (!edgeMap.has(target)) {
        edgeMap.set(target, []);
      }
      edgeMap.get(target)!.push(source);
    });

    // Create nodes without manual positioning (Dagre will handle this)
    Object.values(treeGraph.nodes).forEach((treeNode) => {
      // Create React Flow node with temporary position (will be overridden by Dagre)
      const node: Node = {
        id: treeNode.id,
        type: "toolEditorNode",
        position: { x: 0, y: 0 }, // Temporary position
        draggable: true, // Enable dragging by default
        data: {
          label: treeNode.name,
          branch_info: treeNode.is_branch
            ? {
                name: treeNode.name,
                description: treeNode.description || "",
                instruction: treeNode.instruction || "",
              }
            : null,
          tool_info: {
            name: treeNode.name,
            from_branch: "", // Will be determined from edges if needed
            from_tools: edgeMap.get(treeNode.id) || [],
            is_branch: treeNode.is_branch,
          },
          tool_metadata: getToolInfo(treeNode.name),
          tree_node: treeNode,
          duplicate_node: duplicateNode,
        },
      };
      parsedNodes.push(node);
    });

    // Create edges with step type for traditional decision tree look
    treeGraph.edges.forEach(([source, target]) => {
      const edge: Edge = {
        id: `${source}-${target}`,
        source: source,
        target: target,
        type: "smoothstep", // 90-degree turns for decision tree look
        animated: true,
      };
      parsedEdges.push(edge);
    });

    // Apply Dagre auto-layout to calculate positions
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      parsedNodes,
      parsedEdges
    );

    return { nodes: layoutedNodes, edges: layoutedEdges };
  };

  const duplicateNode = (treeNode: TreeNode) => {
    console.log("duplicate node", treeNode);
    // TODO: Implement duplication logic
  };

  const fetchToolPresets = async () => {
    if (!id) return;
    const data: ToolPresetPayload = await getToolPresets(id);

    if (data.error) {
      showErrorToast("Failed to fetch tool presets", data.error);
      return;
    }

    setToolPresets(data.presets);
    const deepCopy = JSON.parse(JSON.stringify(data.presets[0]));
    setSelectedToolPreset(deepCopy || null);
  };

  const fetchToolMetadata = async () => {
    const data: ToolMetadataListPayload = await getToolMetadata();

    if (data.error) {
      showErrorToast("Failed to fetch tool metadata", data.error);
      return;
    }

    setToolMetadata(data.tools);
  };

  const selectToolPreset = (id: string) => {
    const deepCopy = JSON.parse(
      JSON.stringify(toolPresets.find((preset) => preset.id === id))
    );
    setSelectedToolPreset(deepCopy);

    // Reset history when changing presets
    resetHistory();
  };

  const updateSelectedToolPreset = (preset: TreeGraph) => {
    setToolPresets((prevToolPresets) =>
      prevToolPresets.map((toolPreset) =>
        toolPreset.id === preset.id ? preset : toolPreset
      )
    );
    const deepCopy = JSON.parse(JSON.stringify(preset));
    setSelectedToolPreset(deepCopy as TreeGraph);
  };

  const createNodeFromTool = useCallback(
    (
      toolData: {
        name: string;
        description: string | null;
        instruction?: string | null;
        is_branch: boolean;
      },
      position: { x: number; y: number }
    ) => {
      // Generate unique ID
      const newId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create new TreeNode
      const newTreeNode: TreeNode = {
        id: newId,
        name: toolData.name,
        description: toolData.description,
        instruction: toolData.instruction || "",
        is_branch: toolData.is_branch,
        is_root: false,
      };

      // Create React Flow node
      const newNode: Node = {
        id: newId,
        type: "toolEditorNode",
        position: position,
        draggable: true, // Enable dragging by default
        data: {
          label: toolData.name,
          tool_metadata: getToolInfo(toolData.name),
          tree_node: newTreeNode,
          duplicate_node: duplicateNode,
        },
      };

      // Track node addition in history BEFORE updating the state
      addHistoryAction(
        "ADD_NODE",
        `Added ${toolData.name}`,
        { nodeData: newNode },
        { nodes: [...nodes, newNode] }
      );

      // Add node to React Flow
      setNodes((prevNodes) => [...prevNodes, newNode]);
    },
    [
      selectedToolPreset,
      getToolInfo,
      duplicateNode,
      setNodes,
      addHistoryAction,
      nodes,
    ]
  );

  const handleAutoLayout = () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );

    // Update nodes with new positions
    onNodesChange(
      layoutedNodes.map((node) => ({
        type: "position",
        id: node.id,
        position: node.position,
      }))
    );
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const toolDataString = event.dataTransfer.getData(
        "application/reactflow"
      );
      if (!toolDataString) return;

      try {
        const toolData = JSON.parse(toolDataString);

        // Use screenToFlowPosition directly with clientX/clientY
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        createNodeFromTool(toolData, position);
      } catch (error) {
        console.error("Error parsing dropped tool data:", error);
      }
    },
    [screenToFlowPosition, createNodeFromTool]
  );

  const saveTree = () => {
    if (!validateTree()) return;

    // Save the TreeGraph to the database
    // TODO: Implement actual save logic

    // Reset history and unsaved changes after successful save
    resetHistory();
  };

  const validateTree = () => {
    const warnings: string[] = [];
    let isValid = true;

    // Reset all nodes and edges to valid state
    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        data: { ...node.data, isInvalid: false },
      }))
    );
    setEdges((prevEdges) =>
      prevEdges.map((edge) => ({
        ...edge,
        data: { ...edge.data, isInvalid: false },
        style: { ...edge.style, stroke: undefined, strokeWidth: 2 },
      }))
    );

    // 1. Check for at least one root node
    const rootNodes = nodes.filter((node) => {
      const nodeData = node.data as any;
      return nodeData?.tree_node?.is_root;
    });
    if (rootNodes.length === 0) {
      warnings.push("At least one root node is required");
      isValid = false;
    }

    // 2. Check for loose tools (tools with no incoming connections)
    const looseTools: Node[] = [];
    nodes.forEach((node) => {
      const nodeData = node.data as any;
      const treeNode = nodeData?.tree_node;
      if (treeNode && !treeNode.is_branch && !treeNode.is_root) {
        // It's a tool node
        const hasIncomingConnection = edges.some(
          (edge) => edge.target === node.id
        );
        if (!hasIncomingConnection) {
          looseTools.push(node);
        }
      }
    });

    if (looseTools.length > 0) {
      warnings.push(
        `${looseTools.length} loose tool(s) found - all tools need at least one incoming connection`
      );
      isValid = false;

      // Mark loose tools as invalid
      setNodes((prevNodes) =>
        prevNodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            isInvalid: looseTools.some((loose) => loose.id === node.id),
          },
        }))
      );
    }

    // 3. Check for cycles (DAG validation)
    const cycleEdges = detectCycles();
    if (cycleEdges.length > 0) {
      warnings.push(
        `${cycleEdges.length} cycle(s) detected - the graph must be a DAG (no loops)`
      );
      isValid = false;

      // Mark cycle edges as invalid
      setEdges((prevEdges) =>
        prevEdges.map((edge) => {
          const isInvalid = cycleEdges.some(
            (cycleEdge) => cycleEdge.id === edge.id
          );
          return {
            ...edge,
            data: { ...edge.data, isInvalid },
            style: isInvalid
              ? { ...edge.style, stroke: "hsl(var(--warning))", strokeWidth: 3 }
              : { ...edge.style, stroke: undefined, strokeWidth: 2 },
          };
        })
      );
    }

    setWarningMessages(warnings);
    return isValid;
  };

  // Helper function to detect cycles using DFS
  const detectCycles = (): Edge[] => {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cycleEdges: Edge[] = [];

    const dfs = (nodeId: string, path: Edge[]): boolean => {
      if (recursionStack.has(nodeId)) {
        // Found a cycle, add all edges in the current path to cycleEdges
        cycleEdges.push(...path);
        return true;
      }

      if (visited.has(nodeId)) {
        return false;
      }

      visited.add(nodeId);
      recursionStack.add(nodeId);

      // Get all outgoing edges from this node
      const outgoingEdges = edges.filter((edge) => edge.source === nodeId);

      for (const edge of outgoingEdges) {
        const newPath = [...path, edge];
        if (dfs(edge.target, newPath)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    // Start DFS from all nodes
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        dfs(node.id, []);
      }
    }

    return cycleEdges;
  };

  const parseTreeIntoTreeGraph = () => {
    // Parse the current nodes and edges into TreeGraph
    // Return the TreeGraph
    return {
      nodes: nodes,
      edges: edges,
    };
  };

  const saveTreeToDatabase = (treeGraph: TreeGraph) => {
    // Save the TreeGraph to the database
    console.log("saveTreeToDatabase", treeGraph);
  };

  const updateCurrentPresetName = (name: string) => {
    setCurrentPresetName(name);
  };

  // Parse tree when selectedToolPreset changes
  useEffect(() => {
    if (selectedToolPreset) {
      setNodes([]);
      setEdges([]);
      const { nodes: parsedNodes, edges: parsedEdges } =
        parsePresetIntoTree(selectedToolPreset);
      setNodes(parsedNodes);
      setEdges(parsedEdges);
      setCurrentPresetName(selectedToolPreset.name);

      // Reset history when changing presets
      resetHistory();
    } else {
      setNodes([]);
      setEdges([]);
      resetHistory();
    }
  }, [selectedToolPreset, toolMetadata, resetHistory]);

  useEffect(() => {
    if (!id || !initialized) return;
    fetchToolPresets();
    fetchToolMetadata();
  }, [id, initialized]);

  useEffect(() => {
    if (historyState.actions.length > 0) {
      setUnsavedChanges(true);
      return;
    }
    if (currentPresetName !== selectedToolPreset?.name && selectedToolPreset) {
      setUnsavedChanges(true);
      return;
    }
    setUnsavedChanges(false);
  }, [historyState.actions, currentPresetName]);

  return (
    <TreeContext.Provider
      value={{
        toolPresets,
        toolMetadata,
        fetchToolPresets,
        fetchToolMetadata,
        selectToolPreset,
        selectedToolPreset,
        updateSelectedToolPreset,
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        duplicateNode,
        onConnect,
        isValidConnection,
        createNodeFromTool,
        handleAutoLayout,
        onDragOver,
        onDrop,
        reactFlowWrapper,
        onNodeDrag,
        onNodeDragStop,
        onNodesDelete,
        currentPresetName,
        updateCurrentPresetName,
        saveTree,
        warningMessages,
        validateTree,
        historyState,
        canUndo,
        canRedo,
        undo,
        redo,
        unsavedChanges,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
};
