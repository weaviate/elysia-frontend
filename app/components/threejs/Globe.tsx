import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Import the new shader files
import globeVertexShader from "./globeVertex.glsl";
import globeFragmentShader from "./globeFragment.glsl";

interface NetworkNode {
  id: number;
  position: THREE.Vector3;
  connections: number[];
  color: THREE.Color;
  cluster: number;
}

interface NetworkEdge {
  from: number;
  to: number;
  strength: number;
}

function generateNetworkTopology(nodeCount: number = 80, radius: number = 2) {
  const nodes: NetworkNode[] = [];
  const edges: NetworkEdge[] = [];

  // Generate nodes with clustering (creates that network topology look)
  for (let i = 0; i < nodeCount; i++) {
    // Create 4 main clusters
    const clusterIndex = i % 4;
    const clusterBias = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 1).normalize(),
      new THREE.Vector3(0, -1, -1).normalize(),
    ][clusterIndex];

    // Random position with cluster bias
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const basePosition = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    );

    // Add cluster bias and some randomness for network-like distribution
    const position = basePosition
      .multiplyScalar(radius * (0.5 + Math.random() * 0.5))
      .add(clusterBias.multiplyScalar(0.4 + Math.random() * 0.3));

    // Color nodes based on cluster with some variation
    const hue = (clusterIndex * 0.25 + Math.random() * 0.1) % 1;

    nodes.push({
      id: i,
      position,
      connections: [],
      color: new THREE.Color().setHSL(hue, 0.8, 0.6),
      cluster: clusterIndex,
    });
  }

  // Generate edges using proximity and cluster affinity
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const distances: Array<{
      index: number;
      distance: number;
      affinity: number;
    }> = [];

    // Calculate distances and cluster affinity to all other nodes
    for (let j = 0; j < nodes.length; j++) {
      if (i !== j) {
        const distance = node.position.distanceTo(nodes[j].position);
        const clusterAffinity = nodes[j].cluster === node.cluster ? 0.7 : 1.0;
        const weightedDistance = distance * clusterAffinity;

        distances.push({
          index: j,
          distance: weightedDistance,
          affinity: clusterAffinity,
        });
      }
    }

    // Sort by weighted distance (prefer same cluster)
    distances.sort((a, b) => a.distance - b.distance);

    // Connect to 3-6 nearest neighbors (more connections for network effect)
    const connectionCount = 3 + Math.floor(Math.random() * 4);
    for (let k = 0; k < Math.min(connectionCount, distances.length); k++) {
      const targetIndex = distances[k].index;

      // Avoid duplicate edges
      const existingEdge = edges.find(
        (e) =>
          (e.from === i && e.to === targetIndex) ||
          (e.from === targetIndex && e.to === i)
      );

      if (!existingEdge) {
        edges.push({
          from: i,
          to: targetIndex,
          strength: 1.0 - (k / connectionCount) * 0.4,
        });

        nodes[i].connections.push(targetIndex);
        nodes[targetIndex].connections.push(i);
      }
    }

    // Add some long-distance connections for network complexity
    if (Math.random() < 0.4) {
      const randomIndex = Math.floor(Math.random() * nodes.length);
      if (randomIndex !== i && !nodes[i].connections.includes(randomIndex)) {
        edges.push({
          from: i,
          to: randomIndex,
          strength: 0.2,
        });
        nodes[i].connections.push(randomIndex);
        nodes[randomIndex].connections.push(i);
      }
    }
  }

  return { nodes, edges };
}

function createNetworkGeometry(nodes: NetworkNode[], edges: NetworkEdge[]) {
  // Create node geometries
  const nodePositions: number[] = [];
  const nodeColors: number[] = [];

  nodes.forEach((node) => {
    nodePositions.push(node.position.x, node.position.y, node.position.z);
    nodeColors.push(node.color.r, node.color.g, node.color.b);
  });

  // Create edge geometries with multiple segments for smoother lines
  const edgePositions: number[] = [];
  const edgeColors: number[] = [];

  edges.forEach((edge) => {
    const fromNode = nodes[edge.from];
    const toNode = nodes[edge.to];

    // Create curved lines for more organic network look
    const segments = 3;
    for (let i = 0; i < segments; i++) {
      const t1 = i / segments;
      const t2 = (i + 1) / segments;

      // Add some curve to the line
      const midpoint = fromNode.position.clone().lerp(toNode.position, 0.5);
      const offset = midpoint
        .clone()
        .normalize()
        .multiplyScalar(0.1 * Math.sin(Math.PI * (t1 + t2) * 0.5));

      const p1 = fromNode.position
        .clone()
        .lerp(toNode.position, t1)
        .add(offset.clone().multiplyScalar(t1 * (1 - t1) * 4));
      const p2 = fromNode.position
        .clone()
        .lerp(toNode.position, t2)
        .add(offset.clone().multiplyScalar(t2 * (1 - t2) * 4));

      edgePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);

      // Color based on edge strength and position along edge
      const edgeColor = new THREE.Color().setHSL(
        0.6,
        0.7,
        0.2 + edge.strength * 0.5
      );
      edgeColors.push(
        edgeColor.r,
        edgeColor.g,
        edgeColor.b,
        edgeColor.r,
        edgeColor.g,
        edgeColor.b
      );
    }
  });

  return {
    nodePositions: new Float32Array(nodePositions),
    nodeColors: new Float32Array(nodeColors),
    edgePositions: new Float32Array(edgePositions),
    edgeColors: new Float32Array(edgeColors),
  };
}

export default function Globe({
  radius = 2,
  nodeCount = 80,
  glowColor = "#00ff41",
  wireframeColor = "#00ff41",
  branchColor = "#8844ff",
  retroMode = true,
  pixelSize = 4.0,
  ...props
}: {
  radius?: number;
  nodeCount?: number;
  glowColor?: string;
  wireframeColor?: string;
  branchColor?: string;
  retroMode?: boolean;
  pixelSize?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const nodesRef = useRef<THREE.Points>(null);
  const sphereWireframeRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { size, camera } = useThree();

  const { geometryData } = useMemo(() => {
    const networkData = generateNetworkTopology(nodeCount, radius);
    const geometryData = createNetworkGeometry(
      networkData.nodes,
      networkData.edges
    );
    return { networkData, geometryData };
  }, [nodeCount, radius]);

  // Create wireframe sphere geometry
  const wireframeSphereGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(radius * 0.7, 32, 16);
    return new THREE.WireframeGeometry(geometry);
  }, [radius]);

  // Create custom shader material for retro effect using the new shaders
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: globeVertexShader,
      fragmentShader: globeFragmentShader,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(size.width, size.height) },
        glowColor: { value: new THREE.Color(glowColor) },
        wireframeColor: { value: new THREE.Color(wireframeColor) },
        branchColor: { value: new THREE.Color(branchColor) },
        pixelSize: { value: pixelSize },
        retroMode: { value: retroMode },
      },
      transparent: true,
      // Remove additive blending and glow effects
      blending: THREE.NormalBlending,
      depthWrite: true,
    });
  }, [
    glowColor,
    wireframeColor,
    branchColor,
    pixelSize,
    retroMode,
    size,
    camera,
  ]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.08;
      groupRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
    }

    // Update shader uniforms
    if (shaderMaterial) {
      shaderMaterial.uniforms.time.value = clock.getElapsedTime();
      shaderMaterial.uniforms.resolution.value.set(size.width, size.height);
    }

    // Animate edge opacity for data flow effect
    if (edgesRef.current && edgesRef.current.material) {
      const material = edgesRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.2 + Math.sin(clock.getElapsedTime() * 1.5) * 0.15;
    }

    // Pulse nodes for alive network effect
    if (nodesRef.current && nodesRef.current.material) {
      const material = nodesRef.current.material as THREE.PointsMaterial;
      material.size = 0.06 + Math.sin(clock.getElapsedTime() * 2) * 0.02;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* Smooth Spherical Wireframe */}
      <lineSegments ref={sphereWireframeRef}>
        <primitive object={wireframeSphereGeometry} />
        <lineBasicMaterial
          color={wireframeColor}
          transparent
          opacity={0.4}
          // Remove additive blending for cleaner lines
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Network Edges - The Connection Lines */}
      <lineSegments ref={edgesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={geometryData.edgePositions.length / 3}
            array={geometryData.edgePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={geometryData.edgeColors.length / 3}
            array={geometryData.edgeColors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={branchColor}
          transparent
          opacity={0.3}
          // Remove additive blending for cleaner lines
          blending={THREE.NormalBlending}
          depthWrite={false}
          vertexColors
        />
      </lineSegments>

      {/* Network Nodes - The Data Points */}
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={geometryData.nodePositions.length / 3}
            array={geometryData.nodePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={geometryData.nodeColors.length / 3}
            array={geometryData.nodeColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={glowColor}
          size={0.08}
          transparent
          opacity={0.9}
          // Remove additive blending for cleaner appearance
          blending={THREE.NormalBlending}
          depthWrite={false}
          vertexColors
        />
      </points>

      {/* Wireframe Sphere Backdrop with Retro Pixelated Shader */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius * 0.7, 32, 16]} />
        <primitive object={shaderMaterial} />
      </mesh>

      {/* Central Core */}
      <mesh>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.8}
          // Remove additive blending
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
