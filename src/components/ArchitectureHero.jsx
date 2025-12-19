import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Globe,
  Monitor,
  Smartphone,
  Cloud,
  Network,
  Server,
  Mail,
  Database,
  Layers,
  Cpu,
  Braces,
  FileText,
  BarChart3,
  Activity,
  Settings,
} from 'lucide-react';

const W = 700;
const H = 620; // Increased height for better spacing

// Animation configuration - slower for cooler effect
const ANIMATION_DURATION = 2500; // 2.5 seconds per step (slower)

// Updated animation steps with correct flow (grouped by parallel execution)
// Each step includes dataType label showing what data flows through the connection
const ANIMATION_STEPS = [
  // Phase 1: DNS resolution (must happen first)
  { id: 'user-dns', from: 'user', to: 'dns', color: '#64748b', delay: 0, phase: 1, dataType: 'DNS Query → IP Address' },
  
  // Phase 2: Parallel requests - CDN, Web Browser, and Mobile App all call simultaneously
  { id: 'user-cdn', from: 'user', to: 'cdn', color: '#64748b', delay: 0, phase: 2, dataType: 'Static Files (HTML/CSS/JS)' },
  { id: 'webbrowser-lb', from: 'webbrowser', to: 'loadBalancer', color: '#22d3ee', delay: 0, phase: 2, dataType: 'HTTP Request' },
  { id: 'mobileapp-lb', from: 'mobileapp', to: 'loadBalancer', color: '#22d3ee', delay: 0, phase: 2, dataType: 'HTTP Request' },
  
  // Phase 3: Load Balancer routes to Web Servers
  { id: 'lb-webservers', from: 'loadBalancer', to: 'webServers', color: '#22d3ee', delay: 0, phase: 3, dataType: 'HTTP Request' },
  
  // Phase 4: Web Servers call backend services simultaneously (parallel)
  { id: 'webservers-messagequeue', from: 'webServers', to: 'messageQueue', color: '#22c55e', delay: 0, phase: 4, dataType: 'Messages/Jobs' },
  { id: 'webservers-databases', from: 'webServers', to: 'databases', color: '#22c55e', delay: 0, phase: 4, dataType: 'SQL Queries' },
  { id: 'webservers-caches', from: 'webServers', to: 'caches', color: '#22c55e', delay: 0, phase: 4, dataType: 'Cache Lookup' },
  { id: 'webservers-nosql', from: 'webServers', to: 'nosql', color: '#a855f7', delay: 0, phase: 4, dataType: 'Documents/Sessions' },
  
  // Phase 5: Async processing flow
  { id: 'messagequeue-workers', from: 'messageQueue', to: 'workers', color: '#22d3ee', delay: 0, phase: 5, dataType: 'Job Messages' },
  { id: 'workers-nosql', from: 'workers', to: 'nosql', color: '#a855f7', delay: 0, phase: 5, dataType: 'Processed Data/Logs' },
  
  // Phase 6: Monitoring (can happen continuously, shown last)
  { id: 'dc1-tools', from: 'dc1', to: 'tools', color: '#64748b', dashed: true, delay: 0, phase: 6, dataType: 'Metrics/Logs' },
];

// Styled icon wrapper with background
const IconBox = ({ children, color = "cyan", size = "md", className = "", isActive = false }) => {
  const colors = {
    cyan: isActive 
      ? "bg-cyan-500/40 border-cyan-300/80 text-cyan-300 shadow-lg shadow-cyan-500/50" 
      : "bg-cyan-500/20 border-cyan-400/50 text-cyan-400",
    green: isActive 
      ? "bg-emerald-500/40 border-emerald-300/80 text-emerald-300 shadow-lg shadow-emerald-500/50" 
      : "bg-emerald-500/20 border-emerald-400/50 text-emerald-400",
    blue: isActive 
      ? "bg-blue-500/40 border-blue-300/80 text-blue-300 shadow-lg shadow-blue-500/50" 
      : "bg-blue-500/20 border-blue-400/50 text-blue-400",
    purple: isActive 
      ? "bg-purple-500/40 border-purple-300/80 text-purple-300 shadow-lg shadow-purple-500/50" 
      : "bg-purple-500/20 border-purple-400/50 text-purple-400",
    amber: isActive 
      ? "bg-amber-500/40 border-amber-300/80 text-amber-300 shadow-lg shadow-amber-500/50" 
      : "bg-amber-500/20 border-amber-400/50 text-amber-400",
    slate: isActive 
      ? "bg-slate-500/40 border-slate-300/80 text-slate-300 shadow-lg shadow-slate-500/50" 
      : "bg-slate-500/20 border-slate-400/50 text-slate-400",
  };
  
  const sizes = {
    sm: "w-8 h-8 p-1.5",
    md: "w-10 h-10 p-2",
    lg: "w-12 h-12 p-2.5",
    xl: "w-14 h-14 p-3",
  };

  return (
    <div className={`rounded-lg border transition-all duration-500 ${colors[color]} ${sizes[size]} flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
};

// Tool box component
const ToolBox = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/60 border border-slate-500/50 rounded-lg">
    <Icon size={14} className="text-slate-400" />
    <span className="text-xs text-slate-300 font-medium">{label}</span>
  </div>
);

// Helper function to get connection point from element bounds
const getConnectionPoint = (bounds, side = 'center') => {
  const { left, top, width, height } = bounds;
  
  switch (side) {
    case 'left':
      return { x: left, y: top + height / 2 };
    case 'right':
      return { x: left + width, y: top + height / 2 };
    case 'top':
      return { x: left + width / 2, y: top };
    case 'bottom':
      return { x: left + width / 2, y: top + height };
    case 'center':
    default:
      return { x: left + width / 2, y: top + height / 2 };
  }
};

// Animated Arrow component with dotted lines and data type labels
const AnimatedArrow = ({ 
  x1, 
  y1, 
  x2, 
  y2, 
  color = "#64748b", 
  dashed = false, 
  curved = false,
  isActive = false,
  dataType = null,
}) => {
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(1000);
  const id = `arrow-${Math.round(x1)}-${Math.round(y1)}-${Math.round(x2)}-${Math.round(y2)}`.replace(/\./g, '-');
  
  let path;
  if (curved) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const cx = midX - dy * 0.3;
    const cy = midY + dx * 0.3;
    path = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  } else {
    path = `M ${x1} ${y1} L ${x2} ${y2}`;
  }
  
  // Calculate label position (midpoint of the line)
  const labelX = (x1 + x2) / 2;
  const labelY = (y1 + y2) / 2;
  // Offset label perpendicular to the line to avoid overlap
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);
  const offset = 15;
  const labelOffsetX = Math.sin(angle) * offset;
  const labelOffsetY = -Math.cos(angle) * offset;

  // Calculate path length on mount
  useEffect(() => {
    if (pathRef.current) {
      try {
        const length = pathRef.current.getTotalLength();
        if (length > 0) {
          setPathLength(length);
        }
      } catch (e) {
        // Fallback to estimated length
        const dx = x2 - x1;
        const dy = y2 - y1;
        setPathLength(Math.sqrt(dx * dx + dy * dy));
      }
    }
  }, [x1, y1, x2, y2]);

  // Active color (light blue) or inactive (grey)
  const strokeColor = isActive ? color : '#64748b';
  const strokeOpacity = isActive ? 1 : 0.4;
  const dashPattern = dashed ? "6 4" : "8 4";

  return (
    <g>
      <defs>
        <marker
          id={`marker-${id}`}
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill={strokeColor} opacity={strokeOpacity} />
        </marker>
      </defs>
      
      {/* Base dotted line (always visible, grey) */}
      <path
        d={path}
        fill="none"
        stroke="#64748b"
        strokeWidth="2"
        strokeDasharray={dashPattern}
        strokeOpacity="0.4"
        markerEnd={`url(#marker-${id})`}
      />
      
      {/* Animated active line (light blue when active) */}
      {isActive && (
        <path
          ref={pathRef}
          d={path}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeDasharray={dashPattern}
          strokeOpacity={strokeOpacity}
          markerEnd={`url(#marker-${id})`}
          style={{
            strokeDashoffset: pathLength,
            animation: `flowAnimation ${ANIMATION_DURATION}ms linear forwards`,
          }}
        />
      )}
      
      {/* Data type label (only shown when active) */}
      {isActive && dataType && (
        <g>
          {/* Background rectangle for label - estimate width based on character count */}
          <rect
            x={labelX + labelOffsetX - (dataType.length * 3.5)}
            y={labelY + labelOffsetY - 8}
            width={Math.max(dataType.length * 7, 60)}
            height={16}
            fill="rgba(15, 23, 42, 0.92)"
            stroke={strokeColor}
            strokeWidth="1.5"
            rx="4"
            opacity={0.95}
          />
          {/* Label text */}
          <text
            x={labelX + labelOffsetX}
            y={labelY + labelOffsetY + 4.5}
            fill={strokeColor}
            fontSize="9.5"
            fontWeight="600"
            textAnchor="middle"
            opacity={1}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {dataType}
          </text>
        </g>
      )}
    </g>
  );
};

// Scale-to-fit wrapper
function ScaleToFit({ baseWidth, baseHeight, children }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const ro = new ResizeObserver(() => {
      const parentWidth = el.parentElement?.clientWidth || baseWidth;
      const nextScale = Math.min(1, parentWidth / baseWidth);
      setScale(nextScale);
    });

    ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, [baseWidth]);

  return (
    <div ref={ref} className="relative w-full overflow-visible">
      <div
        style={{
          width: baseWidth,
          height: baseHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <div style={{ width: baseWidth, height: baseHeight }}>{children}</div>
      </div>
      <div style={{ height: baseHeight * scale }} />
    </div>
  );
}

export default function ArchitectureHero() {
  // Refs for all components
  const containerRef = useRef(null);
  const dnsRef = useRef(null);
  const userRef = useRef(null);
  const webbrowserRef = useRef(null);
  const mobileappRef = useRef(null);
  const cdnRef = useRef(null);
  const loadBalancerRef = useRef(null);
  const dc1Ref = useRef(null);
  const webServersRef = useRef(null);
  const messageQueueRef = useRef(null);
  const databasesRef = useRef(null);
  const cachesRef = useRef(null);
  const workersRef = useRef(null);
  const nosqlRef = useRef(null);
  const toolsRef = useRef(null);

  // State for arrow positions and animation
  const [arrows, setArrows] = useState([]);
  const [activeStep, setActiveStep] = useState(-1);
  const [activeComponents, setActiveComponents] = useState(new Set());

  // Calculate arrow positions dynamically
  const calculateArrows = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    const getBounds = (ref) => {
      if (!ref.current) return null;
      const rect = ref.current.getBoundingClientRect();
      return {
        left: rect.left - containerRect.left,
        top: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height,
      };
    };

    const newArrows = [];
    
    // Helper to create arrow with step config
    const createArrow = (stepId, from, to, fromComponent, toComponent, curved = false, customConfig = {}) => {
      const stepConfig = ANIMATION_STEPS.find(s => s.id === stepId) || {};
      return {
        id: stepId,
        from,
        to,
        color: stepConfig.color || customConfig.color || '#64748b',
        dashed: stepConfig.dashed || customConfig.dashed || false,
        curved,
        dataType: stepConfig.dataType || null,
        fromComponent,
        toComponent,
      };
    };

    // User to DNS (User queries DNS)
    const dnsBounds = getBounds(dnsRef);
    const userBounds = getBounds(userRef);
    if (dnsBounds && userBounds) {
      const from = getConnectionPoint(userBounds, 'left');
      const to = getConnectionPoint(dnsBounds, 'right');
      newArrows.push(createArrow('user-dns', from, to, 'user', 'dns'));
    }

    // User to CDN (User gets static assets)
    const cdnBounds = getBounds(cdnRef);
    if (userBounds && cdnBounds) {
      const from = getConnectionPoint(userBounds, 'right');
      const to = getConnectionPoint(cdnBounds, 'left');
      newArrows.push(createArrow('user-cdn', from, to, 'user', 'cdn'));
    }

    // Web Browser to Load Balancer
    const webbrowserBounds = getBounds(webbrowserRef);
    const lbBounds = getBounds(loadBalancerRef);
    if (webbrowserBounds && lbBounds) {
      const from = getConnectionPoint(webbrowserBounds, 'bottom');
      const to = getConnectionPoint(lbBounds, 'top');
      // Offset slightly left for clarity
      newArrows.push(createArrow('webbrowser-lb', 
        { x: from.x - 25, y: from.y }, 
        { x: to.x - 15, y: to.y }, 
        'webbrowser', 'loadBalancer'));
    }

    // Mobile App to Load Balancer
    const mobileappBounds = getBounds(mobileappRef);
    if (mobileappBounds && lbBounds) {
      const from = getConnectionPoint(mobileappBounds, 'bottom');
      const to = getConnectionPoint(lbBounds, 'top');
      // Offset slightly right for clarity
      newArrows.push(createArrow('mobileapp-lb', 
        { x: from.x + 25, y: from.y }, 
        { x: to.x + 15, y: to.y }, 
        'mobileapp', 'loadBalancer'));
    }

    // Load Balancer to Web Servers
    const webServersBounds = getBounds(webServersRef);
    if (lbBounds && webServersBounds) {
      const from = getConnectionPoint(lbBounds, 'bottom');
      const to = getConnectionPoint(webServersBounds, 'top');
      newArrows.push(createArrow('lb-webservers', from, to, 'loadBalancer', 'webServers'));
    }

    // Get DC1 bounds for Tools connection
    const dc1Bounds = getBounds(dc1Ref);

    // Web Servers to Message Queue
    const messageQueueBounds = getBounds(messageQueueRef);
    if (webServersBounds && messageQueueBounds) {
      const from = getConnectionPoint(webServersBounds, 'right');
      const to = getConnectionPoint(messageQueueBounds, 'left');
      newArrows.push(createArrow('webservers-messagequeue', from, to, 'webServers', 'messageQueue'));
    }

    // Message Queue to Workers
    const workersBounds = getBounds(workersRef);
    if (messageQueueBounds && workersBounds) {
      const from = getConnectionPoint(messageQueueBounds, 'bottom');
      const to = getConnectionPoint(workersBounds, 'top');
      newArrows.push(createArrow('messagequeue-workers', from, to, 'messageQueue', 'workers'));
    }

    // Get NoSQL bounds (used by both Web Servers and Workers)
    const nosqlBounds = getBounds(nosqlRef);

    // Workers to NoSQL - Use straight line by connecting to right side of workers
    if (workersBounds && nosqlBounds) {
      const from = getConnectionPoint(workersBounds, 'right');
      const to = getConnectionPoint(nosqlBounds, 'left');
      // Use straight line instead of curved for clarity
      newArrows.push(createArrow('workers-nosql', from, to, 'workers', 'nosql', false));
    }

    // Web Servers to Databases
    const databasesBounds = getBounds(databasesRef);
    if (webServersBounds && databasesBounds) {
      const from = getConnectionPoint(webServersBounds, 'bottom');
      const to = getConnectionPoint(databasesBounds, 'top');
      newArrows.push(createArrow('webservers-databases', from, to, 'webServers', 'databases'));
    }

    // Web Servers to Caches
    const cachesBounds = getBounds(cachesRef);
    if (webServersBounds && cachesBounds) {
      const from = getConnectionPoint(webServersBounds, 'bottom');
      const to = getConnectionPoint(cachesBounds, 'top');
      newArrows.push(createArrow('webservers-caches', from, to, 'webServers', 'caches'));
    }

    // Web Servers to NoSQL - Offset to avoid overlap with Workers->NoSQL
    if (webServersBounds && nosqlBounds) {
      // Connect from top-right of web servers to top-left of nosql to avoid curve overlap
      const from = { x: webServersBounds.left + webServersBounds.width, y: webServersBounds.top + 10 };
      const to = { x: nosqlBounds.left, y: nosqlBounds.top + 15 };
      newArrows.push(createArrow('webservers-nosql', from, to, 'webServers', 'nosql', false));
    }

    // DC1 to Tools (from DC1 boundary bottom to Tools)
    const toolsBounds = getBounds(toolsRef);
    if (dc1Bounds && toolsBounds) {
      const from = getConnectionPoint(dc1Bounds, 'bottom');
      const to = getConnectionPoint(toolsBounds, 'top');
      newArrows.push(createArrow('dc1-tools', from, to, 'dc1', 'tools'));
    }

    setArrows(newArrows);
  }, []);

  // Animation loop with phases (parallel execution within each phase)
  useEffect(() => {
    let currentPhase = 1;
    let animationTimer;
    
    // Group steps by phase
    const stepsByPhase = ANIMATION_STEPS.reduce((acc, step, index) => {
      const phase = step.phase || 1;
      if (!acc[phase]) acc[phase] = [];
      acc[phase].push({ ...step, index });
      return acc;
    }, {});

    const runAnimation = () => {
      const maxPhase = Math.max(...Object.keys(stepsByPhase).map(Number));
      
      if (currentPhase > maxPhase) {
        // Reset and loop
        currentPhase = 1;
        setActiveComponents(new Set());
        setActiveStep(-1);
      }

      // Get all steps in the current phase
      const phaseSteps = stepsByPhase[currentPhase] || [];
      
      // Activate all steps in this phase simultaneously
      // We'll use the first step's index as the activeStep indicator for phase-based rendering
      if (phaseSteps.length > 0) {
        setActiveStep(phaseSteps[0].index); // Use first step index to indicate phase
        
        // Collect all components that should be active in this phase
        const activeComponentsSet = new Set();
        phaseSteps.forEach(step => {
          activeComponentsSet.add(step.from);
          activeComponentsSet.add(step.to);
        });
        setActiveComponents(activeComponentsSet);
      }

      currentPhase++;
      animationTimer = setTimeout(runAnimation, ANIMATION_DURATION);
    };

    // Start animation after initial render
    const startTimer = setTimeout(() => {
      runAnimation();
    }, 500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(animationTimer);
    };
  }, []);

  // Recalculate arrows on mount and resize
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateArrows();
    }, 100);

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        calculateArrows();
      });
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        requestAnimationFrame(() => {
          calculateArrows();
        });
      }, 50);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateArrows]);

  const currentStep = activeStep >= 0 ? ANIMATION_STEPS[activeStep] : null;
  const currentPhase = currentStep?.phase || null;
  const isComponentActive = (componentName) => activeComponents.has(componentName);
  
  // Helper to check if an arrow belongs to the active phase
  const isArrowInActivePhase = (arrowId) => {
    if (currentPhase === null) return false;
    const step = ANIMATION_STEPS.find(s => s.id === arrowId);
    return step?.phase === currentPhase;
  };

  return (
    <div className="w-full">
      <style>
        {`
          @keyframes flowAnimation {
            from {
              stroke-dashoffset: 1000;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
      <div className="relative w-full">
        <ScaleToFit baseWidth={W} baseHeight={H}>
          <div
            ref={containerRef}
            className="relative bg-slate-900/50 rounded-2xl border border-slate-700/50 p-4"
            style={{ width: `${W}px`, height: `${H}px` }}
            aria-label="System architecture diagram"
          >
            {/* User Box */}
            <div 
              ref={userRef}
              className={`absolute left-[220px] top-[12px] w-[240px] h-[85px] border-2 rounded-xl bg-slate-800/40 transition-all duration-500 ${
                isComponentActive('user') 
                  ? 'border-cyan-300/80 shadow-lg shadow-cyan-500/50' 
                  : 'border-cyan-400/70'
              }`}
            >
              <div className="absolute -top-3 left-4 px-2 bg-slate-900 text-cyan-400 text-sm font-semibold">
                User
              </div>
              <div className="flex items-center justify-center gap-10 h-full pt-2">
                <div 
                  ref={webbrowserRef}
                  className="flex flex-col items-center gap-1"
                >
                  <IconBox color="cyan" size="lg" isActive={isComponentActive('webbrowser')}>
                    <Monitor size={24} />
                  </IconBox>
                  <span className="text-[10px] text-slate-300">Web browser</span>
                </div>
                <div 
                  ref={mobileappRef}
                  className="flex flex-col items-center gap-1"
                >
                  <IconBox color="cyan" size="lg" isActive={isComponentActive('mobileapp')}>
                    <Smartphone size={24} />
                  </IconBox>
                  <span className="text-[10px] text-slate-300">Mobile app</span>
                </div>
              </div>
            </div>

            {/* DNS */}
            <div 
              ref={dnsRef}
              className="absolute left-[45px] top-[20px] flex flex-col items-center gap-1"
            >
              <IconBox color="slate" size="xl" isActive={isComponentActive('dns')}>
                <Globe size={28} />
              </IconBox>
              <span className="text-[10px] text-slate-400 font-medium">DNS</span>
            </div>

            {/* CDN */}
            <div 
              ref={cdnRef}
              className="absolute right-[45px] top-[20px] flex flex-col items-center gap-1"
            >
              <IconBox color="amber" size="xl" isActive={isComponentActive('cdn')}>
                <Cloud size={28} />
              </IconBox>
              <span className="text-[10px] text-slate-300 font-medium">CDN</span>
            </div>

            {/* Domain labels */}
            <div className="absolute left-[175px] top-[102px] text-[9px] text-slate-500 font-mono">
              www.mysite.com
            </div>
            <div className="absolute left-[365px] top-[102px] text-[9px] text-slate-500 font-mono">
              api.mysite.com
            </div>

            {/* Load Balancer - Moved down for padding */}
            <div 
              ref={loadBalancerRef}
              className="absolute left-[290px] top-[125px] flex flex-col items-center gap-1"
            >
              <IconBox color="cyan" size="lg" isActive={isComponentActive('loadBalancer')}>
                <Network size={24} />
              </IconBox>
              <span className="text-[10px] text-slate-300 font-medium">Load Balancer</span>
            </div>

            {/* DC1 Boundary - Moved down for padding */}
            <div 
              ref={dc1Ref}
              className={`absolute left-[28px] top-[200px] w-[530px] h-[260px] border-2 border-dashed rounded-xl bg-slate-800/20 transition-all duration-500 ${
                isComponentActive('dc1')
                  ? 'border-cyan-300/60 shadow-lg shadow-cyan-500/30'
                  : 'border-cyan-400/40'
              }`}
            >
              <div className="absolute -top-3 left-4 px-2 bg-slate-900 text-slate-500 text-sm font-medium">
                DC1
              </div>

              {/* Web Servers */}
              <div 
                ref={webServersRef}
                className="absolute left-[25px] top-[25px] flex flex-col items-center gap-2"
              >
                <div className="flex gap-2">
                  <IconBox color="green" size="lg" isActive={isComponentActive('webServers')}>
                    <Server size={22} />
                  </IconBox>
                  <IconBox color="green" size="lg" isActive={isComponentActive('webServers')}>
                    <Server size={22} />
                  </IconBox>
                  <IconBox color="green" size="lg" isActive={isComponentActive('webServers')}>
                    <Server size={22} />
                  </IconBox>
                </div>
                <span className="text-[10px] text-slate-300 font-medium">Web Servers</span>
              </div>

              {/* Message Queue */}
              <div 
                ref={messageQueueRef}
                className="absolute right-[90px] top-[20px] flex flex-col items-center gap-2"
              >
                <div className="flex gap-2">
                  <IconBox color="blue" size="lg" isActive={isComponentActive('messageQueue')}>
                    <Mail size={22} />
                  </IconBox>
                  <IconBox color="blue" size="lg" isActive={isComponentActive('messageQueue')}>
                    <Mail size={22} />
                  </IconBox>
                  <IconBox color="blue" size="lg" isActive={isComponentActive('messageQueue')}>
                    <Mail size={22} />
                  </IconBox>
                </div>
                <span className="text-[10px] text-slate-300 font-medium">Message Queue</span>
              </div>

              {/* Databases */}
              <div 
                ref={databasesRef}
                className="absolute left-[15px] top-[115px] flex flex-col items-center gap-2"
              >
                <div className="flex gap-2">
                  <div className="flex flex-col items-center">
                    <IconBox color="cyan" size="lg" isActive={isComponentActive('databases')}>
                      <Database size={22} />
                    </IconBox>
                    <span className="text-[8px] text-slate-400 mt-1">Shard 1</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <IconBox color="cyan" size="lg" isActive={isComponentActive('databases')}>
                      <Database size={22} />
                    </IconBox>
                    <span className="text-[8px] text-slate-400 mt-1">Shard 2</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <IconBox color="cyan" size="lg" isActive={isComponentActive('databases')}>
                      <Database size={22} />
                    </IconBox>
                    <span className="text-[8px] text-slate-400 mt-1">Shard ...</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full border border-slate-500 text-[8px] flex items-center justify-center text-slate-400">1</span>
                  <span className="text-[10px] text-slate-300 font-medium">Databases</span>
                </div>
              </div>

              {/* Caches */}
              <div 
                ref={cachesRef}
                className="absolute left-[190px] top-[110px] flex flex-col items-center gap-2"
              >
                <div className="flex flex-col gap-1">
                  <IconBox color="cyan" size="md" isActive={isComponentActive('caches')}>
                    <Layers size={18} />
                  </IconBox>
                  <IconBox color="cyan" size="md" isActive={isComponentActive('caches')}>
                    <Layers size={18} />
                  </IconBox>
                  <IconBox color="cyan" size="md" isActive={isComponentActive('caches')}>
                    <Layers size={18} />
                  </IconBox>
                </div>
                <span className="text-[10px] text-slate-300 font-medium">Caches</span>
              </div>

              {/* Workers */}
              <div 
                ref={workersRef}
                className="absolute right-[75px] top-[105px] flex flex-col items-center gap-2"
              >
                <div className="flex gap-2">
                  <IconBox color="cyan" size="lg" isActive={isComponentActive('workers')}>
                    <Cpu size={22} />
                  </IconBox>
                  <IconBox color="cyan" size="lg" isActive={isComponentActive('workers')}>
                    <Cpu size={22} />
                  </IconBox>
                  <IconBox color="cyan" size="lg" isActive={isComponentActive('workers')}>
                    <Cpu size={22} />
                  </IconBox>
                </div>
                <span className="text-[10px] text-slate-300 font-medium">Workers</span>
              </div>
            </div>

            {/* NoSQL (outside DC1) */}
            <div 
              ref={nosqlRef}
              className="absolute right-[30px] top-[315px] flex flex-col items-center gap-1"
            >
              <div className="flex items-center gap-1 mb-1">
                <span className="w-4 h-4 rounded-full border border-slate-500 text-[8px] flex items-center justify-center text-slate-400">2</span>
                <span className="text-[10px] text-slate-300 font-medium">NoSQL</span>
              </div>
              <IconBox color="purple" size="xl" isActive={isComponentActive('nosql')}>
                <Braces size={28} />
              </IconBox>
            </div>

            {/* Tools Section - Moved down */}
            <div 
              ref={toolsRef}
              className="absolute left-[190px] bottom-[25px] flex flex-col items-center"
            >
              <div className={`border rounded-lg p-2.5 bg-slate-800/40 transition-all duration-500 ${
                isComponentActive('tools') 
                  ? 'border-slate-400/80 shadow-lg shadow-slate-500/50' 
                  : 'border-slate-600/50'
              }`}>
                <div className="grid grid-cols-2 gap-1.5">
                  <ToolBox icon={FileText} label="Logging" />
                  <ToolBox icon={BarChart3} label="Metrics" />
                  <ToolBox icon={Activity} label="Monitoring" />
                  <ToolBox icon={Settings} label="Automation" />
                </div>
              </div>
              <span className="text-[10px] text-slate-300 mt-1.5 font-medium">Tools</span>
            </div>

            {/* SVG Arrows Layer - Dynamically calculated with animation */}
            <svg
              className="absolute inset-0 pointer-events-none"
              viewBox={`0 0 ${W} ${H}`}
              style={{ width: W, height: H }}
            >
              {arrows.map((arrow) => {
                const step = ANIMATION_STEPS.find(s => s.id === arrow.id);
                const isActive = isArrowInActivePhase(arrow.id);
                
                return (
                  <AnimatedArrow
                    key={arrow.id}
                    x1={arrow.from.x}
                    y1={arrow.from.y}
                    x2={arrow.to.x}
                    y2={arrow.to.y}
                    color={step?.color || arrow.color}
                    dashed={step?.dashed || arrow.dashed}
                    curved={arrow.curved}
                    isActive={isActive}
                    dataType={arrow.dataType || step?.dataType || null}
                  />
                );
              })}
            </svg>

            {/* Figure label */}
            <div className="absolute bottom-[6px] right-[180px] text-[10px] text-slate-600 font-mono">
              Figure 1-23
            </div>
          </div>
        </ScaleToFit>
      </div>
    </div>
  );
}
