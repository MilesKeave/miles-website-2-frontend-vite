import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { IconCode, IconDatabase, IconGlobe, IconDeviceMobile, IconRobot } from "@tabler/icons-react";

// Project interface for future backend integration
interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  category: string;
}

// Fake project data - will be replaced with API call in the future
const fakeProjects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.",
    imageUrl: "/api/placeholder/400/300",
    githubUrl: "https://github.com/username/ecommerce-platform",
    liveUrl: "https://ecommerce-demo.com",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
    category: "Full Stack"
  },
  {
    id: "2",
    title: "AI Chat Assistant",
    description: "An intelligent chatbot powered by OpenAI's GPT API with custom training data and real-time conversation capabilities.",
    imageUrl: "/api/placeholder/400/300",
    githubUrl: "https://github.com/username/ai-chat-assistant",
    liveUrl: "https://ai-chat-demo.com",
    technologies: ["Python", "OpenAI API", "FastAPI", "WebSocket"],
    category: "AI/ML"
  },
  {
    id: "3",
    title: "Mobile Task Manager",
    description: "A cross-platform mobile app for task management with offline support, push notifications, and team collaboration features.",
    imageUrl: "/api/placeholder/400/300",
    githubUrl: "https://github.com/username/task-manager-mobile",
    liveUrl: "https://apps.apple.com/task-manager",
    technologies: ["React Native", "Firebase", "Redux", "Expo"],
    category: "Mobile"
  },
  {
    id: "4",
    title: "Data Visualization Dashboard",
    description: "Interactive dashboard for analyzing business metrics with real-time data updates, custom charts, and export functionality.",
    imageUrl: "/api/placeholder/400/300",
    githubUrl: "https://github.com/username/data-dashboard",
    liveUrl: "https://dashboard-demo.com",
    technologies: ["D3.js", "React", "Python", "MongoDB"],
    category: "Data Visualization"
  },
  {
    id: "5",
    title: "Blockchain Voting System",
    description: "A secure voting platform built on blockchain technology ensuring transparency, immutability, and voter anonymity.",
    imageUrl: "/api/placeholder/400/300",
    githubUrl: "https://github.com/username/blockchain-voting",
    liveUrl: "https://voting-demo.com",
    technologies: ["Solidity", "Web3.js", "React", "Ethereum"],
    category: "Blockchain"
  }
];

// Icon mapping for different project categories
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Full Stack":
      return <IconCode className="h-4 w-4" />;
    case "AI/ML":
      return <IconRobot className="h-4 w-4" />;
    case "Mobile":
      return <IconDeviceMobile className="h-4 w-4" />;
    case "Data Visualization":
      return <IconDatabase className="h-4 w-4" />;
    case "Blockchain":
      return <IconGlobe className="h-4 w-4" />;
    default:
      return <IconCode className="h-4 w-4" />;
  }
};

export const ProjectsPage = (): React.JSX.Element => {
  return (
    <div className="projects-page min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            My Projects
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A collection of projects showcasing my skills in full-stack development, 
            AI/ML, mobile development, and emerging technologies.
          </p>
        </div>

        <BentoGrid className="max-w-7xl mx-auto">
          {fakeProjects.map((project, index) => (
            <BentoGridItem
              key={project.id}
              title={project.title}
              description={project.description}
              header={
                <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-4xl text-slate-500 dark:text-slate-400">
                        {getCategoryIcon(project.category)}
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
                      {project.category}
                    </span>
                  </div>
                </div>
              }
              icon={
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  {getCategoryIcon(project.category)}
                  <span className="text-xs">{project.category}</span>
                </div>
              }
              className={index === 0 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>

        {/* Future: This section will be populated with actual project links */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            More projects coming soon... 
            <span className="block mt-2">
              (This will be populated from a backend API in the future)
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
