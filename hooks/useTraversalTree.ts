import { useCallback, useRef } from "react";
import { Node, Edge } from "@xyflow/react";
import { Query, GraphPayload } from "@/app/types/chat";
import { TreeGraph, ToolMetadataList } from "@/app/types/objects";
import { ViewerNodeData } from "@/app/components/chat/nodes/ViewerNode";
import { useAutoLayout } from "./useAutoLayout";

export interface TraversalTreeOptions {
  toolMetadata: ToolMetadataList;
  hideUnusedNodes?: boolean;
}

interface TreeInstance {
  queryIndex: number;
  treeIndex: number;
  graph: GraphPayload;
  traversedEdges: Set<string>; // "from-to" format
  edgeReasonings: Map<string, string>; // "from-to" -> reasoning
  firstTraversedTarget: string | null; // First target node after root in this tree
}

// Generate unique IDs for duplicated tree instances
const generateNodeId = (
  originalId: string,
  queryIndex: number,
  treeIndex: number
) => `q${queryIndex}_t${treeIndex}_${originalId}`;

const generateEdgeId = (
  source: string,
  target: string,
  queryIndex: number,
  treeIndex: number
) => `q${queryIndex}_t${treeIndex}_${source}-${target}`;

// Find root node - checks for explicit is_root first, then falls back to edge analysis
const findRootNodeId = (graph: GraphPayload): string | null => {
  // First check for explicit is_root
  const explicitRoot = Object.values(graph.nodes).find((n) => n.is_root);
  if (explicitRoot) return explicitRoot.id;

  // Fallback: Find by edge analysis - source nodes that are never targets
  const allSources = new Set(graph.edges.map(([source]) => source));
  const allTargets = new Set(graph.edges.map(([, target]) => target));

  for (const sourceId of allSources) {
    if (!allTargets.has(sourceId)) {
      return sourceId;
    }
  }

  return null;
};

export const useTraversalTree = (options: TraversalTreeOptions) => {
  const { toolMetadata, hideUnusedNodes = false } = options;

  const { getLayoutedElements } = useAutoLayout({
    direction: "TB",
    nodeWidth: 260,
    nodeHeight: 120,
    rankSeparation: 180,
    nodeSeparation: 120,
  });

  // Cache for stable references to prevent unnecessary re-renders
  const nodesCache = useRef<Map<string, Node>>(new Map());

  const getToolInfo = useCallback(
    (toolName: string) => toolMetadata[toolName] || null,
    [toolMetadata]
  );

  // Build traversal tree from queries
  const buildTraversalTree = useCallback(
    (
      queries: Query[],
      sortedQueryIds: string[]
    ): { nodes: Node[]; edges: Edge[] } => {
      if (sortedQueryIds.length === 0) {
        return { nodes: [], edges: [] };
      }

      const allNodes: Node[] = [];
      const allEdges: Edge[] = [];

      // Track the last leaf node for connections between trees/queries
      let previousLeafNodeId: string | null = null;
      // Track if this is the very first tree being rendered (only show root for this one)
      let isFirstTreeOverall = true;

      sortedQueryIds.forEach((queryId, queryIndex) => {
        const query = queries.find((q) => q.id === queryId);
        if (
          !query ||
          !query.graph ||
          Object.keys(query.graph.nodes).length === 0
        ) {
          return;
        }

        const { graph } = query;

        // Find root node
        const rootNodeId = findRootNodeId(graph);
        if (!rootNodeId) {
          console.warn(`Query ${queryIndex}: Could not find root node`);
          return;
        }

        // Determine how many tree instances this query has based on edges
        const maxTreeIndex = query.edges.reduce(
          (max, edge) => Math.max(max, edge.tree_index),
          0
        );

        // Create tree instances for this query
        const treeInstances: TreeInstance[] = [];

        for (let treeIdx = 0; treeIdx <= maxTreeIndex; treeIdx++) {
          // Get edges for this tree index
          const edgesForTree = query.edges.filter(
            (e) => e.tree_index === treeIdx
          );

          const traversedEdges = new Set<string>();
          const edgeReasonings = new Map<string, string>();
          let firstTraversedTarget: string | null = null;

          edgesForTree.forEach((edge) => {
            const edgeKey = `${edge.from}-${edge.to}`;
            traversedEdges.add(edgeKey);
            if (edge.reasoning) {
              edgeReasonings.set(edgeKey, edge.reasoning);
            }
            // Track the first target from root
            if (edge.from === rootNodeId && !firstTraversedTarget) {
              firstTraversedTarget = edge.to;
            }
          });

          treeInstances.push({
            queryIndex,
            treeIndex: treeIdx,
            graph,
            traversedEdges,
            edgeReasonings,
            firstTraversedTarget,
          });
        }

        // If no edges yet, still show the base tree (but only for first query)
        if (treeInstances.length === 0) {
          treeInstances.push({
            queryIndex,
            treeIndex: 0,
            graph,
            traversedEdges: new Set(),
            edgeReasonings: new Map(),
            firstTraversedTarget: null,
          });
        }

        // Track last leaf for this query
        let queryLastLeafNode: string | null = null;

        treeInstances.forEach((instance, instanceIdx) => {
          const {
            traversedEdges,
            edgeReasonings,
            treeIndex,
            firstTraversedTarget,
          } = instance;

          // Determine which nodes are traversed
          const traversedNodeIds = new Set<string>();
          traversedEdges.forEach((edgeKey) => {
            const [from, to] = edgeKey.split("-");
            traversedNodeIds.add(from);
            traversedNodeIds.add(to);
          });

          // Find the last traversed node (leaf) in this tree instance
          let lastTraversedNode: string | null = null;
          traversedNodeIds.forEach((nodeId) => {
            const hasOutgoing = Array.from(traversedEdges).some((edgeKey) =>
              edgeKey.startsWith(`${nodeId}-`)
            );
            if (!hasOutgoing) {
              lastTraversedNode = nodeId;
            }
          });

          // Skip root for ALL trees except the very first one
          // This means: queryIndex > 0 OR (queryIndex === 0 AND instanceIdx > 0)
          const shouldSkipRoot = !isFirstTreeOverall;

          // Create nodes for this tree instance
          Object.values(graph.nodes).forEach((treeNode) => {
            // Skip root node if not the first tree overall
            if (shouldSkipRoot && treeNode.id === rootNodeId) {
              return;
            }

            const isTraversed = traversedNodeIds.has(treeNode.id);

            // If hideUnusedNodes is enabled and this is a subsequent tree,
            // only show traversed nodes
            if (hideUnusedNodes && shouldSkipRoot && !isTraversed) {
              return;
            }

            const nodeId = generateNodeId(treeNode.id, queryIndex, treeIndex);
            const isActive =
              isTraversed &&
              treeNode.id === lastTraversedNode &&
              !query.finished;

            const nodeData: ViewerNodeData = {
              label: treeNode.name,
              tree_node: treeNode,
              tool_metadata: getToolInfo(treeNode.name),
              traversed: isTraversed,
              active: isActive,
              queryIndex,
              treeIndex,
            };

            // Use cache for stable references
            const cachedNode = nodesCache.current.get(nodeId);
            const newNode: Node = {
              id: nodeId,
              type: "viewerNode",
              position: cachedNode?.position || { x: 0, y: 0 },
              data: nodeData as unknown as Record<string, unknown>,
            };

            if (
              !cachedNode ||
              JSON.stringify(cachedNode.data) !== JSON.stringify(nodeData)
            ) {
              nodesCache.current.set(nodeId, newNode);
            }

            allNodes.push(newNode);
          });

          // Create edges for this tree instance
          graph.edges.forEach(([source, target]) => {
            const edgeKey = `${source}-${target}`;
            const isTraversed = traversedEdges.has(edgeKey);
            const reasoning = edgeReasonings.get(edgeKey);

            // For subsequent trees, redirect edges FROM root to come from previousLeafNode
            const isEdgeFromRoot = source === rootNodeId;

            if (shouldSkipRoot && isEdgeFromRoot) {
              // For subsequent trees, edges from root should come from the previous leaf
              if (!previousLeafNodeId) return; // Can't create edge without a source

              // If hideUnusedNodes is enabled, skip non-traversed edges
              if (hideUnusedNodes && !isTraversed) return;

              const targetNodeId = generateNodeId(
                target,
                queryIndex,
                treeIndex
              );

              // Determine if this is the traversed path
              const isFirstTraversedInTree = target === firstTraversedTarget;
              const isCrossQuery = instanceIdx === 0 && queryIndex > 0;
              const isReset = instanceIdx > 0;

              const edgeId = isFirstTraversedInTree
                ? isCrossQuery
                  ? `cross_query_${queryIndex - 1}_${queryIndex}`
                  : `reset_${queryIndex}_${treeIndex}`
                : `branch_${queryIndex}_${treeIndex}_${target}`;

              allEdges.push({
                id: edgeId,
                source: previousLeafNodeId,
                target: targetNodeId,
                type: "traversalEdge",
                animated: isTraversed,
                data: {
                  traversed: isTraversed,
                  reasoning: isTraversed ? reasoning : undefined,
                  isReset: isReset && isFirstTraversedInTree,
                  isCrossQuery: isCrossQuery && isFirstTraversedInTree,
                  queryText:
                    isCrossQuery && isFirstTraversedInTree
                      ? query.query
                      : undefined,
                },
              });
            } else if (!isEdgeFromRoot) {
              // Non-root edges (deeper tree structure) - create normally
              const sourceNodeId = generateNodeId(
                source,
                queryIndex,
                treeIndex
              );
              const targetNodeId = generateNodeId(
                target,
                queryIndex,
                treeIndex
              );

              // For the very first tree, first traversed edge from root shows query
              const isFirstDecision =
                isFirstTreeOverall &&
                treeIndex === 0 &&
                source === rootNodeId &&
                target === firstTraversedTarget &&
                isTraversed;

              const edgeId = generateEdgeId(
                source,
                target,
                queryIndex,
                treeIndex
              );

              allEdges.push({
                id: edgeId,
                source: sourceNodeId,
                target: targetNodeId,
                type: "traversalEdge",
                animated: isTraversed,
                data: {
                  traversed: isTraversed,
                  reasoning: reasoning,
                  isReset: false,
                  isFirstDecision: isFirstDecision,
                  queryText: isFirstDecision ? query.query : undefined,
                },
              });
            } else {
              // First tree, edge from root - create normally
              const sourceNodeId = generateNodeId(
                source,
                queryIndex,
                treeIndex
              );
              const targetNodeId = generateNodeId(
                target,
                queryIndex,
                treeIndex
              );

              const isFirstDecision =
                isFirstTreeOverall &&
                treeIndex === 0 &&
                target === firstTraversedTarget &&
                isTraversed;

              const edgeId = generateEdgeId(
                source,
                target,
                queryIndex,
                treeIndex
              );

              allEdges.push({
                id: edgeId,
                source: sourceNodeId,
                target: targetNodeId,
                type: "traversalEdge",
                animated: isTraversed,
                data: {
                  traversed: isTraversed,
                  reasoning: reasoning,
                  isReset: false,
                  isFirstDecision: isFirstDecision,
                  queryText: isFirstDecision ? query.query : undefined,
                },
              });
            }
          });

          // Update tracking for next iteration
          if (lastTraversedNode) {
            const leafId = generateNodeId(
              lastTraversedNode,
              queryIndex,
              treeIndex
            );
            queryLastLeafNode = leafId;
            previousLeafNodeId = leafId;
          }

          // After processing the first tree instance, mark that we're no longer on the first tree
          isFirstTreeOverall = false;
        });

        // Update for next query
        if (queryLastLeafNode) {
          previousLeafNodeId = queryLastLeafNode;
        }
      });

      // Apply layout
      if (allNodes.length > 0) {
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(allNodes, allEdges);
        return { nodes: layoutedNodes, edges: layoutedEdges };
      }

      return { nodes: allNodes, edges: allEdges };
    },
    [getLayoutedElements, getToolInfo, hideUnusedNodes]
  );

  // Build tree from preset (for when no queries exist)
  const buildPresetTree = useCallback(
    (preset: TreeGraph): { nodes: Node[]; edges: Edge[] } => {
      if (!preset || !preset.nodes || Object.keys(preset.nodes).length === 0) {
        return { nodes: [], edges: [] };
      }

      const parsedNodes: Node[] = [];
      const parsedEdges: Edge[] = [];

      Object.values(preset.nodes).forEach((treeNode) => {
        const nodeData: ViewerNodeData = {
          label: treeNode.name,
          tree_node: treeNode,
          tool_metadata: getToolInfo(treeNode.name),
          traversed: false,
          active: false,
          queryIndex: 0,
          treeIndex: 0,
        };

        const node: Node = {
          id: treeNode.id,
          type: "viewerNode",
          position: { x: 0, y: 0 },
          data: nodeData as unknown as Record<string, unknown>,
        };

        parsedNodes.push(node);
      });

      preset.edges.forEach(([source, target]) => {
        const edge: Edge = {
          id: `${source}-${target}`,
          source,
          target,
          type: "traversalEdge",
          animated: false,
          data: {
            traversed: false,
            isReset: false,
          },
        };

        parsedEdges.push(edge);
      });

      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(parsedNodes, parsedEdges);

      return { nodes: layoutedNodes, edges: layoutedEdges };
    },
    [getLayoutedElements, getToolInfo]
  );

  return {
    buildTraversalTree,
    buildPresetTree,
  };
};
