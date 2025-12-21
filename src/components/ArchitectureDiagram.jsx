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
  const spacing = 160;

  return (
    <div className="w-full bg-white rounded-lg border border-slate-200 p-2">
      <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
      <div className="overflow-x-auto">
        <svg
          width={width}
          height={height}
          className="w-full h-auto"
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Grid background (optional, subtle) */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
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
          </defs>
          <rect width={width} height={height} fill="url(#grid)" opacity="0.3" />

          {/* Draw connections (arrows) */}
          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            const fromX = fromNode.x + nodeWidth / 2;
            const fromY = fromNode.y + nodeHeight / 2;
            const toX = toNode.x + nodeWidth / 2;
            const toY = toNode.y + nodeHeight / 2;

            return (
              <line
                key={idx}
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke="#64748b"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                opacity="0.6"
              />
            );
          })}

          {/* Draw nodes */}
          {nodes.map((node, idx) => (
            <g key={idx}>
              {/* Node rectangle */}
              <rect
                x={node.x}
                y={node.y}
                width={nodeWidth}
                height={nodeHeight}
                rx="8"
                fill={node.color || "#ffffff"}
                stroke={node.borderColor || "#334155"}
                strokeWidth="2"
                className="drop-shadow-sm"
              />
              {/* Node label */}
              <text
                x={node.x + nodeWidth / 2}
                y={node.y + nodeHeight / 2 - 8}
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="600"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {node.label}
              </text>
              {/* Node tech/description */}
              {node.description && (
                <text
                  x={node.x + nodeWidth / 2}
                  y={node.y + nodeHeight / 2 + 10}
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="11"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {node.description}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

