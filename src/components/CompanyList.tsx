import type { WorkExperience } from "../services/workExperienceApi";

interface CompanyListProps {
  workExperiences: WorkExperience[];
  activeExperienceId: string | null;
  isTransitioning: boolean;
  onExperienceSelect: (experienceId: string) => void;
  isMobile?: boolean;
}

export const CompanyList = ({
  workExperiences,
  activeExperienceId,
  isTransitioning,
  onExperienceSelect,
  isMobile = false
}: CompanyListProps): React.JSX.Element => {
  const containerClass = isMobile 
    ? "flex gap-2 overflow-x-auto pb-2" 
    : "space-y-1 sm:space-y-2";
  
  const buttonClass = isMobile
    ? "flex-shrink-0 text-left px-3 py-2 rounded-lg transition-all duration-200"
    : "w-full text-left px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 rounded-lg transition-all duration-200";
  
  const companyNameClass = isMobile
    ? "font-medium text-xs"
    : "font-medium text-xs sm:text-sm lg:text-base";
    
  const jobTitleClass = isMobile
    ? "text-xs opacity-75"
    : "text-xs sm:text-sm opacity-75";

  return (
    <div className={isMobile ? "mb-4" : ""}>
      <div className={containerClass}>
        {workExperiences.map((experience) => (
          <button
            key={experience.id}
            onClick={() => onExperienceSelect(experience.id)}
            disabled={isTransitioning}
            className={`${buttonClass} ${
              activeExperienceId === experience.id
                ? 'bg-blue-500 text-white shadow-lg'
                : isTransitioning
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <div className={companyNameClass}>{experience.companyName}</div>
            <div className={jobTitleClass}>{experience.jobTitle}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
