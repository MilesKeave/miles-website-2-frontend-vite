"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import type { WorkExperience } from "../services/workExperienceApi";
import { WorkExperienceCard } from "./WorkExperienceCard";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface VerticalWorkExperienceCarouselProps {
  workExperiences: WorkExperience[];
  activeExperienceId: string | null;
  isTransitioning: boolean;
  onCardClick: (experienceId: string) => void;
  isMobile?: boolean;
}

export const VerticalWorkExperienceCarousel = ({
  workExperiences,
  activeExperienceId,
  isTransitioning,
  onCardClick,
  isMobile = false
}: VerticalWorkExperienceCarouselProps): React.JSX.Element => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visualIndex, setVisualIndex] = useState(0); // For visual effects only
  const scrollTimeoutRef = useRef<number | null>(null);

  const containerHeight = isMobile 
    ? "h-[calc(100vh-12rem)]" 
    : "h-full";
  
  const containerPadding = isMobile 
    ? "" 
    : "pr-1 sm:pr-2 lg:pr-4 pl-1 sm:pl-2 lg:pl-4 py-2 sm:py-3 lg:py-4";


  // Update current index when activeExperienceId changes
  useEffect(() => {
    const newIndex = workExperiences.findIndex(exp => exp.id === activeExperienceId);
    if (newIndex !== -1 && newIndex !== currentIndex) {
      smoothScrollToIndex(newIndex);
    }
  }, [activeExperienceId, workExperiences, currentIndex]);


  const smoothScrollToIndex = useCallback((targetIndex: number) => {
    if (!carouselRef.current || targetIndex === currentIndex) return;
    
    // Calculate the exact card height and gap from the actual DOM elements
    const container = carouselRef.current;
    const firstCard = container.querySelector('[data-card-index="0"]') as HTMLElement;
    
    if (!firstCard) return;
    
    const cardHeight = firstCard.offsetHeight;
    const gap = 16; // Gap between cards (from gap-4 class)
    const cardSpacing = cardHeight + gap;
    
    // Calculate scroll position to put the target card at the top of the container
    const targetCardTop = targetIndex * cardSpacing;
    const scrollPosition = targetCardTop; // No offset needed - we want card at top
    
    container.scrollTo({
      top: Math.max(0, scrollPosition),
      behavior: "smooth",
    });
    
    setCurrentIndex(targetIndex);
  }, [currentIndex, isMobile]);

  const updateVisualIndex = useCallback(() => {
    if (!carouselRef.current || workExperiences.length === 0) return;
    
    const container = carouselRef.current;
    const containerTop = container.scrollTop;
    
    // Calculate the exact card height and gap from the actual DOM elements
    const firstCard = container.querySelector('[data-card-index="0"]') as HTMLElement;
    
    if (!firstCard) return;
    
    const cardHeight = firstCard.offsetHeight;
    const gap = 16; // Gap between cards (from gap-4 class)
    const cardSpacing = cardHeight + gap;
    
    // Calculate which card is closest to the top for visual effects only
    const nearestIndex = Math.round(containerTop / cardSpacing);
    const clampedIndex = Math.max(0, Math.min(nearestIndex, workExperiences.length - 1));
    
    // Update visual index for effects only - don't change the actual active card
    setVisualIndex(clampedIndex);
  }, [workExperiences]);

  const updateActiveCard = useCallback(() => {
    if (!carouselRef.current || workExperiences.length === 0) return;
    
    const container = carouselRef.current;
    const containerTop = container.scrollTop;
    
    // Calculate the exact card height and gap from the actual DOM elements
    const firstCard = container.querySelector('[data-card-index="0"]') as HTMLElement;
    
    if (!firstCard) return;
    
    const cardHeight = firstCard.offsetHeight;
    const gap = 16; // Gap between cards (from gap-4 class)
    const cardSpacing = cardHeight + gap;
    
    // Calculate which card is closest to the top
    const nearestIndex = Math.round(containerTop / cardSpacing);
    const clampedIndex = Math.max(0, Math.min(nearestIndex, workExperiences.length - 1));
    
    // Update current index and sync visual index
    setCurrentIndex(clampedIndex);
    setVisualIndex(clampedIndex);
    
    // Update the active experience in the parent component
    const newActiveExperience = workExperiences[clampedIndex];
    if (newActiveExperience && newActiveExperience.id !== activeExperienceId) {
      onCardClick(newActiveExperience.id);
    }
  }, [workExperiences, activeExperienceId, onCardClick]);

  const snapToNearestCard = useCallback(() => {
    if (!carouselRef.current || workExperiences.length === 0) return;
    
    const container = carouselRef.current;
    const containerTop = container.scrollTop;
    
    // Calculate the exact card height and gap from the actual DOM elements
    const firstCard = container.querySelector('[data-card-index="0"]') as HTMLElement;
    
    if (!firstCard) return;
    
    const cardHeight = firstCard.offsetHeight;
    const gap = 16; // Gap between cards (from gap-4 class)
    const cardSpacing = cardHeight + gap;
    
    // Calculate which card should be active based on scroll position
    const nearestIndex = Math.round(containerTop / cardSpacing);
    const clampedIndex = Math.max(0, Math.min(nearestIndex, workExperiences.length - 1));
    
    // Snap to the nearest card at the top of the container
    const targetCardTop = clampedIndex * cardSpacing;
    const targetScrollPosition = targetCardTop;
    
    container.scrollTo({
      top: Math.max(0, targetScrollPosition),
      behavior: "smooth",
    });
    
    // Use updateActiveCard to properly set both currentIndex and visualIndex
    updateActiveCard();
  }, [workExperiences, updateActiveCard]);



  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    // Prevent scroll events from bubbling up to parent page
    e.stopPropagation();
    
    // Update visual index during scrolling for visual feedback only
    updateVisualIndex();
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set new timeout to detect when scrolling stops - shorter delay for quicker snapping
    scrollTimeoutRef.current = setTimeout(() => {
      snapToNearestCard();
    }, 300); // 300ms delay after scrolling stops - quicker snapping
  }, [updateVisualIndex, snapToNearestCard]);

  const handleWheel = useCallback((e: WheelEvent) => {
    // Prevent wheel events from bubbling up to parent page
    e.stopPropagation();
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      // Add wheel event listener to prevent page navigation
      const container = carouselRef.current;
      container.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleWheel]);



  // Initialize visual index on mount
  useEffect(() => {
    updateVisualIndex();
  }, [updateVisualIndex]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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
      <div
        className={cn(
          "flex flex-col overflow-y-scroll overscroll-y-auto scroll-smooth",
          containerHeight,
          containerPadding,
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
        ref={carouselRef}
        onScroll={handleScroll}
      >
        <div className="flex flex-col justify-start gap-4">
          {workExperiences.map((experience, index) => {
            const isActive = experience.id === activeExperienceId;
            const isPrevious = index === currentIndex - 1;
            const isNext = index === currentIndex + 1;
            const isVisible = true; // Show all cards
            
            // Calculate distance from visual index for shadow effect
            const distanceFromActive = Math.abs(index - visualIndex);
            
            // Determine shadow/transparency level and scale based on distance from visual index
            // All effects should be perfectly synchronized
            let shadowClass = '';
            let opacityClass = '';
            let scaleClass = '';
            let backgroundClass = '';
            
            if (index === visualIndex) {
              // Card at visual index - fully visible, no shadow, full size, solid background
              shadowClass = '';
              opacityClass = 'opacity-100';
              scaleClass = 'scale-100';
              backgroundClass = 'bg-slate-900';
            } else {
              // All other cards - 0.8 size with varying shadow intensity and transparent background
              const shadowIntensity = distanceFromActive === 1 ? 'bg-black/30' : 
                                    distanceFromActive === 2 ? 'bg-black/50' : 'bg-black/70';
              shadowClass = shadowIntensity;
              opacityClass = 'opacity-100';
              scaleClass = 'scale-80'; // 0.8 size for all non-visual-index cards
              backgroundClass = 'bg-transparent';
            }
            
            return (
              <motion.div
                key={experience.id}
                data-card-index={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.1 * index,
                    ease: "easeOut",
                  },
                }}
                className={`transition-all duration-500 ease-out relative ${opacityClass} transform-gpu origin-center`}
              >
                {/* Shadow overlay for cards not at visual index */}
                {index !== visualIndex && (
                  <div className={`absolute inset-0 z-10 rounded-lg sm:rounded-xl transition-all duration-500 ease-out pointer-events-none ${shadowClass}`}></div>
                )}
                <WorkExperienceCard
                  experience={experience}
                  isActive={isActive}
                  isPrevious={isPrevious}
                  isNext={isNext}
                  isVisible={isVisible}
                  isTransitioning={isTransitioning}
                  positionClass=""
                  opacityClass=""
                  scaleClass={scaleClass}
                  zIndexClass=""
                  onCardClick={() => {
                    console.log('Tile clicked:', experience.companyName);
                    onCardClick(experience.id);
                  }}
                  isClickable={true}
                  isMobile={isMobile}
                  hasTransparentBackground={false}
                  backgroundClass={backgroundClass}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
