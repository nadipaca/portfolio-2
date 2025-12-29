export const portfolioData = {
  profile: {
    name: "Charishma Nadipalli",
    role: "Senior Full-Stack Engineer | React, Node, Spring Boot | Cloud & AI Systems at Scale",
    bio: "5+ years experience • Built production systems for 50k+ users • Deployed on AWS • Led end-to-end features",
    experience_years: "5+",
    availability: "Let's Build Something Intelligent.",
    socials: {
      github: "https://github.com/nadipaca",
      linkedin: "https://linkedin.com/in/charishma-nadipalli",
      email: "charishmanadipalli99@gmail.com"
    }
  },
  github: {
    // Curate what you want recruiters/founders to see first (quality > quantity).
    // These should match your GitHub repo names exactly.
    curatedRepos: [
      "ai-code-review-assistant",
      "healthcare-multi-agent",
      "playground-app",
      "Naruto-Infinite-List",
      "spring-sentiment-analyzer",
      "nova_mart",
      "daily_weather_update",
      "project_scout_hackathon"
    ],
    // Hide repos you don’t want displayed (learning repos, forks, portfolio experiments, etc.)
    hiddenRepos: [
      "portfolio-2",
      "Sequelize-learn",
      "nodejs-databases",
      "OCAT-Charishma-2025"
    ],
    // Optional per-repo owner overrides when curated repos live under other accounts
    repoOwners: {
      "spring-sentiment-analyzer": "charish37"
    },
    repoCategories: {
      "ai-code-review-assistant": "AI/ML",
      "healthcare-multi-agent": "AI/ML",
      "spring-sentiment-analyzer": "AI/ML",
      "project_scout_hackathon": "AI/ML",
      "playground-app": "Mobile",
      "Naruto-Infinite-List": "Web",
      "nova_mart": "Web",
      "daily_weather_update": "Web"
    }
  },
  education: {
    label: "Education",
    degree: "Master's in Information Technology",
    school: "University of Cincinnati",
    location: "Cincinnati, OH",
    meta: "Expected Graduation: Dec 2025 | GPA: 4.0/4.0",
    coursework: [
      "Machine Learning",
      "Data Mining",
      "Azure Data Engineering",
      "Mobile App Tech",
      "HCI",
      "Cybersecurity"
    ]
  },
  certifications: [
  {
      id: "oci-developer-professional-2025",
      title: "Oracle Cloud Infrastructure 2025 Certified Developer Professional",
      issuer: "Oracle",
      issued: "Oct 2025",
      expires: "Oct 2027",
      credentialId: "",
      credentialUrl: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=C4252185CA2E9800DA0644A402BB7A59BA7D26EEAD3DFB2CA2B46E0024E112E9",
    },
    {
      id: "oci-generative-ai-professional-2025",
      title: "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional",
      issuer: "Oracle",
      issued: "Oct 2025",
      expires: "Oct 2027",
      credentialId: "",
      credentialUrl: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=7A70A97AF22084C151EA72527C25C28E7DD68353D3241A65D5D31F877FBFD30C",
    },
    {
      id: "azure-fundamentals",
      title: "Microsoft Certified: Azure Fundamentals",
      issuer: "Microsoft",
      issued: "Nov 2022",
      expires: "",
      credentialId: "1940AAD584CB608E",
      credentialUrl: "https://learn.microsoft.com/api/credentials/share/en-us/CharishmaNadipalli-6506/1940AAD584CB608E?sharingId",
    },
  ],
  skills: {
    frontend: {
      primary: ["React", "TypeScript"],
      secondary: ["Next.js", "Tailwind CSS"],
      isPrimary: true,
      usedIn: [
        { name: "Naruto Infinite List", slug: "naruto-infinite-list", tooltip: "Used for infinite scroll + API integration" },
        { name: "Portfolio", slug: "#", tooltip: "Built with React + TypeScript" },
        { name: "Work", slug: "#experience", tooltip: "Built Dashboard and Forms for 50k+ users" }
      ]
    },
    backend: {
      primary: ["Node.js", "FastAPI", "Spring Boot"],
      secondary: ["Java", "Python", "Kafka"],
      isPrimary: false,
      usedIn: [
        { name: "NovaMart", slug: "novamart-ecommerce-platform", tooltip: "Event-driven microservices architecture" },
        { name: "Healthcare Agent", slug: "healthcare-multi-agent-system", tooltip: "Multi-agent orchestration" },
        { name: "AI Code Review", slug: "ai-code-review-assistant", tooltip: "FastAPI backend + RAG pipeline" },
        { name: "Work", slug: "#experience", tooltip: "Built entire backend system from scratch" }
      ]
    },
    cloud: {
      primary: ["AWS Lambda", "Docker", "Kubernetes"],
      secondary: ["Terraform", "CI/CD", "EventBridge"],
      isPrimary: false,
      usedIn: [
        { name: "NovaMart", slug: "novamart-ecommerce-platform", tooltip: "Serverless architecture on AWS" },
        { name: "Work", slug: "#experience", tooltip: "Managed AWS infrastructure for 99.9% uptime" }
      ]
    },
    ai_ml: {
      primary: ["LangChain", "OpenAI", "RAG Pipelines"],
      secondary: ["GenAI Agents", "Vector DBs", "Hugging Face"],
      isPrimary: false,
      usedIn: [
        { name: "Healthcare Agent", slug: "healthcare-multi-agent-system", tooltip: "Multi-agent system with RAG" },
        { name: "AI Code Review", slug: "ai-code-review-assistant", tooltip: "GPT-4 + RAG for code analysis" },
        { name: "ProjectScout", slug: "project-scout-hackathon", tooltip: "AI agent for project recommendations" }
      ]
    },
    database: {
      primary: ["DynamoDB", "Firebase"],
      secondary: ["PostgreSQL", "Redis"],
      isPrimary: false,
      usedIn: [
        { name: "NovaMart", slug: "novamart-ecommerce-platform", tooltip: "DynamoDB for payments/refunds" },
        { name: "Playground App", slug: "playground-app-realtime-chat", tooltip: "Firebase Firestore for real-time data" }
      ]
    }
  },
  projects: [
    {
      id: "healthcare-agent",
      title: "Healthcare Multi-Agent System",
      category: "AI/ML",
      tech: ["Python", "FastAPI", "RAG", "Pinecone", "Multi-Agent Architecture", "LangChain"],
      summary: "End-to-end healthcare multi-agent system for symptom triage, appointment scheduling, and insurance queries with safety and human oversight.",
      results: ["Reduced triage time by 40%", "95% retrieval accuracy with RAG"],
      github: "https://github.com/nadipaca/healthcare-multi-agent",
      demo: "#",
      situation: "Healthcare facilities were experiencing significant delays in patient triage, with manual processes taking an average of 15 minutes per patient.",
      task: "Design and implement a multi-agent AI system for healthcare that handles symptom triage, appointment scheduling, and insurance questions while maintaining safety and human oversight.",
      action: "Built an end-to-end multi-agent system using Python and FastAPI, implementing RAG pipelines with Pinecone vector database for accurate medical information retrieval. Used LangChain for agent orchestration and ensured safety protocols with human-in-the-loop oversight.",
      result: "Successfully reduced manual triage time by 40%, from 15 minutes to 9 minutes per patient. Achieved 95% retrieval accuracy with the RAG pipeline, significantly improving patient flow and reducing wait times while maintaining safety standards.",
      learning: "Learned the importance of safety and human oversight in healthcare AI systems. Gained expertise in multi-agent architectures, vector databases, and RAG pipelines for accurate information retrieval in critical domains.",
      architectureDiagram: {
        title: "Multi-Agent System Architecture",
        nodes: [
          { id: "patient", label: "Patient Interface", description: "Web/Mobile", x: 50, y: 160, color: "#e0f2fe", borderColor: "#0284c7" },
          { id: "api", label: "API Gateway", description: "FastAPI", x: 220, y: 160, color: "#fef3c7", borderColor: "#d97706" },
          { id: "orchestrator", label: "Agent Orchestrator", description: "LangChain", x: 390, y: 160, color: "#ddd6fe", borderColor: "#7c3aed" },
          { id: "triage", label: "Triage Agent", description: "Symptom Analysis", x: 560, y: 80, color: "#fce7f3", borderColor: "#be185d" },
          { id: "scheduling", label: "Scheduling Agent", description: "Appointments", x: 560, y: 160, color: "#dcfce7", borderColor: "#16a34a" },
          { id: "insurance", label: "Insurance Agent", description: "Claims/Queries", x: 560, y: 240, color: "#ffe4e6", borderColor: "#e11d48" },
          { id: "rag", label: "RAG Pipeline", description: "Pinecone Vector DB", x: 390, y: 280, color: "#f3f4f6", borderColor: "#374151" },
          { id: "human", label: "Human Oversight", description: "Safety Layer", x: 220, y: 280, color: "#fed7aa", borderColor: "#ea580c" }
        ],
        connections: [
          { from: "patient", to: "api" },
          { from: "api", to: "orchestrator" },
          { from: "orchestrator", to: "triage" },
          { from: "orchestrator", to: "scheduling" },
          { from: "orchestrator", to: "insurance" },
          { from: "orchestrator", to: "rag" },
          { from: "orchestrator", to: "human" }
        ]
      }
    },
    {
      id: "novamart",
      title: "NovaMart E-Commerce Platform",
      category: "Cloud Architecture",
      tech: ["Node.js", "JavaScript", "Python", "Java", "AWS Lambda", "EventBridge", "DynamoDB", "SQS", "Event-Driven Architecture"],
      summary: "Amazon/Walmart-style commerce platform with event-driven serverless architecture, zero-trust security, idempotency, and comprehensive observability.",
      results: ["99.9%+ event processing success", "Lambda p95: ~200-500ms"],
      github: "https://github.com/nadipaca/nova_mart",
      demo: "#",
      situation: "Enterprise e-commerce platforms require high availability, scalability, and cost efficiency to handle peak traffic loads and maintain profitability.",
      task: "Design and implement a scalable e-commerce platform with event-driven architecture, zero-trust security, and serverless microservices capable of handling enterprise-level traffic.",
      action: "Architected an event-driven serverless platform using Node.js, Python, and Java. Implemented zero-trust security architecture and deployed serverless microservices on AWS Lambda. Used EventBridge for domain events, DynamoDB for data persistence with idempotency, and SQS DLQ for reliability. Established comprehensive observability with CloudWatch and X-Ray.",
      result: "Achieved 99.9%+ event processing success rate with Lambda p95 latency of ~200-500ms. Reduced infrastructure costs by 40% using serverless components. Established zero-trust security model and comprehensive observability with correlation IDs for end-to-end tracing.",
      learning: "Mastered event-driven architecture patterns and serverless microservices design. Learned the importance of idempotency, DLQ patterns for reliability, and correlation IDs for distributed tracing in cloud environments."
    },
    {
      id: "playground-app",
      title: "PlayGround Social Platform",
      category: "Mobile",
      tech: ["React Native", "Firebase", "OAuth", "Expo", "Geolocation API", "Real-time Sockets"],
      summary: "Social event and chat platform for students and communities to connect, organize, and participate in sports and social activities.",
      results: ["2k+ weekly active users", "Sub-200ms real-time latency"],
      github: "https://github.com/nadipaca/playground-app",
      demo: "https://res.cloudinary.com/dlmpwxayb/video/upload/v1766210847/Playground-App_cbwrgg.mp4",
      situation: "Students and communities needed a platform to connect, organize events, and participate in sports and social activities with real-time communication capabilities.",
      task: "Develop a real-time social mobile application with geolocation features, event organization, and chat capabilities for community engagement.",
      action: "Built a React Native mobile application with Firebase for backend services and real-time database. Implemented OAuth for secure authentication, Expo for cross-platform development, and geolocation API for location-based features. Integrated real-time socket connections for instant messaging and event updates.",
      result: "Successfully launched platform with 2,000+ weekly active users. Achieved sub-200ms latency for real-time updates, ensuring smooth user experience. Enabled community-driven event organization and social connections.",
      learning: "Gained expertise in React Native development and Firebase real-time capabilities. Learned optimization techniques for mobile applications, geolocation integration, and the importance of efficient state management in real-time mobile apps.",
      architectureDiagram: {
        title: "Mobile App Architecture",
        nodes: [
          { id: "mobile", label: "Mobile App", description: "React Native (iOS/Android)", x: 50, y: 160, color: "#e0f2fe", borderColor: "#0284c7" },
          { id: "auth", label: "Firebase Auth", description: "OAuth & Email/Password", x: 220, y: 80, color: "#fef3c7", borderColor: "#d97706" },
          { id: "firestore", label: "Firestore DB", description: "Real-time Database", x: 220, y: 160, color: "#dcfce7", borderColor: "#16a34a" },
          { id: "storage", label: "Firebase Storage", description: "Media Files", x: 220, y: 240, color: "#fce7f3", borderColor: "#be185d" },
          { id: "geolocation", label: "Geolocation API", description: "Map & Location", x: 390, y: 160, color: "#ddd6fe", borderColor: "#7c3aed" },
          { id: "realtime", label: "Real-time Listeners", description: "Chat & Events", x: 560, y: 160, color: "#ffe4e6", borderColor: "#e11d48" }
        ],
        connections: [
          { from: "mobile", to: "auth" },
          { from: "mobile", to: "firestore" },
          { from: "mobile", to: "storage" },
          { from: "mobile", to: "geolocation" },
          { from: "firestore", to: "realtime" }
        ]
      }
    },
    {
      id: "naruto-infinite-list",
      title: "Naruto Infinite List",
      category: "Web",
      tech: ["React", "JavaScript", "API Integration", "Infinite Scroll", "Vercel"],
      summary: "Interactive web application showcasing Naruto characters with infinite scrolling, real-time API integration, and optimized rendering performance.",
      results: ["Smooth infinite scroll performance", "Real-time character data fetching"],
      github: "https://github.com/nadipaca/Naruto-Infinite-List",
      demo: "https://naruto-infinite-list.vercel.app/",
      situation: "Developed an interactive web application to display Naruto character data with seamless infinite scrolling and real-time API integration for an optimal user experience.",
      task: "Build a responsive web application with infinite scroll capabilities, efficient data fetching, and smooth user interactions for browsing Naruto character information.",
      action: "Built a React application with infinite scrolling functionality, integrated with external APIs for character data, and deployed on Vercel. Implemented optimized rendering techniques to handle large datasets efficiently.",
      result: "Successfully created a performant web application with smooth infinite scroll, real-time data fetching, and fast load times. Deployed on Vercel for optimal performance and accessibility.",
      learning: "Gained expertise in infinite scroll implementation, API integration, and performance optimization techniques for handling large datasets in React applications."
    },
  ],
  experience: [
    {
      id: "macys-map-central",
      type: "architectural", // Uses Problem/Solution/Metrics layout
      company: "ITSC (Macy's Project)",
      role: "Software Engineer",
      period: "OCT 2024 - AUG 2025",
      summary: "High-performance 'Backend-for-Frontend' (BFF) for store floor-plan management.",
      problem: "Synchronous processing of 'Change Requests' caused UI timeouts (800ms+), and client-side token handling posed security risks.",
      solution: "Architected a Node.js BFF with Redis (BullMQ) for async event queues and a Proxy Middleware pattern to secure legacy Spring Boot tokens.",
      impact_metrics: [
        { label: "API Latency", value: "800ms → <100ms" },
        { label: "PDF Gen Time", value: "20min → 5sec" },
        { label: "Security", value: "Zero Token Leaks" }
      ],
      tech_stack_flow: ["Vue.js", "Node.js (BFF)", "Redis (Bull)", "Spring Boot", "Autodesk Forge"]
    },
    {
      id: "mcesc-platform",
      type: "visual", // Uses Image Carousel layout
      company: "ITSC (MCESC Project)",
      role: "Full Stack Developer",
      period: "AUG 2025 - Dec 2025",
      summary: "Modular Monolith platform modernizing educational therapy documentation.",
      gallery: [
        { 
          src: "https://res.cloudinary.com/dlmpwxayb/image/upload/v1766972652/MCESC-Admin_dashboard_p2y6ph.png", 
          caption: "Admin Dashboard with comprehensive overview",
          metrics: [
            { label: "Data Points", value: "10k+" },
            { label: "Load Time", value: "<1s" },
            { label: "Users", value: "500+" }
          ],
        },
        { 
          src: "https://res.cloudinary.com/dlmpwxayb/image/upload/v1766972655/student-history_dkxov5.png", 
          caption: "Student History View (Aggregating 10k+ records)",
          metrics: [
            { label: "Records", value: "10k+" },
            { label: "Query Time", value: "200ms" },
            { label: "Cache Hit", value: "95%" }
          ],
        },
        { 
          src: "https://res.cloudinary.com/dlmpwxayb/image/upload/v1766972665/MCESC-Create_Note_Form_h2wtcf.png", 
          caption: "Optimistic UI 'Add Note' Forms with validation",
          metrics: [
            { label: "Validation", value: "Zod" },
            { label: "Response", value: "Instant" },
            { label: "Offline", value: "Yes" }
          ],
        },
        { 
          src: "https://res.cloudinary.com/dlmpwxayb/image/upload/v1766972667/MCESC-district-profile_vz5ds3.png", 
          caption: "District Profile Management",
          metrics: [
            { label: "Districts", value: "50+" },
            { label: "Data Sync", value: "Real-time" },
            { label: "Uptime", value: "99.9%" }
          ],
        },
        { 
          src: "https://res.cloudinary.com/dlmpwxayb/image/upload/v1766972648/District-provider-view_dkmrjb.png", 
          caption: "District Provider View",
          metrics: [
            { label: "Providers", value: "200+" },
            { label: "Search", value: "Instant" },
            { label: "Filter", value: "Multi-criteria" }
          ],
        },
        { 
          src: "https://res.cloudinary.com/dlmpwxayb/image/upload/v1766972660/MCESC-Referral_lju530.png", 
          caption: "Referral Management System",
          metrics: [
            { label: "Referrals", value: "5k+/month" },
            { label: "Processing", value: "Automated" },
            { label: "Tracking", value: "100%" }
          ],
        },
        { 
          src: "https://res.cloudinary.com/dlmpwxayb/image/upload/v1766972660/MCESC-Referral_lju530.png", 
          caption: "Referral Status Tracking",
          metrics: [
            { label: "Statuses", value: "Real-time" },
            { label: "Updates", value: "Instant" },
            { label: "Accuracy", value: "100%" }
          ],
        },
        { 
          src: "https://res.cloudinary.com/dlmpwxayb/image/upload/v1766972662/MonthlyView_bwgqck.png", 
          caption: "Monthly Calendar View",
          metrics: [
            { label: "Appointments", value: "1k+/month" },
            { label: "Views", value: "Calendar/List" },
            { label: "Performance", value: "Optimized" }
          ],
        }
      ],
      features: [
        "Architected modular monolith migrating from legacy system, reducing technical debt by 60% and improving maintainability.",
        "Implemented server-side aggregation for 10k+ student records, reducing frontend load time from 8s to <1s with strategic caching layers.",
        "Designed and built scalable form engine supporting 50+ dynamic form types with offline sync capabilities for field therapists.",
        "Established shared TypeScript contracts between frontend and backend, eliminating type mismatches and reducing API integration bugs by 80%."
      ]
    },
    {
      id: "usbank",
      type: "architectural",
      company: "U.S. Bank",
      role: "Software Engineer",
      period: "Jul 2019 - Jul 2024",
      summary: "Fidelity Services: Transaction Disputes & Fraud Claims.",
      problem: "Legacy dispute processing faced high latency during fraud spikes, affecting customer MTTR.",
      solution: "Engineered robust Spring Boot microservices for real-time fraud validation and secure transaction history retrieval.",
      impact_metrics: [
        { label: "Throughput", value: "+35%" },
        { label: "Dispute MTTR", value: "-45%" },
        { label: "Uptime", value: "99.99%" }
      ],
      tech_stack_flow: ["React", "Java Spring Boot", "Oracle DB", "Fidelity APIs"]
    }
  ]
};
