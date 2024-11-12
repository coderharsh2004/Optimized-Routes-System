import React from 'react';
import '../styles/GraphDisplay.css';

const GraphDisplay = ({ graph, cityNames }) => {
  const radius = 200; // Radius for circular layout
  const center = 250; // Center of the SVG

  // Position nodes in a circular layout
  const nodes = cityNames.map((city, index) => ({
    x: center + radius * Math.cos((2 * Math.PI * index) / cityNames.length),
    y: center + radius * Math.sin((2 * Math.PI * index) / cityNames.length),
    label: city,
  }));

  // Get edges from the graph matrix
  const edges = [];
  for (let i = 0; i < graph.length; i++) {
    for (let j = 0; j < graph[i].length; j++) {
      if (graph[i][j] > 0 && graph[i][j] !== -1) {
        edges.push({ from: i, to: j, weight: graph[i][j] });
      }
    }
  }

  return (
    <svg width="500" height="500" className="graph-display">
      {/* Render edges */}
      {edges.map((edge, index) => {
        const fromNode = nodes[edge.from];
        const toNode = nodes[edge.to];
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;

        return (
          <g key={index}>
            <line
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="black"
              strokeWidth="2"
            />
            <text
              x={midX}
              y={midY}
              fontSize="12"
              fill="red"
              textAnchor="middle"
              dy="-5"
            >
              {edge.weight}
            </text>
          </g>
        );
      })}

      {/* Render nodes */}
      {nodes.map((node, index) => (
        <g key={index}>
          <circle cx={node.x} cy={node.y} r="10" fill="blue" />
          <text x={node.x + 12} y={node.y + 4} fontSize="12" fill="black">
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default GraphDisplay;

