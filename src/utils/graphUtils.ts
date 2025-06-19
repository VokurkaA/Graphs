import type { Graph, Node } from '../types/graph';

export const presetGraphs: { name: string; graph: Graph }[] = [
  {
    name: 'Simple Sample',
    graph: {
      nodes: [
        { id: 'A', x: 150, y: 100, label: 'A' },
        { id: 'B', x: 350, y: 100, label: 'B' },
        { id: 'C', x: 550, y: 100, label: 'C' },
        { id: 'D', x: 250, y: 250, label: 'D' },
        { id: 'E', x: 450, y: 250, label: 'E' },
      ],
      edges: [
        { id: 'AB', source: 'A', target: 'B', weight: 4 },
        { id: 'AC', source: 'A', target: 'C', weight: 2 },
        { id: 'BC', source: 'B', target: 'C', weight: 1 },
        { id: 'BD', source: 'B', target: 'D', weight: 5 },
        { id: 'CD', source: 'C', target: 'D', weight: 8 },
        { id: 'CE', source: 'C', target: 'E', weight: 10 },
        { id: 'DE', source: 'D', target: 'E', weight: 2 },
      ],
    },
  },
  {
    name: 'Directed Weighted (Image Preset)',
    graph: {
      nodes: [
        { id: 'A', x: 100, y: 120, label: 'A' },
        { id: 'B', x: 250, y: 60, label: 'B' },
        { id: 'C', x: 400, y: 120, label: 'C' },
        { id: 'D', x: 250, y: 200, label: 'D' },
        { id: 'E', x: 400, y: 240, label: 'E' },
      ],
      edges: [
        { id: 'AB', source: 'A', target: 'B', weight: 2 },
        { id: 'AC', source: 'A', target: 'C', weight: 10 },
        { id: 'AD', source: 'A', target: 'D', weight: 3 },
        { id: 'BD', source: 'B', target: 'D', weight: 8 },
        { id: 'BC', source: 'B', target: 'C', weight: 2 },
        { id: 'CD', source: 'C', target: 'E', weight: 4 },
        { id: 'DE', source: 'D', target: 'C', weight: 4 },
        { id: 'DE2', source: 'D', target: 'E', weight: 3 },
        { id: 'EC', source: 'E', target: 'C', weight: 1 },
      ],
    },
  },
  // Add more presets as needed
];

export const getPresetGraph = (index: number): Graph => {
  return presetGraphs[index]?.graph || presetGraphs[0].graph;
};

export const generateNodeId = (existingNodes: Node[]): string => {
  const existingIds = new Set(existingNodes.map(n => n.id));
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (const letter of letters) {
    if (!existingIds.has(letter)) {
      return letter;
    }
  }
  
  // If all single letters are used, start with double letters
  for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < letters.length; j++) {
      const id = letters[i] + letters[j];
      if (!existingIds.has(id)) {
        return id;
      }
    }
  }
  
  return `Node${existingNodes.length + 1}`;
};

export const generateEdgeId = (source: string, target: string): string => {
  return `${source}${target}`;
};
