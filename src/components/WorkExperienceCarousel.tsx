import { WorkExperienceCard } from "./WorkExperienceCard";
import type { WorkExperience } from "../services/workExperienceApi";

interface WorkExperienceCarouselProps {
  workExperiences: WorkExperience[];
  activeExperienceId: string | null;
  isTransitioning: boolean;
  onCardClick: (experienceId: string) => void;
  isMobile?: boolean;
}

export const WorkExperienceCarousel = ({
  workExperiences,
  activeExperienceId,
  isTransitioning,
  onCardClick,
  isMobile = false
}: WorkExperienceCarouselProps): React.JSX.Element => {
  const containerHeight = isMobile 
    ? "h-[calc(100vh-12rem)]" 
    : "h-full";
  
  const containerPadding = isMobile 
    ? "" 
    : "pr-1 sm:pr-2 lg:pr-4 pl-1 sm:pl-2 lg:pl-4 py-2 sm:py-3 lg:py-4";

  if (workExperiences.length === 0) {
    return (
      <div className={`${containerHeight} relative overflow-hidden`}>
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg">No work experience data available yet.</p>
          <p className="text-slate-500 text-sm mt-2">Add some work experience through the backend API to see it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerHeight} ${isMobile ? 'relative overflow-hidden' : 'relative overflow-hidden'}`}>
      <div className={`${containerHeight} ${containerPadding}`}>
        {workExperiences.map((experience, index) => {
          const activeIndex = workExperiences.findIndex(exp => exp.id === activeExperienceId);
          const isActive = experience.id === activeExperienceId;
          const isPrevious = index === activeIndex - 1;
          const isNext = index === activeIndex + 1;
          const isVisible = isActive || isPrevious || isNext;
          
          let positionClass = '';
          let opacityClass = '';
          let scaleClass = '';
          let zIndexClass = '';
          
          if (isActive) {
            positionClass = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
            opacityClass = 'opacity-100';
            scaleClass = 'scale-100';
            zIndexClass = 'z-30';
          } else if (isPrevious) {
            positionClass = 'absolute top-[15%] left-1/2 transform -translate-x-1/2 -translate-y-1/2';
            opacityClass = 'opacity-30';
            scaleClass = 'scale-90';
            zIndexClass = 'z-20';
          } else if (isNext) {
            positionClass = 'absolute top-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2';
            opacityClass = 'opacity-30';
            scaleClass = 'scale-90';
            zIndexClass = 'z-20';
          } else {
            positionClass = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
            opacityClass = 'opacity-0';
            scaleClass = 'scale-95';
            zIndexClass = 'z-10';
          }
          
          return (
            <WorkExperienceCard
              key={experience.id}
              experience={experience}
              isActive={isActive}
              isPrevious={isPrevious}
              isNext={isNext}
              isVisible={isVisible}
              isTransitioning={isTransitioning}
              positionClass={positionClass}
              opacityClass={opacityClass}
              scaleClass={scaleClass}
              zIndexClass={zIndexClass}
              onCardClick={() => {
                if ((isPrevious || isNext) && !isTransitioning) {
                  onCardClick(experience.id);
                }
              }}
              isMobile={isMobile}
            />
          );
        })}
      </div>
    </div>
  );
};
