import React from 'react';
import type { AlgorithmStep } from '../types/graph';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface AlgorithmVisualizationProps {
  steps: AlgorithmStep[];
  currentStep: number;
  distances: Record<string, number>;
  paths: Record<string, string[]>;
}

export const AlgorithmVisualization: React.FC<AlgorithmVisualizationProps> = ({
  steps,
  currentStep,
  distances,
  paths
}) => {
  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Algorithm Step</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </p>
            {currentStepData && (
              <p className="font-medium">{currentStepData.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Distances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(distances).map(([nodeId, distance]) => (
              <div key={nodeId} className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">Node {nodeId}:</span>
                <span className={distance === Infinity ? 'text-gray-400' : 'text-blue-600'}>
                  {distance === Infinity ? '∞' : distance}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shortest Paths</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(paths).map(([nodeId, path]) => (
              <div key={nodeId} className="p-2 bg-gray-50 rounded">
                <span className="font-medium">To {nodeId}: </span>
                <span className="text-blue-600">
                  {path.join(' → ')}
                </span>
                <span className="text-gray-500 ml-2">
                  (distance: {distances[nodeId]})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
