export const portfolioData = {
  profile: {
    name: "Charishma Nadipalli",
    role: "Senior Java Software Engineer",
    bio: "Full Stack Engineer transforming complex requirements into scalable microservices and AI-driven solutions. Specializing in Spring Boot, AWS, and Agentic AI workflows.",
    experience_years: "5+",
    availability: "Available for Full-Time Opportunities",
    socials: {
      github: "https://github.com/nadipaca",
      linkedin: "https://linkedin.com/in/charishma-nadipalli",
      email: "nadipaca@mail.uc.edu"
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
  skills: {
    backend: ["Java (8+)", "Spring Boot", "Node.js", "FastAPI", "Microservices", "Kafka"],
    cloud: ["AWS (EC2, EKS, S3)", "Docker", "Kubernetes", "Terraform", "CI/CD"],
    frontend: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    ai_ml: ["GenAI Agents", "RAG Pipelines", "Vector DBs", "LangChain", "Vertex AI"]
  },
  projects: [
    {
      id: "healthcare-agent",
      title: "Healthcare Q&A Agent System",
      category: "AI/ML",
      tech: ["Gemini 2.5 Flash", "FastAPI", "GKE", "Pinecone"],
      summary: "Multi-agent AI system reducing triage time by 40% using vector search and HIPAA-compliant workflows.",
      results: ["Reduced manual triage time by 40%", "95% retrieval accuracy with RAG"],
      github: "#",
      demo: "#",
      situation: "Healthcare facilities were experiencing significant delays in patient triage, with manual processes taking an average of 15 minutes per patient.",
      task: "Design and implement an AI-powered Q&A system that could reduce triage time while maintaining HIPAA compliance and ensuring accurate medical information retrieval.",
      action: "Built a multi-agent AI system using Gemini 2.5 Flash for natural language understanding, FastAPI for the backend API, Google Kubernetes Engine (GKE) for scalable deployment, and Pinecone for vector database storage. Implemented RAG (Retrieval-Augmented Generation) pipelines to ensure accurate medical information retrieval.",
      result: "Successfully reduced manual triage time by 40%, from 15 minutes to 9 minutes per patient. Achieved 95% retrieval accuracy with the RAG pipeline, significantly improving patient flow and reducing wait times.",
      learning: "Learned the importance of HIPAA compliance in healthcare AI systems and the critical role of vector databases in ensuring accurate information retrieval. Gained expertise in multi-agent architectures and their application in healthcare workflows."
    },
    {
      id: "playground-app",
      title: "PlayGround App",
      category: "Mobile",
      tech: ["React Native", "Firebase", "Real-time Socket", "OAuth"],
      summary: "Real-time social mobile app handling concurrent connections with sub-200ms latency for 2k+ weekly users.",
      results: ["30% faster UI rendering", "Sub-200ms image uploads"],
      github: "#",
      demo: "#",
      situation: "Social mobile apps require real-time updates and low latency to maintain user engagement, especially with concurrent user interactions.",
      task: "Develop a real-time social mobile application capable of handling thousands of concurrent users with minimal latency, ensuring smooth user experience and fast image uploads.",
      action: "Built a React Native mobile application with Firebase for backend services, implemented real-time socket connections for instant messaging and updates, and integrated OAuth for secure authentication. Optimized image uploads and UI rendering performance.",
      result: "Achieved 30% faster UI rendering compared to initial implementation. Image uploads completed in under 200ms, significantly improving user experience. Successfully handled 2,000+ weekly active users with consistent performance.",
      learning: "Gained deep understanding of real-time systems architecture and the challenges of maintaining low latency at scale. Learned optimization techniques for mobile applications and the importance of efficient state management in React Native."
    },
    {
      id: "novamart",
      title: "NovaMart Platform",
      category: "Cloud Architecture",
      tech: ["Spring Boot", "AWS EKS", "Terraform", "Kafka"],
      summary: "Enterprise e-commerce microservices architecture handling high-volume transactions with 99.99% uptime.",
      results: ["Infrastructure as Code (IaC) implementation", "40% cost reduction via Serverless"],
      github: "#",
      demo: "#",
      situation: "Enterprise e-commerce platforms require high availability, scalability, and cost efficiency to handle peak traffic loads and maintain profitability.",
      task: "Design and implement a microservices-based e-commerce platform with high availability (99.99% uptime), scalable architecture, and cost-effective infrastructure using cloud-native technologies.",
      action: "Architected a microservices system using Spring Boot for service development, deployed on AWS EKS (Elastic Kubernetes Service) for container orchestration. Implemented Infrastructure as Code using Terraform for reproducible deployments. Integrated Apache Kafka for event-driven architecture and asynchronous processing.",
      result: "Successfully achieved 99.99% uptime through robust microservices architecture and Kubernetes orchestration. Reduced infrastructure costs by 40% by implementing serverless components where appropriate. Established IaC practices enabling rapid scaling and deployment.",
      learning: "Mastered microservices architecture patterns and Kubernetes orchestration. Learned the importance of Infrastructure as Code for maintaining consistency and reducing deployment errors. Gained expertise in event-driven architectures using Kafka and cost optimization strategies in cloud environments."
    }
  ],
  experience: [
    {
      id: "macys-map-central",
      type: "architectural", // Uses Problem/Solution/Metrics layout
      company: "ITSC (Macy's Project)",
      role: "Technical Lead (Node.js)",
      period: "Dec 2024 - Present",
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
      period: "May 2025 - Dec 2025",
      summary: "Modular Monolith platform modernizing educational therapy documentation.",
      gallery: [
        // Placeholder paths - I will replace with real files
        { src: "/images/mcesc-dashboard.png", caption: "Therapist Dashboard with TanStack Query Caching" },
        { src: "/images/mcesc-history.png", caption: "Student History View (Aggregating 10k+ records)" },
        { src: "/images/mcesc-forms.png", caption: "Optimistic UI 'Add Note' Forms" }
      ],
      features: [
        "Strict TypeScript Monorepo with shared DTOs/Types between React & Node.",
        "Optimistic UI updates using TanStack Query for instant feedback.",
        "Complex CQRS-style use cases decoupled via InversifyJS.",
        "Offline-capable forms using ShadCN and Zod validation."
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

