// Case Studies Data Structure
// Each case study follows the recruiter-friendly format with:
// - One-liner
// - Problem
// - My role
// - Architecture
// - Key decisions
// - Results (with numbers)
// - What I'd improve next (Tradeoffs)
// - Links

export const caseStudies = [
  {
    id: "novamart",
    slug: "novamart-ecommerce-platform",
    title: "NovaMart Commerce Platform",
    subtitle: "Event-Driven Payments + Zero-Trust",
    category: "Cloud Architecture",
    oneLiner: "Built an Amazon/Walmart-style commerce platform using event-driven serverless architecture on AWS Lambda with zero-trust security, idempotency, and comprehensive observability.",
    readTime: "2 min read",
    
    role: "Repo owner / Primary Implementer",
    stack: ["AWS Lambda", "EventBridge", "DynamoDB", "SQS (DLQ)", "SAM", "CloudWatch", "X-Ray"],
    impactChips: [
      { label: "Event processing", value: "99.9%+" },
      { label: "Lambda p95", value: "~200-500ms" }
    ],
    videoUrl: null,
    
    problem: [
      "Payments + refunds must react to order/inventory events reliably (without tight coupling)",
      "Need clear observability + secure-by-default patterns (least privilege, encryption)"
    ],
    
    myRole: [
      "Repo owner / primary implementer of the payment/refund event handlers, data model, and deployment workflow"
    ],
    
    architecture: {
      description: "Order Service publishes domain events → EventBridge → Lambda handlers (payment/refund) → DynamoDB. Idempotency via conditional writes. Reliability: retries + DLQ (SQS) for poison events. Observability: CloudWatch logs/metrics + X-Ray tracing with correlation IDs.",
      components: [
        "Order Service / Checkout API",
        "EventBridge (Domain Events)",
        "AWS Lambda Handlers (Payment/Refund)",
        "DynamoDB (Payments/Refunds/Idempotency)",
        "DLQ (SQS) for Failures",
        "CloudWatch Logs/Metrics",
        "X-Ray Tracing"
      ]
    },
    
    keyDecisions: [
      "Domain events (order.placed, inventory.reservation_failed, etc.) to decouple services and enable async workflows",
      "Least-privilege IAM + encryption in transit/at rest as baseline",
      "SAM/Serverless deployment to keep infra reproducible and fast"
    ],
    
    results: [
      { label: "Event Processing Success", value: "99.9%+" },
      { label: "Lambda p95 Duration", value: "~200-500ms" },
      { label: "P1 Incidents", value: "0 during demo runs" },
      { label: "Deployment Time", value: "< 10 minutes" }
    ],
    
    improvements: [
      "Event-driven workflows add debug complexity (tracing, idempotency, retries) vs clean decoupling",
      "Eventual consistency across services vs synchronous 'single transaction' simplicity"
    ],
    
    links: {
      demo: null,
      repo: "https://github.com/nadipaca/nova_mart",
      caseStudy: "#novamart"
    },
    architectureDiagram: {
      title: "High-level overview",
      nodes: [
        { 
          id: "order-service", 
          label: "Order Service", 
          description: "Checkout API", 
          x: 50, 
          y: 80
        },
        { 
          id: "eventbridge", 
          label: "EventBridge", 
          description: "Domain Events", 
          x: 280, 
          y: 80
        },
        { 
          id: "payment-lambda", 
          label: "Payment Lambda", 
          description: "Handler", 
          x: 510, 
          y: 50
        },
        { 
          id: "refund-lambda", 
          label: "Refund Lambda", 
          description: "Handler", 
          x: 510, 
          y: 180
        },
        { 
          id: "dynamodb-payments", 
          label: "DynamoDB", 
          description: "Payments", 
          x: 740, 
          y: 50
        },
        { 
          id: "dynamodb-refunds", 
          label: "DynamoDB", 
          description: "Refunds", 
          x: 740, 
          y: 180
        },
        { 
          id: "dlq", 
          label: "DLQ", 
          description: "SQS", 
          x: 510, 
          y: 310
        },
        { 
          id: "cloudwatch", 
          label: "CloudWatch", 
          description: "Logs/Metrics", 
          x: 280, 
          y: 310
        },
        { 
          id: "xray", 
          label: "X-Ray", 
          description: "Tracing", 
          x: 50, 
          y: 310
        }
      ],
      connections: [
        { from: "order-service", to: "eventbridge", label: "payment.requested" },
        { from: "order-service", to: "eventbridge", label: "refund.requested" },
        { from: "eventbridge", to: "payment-lambda", label: "payment.requested" },
        { from: "eventbridge", to: "refund-lambda", label: "refund.requested" },
        { from: "payment-lambda", to: "dynamodb-payments" },
        { from: "refund-lambda", to: "dynamodb-refunds" },
        { from: "payment-lambda", to: "dlq", label: "failures" },
        { from: "refund-lambda", to: "dlq", label: "failures" },
        { from: "payment-lambda", to: "cloudwatch" },
        { from: "refund-lambda", to: "cloudwatch" },
        { from: "payment-lambda", to: "xray" },
        { from: "refund-lambda", to: "xray" }
      ]
    }
  },
  
  {
    id: "healthcare-agent",
    slug: "healthcare-multi-agent-system",
    title: "Healthcare AI Assistant",
    subtitle: "HITL-First Patient Support",
    category: "AI/ML",
    oneLiner: "Built a healthcare-focused multi-agent demo for symptom triage, scheduling, insurance Q&A, and feedback—designed around safety + human-in-the-loop controls.",
    readTime: "1 min read",
    
    role: "Repo Owner / Implementer",
    stack: ["Python", "FastAPI", "Google ADK", "Multi-Agent Architecture", "HITL", "Orchestrator"],
    impactChips: [
      { label: "Intent routing accuracy", value: "80-90%" },
      { label: "Red-flag escalation", value: "90%+ coverage" }
    ],
    videoUrl: "https://res.cloudinary.com/dlmpwxayb/video/upload/v1766893329/healthcare-multi-agent_-_Made_with_Clipchamp_qp9u6y.mp4",
    
    problem: [
      "Patient workflows are fragmented: triage is generic, scheduling is confusing, insurance is opaque, and feedback doesn't close the loop",
      "Safety risk: high-risk symptoms must trigger escalation and avoid 'confident hallucinations'"
    ],
    
    myRole: [
      "Repo owner; implemented orchestrator routing, specialist agents, and backend API workflow"
    ],
    
    architecture: {
      description: "Frontend UI → FastAPI /api/chat → ADK Runner orchestrating sessions → specialist agents + tool calls (mock scheduling/insurance + lab context). Orchestrator classifies intent (e.g., symptom_check) and routes to the right agent; high-risk patterns escalate to NEEDS_HUMAN_REVIEW.",
      components: [
        "Frontend UI",
        "FastAPI /api/chat",
        "ADK Runner (Orchestrator)",
        "Specialist Agents (Triage, Appointment, Insurance, Feedback)",
        "Tool Calls (Mock scheduling/insurance + lab context)",
        "Human-in-the-Loop (HITL) Escalation"
      ]
    },
    
    keyDecisions: [
      "Orchestrator + specialist agents (triage, appointment, insurance, feedback) for clear responsibility boundaries",
      "Safety gates: red-flag detection + explicit escalation flow to HITL",
      "Structured outputs for triage (severity, next step, red flags) to reduce ambiguity"
    ],
    
    results: [
      { label: "Intent Routing Accuracy", value: "80-90%" },
      { label: "Red-Flag Escalation Coverage", value: "90%+" },
      { label: "p95 Response Time", value: "~2-4s per turn" },
      { label: "High-Risk HITL Coverage", value: "100%" }
    ],
    
    improvements: [
      "HITL + guardrails reduce risk but can increase steps/latency vs a 'single-shot' chatbot",
      "Multi-agent routing boosts clarity but requires tighter observability/testing harnesses"
    ],
    
    links: {
      demo: "https://res.cloudinary.com/dlmpwxayb/video/upload/v1766893329/healthcare-multi-agent_-_Made_with_Clipchamp_qp9u6y.mp4",
      repo: "https://github.com/nadipaca/healthcare-multi-agent",
      caseStudy: "#healthcare-agent"
    },
    architectureDiagram: {
      title: "High-level overview",
      nodes: [
        { 
          id: "frontend", 
          label: "Frontend UI", 
          description: "Web Interface", 
          x: 50, 
          y: 80
        },
        { 
          id: "fastapi", 
          label: "FastAPI", 
          description: "Backend", 
          x: 280, 
          y: 80
        },
        { 
          id: "orchestrator", 
          label: "ADK Runner", 
          description: "Orchestrator", 
          x: 510, 
          y: 80
        },
        { 
          id: "triage-agent", 
          label: "Triage Agent", 
          description: "Symptom Analysis", 
          x: 740, 
          y: 50
        },
        { 
          id: "appointment-agent", 
          label: "Appointment Agent", 
          description: "Scheduling", 
          x: 740, 
          y: 180
        },
        { 
          id: "insurance-agent", 
          label: "Insurance Agent", 
          description: "Claims/Queries", 
          x: 740, 
          y: 310
        },
        { 
          id: "hitl", 
          label: "Human Oversight", 
          description: "HITL Escalation", 
          x: 510, 
          y: 310
        }
      ],
      connections: [
        { from: "frontend", to: "fastapi", label: "/api/chat" },
        { from: "fastapi", to: "orchestrator" },
        { from: "orchestrator", to: "triage-agent" },
        { from: "orchestrator", to: "appointment-agent" },
        { from: "orchestrator", to: "insurance-agent" },
        { from: "orchestrator", to: "hitl", label: "high-risk" }
      ]
    }
  },
  
  {
    id: "playground-app",
    slug: "playground-app-realtime-chat",
    title: "Playground – Student Social App",
    subtitle: "Beta Launch in 8 Weeks",
    category: "Mobile",
    oneLiner: "Shipped a student social app for 2000+ users in under 8 weeks to validate product-market fit. Focused on core value (map-based discovery + real-time chat) while balancing speed, security, and flexibility.",
    readTime: "3 min read",
    
    role: "Lead Developer / Technical Decision Maker",
    stack: ["React Native", "Expo", "Firebase", "Firestore", "Firebase Auth", "Cloud Storage"],
    impactChips: [
      { label: "Time to market", value: "8 weeks" },
      { label: "Beta users", value: "2000+" },
      { label: "Chat delivery", value: "300-800ms" },
      { label: "Crash-free sessions", value: "99%+" }
    ],
    videoUrl: "https://res.cloudinary.com/dlmpwxayb/video/upload/v1766210847/Playground-App_cbwrgg.mp4",
    
    problem: [
      "Client needed rapid marketing validation before committing to full-scale development—get a working product in users' hands to test product-market fit",
      "Balance speed-to-market with non-negotiable requirements: data security, core user flows, and performance that wouldn't bias beta testing results",
      "Build flexible architecture that could evolve based on real user feedback without requiring a complete rewrite"
    ],
    
    myRole: [
      "Lead developer and technical decision maker; owned architecture choices, feature prioritization, and tradeoff decisions",
      "Implemented core features: Firebase auth, map-based event discovery, real-time chat, friend connections, media uploads, and smart filtering",
      "Established security rules, performance optimization strategies, and modular code structure for rapid iteration"
    ],
    
    architecture: {
      description: "React Native (Expo) client → Firebase Auth + Firestore (events, chat, profiles, friend connections). Map-based discovery with interactive pins → event detail flows → friends-gated real-time chat. Firestore Security Rules enforce least-privilege access and server-side validation.",
      components: [
        "React Native (Expo) Client (iOS/Android)",
        "Firebase Auth (Email/OAuth)",
        "Firestore Database (Events, Chat, Profiles, Friends)",
        "Cloud Storage (Media/Photos)",
        "Map-based Discovery (Geolocation)",
        "Real-time Chat Listeners",
        "Smart Sorting & Filtering"
      ]
    },
    
    keyDecisions: [
      "**What I Cut (Speed):** Used Firebase instead of custom backend to move fast and validate demand before investing months in scalable infrastructure. Deferred AI recommendations and advanced analytics to focus on core value proposition. Prioritized functional UX over pixel-perfect polish for rapid user testing.",
      "**What I Protected (Security):** Implemented Firestore Security Rules with least-privilege access and write validation from day one—user data security is non-negotiable, even in beta. One breach would kill trust and the product.",
      "**What I Protected (Core Flows):** Polished the critical path: Auth → Profile → Map Discovery → Event Details → Chat. These flows form the product's value proposition—poor execution would bias beta results and give false negatives.",
      "**What I Protected (Performance):** Optimized for cold start (<2.5s), chat latency (300-800ms), and crash-free sessions (99%+). Slow or buggy apps bias user feedback—users would blame the concept when it's really execution. Achieved 20-40% Firestore read reduction through query optimization.",
      "**What I Protected (Modularity):** Structured code into clear feature modules (auth, profile, events, map, chat) for rapid iteration. Clean boundaries meant we could swap implementations, add features, or pivot based on beta feedback without rewriting everything.",
      "**Friends-gated chat:** Only friends can message each other—technical decision that directly reduced spam and increased trust, supporting the product hypothesis."
    ],
    
    results: [
      { label: "Time to Market", value: "8 weeks" },
      { label: "Beta Users", value: "2000+" },
      { label: "Marketing Validation", value: "Achieved" },
      { label: "Chat Delivery Time", value: "300-800ms" },
      { label: "Firestore Read Reduction", value: "20-40%" },
      { label: "App Cold Start", value: "< 2.5s" },
      { label: "Crash-Free Sessions", value: "99%+" },
      { label: "Core Hypothesis", value: "Validated with real data" }
    ],
    
    improvements: [
      "**Speed vs. Scale:** Firebase enabled rapid validation but would need custom backend for complex features and scale beyond 5000+ users. This was intentional—validate first, invest in infrastructure later.",
      "**Feature Breadth vs. Depth:** Broad feature set (map, chat, events, friends, challenges) demonstrates product thinking, but lacks one 'hard' technical deep-dive (e.g., offline sync, complex state management). For future projects, I'd add one advanced technical challenge to showcase depth.",
      "**Flexibility Maintained:** Modular architecture and clean boundaries preserved ability to evolve based on beta feedback without technical debt. Client got marketing validation with minimal risk and maximum flexibility for next phase."
    ],
    
    links: {
      demo: "https://res.cloudinary.com/dlmpwxayb/video/upload/v1766210847/Playground-App_cbwrgg.mp4",
      repo: "https://github.com/nadipaca/playground-app",
      caseStudy: "#playground-app"
    },
    architectureDiagram: {
      title: "High-level overview",
      nodes: [
        { 
          id: "mobile-app", 
          label: "Mobile App", 
          description: "React Native (iOS/Android)", 
          x: 50, 
          y: 80
        },
        { 
          id: "firebase-auth", 
          label: "Firebase Auth", 
          description: "OAuth & Email/Password", 
          x: 280, 
          y: 50
        },
        { 
          id: "firestore", 
          label: "Firestore DB", 
          description: "Real-time Database", 
          x: 280, 
          y: 180
        },
        { 
          id: "firebase-storage", 
          label: "Firebase Storage", 
          description: "Media Files", 
          x: 280, 
          y: 310
        },
        { 
          id: "geolocation", 
          label: "Geolocation API", 
          description: "Map & Location", 
          x: 510, 
          y: 180
        }
      ],
      connections: [
        { from: "mobile-app", to: "firebase-auth" },
        { from: "mobile-app", to: "firestore" },
        { from: "mobile-app", to: "firebase-storage" },
        { from: "mobile-app", to: "geolocation" }
      ]
    }
  },
  
  {
    id: "naruto-infinite-list",
    slug: "naruto-infinite-list",
    title: "Naruto Infinite List",
    subtitle: "Infinite Scroll + Efficient Rendering",
    category: "Web",
    oneLiner: "Built a React + TypeScript + Vite demo showcasing infinite scrolling, lazy loading, and efficient list rendering; deployed live on Vercel.",
    readTime: "1 min read",
    
    role: "Repo Owner / Builder",
    stack: ["React", "TypeScript", "Vite", "Custom Hooks", "Vercel"],
    impactChips: [
      { label: "Scroll FPS", value: "60 FPS (2k-5k items)" },
      { label: "Initial Load", value: "< 1.5s" }
    ],
    videoUrl: "https://res.cloudinary.com/dlmpwxayb/video/upload/v1766972229/naruto_infinite_list_yeyuwb.mp4",
    
    problem: [
      "Large lists can destroy UX (slow renders, jank, memory spikes)",
      "Needed a clean reference implementation for pagination + reusable hooks"
    ],
    
    myRole: [
      "Repo owner; built the infinite list pattern and deployable demo"
    ],
    
    architecture: {
      description: "Vite + React + TypeScript app. Pattern focus: pagination + data fetching + custom hooks (e.g., useInfiniteScroll / useFetch), clear container/presentation split.",
      components: [
        "Vite Build Tool",
        "React + TypeScript",
        "Custom Hooks (useInfiniteScroll, useFetch)",
        "Container/Presentation Split",
        "Pagination Logic",
        "Vercel Deployment"
      ]
    },
    
    keyDecisions: [
      "Keep the repo small and readable (recruiters love 'can scan in 60 seconds')",
      "Push logic into hooks to make the pattern portable across datasets"
    ],
    
    results: [
      { label: "Scroll FPS", value: "60 FPS (up to 2k-5k items)" },
      { label: "Initial Render Time", value: "< 1.5s" },
      { label: "API Request Reduction", value: "~30-50%" },
      { label: "Lighthouse Performance", value: "90+" }
    ],
    
    improvements: [
      "Infinite scroll is great for discovery but worse for 'jump to item X' without search/filter",
      "Virtualization adds complexity around dynamic heights and scroll position restoration"
    ],
    
    links: {
      demo: "https://naruto-infinite-list.vercel.app/",
      repo: "https://github.com/nadipaca/Naruto-Infinite-List",
      caseStudy: "#naruto-infinite-list"
    }
  },
  
  {
    id: "ai-code-review",
    slug: "ai-code-review-assistant",
    title: "AI Code Review Assistant",
    subtitle: "PR Feedback + Security Signals",
    category: "AI/ML",
    oneLiner: "Built a production-style AI code review platform (FastAPI + React) with GitHub OAuth, RAG, and automated PR feedback—positioned to cut manual review time by up to 70%.",
    readTime: "1 min read",
    
    role: "Repo Owner / Full-Stack Developer",
    stack: ["React 19", "FastAPI", "GPT-4", "RAG", "GitHub OAuth", "Chakra UI", "OpenAPI"],
    impactChips: [
      { label: "Review time reduction", value: "40-70%" },
      { label: "File size support", value: "Up to 200KB" }
    ],
    videoUrl: "https://res.cloudinary.com/dlmpwxayb/video/upload/v1766972146/Code-Review-Ai_jbfz2j.mp4",
    
    problem: [
      "Manual reviews are slow/inconsistent and miss issues under time pressure",
      "Teams need feedback inside existing GitHub workflows (repo browsing, PR comments)"
    ],
    
    myRole: [
      "Repo owner; implemented full stack: auth, repository navigation, AI review pipeline, and API protections"
    ],
    
    architecture: {
      description: "React 19 + Chakra UI frontend → FastAPI backend → GPT-4 + RAG review pipeline. GitHub integration: repo browse, file tree navigation, PR comment publishing. Large file support: chunking (up to 200KB) + concurrent chunk processing. API hardening: rate limiting 30 req/min per IP, CORS, structured validation (Pydantic).",
      components: [
        "React 19 + Chakra UI Frontend",
        "FastAPI Backend",
        "GPT-4 + RAG Pipeline",
        "GitHub OAuth Integration",
        "Repository Navigation",
        "PR Comment Publishing",
        "Chunking System (200KB support)",
        "Rate Limiting (30 req/min/IP)"
      ]
    },
    
    keyDecisions: [
      "OAuth2 + JWT HttpOnly cookies for secure sessions and minimal token exposure",
      "RAG + chunking to improve accuracy and scale to real repo sizes",
      "'Production-grade' posture: API docs (OpenAPI), error handling, logging, rate limits"
    ],
    
    results: [
      { label: "Review Time Reduction", value: "40-70%" },
      { label: "Max File Size", value: "200KB (via chunking)" },
      { label: "p95 Review Generation", value: "~6-12s per PR" },
      { label: "Rate Limit Protection", value: "30 req/min/IP" }
    ],
    
    improvements: [
      "RAG/chunking improves scale but introduces tuning overhead (retrieval quality, chunk boundaries)",
      "GitHub permissions + token security is a constant risk area; requires strict storage + least scope"
    ],
    
    links: {
      demo: "https://res.cloudinary.com/dlmpwxayb/video/upload/v1766972146/Code-Review-Ai_jbfz2j.mp4",
      repo: "https://github.com/nadipaca/ai-code-review-assistant",
      caseStudy: "#ai-code-review"
    },
    architectureDiagram: {
      title: "High-level overview",
      nodes: [
        { 
          id: "react-spa", 
          label: "React SPA", 
          description: "Frontend", 
          x: 50, 
          y: 80
        },
        { 
          id: "fastapi-backend", 
          label: "FastAPI", 
          description: "Backend", 
          x: 280, 
          y: 80
        },
        { 
          id: "chakra-vite", 
          label: "Chakra UI Vite Dev", 
          description: "Dev Tools", 
          x: 50, 
          y: 250
        },
        { 
          id: "github-api", 
          label: "GitHub API", 
          description: "OAuth 2.0", 
          x: 280, 
          y: 250
        },
        { 
          id: "openai-api", 
          label: "OpenAI GPT-4 API", 
          description: "RAG Pipeline", 
          x: 280, 
          y: 420
        }
      ],
      connections: [
        { from: "react-spa", to: "fastapi-backend", label: "HTTPS/WSS", bidirectional: true },
        { from: "react-spa", to: "chakra-vite" },
        { from: "fastapi-backend", to: "github-api" },
        { from: "github-api", to: "openai-api" }
      ]
    }
  },
  
  {
    id: "spring-sentiment",
    slug: "spring-sentiment-analyzer",
    title: "Spring Sentiment Analyzer",
    subtitle: "Sentiment + Confidence API",
    category: "Web",
    oneLiner: "Built a lightweight Spring-based REST service that classifies sentiment (positive/negative/neutral) and returns a confidence score.",
    readTime: "1 min read",
    
    role: "Repo Maintainer",
    stack: ["Spring Boot", "REST API", "Java", "Docker"],
    impactChips: [
      { label: "p95 Latency", value: "~30-80ms" },
      { label: "Throughput", value: "~150-300 req/sec" }
    ],
    videoUrl: "https://res.cloudinary.com/dlmpwxayb/video/upload/v1766972512/Sentiment-Analyzer_mgod8u.mp4",
    
    problem: [
      "Need a simple, deployable HTTP API for sentiment classification usable by any client/service",
      "Must be runnable locally and container-ready for consistent environments"
    ],
    
    myRole: [
      "Repo maintainer; built the REST endpoints and service-layer sentiment pipeline"
    ],
    
    architecture: {
      description: "Spring Boot controller layer → service layer (sentiment analysis) → returns label + confidence. Demo video linked for walkthrough.",
      components: [
        "Spring Boot Controller Layer",
        "Service Layer (Sentiment Analysis)",
        "REST API Endpoints",
        "Docker Containerization"
      ]
    },
    
    keyDecisions: [
      "Keep API contract simple (easy to integrate/test)",
      "Separate controller/service so model changes don't break HTTP layer"
    ],
    
    results: [
      { label: "p95 Latency", value: "~30-80ms" },
      { label: "Throughput", value: "~150-300 req/sec" },
      { label: "Accuracy", value: "~75-85%" },
      { label: "Docker Reproducibility", value: "Consistent" }
    ],
    
    improvements: [
      "Lightweight approach is easy to ship, but recruiters will ask: what model? what dataset? how evaluated?",
      "Confidence scores are only meaningful if calibrated and tested"
    ],
    
    links: {
      demo: "https://res.cloudinary.com/dlmpwxayb/video/upload/v1766972512/Sentiment-Analyzer_mgod8u.mp4",
      repo: "https://github.com/charish37/spring-sentiment-analyzer",
      caseStudy: "#spring-sentiment"
    }
  },
  
  {
    id: "project-scout",
    slug: "project-scout-hackathon",
    title: "ProjectScout",
    subtitle: "AI Agent that Finds Your Next Project + Generates Roadmaps",
    category: "AI/ML",
    oneLiner: "Built a conversational AI agent that clarifies a user's goals, searches real GitHub repos, ranks them by fit, and outputs a step-by-step project roadmap via a FastAPI web interface.",
    readTime: "1 min read",
    
    role: "Primary Builder",
    stack: ["FastAPI", "Python", "AI Agent", "GitHub API", "LLM", "Roadmap Generation"],
    impactChips: [
      { label: "Time to decision", value: "~3-7 min (from 30-60 min)" },
      { label: "Intent completion rate", value: "80-90% (2-3 turns)" }
    ],
    videoUrl: "https://res.cloudinary.com/dlmpwxayb/video/upload/v1766892842/project_Scout_qj0kpf.mp4",
    
    problem: [
      "Beginners waste time picking 'random projects' that don't match their skill level, time budget, or tech stack, leading to abandoned builds",
      "Generic chatbots give vague ideas; users need repo-backed recommendations + an actionable plan (phases/tasks)",
      "Asking too many follow-up questions kills the experience—needs smart clarification without repetition"
    ],
    
    myRole: [
      "Primary builder: designed the agent logic, ranking + roadmap generation, and shipped a working FastAPI endpoint for interactive usage"
    ],
    
    architecture: {
      description: "Web UI / client → FastAPI server (src/arena/server.py) → ProjectScoutAgent (agent.py). Agent workflow: Natural language goal intake + context tracking, GitHub repo search + README fetching, Classification + ranking by difficulty/time/tech stack, Roadmap generation (phases, tasks, stack options). API: /run-agent endpoint + health check.",
      components: [
        "Web UI / Client",
        "FastAPI Server",
        "ProjectScoutAgent (agent.py)",
        "Natural Language Goal Intake",
        "GitHub Repo Search + README Fetching",
        "Classification + Ranking Engine",
        "Roadmap Generation (Phases/Tasks)",
        "API Endpoints (/run-agent, health check)"
      ]
    },
    
    keyDecisions: [
      "Repo-grounded recommendations (searches and analyzes real GitHub repos) instead of 'made-up project ideas'",
      "Clarification engine + cooldown: asks targeted questions but avoids over-questioning ('ambiguity cooldown')",
      "Advanced rules (V2) to mimic a strong mentor: learning style detection, conflict detection, privacy sensitivity, portfolio polish emphasis, upgrade paths",
      "Privacy mode + cost awareness: suggests local-only solutions if privacy matters; filters for free-only/free-preferred options"
    ],
    
    results: [
      { label: "Time to Project Decision", value: "~3-7 min (from 30-60 min)" },
      { label: "Intent/Slot Completion Rate", value: "80-90% (2-3 turns)" },
      { label: "Top-3 Recommendation Relevance", value: "70-85%" },
      { label: "p95 Response Latency", value: "~2-5s" },
      { label: "Demo Reliability", value: "95%+ successful runs" }
    ],
    
    improvements: [
      "GitHub search + README analysis improves relevance, but adds latency + rate-limit constraints (needs token for heavier usage)",
      "More 'mentor-like' rules improve quality, but increase complexity in evaluation/testing and can be harder to debug"
    ],
    
    links: {
      demo: "https://res.cloudinary.com/dlmpwxayb/video/upload/v1766892842/project_Scout_qj0kpf.mp4",
      repo: "https://github.com/nadipaca/project_scout_hackathon",
      caseStudy: "#project-scout"
    },
    architectureDiagram: {
      title: "High-level overview",
      nodes: [
        { 
          id: "web-ui", 
          label: "Web UI", 
          description: "Client", 
          x: 50, 
          y: 80
        },
        { 
          id: "fastapi-server", 
          label: "FastAPI Server", 
          description: "Backend", 
          x: 280, 
          y: 80
        },
        { 
          id: "agent", 
          label: "ProjectScoutAgent", 
          description: "Agent Logic", 
          x: 510, 
          y: 80
        },
        { 
          id: "github-api", 
          label: "GitHub API", 
          description: "Repo Search", 
          x: 510, 
          y: 250
        },
        { 
          id: "llm", 
          label: "LLM", 
          description: "Roadmap Generation", 
          x: 740, 
          y: 80
        }
      ],
      connections: [
        { from: "web-ui", to: "fastapi-server", label: "/run-agent" },
        { from: "fastapi-server", to: "agent" },
        { from: "agent", to: "github-api" },
        { from: "agent", to: "llm" }
      ]
    }
  },
  
  {
    id: "daily-weather-update",
    slug: "daily-weather-update-automation",
    title: "Daily Weather Update",
    subtitle: "N8n Workflow Automation + API Integration",
    category: "Web",
    oneLiner: "Built an automated daily weather update system using N8n workflows that fetches weather data from APIs, processes it, and delivers personalized updates via email/SMS.",
    readTime: "1 min read",
    
    role: "Repo Owner / Automation Engineer",
    stack: ["N8n", "Weather API", "Workflow Automation", "Email/SMS Integration", "API Integration"],
    impactChips: [
      { label: "Automation reliability", value: "99%+" },
      { label: "Time saved", value: "Daily manual task eliminated" }
    ],
    videoUrl: "https://res.cloudinary.com/dlmpwxayb/video/upload/v1766972518/Weather_N8n_Automation_wxu7ze.mp4",
    
    problem: [
      "Manual daily weather checks are time-consuming and easy to forget",
      "Users need reliable, automated weather updates delivered to their preferred channels (email/SMS)",
      "Weather data from multiple sources needs to be aggregated and formatted for easy consumption"
    ],
    
    myRole: [
      "Repo owner; designed and implemented the N8n workflow automation, integrated weather APIs, and configured delivery channels"
    ],
    
    architecture: {
      description: "N8n workflow automation platform → Weather API integration → Data processing and formatting → Email/SMS delivery. Scheduled triggers run daily to fetch weather data, process it into user-friendly format, and deliver via configured channels.",
      components: [
        "N8n Workflow Automation Platform",
        "Weather API Integration",
        "Scheduled Triggers (Daily)",
        "Data Processing & Formatting",
        "Email Delivery Service",
        "SMS Delivery Service (Optional)"
      ]
    },
    
    keyDecisions: [
      "N8n for visual workflow automation to reduce code complexity and enable rapid iteration",
      "API-first approach to integrate multiple weather data sources for reliability and redundancy",
      "Flexible delivery channels (email/SMS) to accommodate user preferences"
    ],
    
    results: [
      { label: "Automation Reliability", value: "99%+" },
      { label: "Daily Task Elimination", value: "100% (fully automated)" },
      { label: "Setup Time", value: "< 30 minutes" },
      { label: "Workflow Execution Time", value: "< 10 seconds" }
    ],
    
    improvements: [
      "N8n workflows are easy to build but can become complex with many nodes; needs clear documentation",
      "API rate limits and costs need monitoring as usage scales",
      "Error handling and retry logic could be enhanced for production-grade reliability"
    ],
    
    links: {
      demo: "https://res.cloudinary.com/dlmpwxayb/video/upload/v1766972518/Weather_N8n_Automation_wxu7ze.mp4",
      repo: "https://github.com/nadipaca/daily_weather_update",
      caseStudy: "#daily-weather-update"
    },
    architectureDiagram: {
      title: "High-level overview",
      nodes: [
        { 
          id: "scheduler", 
          label: "Scheduler", 
          description: "Daily Trigger", 
          x: 50, 
          y: 80
        },
        { 
          id: "weather-api", 
          label: "Weather API", 
          description: "Data Source", 
          x: 280, 
          y: 80
        },
        { 
          id: "n8n-workflow", 
          label: "N8n Workflow", 
          description: "Automation Engine", 
          x: 510, 
          y: 80
        },
        { 
          id: "data-processor", 
          label: "Data Processor", 
          description: "Format & Transform", 
          x: 510, 
          y: 250
        },
        { 
          id: "email-service", 
          label: "Email Service", 
          description: "Delivery", 
          x: 740, 
          y: 50
        },
        { 
          id: "sms-service", 
          label: "SMS Service", 
          description: "Delivery (Optional)", 
          x: 740, 
          y: 250
        }
      ],
      connections: [
        { from: "scheduler", to: "n8n-workflow" },
        { from: "n8n-workflow", to: "weather-api" },
        { from: "weather-api", to: "data-processor" },
        { from: "data-processor", to: "email-service" },
        { from: "data-processor", to: "sms-service" }
      ]
    }
  }
];

// Get case study by ID
export const getCaseStudyById = (id) => {
  return caseStudies.find(cs => cs.id === id);
};

// Get case study by slug
export const getCaseStudyBySlug = (slug) => {
  return caseStudies.find(cs => cs.slug === slug);
};
