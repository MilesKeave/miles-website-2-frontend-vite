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

const isSafari = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

const smoothScrollTo = (element: HTMLElement, targetPosition: number, duration: number = 600): void => {
  const isSafariBrowser = isSafari();

  if (isSafariBrowser) {
    const startPosition = element.scrollTop;
    const distance = targetPosition - startPosition;

    if (Math.abs(distance) < 1) {
      element.scrollTop = targetPosition;
      return;
    }

    const startTime = performance.now();
    let lastFrameTime = startTime;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      const currentPosition = startPosition + (distance * easedProgress);

      const deltaTime = currentTime - lastFrameTime;
      lastFrameTime = currentTime;

      element.scrollTop = currentPosition;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        element.scrollTop = targetPosition;
      }
    };

    requestAnimationFrame(animateScroll);
  } else {
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
  const [visualIndex, setVisualIndex] = useState(0);
  const scrollTimeoutRef = useRef<number | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const [bottomPadding, setBottomPadding] = useState<number>(0);

  const containerHeight = isMobile 
    ? "h-[calc(100vh-18rem)]" 
    : "h-full";
  
  const containerPadding = isMobile 
    ? "" 
    : "pr-1 sm:pr-2 lg:pr-4 pl-1 sm:pl-2 lg:pl-4 py-2 sm:py-3 lg:py-4";

  const smoothScrollToIndex = useCallback((targetIndex: number) => {
    if (!carouselRef.current || targetIndex < 0 || targetIndex >= workExperiences.length) return;

    const container = carouselRef.current;

    const scrollToCard = (retryCount = 0) => {
      const targetCard = container.querySelector(`[data-card-index="${targetIndex}"]`) as HTMLElement;

      if (!targetCard) {
        if (retryCount < 5) {
          setTimeout(() => scrollToCard(retryCount + 1), 100);
        }
        return;
      }

      const performScroll = () => {
        const scrollContainer = container;
        const outerContainer = scrollContainer.parentElement;
        if (!outerContainer) return;

        const outerContainerHeight = outerContainer.clientHeight;
        const scrollContainerHeight = scrollContainer.clientHeight;
        const cardHeight = targetCard.offsetHeight;
        const isFirstCard = targetIndex === 0;
        const isLastCard = targetIndex === workExperiences.length - 1;
        const maxScroll = Math.max(0, scrollContainer.scrollHeight - scrollContainerHeight);

        let targetScrollPosition: number;

        if (isFirstCard) {
          targetScrollPosition = 0;
        } else if (isLastCard) {
          targetScrollPosition = maxScroll;
        } else {
          const cardRect = targetCard.getBoundingClientRect();
          const outerContainerRect = outerContainer.getBoundingClientRect();
          const cardCenterY = cardRect.top + (cardHeight / 2);
          const outerContainerCenterY = outerContainerRect.top + (outerContainerHeight / 2);
          const scrollOffset = cardCenterY - outerContainerCenterY;
          targetScrollPosition = scrollContainer.scrollTop + scrollOffset;
        }

        const finalScrollPosition = Math.max(0, Math.min(targetScrollPosition, maxScroll));
        smoothScrollTo(scrollContainer, finalScrollPosition);
      };

      if (isSafari()) {
        requestAnimationFrame(performScroll);
      } else {
        requestAnimationFrame(() => {
          requestAnimationFrame(performScroll);
        });
      }
    };

    scrollToCard();
  }, [isMobile, workExperiences.length]);

  useEffect(() => {
    if (!activeExperienceId || workExperiences.length === 0) return;

    const newIndex = workExperiences.findIndex(exp => exp.id === activeExperienceId);

    if (newIndex !== -1) {
      setCurrentIndex(newIndex);
      setVisualIndex(newIndex);
      isProgrammaticScrollRef.current = true;
      smoothScrollToIndex(newIndex);

      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
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
    const firstCard = container.querySelector('[data-card-index="0"]') as HTMLElement;

    if (!firstCard) return;

    const cardHeight = firstCard.offsetHeight;
    const gap = 4;
    const cardSpacing = cardHeight + gap;
    const nearestIndex = Math.round(containerTop / cardSpacing);
    const clampedIndex = Math.max(0, Math.min(nearestIndex, workExperiences.length - 1));

    setVisualIndex(clampedIndex);
  }, [workExperiences]);

  const updateActiveCard = useCallback(() => {
    if (!carouselRef.current || workExperiences.length === 0 || isProgrammaticScrollRef.current) {
      return;
    }

    const container = carouselRef.current;
    const containerTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const maxScroll = Math.max(0, container.scrollHeight - containerHeight);
    const firstCard = container.querySelector('[data-card-index="0"]') as HTMLElement;

    if (!firstCard) return;

    const cardHeight = firstCard.offsetHeight;
    const gap = 4;
    const cardSpacing = cardHeight + gap;
    const isNearBottom = containerTop >= maxScroll - (cardHeight * 1.5);
    let clampedIndex: number;

    if (isNearBottom) {
      clampedIndex = workExperiences.length - 1;
    } else {
      const nearestIndex = Math.round(containerTop / cardSpacing);
      clampedIndex = Math.max(0, Math.min(nearestIndex, workExperiences.length - 1));
    }

    if (clampedIndex !== currentIndex && !isProgrammaticScrollRef.current) {
      setCurrentIndex(clampedIndex);
      setVisualIndex(clampedIndex);

      const newActiveExperience = workExperiences[clampedIndex];
      if (newActiveExperience && newActiveExperience.id !== activeExperienceId) {
        onCardClick(newActiveExperience.id);
      }
    }
  }, [workExperiences, activeExperienceId, onCardClick, currentIndex]);

  const snapToNearestCard = useCallback(() => {
    if (isProgrammaticScrollRef.current) {
      return;
    }

    if (!carouselRef.current || workExperiences.length === 0) return;

    const container = carouselRef.current;
    const outerContainer = container.parentElement;
    if (!outerContainer) return;

    const outerContainerRect = outerContainer.getBoundingClientRect();
    const outerContainerHeight = outerContainer.clientHeight;
    const outerContainerCenterY = outerContainerRect.top + (outerContainerHeight / 2);
    const containerHeight = container.clientHeight;
    const containerScrollTop = container.scrollTop;
    const maxScroll = Math.max(0, container.scrollHeight - containerHeight);
    const lastCardIndex = workExperiences.length - 1;

    const isAtBottom = containerScrollTop >= maxScroll - 1;
    const lastCard = container.querySelector(`[data-card-index="${lastCardIndex}"]`) as HTMLElement;
    const isLastCardVisible = lastCard ? lastCard.getBoundingClientRect().bottom <= outerContainerRect.bottom + 50 : false;
    const isNearBottom = isAtBottom || isLastCardVisible || containerScrollTop >= maxScroll - 150;

    let closestCardIndex = 0;
    let closestDistance = Infinity;

    if (isNearBottom && lastCardIndex >= 0) {
      closestCardIndex = lastCardIndex;
    } else {
      workExperiences.forEach((_, index) => {
        const card = container.querySelector(`[data-card-index="${index}"]`) as HTMLElement;
        if (!card) return;

        const cardRect = card.getBoundingClientRect();
        const cardHeight = cardRect.height;
        const cardCenterY = cardRect.top + (cardHeight / 2);
        const distance = Math.abs(cardCenterY - outerContainerCenterY);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestCardIndex = index;
        }
      });
    }

    setCurrentIndex(closestCardIndex);
    setVisualIndex(closestCardIndex);

    const newActiveExperience = workExperiences[closestCardIndex];
    if (newActiveExperience && newActiveExperience.id !== activeExperienceId) {
      isProgrammaticScrollRef.current = true;
      onCardClick(newActiveExperience.id);
    }

    const isLastCard = closestCardIndex === lastCardIndex;
    let finalScrollPosition: number;

    if (isLastCard) {
      finalScrollPosition = maxScroll;
    } else {
      const targetCard = container.querySelector(`[data-card-index="${closestCardIndex}"]`) as HTMLElement;
      if (!targetCard) {
        if (newActiveExperience && newActiveExperience.id !== activeExperienceId) {
          isProgrammaticScrollRef.current = false;
        }
        return;
      }

      const cardRect = targetCard.getBoundingClientRect();
      const cardHeight = cardRect.height;
      const cardCenterY = cardRect.top + (cardHeight / 2);
      const scrollOffset = cardCenterY - outerContainerCenterY;
      const targetScrollPosition = containerScrollTop + scrollOffset;
      finalScrollPosition = Math.max(0, Math.min(targetScrollPosition, maxScroll));
    }

    smoothScrollTo(container, finalScrollPosition);

    if (newActiveExperience && newActiveExperience.id !== activeExperienceId) {
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 1000);
    }
  }, [workExperiences, activeExperienceId, onCardClick]);



  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (isProgrammaticScrollRef.current) {
      return;
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (!isProgrammaticScrollRef.current) {
        snapToNearestCard();
      }
    }, 500);
  }, [snapToNearestCard]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.stopPropagation();
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      container.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleWheel]);



  useEffect(() => {
    const calculateBottomPadding = () => {
      if (!carouselRef.current || workExperiences.length === 0) return;

      const container = carouselRef.current;
      const firstCard = container.querySelector('[data-card-index="0"]') as HTMLElement;

      if (!firstCard) return;

      const cardHeight = firstCard.offsetHeight;
      const outerContainer = carouselRef.current?.parentElement;
      if (!outerContainer) return;

      const outerContainerHeight = outerContainer.clientHeight;
      const calculatedPadding = Math.max(0, (outerContainerHeight - cardHeight) / 2);

      setBottomPadding(calculatedPadding);
    };

    calculateBottomPadding();
    window.addEventListener('resize', calculateBottomPadding);

    const timeoutId = setTimeout(calculateBottomPadding, 100);
    const timeoutId2 = setTimeout(calculateBottomPadding, 300);

    return () => {
      window.removeEventListener('resize', calculateBottomPadding);
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [workExperiences.length, isMobile]);

  useEffect(() => {
    updateVisualIndex();
  }, [updateVisualIndex]);

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
          !isSafari() && "scroll-smooth"
        )}
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
        ref={carouselRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
            const isVisible = true;

            const activeIndex = workExperiences.findIndex(exp => exp.id === activeExperienceId);
            const isActiveCard = index === activeIndex;
            const distanceFromActive = Math.abs(index - activeIndex);
            
            let shadowClass = '';
            let opacityClass = '';
            let scaleClass = '';
            let backgroundClass = '';

            if (isActiveCard) {
              shadowClass = '';
              opacityClass = 'opacity-100';
              scaleClass = 'scale-100';
              backgroundClass = 'bg-slate-900';
            } else {
              const shadowIntensity = distanceFromActive === 1 ? 'bg-black/30' :
                                    distanceFromActive === 2 ? 'bg-black/50' : 'bg-black/70';
              shadowClass = shadowIntensity;
              opacityClass = 'opacity-100';
              scaleClass = 'scale-90';
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
