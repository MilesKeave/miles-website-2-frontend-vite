import { BentoGrid } from "./ui/bento-grid";
import { CardSpotlight } from "./ui/card-spotlight";
import { ProjectPopup } from "./ui/project-popup";
import { IconCode, IconDatabase, IconGlobe, IconDeviceMobile, IconRobot, IconBrandGithub, IconBrandYoutube } from "@tabler/icons-react";
import { useProjects } from "../hooks/useProjects";
import { useState } from "react";
import type { Project } from "../services/projectApi";

// Icon mapping for different project categories (based on project name or content)
const getCategoryIcon = (projectName: string) => {
  const name = projectName.toLowerCase();
  if (name.includes('mobile') || name.includes('app')) {
    return <IconDeviceMobile className="h-4 w-4" />;
  } else if (name.includes('ai') || name.includes('ml') || name.includes('chat')) {
    return <IconRobot className="h-4 w-4" />;
  } else if (name.includes('data') || name.includes('dashboard') || name.includes('analytics')) {
    return <IconDatabase className="h-4 w-4" />;
  } else if (name.includes('blockchain') || name.includes('crypto') || name.includes('web3')) {
    return <IconGlobe className="h-4 w-4" />;
  } else {
    return <IconCode className="h-4 w-4" />;
  }
};

export const ProjectsPage = (): React.JSX.Element => {
  const { projects, loading, error, refreshProjects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleClosePopup = () => {
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="projects-page min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-4">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              My Projects
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Loading projects...
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-slate-100"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-page min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-4">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              My Projects
            </h1>
            <p className="text-lg text-red-600 dark:text-red-400 max-w-2xl mx-auto">
              Error loading projects: {error}
            </p>
            <button
              onClick={refreshProjects}
              className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            My Projects
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A collection of projects showcasing my skills in full-stack development.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              No projects found. Projects will appear here once they're added to the database.
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Scrollable container for projects */}
            <div 
              className="max-h-[65vh] md:max-h-[70vh] lg:max-h-[75vh] xl:h-[39rem] overflow-y-auto overflow-x-hidden pr-4 pl-4 projects-scrollbar" 
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#64748b #1e293b', overscrollBehavior: 'contain' }}
            >
              <BentoGrid className="max-w-7xl mx-auto pb-8 pt-6">
                {projects.map((project, index) => (
                  <CardSpotlight
                    key={project.id}
                    className={`h-full flex flex-col cursor-pointer hover:scale-[1.02] transition-transform duration-200 p-0 ${index === 0 ? "md:col-span-2" : ""}`}
                    onClick={() => handleProjectClick(project)}
                  >
                    {/* Image section */}
                    <div className="relative h-3/4 w-full overflow-hidden rounded-lg pt-8 px-8">
                      {project.projectImageUrl ? (
                        <img
                          src={project.projectImageUrl}
                          alt={project.projectName}
                          className="h-full w-full object-cover rounded-lg select-none pointer-events-none"
                          draggable={false}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center rounded-lg">
                          <div className="text-4xl text-slate-500 dark:text-slate-400">
                            {getCategoryIcon(project.projectName)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Title section */}
                    <div className="flex-1 flex items-center justify-center px-4 relative z-10">
                      <h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg text-center">
                        {project.projectName}
                      </h3>
                    </div>
                  </CardSpotlight>
                ))}
              </BentoGrid>
            </div>
          </div>
        )}
      </div>

      {/* Project Popup */}
      {selectedProject && (
        <ProjectPopup
          project={selectedProject}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};
