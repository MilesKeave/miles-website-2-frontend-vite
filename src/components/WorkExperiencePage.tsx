import { IconBriefcase, IconCalendar, IconMapPin, IconBuilding } from "@tabler/icons-react";

export const WorkExperiencePage = (): React.JSX.Element => {
  // Sample work experience data - you can replace this with real data later
  const workExperiences = [
    {
      id: 1,
      company: "Tech Company Inc.",
      position: "Software Engineer",
      location: "San Francisco, CA",
      duration: "2022 - Present",
      description: "Developed full-stack applications using React, Node.js, and cloud technologies. Led a team of 3 developers and delivered 5+ major features.",
      technologies: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"]
    },
    {
      id: 2,
      company: "StartupXYZ",
      position: "Frontend Developer",
      location: "Remote",
      duration: "2021 - 2022",
      description: "Built responsive web applications and mobile interfaces. Collaborated with design team to implement pixel-perfect UI components.",
      technologies: ["React", "Vue.js", "CSS3", "Figma", "Jest"]
    },
    {
      id: 3,
      company: "Digital Agency",
      position: "Junior Developer",
      location: "New York, NY",
      duration: "2020 - 2021",
      description: "Worked on various client projects including e-commerce platforms and corporate websites. Gained experience in agile development practices.",
      technologies: ["JavaScript", "HTML5", "CSS3", "PHP", "MySQL"]
    }
  ];

  return (
    <div className="work-experience-page min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Work Experience
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            My professional journey in software development and technology.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Scrollable container for work experiences */}
          <div className="h-[39rem] overflow-y-auto overflow-x-hidden pr-4 pl-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#64748b transparent' }}>
            <div className="space-y-8 pb-8 pt-6">
              {workExperiences.map((experience, index) => (
                <div
                  key={experience.id}
                  className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-xl">
                        <IconBriefcase className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {experience.position}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-300">
                          <IconBuilding className="h-4 w-4" />
                          <span className="font-medium">{experience.company}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-slate-400 mb-1">
                        <IconCalendar className="h-4 w-4" />
                        <span className="text-sm">{experience.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <IconMapPin className="h-4 w-4" />
                        <span className="text-sm">{experience.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    {experience.description}
                  </p>

                  {/* Technologies */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-white/10 text-white text-sm rounded-full border border-white/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Timeline indicator */}
                  {index < workExperiences.length - 1 && (
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-black border-2 border-white/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {workExperiences.length} position{workExperiences.length !== 1 ? 's' : ''} of experience
          </p>
        </div>
      </div>
    </div>
  );
};
