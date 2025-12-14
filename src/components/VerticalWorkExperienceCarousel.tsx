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
  const isProgrammaticScrollRef = useRef(false);
  const [bottomPadding, setBottomPadding] = useState<number>(0);

  const containerHeight = isMobile 
    ? "h-[calc(100vh-14rem)]" 
    : "h-full";
  
  const containerPadding = isMobile 
    ? "" 
    : "pr-1 sm:pr-2 lg:pr-4 pl-1 sm:pl-2 lg:pl-4 py-2 sm:py-3 lg:py-4";

  const smoothScrollToIndex = useCallback((targetIndex: number) => {
    if (!carouselRef.current || targetIndex < 0 || targetIndex >= workExperiences.length) return;
    
    const container = carouselRef.current;
    
    // Function to find and scroll to the target card
    const scrollToCard = (retryCount = 0) => {
      const targetCard = container.querySelector(`[data-card-index="${targetIndex}"]`) as HTMLElement;
      
      if (!targetCard) {
        // If card not found, retry up to 5 times
        if (retryCount < 5) {
          setTimeout(() => scrollToCard(retryCount + 1), 100);
        }
        return;
      }
      
      // Wait for layout to settle
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Get the actual scroll container
          const scrollContainer = container;
          
          // Get container dimensions
          const containerHeight = scrollContainer.clientHeight;
          const cardHeight = targetCard.offsetHeight;
          
          // Special handling for first and last cards
          const isFirstCard = targetIndex === 0;
          const isLastCard = targetIndex === workExperiences.length - 1;
          
          // Calculate max scroll position (accounting for bottom padding)
          const maxScroll = Math.max(0, scrollContainer.scrollHeight - containerHeight);
          
          let targetScrollPosition: number;
          
          if (isFirstCard) {
            // For the first card, scroll to the top
            targetScrollPosition = 0;
          } else if (isLastCard) {
            // For the last card, always scroll to the bottom
            targetScrollPosition = maxScroll;
          } else {
            // For middle cards, find the card's actual position in the scroll container
            // Get the parent container that holds all cards
            const cardsContainer = targetCard.parentElement;
            if (!cardsContainer) return;
            
            // Calculate the card's position relative to the cards container
            let cardTop = 0;
            let element: HTMLElement | null = targetCard;
            
            // Walk up to the cards container
            while (element && element !== cardsContainer) {
              cardTop += element.offsetTop;
              element = element.offsetParent as HTMLElement;
            }
            
            // Calculate scroll position to center the card vertically
            const cardCenter = cardTop + (cardHeight / 2);
            const containerCenter = containerHeight / 2;
            targetScrollPosition = cardCenter - containerCenter;
          }
          
          // Clamp the scroll position to valid bounds
          const finalScrollPosition = Math.max(0, Math.min(targetScrollPosition, maxScroll));
          
          // Perform the scroll
          scrollContainer.scrollTo({
            top: finalScrollPosition,
            behavior: "smooth",
          });
        });
      });
    };
    
    // Start the scroll process
    scrollToCard();
  }, [isMobile, workExperiences.length]);

  // Update current index when activeExperienceId changes - THIS IS THE SOURCE OF TRUTH
  useEffect(() => {
    if (!activeExperienceId || workExperiences.length === 0) return;
    
    const newIndex = workExperiences.findIndex(exp => exp.id === activeExperienceId);
    
    if (newIndex !== -1) {
      // Immediately update indices to match the active experience
      setCurrentIndex(newIndex);
      setVisualIndex(newIndex);
      
      // Set programmatic scroll flag BEFORE scrolling
      isProgrammaticScrollRef.current = true;
      
      // Scroll to the target card
      smoothScrollToIndex(newIndex);
      
      // Reset flag after scroll completes (smooth scroll can take up to 1000ms)
      // Use a longer timeout to ensure all scroll events during animation are ignored
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        // Double-check that indices are still correct after scroll
        const verifyIndex = workExperiences.findIndex(exp => exp.id === activeExperienceId);
        if (verifyIndex !== -1 && verifyIndex !== currentIndex) {
          setCurrentIndex(verifyIndex);
          setVisualIndex(verifyIndex);
        }
      }, 1200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeExperienceId, workExperiences]);

  const updateVisualIndex = useCallback(() => {
    if (!carouselRef.current || workExperiences.length === 0) return;
    
    const container = carouselRef.current;
    const containerTop = container.scrollTop;
    
    // Calculate the exact card height and gap from the actual DOM elements
    const firstCard = container.querySelector('[data-card-index="0"]') as HTMLElement;
    
    if (!firstCard) return;
    
    const cardHeight = firstCard.offsetHeight;
    const gap = 4; // Gap between cards (from gap-1 class)
    const cardSpacing = cardHeight + gap;
    
    // Calculate which card is closest to the top for visual effects only
    const nearestIndex = Math.round(containerTop / cardSpacing);
    const clampedIndex = Math.max(0, Math.min(nearestIndex, workExperiences.length - 1));
    
    // Update visual index for effects only - don't change the actual active card
    setVisualIndex(clampedIndex);
  }, [workExperiences]);

  const updateActiveCard = useCallback(() => {
    // NEVER update active card during programmatic scrolls - this would break the nav clicking
    if (!carouselRef.current || workExperiences.length === 0 || isProgrammaticScrollRef.current) {
      return;
    }
    
    const container = carouselRef.current;
    const containerTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const maxScroll = Math.max(0, container.scrollHeight - containerHeight);
    
    // Calculate the exact card height and gap from the actual DOM elements
    const firstCard = container.querySelector('[data-card-index="0"]') as HTMLElement;
    
    if (!firstCard) return;
    
    const cardHeight = firstCard.offsetHeight;
    const gap = 4; // Gap between cards (from gap-1 class)
    const cardSpacing = cardHeight + gap;
    
    // If we're near the bottom (within 1.5 card heights of max scroll), select the last card
    const isNearBottom = containerTop >= maxScroll - (cardHeight * 1.5);
    let clampedIndex: number;
    
    if (isNearBottom) {
      // If near bottom, always select the last card
      clampedIndex = workExperiences.length - 1;
    } else {
      // Calculate which card is closest to the top
      const nearestIndex = Math.round(containerTop / cardSpacing);
      clampedIndex = Math.max(0, Math.min(nearestIndex, workExperiences.length - 1));
    }
    
    // Only update if the index actually changed AND it's not a programmatic scroll
    if (clampedIndex !== currentIndex && !isProgrammaticScrollRef.current) {
      // Update current index and sync visual index
      setCurrentIndex(clampedIndex);
      setVisualIndex(clampedIndex);
      
      // Update the active experience in the parent component
      const newActiveExperience = workExperiences[clampedIndex];
      if (newActiveExperience && newActiveExperience.id !== activeExperienceId) {
        onCardClick(newActiveExperience.id);
      }
    }
  }, [workExperiences, activeExperienceId, onCardClick, currentIndex]);

  const snapToNearestCard = useCallback(() => {
    // Don't snap if this is a programmatic scroll
    if (isProgrammaticScrollRef.current) {
      return;
    }
    
    if (!carouselRef.current || workExperiences.length === 0) return;
    
    const container = carouselRef.current;
    const containerTop = container.scrollTop;
    
    // Calculate the exact card height and gap from the actual DOM elements
    const firstCard = container.querySelector('[data-card-index="0"]') as HTMLElement;
    
    if (!firstCard) return;
    
    const cardHeight = firstCard.offsetHeight;
    const gap = 4; // Gap between cards (from gap-1 class)
    const cardSpacing = cardHeight + gap;
    const containerHeight = container.clientHeight;
    const maxScroll = container.scrollHeight - containerHeight;
    
    // Calculate which card should be active based on scroll position
    // If we're near the bottom (within 1 card height of max scroll), snap to last card
    const isNearBottom = containerTop >= maxScroll - cardHeight;
    let clampedIndex: number;
    
    if (isNearBottom) {
      // If near bottom, always snap to the last card
      clampedIndex = workExperiences.length - 1;
    } else {
      const nearestIndex = Math.round(containerTop / cardSpacing);
      clampedIndex = Math.max(0, Math.min(nearestIndex, workExperiences.length - 1));
    }
    
    const isLastCard = clampedIndex === workExperiences.length - 1;
    let targetScrollPosition: number;
    
    if (isLastCard) {
      // For the last card, scroll to the maximum position
      targetScrollPosition = maxScroll;
    } else {
      // For other cards, center them vertically
      const targetCardTop = clampedIndex * cardSpacing;
      const offsetFromTop = (containerHeight - cardHeight) / 2;
      targetScrollPosition = targetCardTop - offsetFromTop;
      targetScrollPosition = Math.max(0, Math.min(targetScrollPosition, maxScroll));
    }
    
    container.scrollTo({
      top: targetScrollPosition,
      behavior: "smooth",
    });
    
    // Use updateActiveCard to properly set both currentIndex and visualIndex
    updateActiveCard();
  }, [workExperiences, updateActiveCard]);



  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    // Prevent scroll events from bubbling up to parent page
    e.stopPropagation();
    
    // Don't interfere with programmatic scrolls - return early and don't do anything
    if (isProgrammaticScrollRef.current) {
      return;
    }
    
    // Update visual index during scrolling for visual feedback only
    updateVisualIndex();
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set new timeout to detect when scrolling stops - shorter delay for quicker snapping
    scrollTimeoutRef.current = setTimeout(() => {
      // Double-check the flag hasn't been set during the timeout
      if (!isProgrammaticScrollRef.current) {
        snapToNearestCard();
      }
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



  // Calculate bottom padding to ensure all cards can be centered
  useEffect(() => {
    const calculateBottomPadding = () => {
      if (!carouselRef.current || workExperiences.length === 0) return;
      
      const container = carouselRef.current;
      const containerHeight = container.clientHeight;
      const firstCard = container.querySelector('[data-card-index="0"]') as HTMLElement;
      
      if (!firstCard) return;
      
      const cardHeight = firstCard.offsetHeight;
      const gap = 4; // Gap between cards (from gap-1 class)
      
      // To center any card, we need: (containerHeight - cardHeight) / 2 space above and below
      // For the last card to be centered, we need:
      // - The last card's position from top
      // - Plus (containerHeight - cardHeight) / 2 space below it
      // Last card position = (numberOfCards - 1) * (cardHeight + gap)
      // Required padding = (containerHeight - cardHeight) / 2
      // Add extra buffer (100px) to ensure smooth scrolling
      const requiredPaddingForCentering = (containerHeight - cardHeight) / 2;
      const buffer = 100; // Extra buffer for smooth scrolling
      const calculatedPadding = Math.max(0, requiredPaddingForCentering + buffer);
      
      setBottomPadding(calculatedPadding);
    };
    
    // Calculate on mount and when window resizes
    calculateBottomPadding();
    window.addEventListener('resize', calculateBottomPadding);
    
    // Also recalculate after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(calculateBottomPadding, 100);
    const timeoutId2 = setTimeout(calculateBottomPadding, 300); // Second check after more time
    
    return () => {
      window.removeEventListener('resize', calculateBottomPadding);
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [workExperiences.length, isMobile]);

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
        <div 
          className="flex flex-col justify-start gap-1"
          style={{ paddingBottom: `${bottomPadding}px` }}
        >
          {workExperiences.map((experience, index) => {
            const isActive = experience.id === activeExperienceId;
            const isPrevious = index === currentIndex - 1;
            const isNext = index === currentIndex + 1;
            const isVisible = true; // Show all cards
            
            // Use activeExperienceId as the source of truth for visual effects
            // visualIndex should match the active card's index
            const activeIndex = workExperiences.findIndex(exp => exp.id === activeExperienceId);
            const isActiveCard = index === activeIndex;
            const distanceFromActive = Math.abs(index - activeIndex);
            
            // Determine shadow/transparency level and scale based on distance from active card
            // All effects should be perfectly synchronized with the active card
            let shadowClass = '';
            let opacityClass = '';
            let scaleClass = '';
            let backgroundClass = '';
            
            if (isActiveCard) {
              // Active card - fully visible, no shadow, full size, solid background
              shadowClass = '';
              opacityClass = 'opacity-100';
              scaleClass = 'scale-100';
              backgroundClass = 'bg-slate-900';
            } else {
              // All other cards - 0.9 size with varying shadow intensity and transparent background
              const shadowIntensity = distanceFromActive === 1 ? 'bg-black/30' : 
                                    distanceFromActive === 2 ? 'bg-black/50' : 'bg-black/70';
              shadowClass = shadowIntensity;
              opacityClass = 'opacity-100';
              scaleClass = 'scale-90'; // 0.9 size for all non-active cards
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
                {/* Shadow overlay for cards not at active index */}
                {!isActiveCard && (
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
