import { useState, useEffect, useCallback } from 'react';
import type { Graph, Node, Edge, Algorithm, AlgorithmResult } from './types/graph';
import { GraphCanvas } from './components/GraphCanvas';
import { ControlPanel } from './components/ControlPanel';
import { EdgeEditor } from './components/EdgeEditor';
import { AlgorithmVisualization } from './components/AlgorithmVisualization';
import { DijkstraAlgorithm, BellmanFordAlgorithm, FloydWarshallAlgorithm } from './algorithms/pathfinding';
import { generateNodeId, generateEdgeId, getPresetGraph } from './utils/graphUtils';
import { Button } from './components/ui/button';
import { Plus } from 'lucide-react';

function App() {
  const [baseGraph, setBaseGraph] = useState<Graph>(getPresetGraph(0));
  const [visualGraph, setVisualGraph] = useState<Graph>(getPresetGraph(0));
  const [algorithm, setAlgorithm] = useState<Algorithm>('dijkstra');
  const [selectedNode, setSelectedNode] = useState<string>('A');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [algorithmResult, setAlgorithmResult] = useState<AlgorithmResult | null>(null);
  const [isEdgeEditorOpen, setIsEdgeEditorOpen] = useState(false);
  const [highlightedEdges, setHighlightedEdges] = useState<string[]>([]);
  const [presetIndex, setPresetIndex] = useState(0);
  const [speed, setSpeed] = useState(1000);

  useEffect(() => {
    let result: AlgorithmResult;
    
    switch (algorithm) {
      case 'dijkstra':
        result = DijkstraAlgorithm.run(baseGraph, selectedNode);
        break;
      case 'bellman-ford':
        result = BellmanFordAlgorithm.run(baseGraph, selectedNode);
        break;
      case 'floyd-warshall':
        result = FloydWarshallAlgorithm.run(baseGraph);
        break;
      default:
        result = DijkstraAlgorithm.run(baseGraph, selectedNode);
    }
    
    setAlgorithmResult(result);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [baseGraph, algorithm, selectedNode]);

  // Update visual graph based on current step
  useEffect(() => {
    if (!algorithmResult) return;

    const updatedGraph = { ...baseGraph };
    
    // Reset all nodes and edges
    updatedGraph.nodes = updatedGraph.nodes.map(node => ({
      ...node,
      visited: false,
      distance: algorithmResult.distances[node.id]
    }));
    
    updatedGraph.edges = updatedGraph.edges.map(edge => ({
      ...edge,
      highlighted: false
    }));

    // Apply changes from steps up to current step
    const newHighlightedEdges: string[] = [];
    
    for (let i = 0; i <= currentStep && i < algorithmResult.steps.length; i++) {
      const step = algorithmResult.steps[i];
      
      if (step.nodeId) {
        const nodeIndex = updatedGraph.nodes.findIndex(n => n.id === step.nodeId);
        if (nodeIndex !== -1) {
          if (step.type === 'node-visit') {
            updatedGraph.nodes[nodeIndex].visited = true;
          }
          if (step.type === 'distance-update' && typeof step.distance === 'number') {
            updatedGraph.nodes[nodeIndex].distance = step.distance;
          }
        }
      }
      
      if (step.edgeId && step.type === 'edge-relax') {
        newHighlightedEdges.push(step.edgeId);
      }
    }
    
    setVisualGraph(updatedGraph);
    setHighlightedEdges(newHighlightedEdges);
  }, [currentStep, algorithmResult, baseGraph]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !algorithmResult) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= algorithmResult.steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, algorithmResult, speed]);

  // When presetIndex changes, update the baseGraph and selectedNode
  useEffect(() => {
    const preset = getPresetGraph(presetIndex);
    setBaseGraph(preset);
    setSelectedNode(preset.nodes[0]?.id || 'A');
  }, [presetIndex]);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId);
  }, []);

  const handleNodeDrag = useCallback((nodeId: string, x: number, y: number) => {
    setBaseGraph(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, x, y } : node
      )
    }));
  }, []);

  const handleAddNode = useCallback(() => {
    const newNodeId = generateNodeId(baseGraph.nodes);
    const newNode: Node = {
      id: newNodeId,
      x: 200 + Math.random() * 400,
      y: 150 + Math.random() * 300,
      label: newNodeId
    };
    
    setBaseGraph(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  }, [baseGraph.nodes]);

  const handleDeleteSelected = useCallback(() => {
    if (!selectedNode) return;
    
    setBaseGraph(prev => ({
      nodes: prev.nodes.filter(node => node.id !== selectedNode),
      edges: prev.edges.filter(edge => 
        edge.source !== selectedNode && edge.target !== selectedNode
      )
    }));
    
    const remainingNodes = baseGraph.nodes.filter(node => node.id !== selectedNode);
    if (remainingNodes.length > 0) {
      setSelectedNode(remainingNodes[0].id);
    }
  }, [selectedNode, baseGraph.nodes]);

  const handleAddEdge = useCallback((edge: Omit<Edge, 'id'>) => {
    const newEdge: Edge = {
      ...edge,
      id: generateEdgeId(edge.source, edge.target)
    };
    
    setBaseGraph(prev => ({
      ...prev,
      edges: [...prev.edges, newEdge]
    }));
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Graph Traversal Visualization
          </h1>
          <p className="text-gray-600">
            Visualize Dijkstra's, Bellman-Ford, and Floyd-Warshall algorithms
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <ControlPanel
              algorithm={algorithm}
              onAlgorithmChange={setAlgorithm}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
              onAddNode={handleAddNode}
              onDeleteSelected={handleDeleteSelected}
              selectedNode={selectedNode}
              step={currentStep}
              totalSteps={algorithmResult?.steps.length || 0}
              onStepChange={setCurrentStep}
              presetIndex={presetIndex}
              onPresetChange={setPresetIndex}
              speed={speed}
              onSpeedChange={setSpeed}
            />
            
            <div className="mt-4">
              <Button 
                onClick={() => setIsEdgeEditorOpen(true)}
                variant="outline"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Edge
              </Button>
            </div>
          </div>

          {/* Graph Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4">
              <GraphCanvas
                graph={visualGraph}
                onNodeClick={handleNodeClick}
                onNodeDrag={handleNodeDrag}
                selectedNode={selectedNode}
                highlightedEdges={highlightedEdges}
                algorithm={algorithm}
              />
            </div>
          </div>

          {/* Algorithm Visualization */}
          <div className="lg:col-span-1">
            {algorithmResult && (
              <AlgorithmVisualization
                steps={algorithmResult.steps}
                currentStep={currentStep}
                distances={algorithmResult.distances}
                paths={algorithmResult.paths}
              />
            )}
          </div>
        </div>

        {/* Edge Editor Dialog */}
        <EdgeEditor
          isOpen={isEdgeEditorOpen}
          onClose={() => setIsEdgeEditorOpen(false)}
          onSave={handleAddEdge}
          nodes={baseGraph.nodes.map(n => ({ id: n.id, label: n.label }))}
        />
      </div>
    </div>
  );
}

export default App;
