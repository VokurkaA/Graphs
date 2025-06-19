import React, { useState } from 'react';
import type { Edge } from '../types/graph';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface EdgeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (edge: Omit<Edge, 'id'>) => void;
  nodes: Array<{ id: string; label: string }>;
  existingEdge?: Edge;
}

export const EdgeEditor: React.FC<EdgeEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  nodes,
  existingEdge
}) => {
  const [source, setSource] = useState(existingEdge?.source || '');
  const [target, setTarget] = useState(existingEdge?.target || '');
  const [weight, setWeight] = useState(existingEdge?.weight?.toString() || '1');

  const handleSave = () => {
    if (source && target && weight) {
      onSave({
        source,
        target,
        weight: parseFloat(weight)
      });
      onClose();
      setSource('');
      setTarget('');
      setWeight('1');
    }
  };

  const handleClose = () => {
    onClose();
    setSource(existingEdge?.source || '');
    setTarget(existingEdge?.target || '');
    setWeight(existingEdge?.weight?.toString() || '1');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {existingEdge ? 'Edit Edge' : 'Add Edge'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="source">Source Node</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select source node" />
              </SelectTrigger>
              <SelectContent>
                {nodes.map(node => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="target">Target Node</Label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger>
                <SelectValue placeholder="Select target node" />
              </SelectTrigger>
              <SelectContent>
                {nodes.filter(node => node.id !== source).map(node => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter edge weight"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!source || !target || !weight}>
              {existingEdge ? 'Update' : 'Add'} Edge
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
