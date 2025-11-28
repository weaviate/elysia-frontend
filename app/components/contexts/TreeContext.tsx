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
const MAX_HISTORY_STEPS = 20; // Maximum number of undo steps to track

// Command Pattern for undo/redo functionality
export interface Command {
  execute(): void;
  undo(): void;
  description: string;
}

// Command implementations
export class AddNodeCommand implements Command {
  description: string;

  constructor(
    private node: Node,
    private setNodes: (updater: (nodes: Node[]) => Node[]) => void
  ) {
    this.description = `Add ${(node.data as any)?.tree_node?.name || "node"}`;
  }

  execute(): void {
    this.setNodes((prev) => [...prev, this.node]);
  }

  undo(): void {
    this.setNodes((prev) => prev.filter((n) => n.id !== this.node.id));
  }
}

export class RemoveNodeCommand implements Command {
  description: string;

  constructor(
    private nodes: Node[],
    private edges: Edge[],
    private removedNodes: Node[],
    private removedEdges: Edge[],
    private createdEdges: Edge[],
    private setNodes: (updater: (nodes: Node[]) => Node[]) => void,
    private setEdges: (updater: (edges: Edge[]) => Edge[]) => void
  ) {
    const nodeNames = removedNodes
      .map((n) => (n.data as any)?.tree_node?.name || "node")
      .join(", ");
    this.description = `Remove ${nodeNames}`;
  }

  execute(): void {
    // Remove nodes and update edges (this is already done when command is created)
    // This method is called during redo
    this.setNodes(() => this.nodes);
    this.setEdges(() => this.edges);
  }

  undo(): void {
    // Restore removed nodes and original edges
    this.setNodes((prev) => [...prev, ...this.removedNodes]);
    this.setEdges((prev) => {
      // Remove created edges and restore removed edges
      const withoutCreated = prev.filter(
        (e) => !this.createdEdges.some((ce) => ce.id === e.id)
      );
      return [...withoutCreated, ...this.removedEdges];
    });
  }
}

export class AddEdgeCommand implements Command {
  description: string;

  constructor(
    private edge: Edge,
    private setEdges: (updater: (edges: Edge[]) => Edge[]) => void
  ) {
    this.description = `Connect nodes`;
  }

  execute(): void {
    this.setEdges((prev) => [...prev, this.edge]);
  }

  undo(): void {
    this.setEdges((prev) => prev.filter((e) => e.id !== this.edge.id));
  }
}

export class RemoveEdgeCommand implements Command {
  description: string;

  constructor(
    private edge: Edge,
    private setEdges: (updater: (edges: Edge[]) => Edge[]) => void
  ) {
    this.description = `Disconnect nodes`;
  }

  execute(): void {
    this.setEdges((prev) => prev.filter((e) => e.id !== this.edge.id));
  }

  undo(): void {
    this.setEdges((prev) => [...prev, this.edge]);
  }
}

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

  // Command Pattern history state
  const [commandHistory, setCommandHistory] = useState<Command[]>([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState<number>(-1);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  // Computed values for undo/redo
  const canUndo = currentCommandIndex >= 0;
  const canRedo = currentCommandIndex < commandHistory.length - 1;

  // Reset history
  const resetHistory = useCallback(() => {
    setCommandHistory([]);
    setCurrentCommandIndex(-1);
  }, []);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Execute command and add to history
  const executeCommand = useCallback(
    (command: Command) => {
      // Execute the command
      command.execute();

      // Add to history, removing any future commands if we're not at the latest state
      setCommandHistory((prev) => {
        const newHistory = prev.slice(0, currentCommandIndex + 1);
        newHistory.push(command);

        // Limit history size
        if (newHistory.length > MAX_HISTORY_STEPS) {
          return newHistory.slice(-MAX_HISTORY_STEPS);
        }

        return newHistory;
      });

      // Update current index to point to the new command
      setCurrentCommandIndex((prev) => {
        const newIndex = Math.min(prev + 1, MAX_HISTORY_STEPS - 1);
        return newIndex;
      });
    },
    [currentCommandIndex]
  );

  // Undo function
  const undo = useCallback(() => {
    if (!canUndo) return;

    const command = commandHistory[currentCommandIndex];
    command.undo();
    setCurrentCommandIndex((prev) => prev - 1);
  }, [canUndo, commandHistory, currentCommandIndex]);

  // Redo function
  const redo = useCallback(() => {
    if (!canRedo) return;

    const command = commandHistory[currentCommandIndex + 1];
    command.execute();
    setCurrentCommandIndex((prev) => prev + 1);
  }, [canRedo, commandHistory, currentCommandIndex]);

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

      // Use command pattern for undo/redo
      const command = new AddEdgeCommand(newEdge, setEdges);
      executeCommand(command);
    },
    [executeCommand, showWarningToast, setEdges]
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
      let remainingNodes = [...nodes];
      let newEdges = [...edges];
      let allRemovedEdges: Edge[] = [];
      let allCreatedEdges: Edge[] = [];

      // Process each deleted node
      deleted.forEach((node) => {
        const incomers = getIncomers(node, remainingNodes, newEdges);
        const outgoers = getOutgoers(node, remainingNodes, newEdges);
        const connectedEdges = getConnectedEdges([node], newEdges);

        // Store removed edges for undo
        allRemovedEdges.push(...connectedEdges);

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

        // Store created edges for undo
        allCreatedEdges.push(...createdEdges);

        // Add the new connecting edges
        newEdges = [...newEdges, ...createdEdges];

        // Remove the node from remaining nodes for next iteration
        remainingNodes = remainingNodes.filter((rn) => rn.id !== node.id);
      });

      // Use command pattern for undo/redo
      const command = new RemoveNodeCommand(
        remainingNodes,
        newEdges,
        deleted,
        allRemovedEdges,
        allCreatedEdges,
        setNodes,
        setEdges
      );
      executeCommand(command);
    },
    [nodes, edges, setNodes, setEdges, executeCommand]
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

      // Use command pattern for undo/redo
      const command = new AddNodeCommand(newNode, setNodes);
      executeCommand(command);
    },
    [selectedToolPreset, getToolInfo, duplicateNode, executeCommand, setNodes]
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
    if (commandHistory.length > 0) {
      setUnsavedChanges(true);
      return;
    }
    if (currentPresetName !== selectedToolPreset?.name && selectedToolPreset) {
      setUnsavedChanges(true);
      return;
    }
    setUnsavedChanges(false);
  }, [commandHistory, currentPresetName, selectedToolPreset]);

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
