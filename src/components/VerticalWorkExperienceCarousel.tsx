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

// Safari detection helper
const isSafari = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

// Safari-aware smooth scroll helper with improved smoothness
const smoothScrollTo = (element: HTMLElement, targetPosition: number, duration: number = 600): void => {
  const isSafariBrowser = isSafari();
  
  if (isSafariBrowser) {
    // Manual animation for Safari with smoother easing
    const startPosition = element.scrollTop;
    const distance = targetPosition - startPosition;
    
    // Skip animation if distance is very small
    if (Math.abs(distance) < 1) {
      element.scrollTop = targetPosition;
      return;
    }
    
    const startTime = performance.now();
    let lastFrameTime = startTime;
    
    // Smoother easing function: ease-in-out cubic (more natural feeling)
    const easeInOutCubic = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    
    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use smoother easing function
      const easedProgress = easeInOutCubic(progress);
      const currentPosition = startPosition + (distance * easedProgress);
      
      // Use delta time for smoother frame updates
      const deltaTime = currentTime - lastFrameTime;
      lastFrameTime = currentTime;
      
      // Update scroll position
      element.scrollTop = currentPosition;
      
      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // Ensure we end exactly at target position
        element.scrollTop = targetPosition;
      }
    };
    
    requestAnimationFrame(animateScroll);
  } else {
    // Native smooth scrolling for other browsers
    element.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }
};

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
      // Use single requestAnimationFrame for Safari, double for others
      const performScroll = () => {
        // Get the actual scroll container
        const scrollContainer = container;
        
        // Get the outer parent container (the div with h-full relative overflow-hidden)
        const outerContainer = scrollContainer.parentElement;
        if (!outerContainer) return;
        
        // Get container dimensions and positions
        const outerContainerRect = outerContainer.getBoundingClientRect();
        const outerContainerHeight = outerContainer.clientHeight;
        const scrollContainerHeight = scrollContainer.clientHeight;
        const cardHeight = targetCard.offsetHeight;
        
        // Special handling for first and last cards
        const isFirstCard = targetIndex === 0;
        const isLastCard = targetIndex === workExperiences.length - 1;
        
        // Calculate max scroll position (accounting for bottom padding)
        const maxScroll = Math.max(0, scrollContainer.scrollHeight - scrollContainerHeight);
        
        let targetScrollPosition: number;
        
        if (isFirstCard) {
          // For the first card, scroll to the top
          targetScrollPosition = 0;
        } else if (isLastCard) {
          // For the last card, always scroll to the bottom
          targetScrollPosition = maxScroll;
        } else {
          // For middle cards, calculate position to center in the outer container
          // Use getBoundingClientRect to get current viewport positions
          const cardRect = targetCard.getBoundingClientRect();
          const outerContainerRect = outerContainer.getBoundingClientRect();
          
          // Card's center Y position in viewport
          const cardCenterY = cardRect.top + (cardHeight / 2);
          
          // Outer container's center Y position in viewport (this is our target)
          const outerContainerCenterY = outerContainerRect.top + (outerContainerHeight / 2);
          
          // Calculate how much we need to scroll to align card center with outer container center
          // The difference in viewport positions tells us how much to scroll
          const scrollOffset = cardCenterY - outerContainerCenterY;
          
          // Current scroll position + offset needed = target scroll position
          targetScrollPosition = scrollContainer.scrollTop + scrollOffset;
        }
        
        // Clamp the scroll position to valid bounds
        const finalScrollPosition = Math.max(0, Math.min(targetScrollPosition, maxScroll));
        
        // Perform the scroll (Safari-aware)
        smoothScrollTo(scrollContainer, finalScrollPosition);
      };
      
      // Use single requestAnimationFrame for Safari, double for others
      if (isSafari()) {
        requestAnimationFrame(performScroll);
      } else {
        requestAnimationFrame(() => {
          requestAnimationFrame(performScroll);
        });
      }
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
    
    // Get the outer container (h-full relative overflow-hidden)
    const outerContainer = container.parentElement;
    if (!outerContainer) return;
    
    const outerContainerRect = outerContainer.getBoundingClientRect();
    const outerContainerHeight = outerContainer.clientHeight;
    // Center of the outer container (in viewport coordinates)
    const outerContainerCenterY = outerContainerRect.top + (outerContainerHeight / 2);
    
    const containerHeight = container.clientHeight;
    const containerScrollTop = container.scrollTop;
    const maxScroll = Math.max(0, container.scrollHeight - containerHeight);
    const lastCardIndex = workExperiences.length - 1;
    
    // Special handling: if we're at or near the bottom, always select the last card
    // Check if we're at the absolute bottom, or if the last card is visible
    const isAtBottom = containerScrollTop >= maxScroll - 1; // At or very close to bottom (1px tolerance)
    const lastCard = container.querySelector(`[data-card-index="${lastCardIndex}"]`) as HTMLElement;
    const isLastCardVisible = lastCard ? lastCard.getBoundingClientRect().bottom <= outerContainerRect.bottom + 50 : false;
    const isNearBottom = isAtBottom || isLastCardVisible || containerScrollTop >= maxScroll - 150; // Within 150px of bottom
    
    let closestCardIndex = 0;
    let closestDistance = Infinity;
    
    if (isNearBottom && lastCardIndex >= 0) {
      // When near the bottom, always select the last card
      closestCardIndex = lastCardIndex;
    } else {
      // Find the card whose center is closest to the center of the outer container
      // Check each card to find which one's center is closest to the outer container's center
      workExperiences.forEach((_, index) => {
        const card = container.querySelector(`[data-card-index="${index}"]`) as HTMLElement;
        if (!card) return;
        
        // Use getBoundingClientRect to get the card's actual position in the viewport
        const cardRect = card.getBoundingClientRect();
        const cardHeight = cardRect.height;
        // Card's center Y position in viewport coordinates
        const cardCenterY = cardRect.top + (cardHeight / 2);
        
        // Calculate distance from the outer container's center
        // Both are in viewport coordinates, so this gives the actual distance
        const distance = Math.abs(cardCenterY - outerContainerCenterY);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestCardIndex = index;
        }
      });
    }
    
    // Update indices to match the closest card immediately
    setCurrentIndex(closestCardIndex);
    setVisualIndex(closestCardIndex);
    
    // Update the active experience in the parent to highlight/select the card
    const newActiveExperience = workExperiences[closestCardIndex];
    if (newActiveExperience && newActiveExperience.id !== activeExperienceId) {
      // Set the programmatic scroll flag to prevent interference
      isProgrammaticScrollRef.current = true;
      // Call onCardClick to update the active experience in the parent
      onCardClick(newActiveExperience.id);
    }
    
    // Special handling for last card - always scroll to maxScroll
    const isLastCard = closestCardIndex === lastCardIndex;
    let finalScrollPosition: number;
    
    if (isLastCard) {
      // For the last card, always scroll to the bottom
      finalScrollPosition = maxScroll;
    } else {
      // Now scroll to center the closest card
      const targetCard = container.querySelector(`[data-card-index="${closestCardIndex}"]`) as HTMLElement;
      if (!targetCard) {
        // Reset flag if card not found
        if (newActiveExperience && newActiveExperience.id !== activeExperienceId) {
          isProgrammaticScrollRef.current = false;
        }
        return;
      }
      
      // Use getBoundingClientRect to get current positions
      const cardRect = targetCard.getBoundingClientRect();
      const cardHeight = cardRect.height;
      
      // Calculate scroll offset needed to center the card in the outer container
      const cardCenterY = cardRect.top + (cardHeight / 2);
      const scrollOffset = cardCenterY - outerContainerCenterY;
      const targetScrollPosition = containerScrollTop + scrollOffset;
      
      // Clamp to valid bounds
      finalScrollPosition = Math.max(0, Math.min(targetScrollPosition, maxScroll));
    }
    
    // Smoothly scroll to center the card (Safari-aware)
    smoothScrollTo(container, finalScrollPosition);
    
    // Reset the programmatic scroll flag after scroll completes
    if (newActiveExperience && newActiveExperience.id !== activeExperienceId) {
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 1000);
    }
  }, [workExperiences, activeExperienceId, onCardClick]);



  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    // Prevent scroll events from bubbling up to parent page
    e.stopPropagation();
    
    // Don't interfere with programmatic scrolls - return early and don't do anything
    if (isProgrammaticScrollRef.current) {
      return;
    }
    
    // During manual scrolling, don't update anything - just let the user scroll freely
    // We'll only snap after they release
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set new timeout to detect when scrolling stops
    // Use 500ms (half a second) delay to allow for quick re-scrolling without snapping
    scrollTimeoutRef.current = setTimeout(() => {
      // Double-check the flag hasn't been set during the timeout
      if (!isProgrammaticScrollRef.current) {
        snapToNearestCard();
      }
    }, 500); // Half a second delay after scrolling stops before snapping
  }, [snapToNearestCard]);

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
      // Get the outer container (h-full relative overflow-hidden)
      const outerContainer = carouselRef.current?.parentElement;
      if (!outerContainer) return;
      
      const outerContainerHeight = outerContainer.clientHeight;
      
      // For the first card to be centered, we need padding at the top
      // For the last card to be centered, we need padding at the bottom
      // Required padding = (outerContainerHeight - cardHeight) / 2
      // This centers the card in the outer container
      const calculatedPadding = Math.max(0, (outerContainerHeight - cardHeight) / 2);
      
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
          "flex flex-col overflow-y-scroll overscroll-y-auto",
          containerHeight,
          containerPadding,
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // Remove scroll-smooth for Safari to prevent glitches
          !isSafari() && "scroll-smooth"
        )}
        style={{
          WebkitOverflowScrolling: 'touch', // Better Safari scrolling
        }}
        ref={carouselRef}
        onScroll={handleScroll}
      >
        <div 
          className="flex flex-col justify-start gap-1"
          style={{ 
            paddingTop: `${bottomPadding}px`,
            paddingBottom: `${bottomPadding}px` 
          }}
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
