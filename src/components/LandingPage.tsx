import { useProfile } from '../hooks/useProfile';
import { TechDiffPage } from './TechDiffPage';
import { BackgroundBeams } from './ui/background-beams';
import { useState, useRef, useEffect } from 'react';
import type { PageId, TransitionMode } from '../types/pages';
import { PAGE_CONFIG, getNextPage, getPreviousPage, getPageOrder } from '../config/pages';
import './LandingPage.css';

interface LandingPageProps {
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
  isDirectNavigation?: boolean;
}

export const LandingPage = ({ currentPage, onPageChange, isDirectNavigation }: LandingPageProps): React.JSX.Element => {
  const { loading, showTechDiff } = useProfile();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMode, setTransitionMode] = useState<TransitionMode>('sequential');
  const [previousPage, setPreviousPage] = useState<PageId | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef<number>(0);
  const scrollCooldown = 800;
  const scrollGestureState = useRef<{
    isActive: boolean;
    startPosition: number;
    startContainer: HTMLElement | null;
    lastEventTime: number;
  }>({
    isActive: false,
    startPosition: 0,
    startContainer: null,
    lastEventTime: 0
  });
  const touchState = useRef<{
    startY: number;
    startX: number;
    startTime: number;
    isActive: boolean;
    startScrollTop: number;
    containerScrolled: boolean;
  }>({
    startY: 0,
    startX: 0,
    startTime: 0,
    isActive: false,
    startScrollTop: 0,
    containerScrolled: false
  });

  const navigateToPage = (targetPageId: PageId, mode: TransitionMode = 'direct') => {
    if (isTransitioning || targetPageId === currentPage) return;
    
    setIsTransitioning(true);
    setTransitionMode(mode);
    setPreviousPage(currentPage);
    
    if (mode === 'sequential') {
      setTimeout(() => {
        onPageChange(targetPageId);
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitionMode('sequential');
          setPreviousPage(null);
        }, 400);
      }, 10);
    } else {
      onPageChange(targetPageId);
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionMode('sequential');
        setPreviousPage(null);
      }, 400);
    }
  };

  const goToNextPage = () => {
    const nextPage = getNextPage(currentPage);
    if (nextPage) {
      navigateToPage(nextPage.id as PageId, 'sequential');
    }
  };

  const goToPreviousPage = () => {
    const prevPage = getPreviousPage(currentPage);
    if (prevPage) {
      navigateToPage(prevPage.id as PageId, 'sequential');
    }
  };

  useEffect(() => {
    if (isDirectNavigation) {
      setTransitionMode('direct');
    } else {
      setTransitionMode('sequential');
    }
  }, [isDirectNavigation]);

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    
    const target = e.target as HTMLElement;
    const scrollableContainer = target.closest('[class*="overflow-y-auto"], [class*="overflow-auto"]');
    
    if (scrollableContainer) {
      const container = scrollableContainer as HTMLElement;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;
      const isStrongScroll = Math.abs(e.deltaY) > 30;
      
      const isNewGesture = !scrollGestureState.current.isActive || 
                          scrollGestureState.current.startContainer !== container ||
                          (now - scrollGestureState.current.lastEventTime) > 200;
      
      if (isNewGesture) {
        scrollGestureState.current = {
          isActive: true,
          startPosition: scrollTop,
          startContainer: container,
          lastEventTime: now
        };
      } else {
        scrollGestureState.current.lastEventTime = now;
      }
      
      if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
        const startedAtTop = scrollGestureState.current.startPosition === 0;
        const startedAtBottom = scrollGestureState.current.startPosition + clientHeight >= scrollHeight - 1;
        
        const canTransitionToPrevious = startedAtTop && isAtTop && isScrollingUp;
        const canTransitionToNext = startedAtBottom && isAtBottom && isScrollingDown;
        
        if ((canTransitionToPrevious || canTransitionToNext) && isStrongScroll && (now - lastScrollTime.current) > scrollCooldown) {
          e.preventDefault();
          e.stopPropagation();
          lastScrollTime.current = now;
          
          if (canTransitionToNext) {
            goToNextPage();
          } else if (canTransitionToPrevious) {
            goToPreviousPage();
          }
          
          scrollGestureState.current.isActive = false;
        } else {
          e.preventDefault();
          e.stopPropagation();
        }
      } else if (!isAtTop && !isAtBottom) {
      } else {
        e.preventDefault();
        e.stopPropagation();
      }
      
      return;
    }
    
    scrollGestureState.current.isActive = false;
    
    if (Math.abs(e.deltaY) > 10 && (now - lastScrollTime.current) > scrollCooldown) {
      e.preventDefault();
      lastScrollTime.current = now;
      
      if (e.deltaY > 0) {
        goToNextPage();
      } else if (e.deltaY < 0) {
        goToPreviousPage();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const target = e.target as HTMLElement;
    const scrollableContainer = target.closest('[class*="overflow-y-auto"], [class*="overflow-auto"], [class*="overflow-y-scroll"]');
    
    if (scrollableContainer) {
      const container = scrollableContainer as HTMLElement;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const tolerance = 5;
      const isAtTop = scrollTop <= tolerance;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - tolerance;
      
      if (isAtTop || isAtBottom) {
        touchState.current = {
          startY: touch.clientY,
          startX: touch.clientX,
          startTime: Date.now(),
          isActive: true,
          startScrollTop: scrollTop,
          containerScrolled: false
        };
      }
    } else {
      touchState.current = {
        startY: touch.clientY,
        startX: touch.clientX,
        startTime: Date.now(),
        isActive: true,
        startScrollTop: 0,
        containerScrolled: false
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchState.current.isActive) return;
    
    const target = e.target as HTMLElement;
    const scrollableContainer = target.closest('[class*="overflow-y-auto"], [class*="overflow-auto"], [class*="overflow-y-scroll"]');
    
    if (scrollableContainer) {
      const container = scrollableContainer as HTMLElement;
      const scrollTop = container.scrollTop;
      const scrollDelta = Math.abs(scrollTop - touchState.current.startScrollTop);
      
      if (scrollDelta > 10) {
        touchState.current.containerScrolled = true;
        touchState.current.isActive = false;
        return;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchState.current.isActive) return;
    
    const now = Date.now();
    const touch = e.changedTouches[0];
    const deltaY = touch.clientY - touchState.current.startY;
    const deltaX = touch.clientX - touchState.current.startX;
    const deltaTime = now - touchState.current.startTime;
    
    const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX);
    const maxSwipeTime = 500;
    
    const target = e.target as HTMLElement;
    const scrollableContainer = target.closest('[class*="overflow-y-auto"], [class*="overflow-auto"], [class*="overflow-y-scroll"]');
    
    if (scrollableContainer) {
      if (touchState.current.containerScrolled) {
        touchState.current.isActive = false;
        touchState.current.containerScrolled = false;
        return;
      }
      
      const container = scrollableContainer as HTMLElement;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const tolerance = 5;
      const isAtTop = scrollTop <= tolerance;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - tolerance;
      
      const minSwipeDistance = 150;
      const isSwipingUp = deltaY < -minSwipeDistance;
      const isSwipingDown = deltaY > minSwipeDistance;
      const isValidSwipe = isVerticalSwipe && Math.abs(deltaY) > minSwipeDistance && deltaTime < maxSwipeTime;
      
      if (isValidSwipe && (now - lastScrollTime.current) > scrollCooldown) {
        const canTransitionToPrevious = isAtTop && isSwipingUp;
        const canTransitionToNext = isAtBottom && isSwipingDown;
        
        if (canTransitionToNext) {
          lastScrollTime.current = now;
          goToNextPage();
        } else if (canTransitionToPrevious) {
          lastScrollTime.current = now;
          goToPreviousPage();
        }
      }
    } else {
      const minSwipeDistance = 50;
      if (isVerticalSwipe && Math.abs(deltaY) > minSwipeDistance && deltaTime < maxSwipeTime && (now - lastScrollTime.current) > scrollCooldown) {
        lastScrollTime.current = now;
        
        if (deltaY < 0) {
          goToNextPage();
        } else {
          goToPreviousPage();
        }
      }
    }
    
    touchState.current.isActive = false;
    touchState.current.containerScrolled = false;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      goToNextPage();
    }
  };

  if (showTechDiff) {
    return <TechDiffPage />;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="landing-page"
      ref={containerRef}
      onWheel={handleWheel}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      <BackgroundBeams />
      
      <div className="page-container">
        {PAGE_CONFIG.map((pageConfig) => {
          const PageComponent = pageConfig.component;
          const currentOrder = getPageOrder(currentPage);
          const pageOrder = pageConfig.order;
          const isCurrentPage = pageConfig.id === currentPage;
          const isPreviousPage = pageConfig.id === previousPage;
          
          let pageClass = 'page-wrapper';
          
          if (isCurrentPage) {
            pageClass += ' active';
          } else if (isPreviousPage && isTransitioning) {
            const prevOrder = getPageOrder(previousPage!);
            const direction = prevOrder < currentOrder ? 'up' : 'down';
            
            if (transitionMode === 'direct') {
              pageClass += ` direct-${direction}`;
            } else {
              pageClass += ` sequential-${direction}`;
            }
          } else {
            const direction = pageOrder < currentOrder ? 'up' : 'down';
            
            if (transitionMode === 'direct') {
              pageClass += ` direct-${direction}`;
            } else {
              pageClass += ` sequential-${direction}`;
            }
          }
          
          pageClass += ` ${pageConfig.id}-page-wrapper`;
          
          return (
            <div key={pageConfig.id} className={pageClass}>
              <PageComponent />
            </div>
          );
        })}
      </div>
    </div>
  );
}; 