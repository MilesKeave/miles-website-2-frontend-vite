import { useWorkExperience } from "../hooks/useWorkExperience";
import { useState, useEffect, useCallback } from "react";
import { WorkExperienceHeader } from "./WorkExperienceHeader";
import { CompanyList } from "./CompanyList";
import { WorkExperienceCarousel } from "./WorkExperienceCarousel";
import { sortWorkExperiencesByDate } from "../utils/workExperienceUtils";

export const WorkExperiencePage = (): React.JSX.Element => {
  const { workExperiences, loading, error } = useWorkExperience();
  const [activeExperienceId, setActiveExperienceId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sort work experiences by start date (most recent first)
  const sortedWorkExperiences = sortWorkExperiencesByDate(workExperiences);

  // Set initial active experience to the first one (most recent)
  useEffect(() => {
    if (sortedWorkExperiences.length > 0 && !activeExperienceId) {
      setActiveExperienceId(sortedWorkExperiences[0].id);
    }
  }, [sortedWorkExperiences, activeExperienceId]);

  // Set active experience with sliding animation
  const setActiveExperience = useCallback((targetExperienceId: string) => {
    if (isTransitioning || targetExperienceId === activeExperienceId) return;
    
    const currentIndex = sortedWorkExperiences.findIndex(exp => exp.id === activeExperienceId);
    const targetIndex = sortedWorkExperiences.findIndex(exp => exp.id === targetExperienceId);
    
    if (currentIndex === -1 || targetIndex === -1) return;
    
    setIsTransitioning(true);
    
    // Calculate the direction and number of steps
    const direction = targetIndex > currentIndex ? 1 : -1;
    const steps = Math.abs(targetIndex - currentIndex);
    
    // Animate through each step
    let currentStep = 0;
    const animateStep = () => {
      if (currentStep < steps) {
        const nextIndex = currentIndex + (direction * (currentStep + 1));
        const nextExperienceId = sortedWorkExperiences[nextIndex]?.id;
        
        if (nextExperienceId) {
          setActiveExperienceId(nextExperienceId);
          currentStep++;
          setTimeout(animateStep, 600); // 600ms delay between each step for more noticeable pitstops (CSS transition is 500ms)
        } else {
          setIsTransitioning(false);
        }
      } else {
        setIsTransitioning(false);
      }
    };
    
    animateStep();
  }, [activeExperienceId, sortedWorkExperiences, isTransitioning]);

  // Loading state
  if (loading) {
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
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
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
            <div className="text-center">
              <p className="text-red-400 mb-4">Error loading work experience: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="work-experience-page min-h-screen">
        <div className="container mx-auto px-1 sm:px-2 py-4 sm:py-8 lg:py-12">
          {/* Mobile Layout - Stacked */}
          <div className="block sm:hidden">
            <WorkExperienceHeader isMobile={true} />
            <CompanyList 
              workExperiences={sortedWorkExperiences}
              activeExperienceId={activeExperienceId}
              isTransitioning={isTransitioning}
              onExperienceSelect={setActiveExperience}
              isMobile={true}
            />
            <WorkExperienceCarousel
              workExperiences={sortedWorkExperiences}
              activeExperienceId={activeExperienceId}
              isTransitioning={isTransitioning}
              onCardClick={setActiveExperience}
              isMobile={true}
            />
          </div>

          {/* Desktop Layout - Side by Side */}
          <div className="hidden sm:flex gap-4 sm:gap-6 lg:gap-8 h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] lg:h-[calc(100vh-12rem)]">
            {/* Left Side - Title and Company List */}
            <div className="w-64 sm:w-80 lg:w-96 flex-shrink-0 flex flex-col justify-center">
              <WorkExperienceHeader isMobile={false} />
              <CompanyList 
                workExperiences={sortedWorkExperiences}
                activeExperienceId={activeExperienceId}
                isTransitioning={isTransitioning}
                onExperienceSelect={setActiveExperience}
                isMobile={false}
              />
            </div>

            {/* Right Side - Work experience carousel container */}
            <div className="flex-1">
              <WorkExperienceCarousel
                workExperiences={sortedWorkExperiences}
                activeExperienceId={activeExperienceId}
                isTransitioning={isTransitioning}
                onCardClick={setActiveExperience}
                isMobile={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};