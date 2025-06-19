import type { Graph, AlgorithmResult, AlgorithmStep } from '../types/graph';

export class DijkstraAlgorithm {
  static run(graph: Graph, startNodeId: string): AlgorithmResult {
    const { nodes, edges } = graph;
    const distances: Record<string, number> = {};
    const previousNodes: Record<string, string | null> = {};
    const visited: Set<string> = new Set();
    const steps: AlgorithmStep[] = [];

    // Initialize distances
    nodes.forEach(node => {
      distances[node.id] = node.id === startNodeId ? 0 : Infinity;
      previousNodes[node.id] = null;
    });

    steps.push({
      type: 'distance-update',
      nodeId: startNodeId,
      distance: 0,
      message: `Starting from node ${startNodeId}`
    });

    while (visited.size < nodes.length) {
      // Find unvisited node with minimum distance
      let currentNode: string | null = null;
      let minDistance = Infinity;

      Object.keys(distances).forEach(nodeId => {
        if (!visited.has(nodeId) && distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          currentNode = nodeId;
        }
      });

      if (!currentNode || minDistance === Infinity) break;

      visited.add(currentNode);
      steps.push({
        type: 'node-visit',
        nodeId: currentNode,
        message: `Visiting node ${currentNode} with distance ${distances[currentNode]}`
      });

      // Update distances to neighbors
      edges
        .filter(edge => edge.source === currentNode)
        .forEach(edge => {
          const neighbor = edge.target;
          const newDistance = distances[currentNode!] + edge.weight;

          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance;
            previousNodes[neighbor] = currentNode;
            
            steps.push({
              type: 'edge-relax',
              edgeId: edge.id,
              nodeId: neighbor,
              distance: newDistance,
              previous: currentNode,
              message: `Relaxing edge to ${neighbor}, new distance: ${newDistance}`
            });
          }
        });
    }

    // Build paths
    const paths: Record<string, string[]> = {};
    nodes.forEach(node => {
      if (node.id !== startNodeId && distances[node.id] !== Infinity) {
        const path: string[] = [];
        let current: string | null = node.id;
        
        while (current !== null) {
          path.unshift(current);
          current = previousNodes[current];
        }
        
        paths[node.id] = path;
      }
    });

    return { steps, distances, previousNodes, paths };
  }
}

export class BellmanFordAlgorithm {
  static run(graph: Graph, startNodeId: string): AlgorithmResult {
    const { nodes, edges } = graph;
    const distances: Record<string, number> = {};
    const previousNodes: Record<string, string | null> = {};
    const steps: AlgorithmStep[] = [];

    // Initialize distances
    nodes.forEach(node => {
      distances[node.id] = node.id === startNodeId ? 0 : Infinity;
      previousNodes[node.id] = null;
    });

    steps.push({
      type: 'distance-update',
      nodeId: startNodeId,
      distance: 0,
      message: `Starting from node ${startNodeId}`
    });

    // Relax edges V-1 times
    for (let i = 0; i < nodes.length - 1; i++) {
      steps.push({
        type: 'distance-update',
        message: `Iteration ${i + 1}: Relaxing all edges`
      });

      edges.forEach(edge => {
        const { source, target, weight } = edge;
        
        if (distances[source] !== Infinity) {
          const newDistance = distances[source] + weight;
          
          if (newDistance < distances[target]) {
            distances[target] = newDistance;
            previousNodes[target] = source;
            
            steps.push({
              type: 'edge-relax',
              edgeId: edge.id,
              nodeId: target,
              distance: newDistance,
              previous: source,
              message: `Relaxing edge ${source} → ${target}, new distance: ${newDistance}`
            });
          }
        }
      });
    }

    // Check for negative cycles
    let hasNegativeCycle = false;
    edges.forEach(edge => {
      const { source, target, weight } = edge;
      if (distances[source] !== Infinity && distances[source] + weight < distances[target]) {
        hasNegativeCycle = true;
        steps.push({
          type: 'distance-update',
          message: `Negative cycle detected involving edge ${source} → ${target}`
        });
      }
    });

    // Build paths
    const paths: Record<string, string[]> = {};
    if (!hasNegativeCycle) {
      nodes.forEach(node => {
        if (node.id !== startNodeId && distances[node.id] !== Infinity) {
          const path: string[] = [];
          let current: string | null = node.id;
          
          while (current !== null) {
            path.unshift(current);
            current = previousNodes[current];
          }
          
          paths[node.id] = path;
        }
      });
    }

    return { steps, distances, previousNodes, paths };
  }
}

export class FloydWarshallAlgorithm {
  static run(graph: Graph): AlgorithmResult {
    const { nodes, edges } = graph;
    const nodeIds = nodes.map(n => n.id);
    const distances: Record<string, Record<string, number>> = {};
    const next: Record<string, Record<string, string | null>> = {};
    const steps: AlgorithmStep[] = [];

    // Initialize distance matrix
    nodeIds.forEach(i => {
      distances[i] = {};
      next[i] = {};
      nodeIds.forEach(j => {
        if (i === j) {
          distances[i][j] = 0;
        } else {
          distances[i][j] = Infinity;
          next[i][j] = null;
        }
      });
    });

    // Set edge weights
    edges.forEach(edge => {
      distances[edge.source][edge.target] = edge.weight;
      next[edge.source][edge.target] = edge.target;
    });

    steps.push({
      type: 'distance-update',
      message: 'Initialized distance matrix with direct edges'
    });

    // Floyd-Warshall algorithm
    nodeIds.forEach(k => {
      steps.push({
        type: 'node-visit',
        nodeId: k,
        message: `Using node ${k} as intermediate node`
      });

      nodeIds.forEach(i => {
        nodeIds.forEach(j => {
          const newDistance = distances[i][k] + distances[k][j];
          if (newDistance < distances[i][j]) {
            distances[i][j] = newDistance;
            next[i][j] = next[i][k];
            
            steps.push({
              type: 'distance-update',
              message: `Updated path ${i} → ${j} via ${k}, new distance: ${newDistance}`
            });
          }
        });
      });
    });

    // Build paths for the first node as source (for visualization)
    const startNode = nodeIds[0];
    const flatDistances: Record<string, number> = {};
    const previousNodes: Record<string, string | null> = {};
    const paths: Record<string, string[]> = {};

    nodeIds.forEach(target => {
      flatDistances[target] = distances[startNode][target];
      
      if (distances[startNode][target] !== Infinity && startNode !== target) {
        const path: string[] = [];
        let current: string | null = startNode;
        
        while (current !== null && current !== target) {
          path.push(current);
          current = next[current][target];
        }
        
        if (current === target) {
          path.push(target);
          paths[target] = path;
        }
      }
    });

    return { 
      steps, 
      distances: flatDistances, 
      previousNodes, 
      paths 
    };
  }
}
