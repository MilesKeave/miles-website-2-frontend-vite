import { useProfile } from '../hooks/useProfile';
import { TechDiffPage } from './TechDiffPage';
import { BackgroundBeams } from './ui/background-beams';
import { useState, useRef, useEffect } from 'react';
import type { PageId, TransitionMode } from '../types/pages';
import { PAGE_CONFIG, getNextPage, getPreviousPage, getPageOrder, getTotalPages } from '../config/pages';
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
  const scrollCooldown = 800; // 800ms cooldown between scroll transitions
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
  }>({
    startY: 0,
    startX: 0,
    startTime: 0,
    isActive: false
  });

  // Dynamic navigation functions
  const navigateToPage = (targetPageId: PageId, mode: TransitionMode = 'direct') => {
    if (isTransitioning || targetPageId === currentPage) return;
    
    setIsTransitioning(true);
    setTransitionMode(mode);
    setPreviousPage(currentPage);
    
    // For sequential transitions, delay the page change to allow current page to transition out
    if (mode === 'sequential') {
      setTimeout(() => {
        onPageChange(targetPageId);
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitionMode('sequential');
          setPreviousPage(null);
        }, 400);
      }, 10); // Minimal delay to start the transition
    } else {
      // For direct transitions, change immediately
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

  // Update transition mode based on navigation type
  useEffect(() => {
    if (isDirectNavigation) {
      setTransitionMode('direct');
    } else {
      setTransitionMode('sequential');
    }
  }, [isDirectNavigation]);

  // Dynamic wheel event handler for trackpad gestures
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    
    // Check if scrolling is happening within a scrollable container
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
      
      // Check if this is a new scroll gesture (gap in time or different container)
      const isNewGesture = !scrollGestureState.current.isActive || 
                          scrollGestureState.current.startContainer !== container ||
                          (now - scrollGestureState.current.lastEventTime) > 200;
      
      if (isNewGesture) {
        // Start tracking a new scroll gesture - record where it starts
        scrollGestureState.current = {
          isActive: true,
          startPosition: scrollTop,
          startContainer: container,
          lastEventTime: now
        };
      } else {
        // Continue tracking existing gesture
        scrollGestureState.current.lastEventTime = now;
      }
      
      // Check if we're at a boundary and trying to scroll beyond it
      if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
        // We're at a boundary and trying to scroll beyond it
        const startedAtTop = scrollGestureState.current.startPosition === 0;
        const startedAtBottom = scrollGestureState.current.startPosition + clientHeight >= scrollHeight - 1;
        
        // Only allow page transition if:
        // 1. The scroll gesture started at the boundary we're trying to scroll beyond
        // 2. It's a strong scroll gesture
        // 3. We're not in cooldown
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
          
          // Reset gesture state after transition
          scrollGestureState.current.isActive = false;
        } else {
          // Prevent parent scroll but don't transition
          e.preventDefault();
          e.stopPropagation();
        }
      } else if (!isAtTop && !isAtBottom) {
        // User is scrolling in the middle - let container handle it normally
      } else {
        // User is at boundary but scrolling in opposite direction - prevent parent scroll
        e.preventDefault();
        e.stopPropagation();
      }
      
      return;
    }
    
    // Reset gesture state when not in scrollable container
    scrollGestureState.current.isActive = false;
    
    // Not in a scrollable container - use normal page transition logic
    if (Math.abs(e.deltaY) > 10 && (now - lastScrollTime.current) > scrollCooldown) {
      e.preventDefault();
      lastScrollTime.current = now;
      
      if (e.deltaY > 0) {
        // Scroll down - go to next page
        console.log('Wheel down detected - going to next page');
        goToNextPage();
      } else if (e.deltaY < 0) {
        // Scroll up - go to previous page
        console.log('Wheel up detected - going to previous page');
        goToPreviousPage();
      }
    }
  };

  // Touch event handlers for mobile swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const target = e.target as HTMLElement;
    const scrollableContainer = target.closest('[class*="overflow-y-auto"], [class*="overflow-auto"]');
    
    // If touching a scrollable container, check if we're at a boundary
    if (scrollableContainer) {
      const container = scrollableContainer as HTMLElement;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      
      // Only track touch if we're at a boundary
      if (isAtTop || isAtBottom) {
        touchState.current = {
          startY: touch.clientY,
          startX: touch.clientX,
          startTime: Date.now(),
          isActive: true
        };
      }
    } else {
      // Not in scrollable container - track all touches for page navigation
      touchState.current = {
        startY: touch.clientY,
        startX: touch.clientX,
        startTime: Date.now(),
        isActive: true
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchState.current.isActive) return;
    
    const touch = e.touches[0];
    const target = e.target as HTMLElement;
    const scrollableContainer = target.closest('[class*="overflow-y-auto"], [class*="overflow-auto"]');
    
    // If in a scrollable container, check if we're at boundary and trying to scroll beyond
    if (scrollableContainer) {
      const container = scrollableContainer as HTMLElement;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      
      const deltaY = touch.clientY - touchState.current.startY;
      const isSwipingUp = deltaY < -10; // Swiping up (finger moving up)
      const isSwipingDown = deltaY > 10; // Swiping down (finger moving down)
      
      // If at boundary and trying to swipe beyond it, prevent default scrolling
      if ((isAtTop && isSwipingUp) || (isAtBottom && isSwipingDown)) {
        e.preventDefault();
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
    
    // Check if it's a vertical swipe (not horizontal)
    const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX);
    const minSwipeDistance = 50; // Minimum distance for a swipe
    const maxSwipeTime = 500; // Maximum time for a swipe (ms)
    
    // Check if we're in a scrollable container
    const target = e.target as HTMLElement;
    const scrollableContainer = target.closest('[class*="overflow-y-auto"], [class*="overflow-auto"]');
    
    if (scrollableContainer) {
      const container = scrollableContainer as HTMLElement;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      
      // Only allow page transition if:
      // 1. It's a vertical swipe
      // 2. Swipe distance is sufficient
      // 3. Swipe time is reasonable
      // 4. We're at the appropriate boundary
      // 5. We're not in cooldown
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
      // Not in scrollable container - allow page navigation with any vertical swipe
      if (isVerticalSwipe && Math.abs(deltaY) > minSwipeDistance && deltaTime < maxSwipeTime && (now - lastScrollTime.current) > scrollCooldown) {
        lastScrollTime.current = now;
        
        if (deltaY < 0) {
          // Swipe up - go to next page
          goToNextPage();
        } else {
          // Swipe down - go to previous page
          goToPreviousPage();
        }
      }
    }
    
    // Reset touch state
    touchState.current.isActive = false;
  };

  // Dynamic click/tap detection for mobile
  const handleClick = (e: React.MouseEvent) => {
    // Only trigger on the main container, not on buttons
    if (e.target === e.currentTarget) {
      console.log('Container clicked - going to next page');
      goToNextPage();
    }
  };

  // Show tech diff page if loading for more than 4 seconds
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
      {/* Fixed Background - Always visible */}
      <BackgroundBeams />
      
      {/* Page Container with Teleportation Transition Effects */}
      <div className="page-container">
        {PAGE_CONFIG.map((pageConfig) => {
          const PageComponent = pageConfig.component;
          const currentOrder = getPageOrder(currentPage);
          const pageOrder = pageConfig.order;
          const isCurrentPage = pageConfig.id === currentPage;
          const isPreviousPage = pageConfig.id === previousPage;
          
          // Determine the CSS class based on page position and transition mode
          let pageClass = 'page-wrapper';
          
          if (isCurrentPage) {
            pageClass += ' active';
          } else if (isPreviousPage && isTransitioning) {
            // Previous page during transition - determine exit direction
            const prevOrder = getPageOrder(previousPage!);
            const direction = prevOrder < currentOrder ? 'up' : 'down';
            
            if (transitionMode === 'direct') {
              pageClass += ` direct-${direction}`;
            } else {
              pageClass += ` sequential-${direction}`;
            }
          } else {
            // Other pages - determine position relative to current page
            const direction = pageOrder < currentOrder ? 'up' : 'down';
            
            if (transitionMode === 'direct') {
              pageClass += ` direct-${direction}`;
            } else {
              pageClass += ` sequential-${direction}`;
            }
          }
          
          // Add page-specific class for styling
          pageClass += ` ${pageConfig.id}-page-wrapper`;
          
          return (
            <div key={pageConfig.id} className={pageClass}>
              <PageComponent />
            </div>
          );
        })}
      </div>

      {/* Dynamic Swipe Indicators */}
    </div>
  );
}; 