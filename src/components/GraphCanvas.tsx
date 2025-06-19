import React, { useRef, useEffect, useState } from 'react';
import type { Graph, Node, Algorithm } from '../types/graph';

interface GraphCanvasProps {
  graph: Graph;
  onNodeClick?: (nodeId: string) => void;
  onNodeDrag?: (nodeId: string, x: number, y: number) => void;
  selectedNode?: string;
  highlightedEdges?: string[];
  algorithm?: Algorithm;
  className?: string;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  graph,
  onNodeClick,
  onNodeDrag,
  selectedNode,
  highlightedEdges = [],
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);

  const NODE_RADIUS = 25;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw edges
    graph.edges.forEach(edge => {
      const sourceNode = graph.nodes.find(n => n.id === edge.source);
      const targetNode = graph.nodes.find(n => n.id === edge.target);
      
      if (!sourceNode || !targetNode) return;

      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      
      if (highlightedEdges.includes(edge.id)) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 2;
      }
      
      ctx.stroke();

      // Draw arrow
      const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
      const arrowLength = 15;
      const arrowAngle = Math.PI / 6;

      // Calculate arrow position (at edge of target node)
      const arrowX = targetNode.x - NODE_RADIUS * Math.cos(angle);
      const arrowY = targetNode.y - NODE_RADIUS * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle - arrowAngle),
        arrowY - arrowLength * Math.sin(angle - arrowAngle)
      );
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle + arrowAngle),
        arrowY - arrowLength * Math.sin(angle + arrowAngle)
      );
      ctx.stroke();

      // Draw weight
      const midX = (sourceNode.x + targetNode.x) / 2;
      const midY = (sourceNode.y + targetNode.y) / 2;
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(midX - 15, midY - 10, 30, 20);
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      ctx.strokeRect(midX - 15, midY - 10, 30, 20);
      
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(edge.weight.toString(), midX, midY + 4);
    });

    // Draw nodes
    graph.nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);
      
      if (selectedNode === node.id) {
        ctx.fillStyle = '#3b82f6';
      } else if (node.visited) {
        ctx.fillStyle = '#10b981';
      } else {
        ctx.fillStyle = '#e5e7eb';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 4);

      // Draw distance if available
      if (typeof node.distance === 'number' && node.distance !== Infinity) {
        ctx.fillStyle = '#dc2626';
        ctx.font = '10px sans-serif';
        ctx.fillText(
          node.distance.toString(),
          node.x,
          node.y - NODE_RADIUS - 5
        );
      }
    });
  }, [graph, selectedNode, highlightedEdges]);

  const getNodeAtPosition = (x: number, y: number): Node | null => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;

    const canvasX = x - rect.left;
    const canvasY = y - rect.top;

    return graph.nodes.find(node => {
      const distance = Math.sqrt(
        Math.pow(canvasX - node.x, 2) + Math.pow(canvasY - node.y, 2)
      );
      return distance <= NODE_RADIUS;
    }) || null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const node = getNodeAtPosition(e.clientX, e.clientY);
    if (node) {
      setIsDragging(true);
      setDragNodeId(node.id);
      onNodeClick?.(node.id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && dragNodeId && onNodeDrag) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        onNodeDrag(dragNodeId, x, y);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragNodeId(null);
  };

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className={`border border-gray-300 rounded-lg cursor-pointer ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};
