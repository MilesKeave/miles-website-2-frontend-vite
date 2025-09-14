import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { CardSpotlight } from "./ui/card-spotlight";
import { IconCode, IconDatabase, IconGlobe, IconDeviceMobile, IconRobot, IconBrandGithub, IconBrandYoutube } from "@tabler/icons-react";
import { useProjects } from "../hooks/useProjects";

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

  if (loading) {
    return (
      <div className="projects-page min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
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
          <div className="text-center mb-16">
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
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            My Projects
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A collection of projects showcasing my skills in full-stack development, 
            AI/ML, mobile development, and emerging technologies.
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
            <div className="h-[39rem] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-500">
              <BentoGrid className="max-w-7xl mx-auto pb-8">
                {projects.map((project, index) => (
                  <CardSpotlight
                    key={project.id}
                    className={`h-full flex flex-col justify-between space-y-4 ${index === 0 ? "md:col-span-2" : ""}`}
                  >
                    {/* Header with image */}
                    <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
                      {project.projectImageUrl ? (
                        <img
                          src={project.projectImageUrl}
                          alt={project.projectName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <div className="text-4xl text-slate-500 dark:text-slate-400">
                            {getCategoryIcon(project.projectName)}
                          </div>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                            title="View on GitHub"
                          >
                            <IconBrandGithub className="h-3 w-3 text-slate-700" />
                          </a>
                        )}
                        {project.youtubeLink && (
                          <a
                            href={project.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                            title="Watch on YouTube"
                          >
                            <IconBrandYoutube className="h-3 w-3 text-slate-700" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="transition duration-200 group-hover:translate-x-2 relative z-20">
                      <div className="flex items-center gap-2 text-neutral-300 mb-2">
                        {getCategoryIcon(project.projectName)}
                        <span className="text-xs">Project</span>
                      </div>
                      <div className="mt-2 mb-2 font-sans font-bold text-white">
                        {project.projectName}
                      </div>
                      <div className="font-sans text-xs font-normal text-neutral-200">
                        {project.paragraph}
                      </div>
                    </div>
                  </CardSpotlight>
                ))}
              </BentoGrid>
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {projects.length} project{projects.length !== 1 ? 's' : ''} loaded from database
          </p>
        </div>
      </div>
    </div>
  );
};
