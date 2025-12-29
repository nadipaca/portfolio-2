import React from 'react';

/**
 * ArchitectureDiagram Component
 * Simple, clean architecture diagrams with rectangular nodes and arrows
 */
export default function ArchitectureDiagram({ nodes, connections, title = "System Architecture" }) {
  if (!nodes || !connections) return null;

  // Calculate canvas size based on node positions
  const maxX = Math.max(...nodes.map(n => n.x)) + 200;
  const maxY = Math.max(...nodes.map(n => n.y)) + 120;
  const width = Math.max(800, maxX);
  const height = Math.max(400, maxY);
  
  const nodeWidth = 160;
  const nodeHeight = 90;

  return (
    <div className="w-full bg-slate-800/70 rounded-lg border border-white/10 p-6">
      <h4 className="text-lg font-semibold text-white mb-6">{title}</h4>
      <div className="overflow-x-auto bg-slate-900/50 rounded-lg p-4">
        <svg
          width={width}
          height={height}
          className="w-full h-auto"
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Arrow marker */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
            </marker>
            {/* Bidirectional arrow marker (reversed) */}
            <marker
              id="arrowhead-start"
              markerWidth="10"
              markerHeight="10"
              refX="1"
              refY="3"
              orient="auto"
            >
              <polygon points="10 0, 0 3, 10 6" fill="#64748b" />
            </marker>
          </defs>
          
          {/* Background */}
          <rect width={width} height={height} fill="#0f172a" rx="8" />

          {/* Draw connections (arrows) - Draw before nodes so they appear behind */}
          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            // Calculate connection points (center of nodes)
            const fromX = fromNode.x + nodeWidth / 2;
            const fromY = fromNode.y + nodeHeight / 2;
            const toX = toNode.x + nodeWidth / 2;
            const toY = toNode.y + nodeHeight / 2;

            const isBidirectional = conn.bidirectional || false;
            const labelX = (fromX + toX) / 2;
            const labelY = (fromY + toY) / 2 - 8;

            return (
              <g key={`conn-${idx}`}>
                <line
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="#64748b"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                  markerStart={isBidirectional ? "url(#arrowhead-start)" : undefined}
                  opacity="0.8"
                />
                {/* Label on arrow */}
                {conn.label && (
                  <g>
                    <rect
                      x={labelX - (conn.label.length * 3.5)}
                      y={labelY - 8}
                      width={conn.label.length * 7}
                      height={14}
                      fill="#0f172a"
                      opacity="0.9"
                      rx="3"
                    />
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="10"
                      fontWeight="500"
                      fontFamily="system-ui, -apple-system, sans-serif"
                    >
                      {conn.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Draw nodes */}
          {nodes.map((node, idx) => {
            const nodeFill = node.color || "#1e293b";
            const nodeBorder = node.borderColor || "#475569";
            const textColor = "#ffffff";
            const descColor = "#cbd5e1";

            return (
              <g key={`node-${idx}`}>
                {/* Simple rectangle node */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx="8"
                  fill={nodeFill}
                  stroke={nodeBorder}
                  strokeWidth="2"
                />
                
                {/* Node label */}
                <text
                  x={node.x + nodeWidth / 2}
                  y={node.y + nodeHeight / 2 - 8}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="14"
                  fontWeight="600"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {node.label}
                </text>
                
                {/* Node description */}
                {node.description && (
                  <text
                    x={node.x + nodeWidth / 2}
                    y={node.y + nodeHeight / 2 + 14}
                    textAnchor="middle"
                    fill={descColor}
                    fontSize="11"
                    fontWeight="400"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {node.description}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
