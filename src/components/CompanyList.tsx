import type { WorkExperience } from "../services/workExperienceApi";
import { useState } from "react";

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
  const [clickedItemId, setClickedItemId] = useState<string | null>(null);
  
  const handleClick = (experienceId: string) => {
    if (!isTransitioning) {
      setClickedItemId(experienceId);
      onExperienceSelect(experienceId);
      
      // Reset the flash after animation completes
      setTimeout(() => {
        setClickedItemId(null);
      }, 600);
    }
  };
  
  const containerClass = isMobile 
    ? "flex gap-4 overflow-x-auto pb-4" 
    : "";
  
  const shelfItemClass = isMobile
    ? "flex-shrink-0 relative group cursor-pointer transition-all duration-300"
    : "relative group cursor-pointer transition-all duration-300";
  
  const companyNameClass = isMobile
    ? "font-medium text-sm text-slate-800 dark:text-slate-200 transition-colors duration-300"
    : "font-medium text-base sm:text-lg lg:text-xl text-slate-800 dark:text-slate-200 transition-colors duration-300";
    
  const jobTitleClass = isMobile
    ? "text-xs text-slate-600 dark:text-slate-400 transition-colors duration-300"
    : "text-sm sm:text-base text-slate-600 dark:text-slate-400 transition-colors duration-300";

  return (
    <div className={isMobile ? "mb-4" : ""}>
      <style jsx>{`
        @keyframes expandHorizontal {
          0% {
            width: 0%;
            opacity: 1;
          }
          38% {
            width: 100%;
            opacity: 1;
          }
          50% {
            width: 100%;
            opacity: 1;
          }
          100% {
            width: 100%;
            opacity: 0;
          }
        }
      `}</style>
      <div className={containerClass}>
        {workExperiences.map((experience, index) => {
          const isActive = activeExperienceId === experience.id;
          
          return (
            <div
              key={experience.id}
              onClick={() => handleClick(experience.id)}
              className={`${shelfItemClass} ${
                isTransitioning ? 'cursor-not-allowed' : ''
              }`}
            >
              {/* Floating shelf with light effect */}
              <div className="relative">
                {/* Bottom border shelf */}
                <div className={`absolute bottom-0 left-0 right-0 h-px ${
                  isActive 
                    ? 'bg-purple-400/60 dark:bg-purple-400/70' 
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}></div>
                
                {/* Click flash animation - expands horizontally from center */}
                {clickedItemId === experience.id && (
                  <div 
                    className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 bg-purple-400/20"
                    style={{
                      width: '0%',
                      animation: 'expandHorizontal 0.8s ease-out forwards'
                    }}
                  ></div>
                )}
                
                {/* Text content */}
                <div className={`relative z-10 text-left ${
                  isActive 
                    ? 'text-purple-600 dark:text-purple-400' 
                    : 'group-hover:text-slate-900 dark:group-hover:text-slate-100'
                }`} style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem', paddingLeft: '0.5rem' }}>
                  {/* Bullet point indicator - positioned absolutely to not affect text layout */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full -ml-3"></div>
                  )}
                  <div className={companyNameClass}>{experience.companyName}</div>
                </div>
                
                {/* Subtle hover effect */}
                {!isActive && !isTransitioning && (
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-200/50 dark:via-slate-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
