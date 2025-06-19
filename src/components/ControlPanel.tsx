import React from 'react';
import type { Algorithm } from '../types/graph';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { presetGraphs } from '../utils/graphUtils';

interface ControlPanelProps {
  algorithm: Algorithm;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onAddNode: () => void;
  onDeleteSelected: () => void;
  selectedNode?: string;
  step: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  presetIndex?: number;
  onPresetChange?: (index: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  algorithm,
  onAlgorithmChange,
  isPlaying,
  onPlayPause,
  onReset,
  onAddNode,
  onDeleteSelected,
  selectedNode,
  step,
  totalSteps,
  onStepChange,
  presetIndex,
  onPresetChange,
  speed,
  onSpeedChange
}) => {
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Algorithm
        </label>
        <Select value={algorithm} onValueChange={onAlgorithmChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
            <SelectItem value="bellman-ford">Bellman-Ford Algorithm</SelectItem>
            <SelectItem value="floyd-warshall">Floyd-Warshall Algorithm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Visualization Controls
        </label>
        <div className="flex space-x-2">
          <Button
            onClick={onPlayPause}
            variant={isPlaying ? "destructive" : "default"}
            size="sm"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button onClick={onReset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Step: {step} / {totalSteps - 1}
        </label>
        <input
          type="range"
          min="0"
          max={totalSteps - 1}
          value={step}
          onChange={(e) => onStepChange(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Speed: {speed} ms
        </label>
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={speed}
          onChange={e => onSpeedChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Graph Editing
        </label>
        <div className="flex space-x-2">
          <Button onClick={onAddNode} variant="outline" size="sm">
            <Plus className="w-4 h-4" />
            Add Node
          </Button>
          <Button 
            onClick={onDeleteSelected} 
            variant="outline" 
            size="sm"
            disabled={!selectedNode}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Preset Graphs Dropdown */}
      {onPresetChange && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preset Graph
          </label>
          <Select value={String(presetIndex ?? 0)} onValueChange={v => onPresetChange(Number(v))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {presetGraphs.map((preset, idx) => (
                <SelectItem key={idx} value={String(idx)}>{preset.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p><strong>Instructions:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Click nodes to select them</li>
          <li>Drag nodes to reposition</li>
          <li>Use controls to add/remove nodes</li>
          <li>Select algorithm and play visualization</li>
        </ul>
      </div>
    </div>
  );
};
