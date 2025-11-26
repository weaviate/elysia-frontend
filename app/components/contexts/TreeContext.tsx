"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
} from "@xyflow/react";
import { useAutoLayout } from "@/hooks/useAutoLayout";

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
  deleteNode: (treeNode: TreeNode) => void;
  duplicateNode: (treeNode: TreeNode) => void;
  onConnect: (connection: Connection) => void;
  isValidConnection: (connection: Connection) => boolean;
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
  deleteNode: () => {},
  duplicateNode: () => {},
  onConnect: () => {},
  isValidConnection: () => false,
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

      const incomingEdges = edges.filter((edge) => edge.target === target);
      if (incomingEdges.length > 0) {
        showWarningToast(
          "Invalid Connection",
          "Node already has an incoming connection"
        );
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

      // Check if target node already has an incoming edge
      const incomingEdges = edges.filter((edge) => edge.target === target);

      const isValid = incomingEdges.length === 0;

      return isValid;
    },
    [edges]
  );

  // Helper function to get tool metadata
  const getToolInfo = (tool_name: string) => {
    return toolMetadata[tool_name] || null;
  };

  const createNodeFromTool = useCallback(
    (toolData: any, position: { x: number; y: number }) => {
      // Generate unique ID
      const newId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create new TreeNode
      const newTreeNode: TreeNode = {
        id: newId,
        name: toolData.name,
        description: toolData.description,
        instruction: toolData.instruction || "",
        is_branch: false,
        is_root: false,
      };

      // Create React Flow node
      const newNode: Node = {
        id: newId,
        type: "toolEditorNode",
        position: position,
        data: {
          label: toolData.name,
          branch_info: null,
          tool_info: {
            name: toolData.name,
            from_branch: "",
            from_tools: [],
            is_branch: false,
          },
          tool_metadata: getToolInfo(toolData.name),
          tree_node: newTreeNode,
          delete_node: deleteNode,
          duplicate_node: duplicateNode,
        },
      };

      // Add node to React Flow
      setNodes((prevNodes) => [...prevNodes, newNode]);

      // Update selectedToolPreset to include the new node
      if (selectedToolPreset) {
        const updatedPreset = {
          ...selectedToolPreset,
          nodes: {
            ...selectedToolPreset.nodes,
            [newId]: newTreeNode,
          },
        };
        setSelectedToolPreset(updatedPreset);
      }
    },
    [selectedToolPreset, getToolInfo, deleteNode, duplicateNode, setNodes]
  );

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
          delete_node: deleteNode,
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

  // Node operations
  const deleteNode = (treeNode: TreeNode) => {
    console.log("delete node", treeNode);

    const nodeId = treeNode.id;

    // Remove the node from React Flow state
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));

    // Remove all edges connected to this node (both incoming and outgoing)
    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );

    console.log("Deleted node and connected edges:", nodeId);
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

  // Parse tree when selectedToolPreset changes
  useEffect(() => {
    if (selectedToolPreset) {
      console.log("Parsing selectedToolPreset:", selectedToolPreset);
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
        deleteNode,
        duplicateNode,
        onConnect,
        isValidConnection,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
};
