import React from 'react';

/**
 * ArchitectureDiagram Component
 * Renders clean, professional architecture diagrams for projects
 */
export default function ArchitectureDiagram({ nodes, connections, title = "System Architecture" }) {
  if (!nodes || !connections) return null;

  const width = 800;
  const height = 400;
  const nodeWidth = 140;
  const nodeHeight = 80;

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
          {/* Background */}
          <defs>
            {/* Grid pattern */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#475569" strokeWidth="0.5" />
            </pattern>
            {/* Arrow marker */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#fb923c" />
            </marker>
            {/* Drop shadow filter */}
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
              <feOffset dx="2" dy="2" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background rectangle with grid */}
          <rect width={width} height={height} fill="#0f172a" rx="8" />
          <rect width={width} height={height} fill="url(#grid)" opacity="0.15" rx="8" />

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

            return (
              <line
                key={`conn-${idx}`}
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke="#fb923c"
                strokeWidth="2.5"
                markerEnd="url(#arrowhead)"
                opacity="0.8"
                filter="url(#shadow)"
              />
            );
          })}

          {/* Draw nodes */}
          {nodes.map((node, idx) => {
            // Use node color if provided, otherwise use a dark background with good contrast
            const nodeFill = node.color || "#1e293b"; // slate-800
            const nodeBorder = node.borderColor || "#475569"; // slate-600
            const textColor = "#ffffff"; // White text for visibility
            const descColor = "#cbd5e1"; // Light gray for description

            return (
              <g key={`node-${idx}`} filter="url(#shadow)">
                {/* Node rectangle with better contrast */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx="10"
                  fill={nodeFill}
                  stroke={nodeBorder}
                  strokeWidth="2.5"
                  className="drop-shadow-lg"
                />
                
                {/* Node label - White text with text shadow for better visibility */}
                <text
                  x={node.x + nodeWidth / 2}
                  y={node.y + nodeHeight / 2 - 10}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  <tspan
                    fill="none"
                    stroke="#000000"
                    strokeWidth="0.5"
                    strokeOpacity="0.5"
                  >
                    {node.label}
                  </tspan>
                  <tspan>{node.label}</tspan>
                </text>
                
                {/* Node tech/description */}
                {node.description && (
                  <text
                    x={node.x + nodeWidth / 2}
                    y={node.y + nodeHeight / 2 + 12}
                    textAnchor="middle"
                    fill={descColor}
                    fontSize="11"
                    fontWeight="500"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    <tspan
                      fill="none"
                      stroke="#000000"
                      strokeWidth="0.5"
                      strokeOpacity="0.5"
                    >
                      {node.description}
                    </tspan>
                    <tspan>{node.description}</tspan>
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
