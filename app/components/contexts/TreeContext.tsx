"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ToolPreset,
  TreeGraph,
  TreeNode,
  ToolItem,
  BranchInfo,
} from "@/app/types/objects";
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
  reactFlowWrapper: { current: null },
  onNodeDrag: () => {},
  onNodeDragStop: () => {},
  onNodesDelete: () => {},
});

export const TreeProvider = ({ children }: { children: React.ReactNode }) => {
  const { id, initialized } = useContext(SessionContext);
  const { showErrorToast, showWarningToast } = useContext(ToastContext);

  const [toolPresets, setToolPresets] = useState<TreeGraph[]>([]);
  const [selectedToolPreset, setSelectedToolPreset] =
    useState<TreeGraph | null>(null);
  const [toolMetadata, setToolMetadata] = useState<ToolMetadataList>({});

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
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
      onEdgesChange([{ type: "add", item: newEdge }]);
    },
    [onEdgesChange]
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

      // Update edges state - keep changes only in React Flow state
      setEdges(newEdges);
    },
    [nodes, edges, setEdges]
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

      // Add node to React Flow
      setNodes((prevNodes) => [...prevNodes, newNode]);
    },
    [selectedToolPreset, getToolInfo, duplicateNode, setNodes]
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

  // Parse tree when selectedToolPreset changes
  useEffect(() => {
    if (selectedToolPreset) {
      setNodes([]);
      setEdges([]);
      const { nodes: parsedNodes, edges: parsedEdges } =
        parsePresetIntoTree(selectedToolPreset);
      setNodes(parsedNodes);
      setEdges(parsedEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [selectedToolPreset, toolMetadata]);

  useEffect(() => {
    if (!id || !initialized) return;
    fetchToolPresets();
    fetchToolMetadata();
  }, [id, initialized]);

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
      }}
    >
      {children}
    </TreeContext.Provider>
  );
};
