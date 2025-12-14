"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    isAnimating,
    selectedFolder,
    onCardClick,
    selectedFolderPosition,
    animationState,
    foldersOpacity,
    isGoingBackToFolders,
    isTwoByThreeLayout,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    isAnimating?: boolean;
    selectedFolder?: any;
    onCardClick?: (card: any) => void;
    selectedFolderPosition?: { x: number; y: number };
    animationState?: 'normal' | 'collapsing' | 'collapsed' | 'expanding';
    foldersOpacity?: number;
    isGoingBackToFolders?: boolean;
    isTwoByThreeLayout?: boolean;
  }) => {
    const isSelected = selectedFolder && card.folder?.id === selectedFolder.id;
    // When clicking a folder: selectedFolder is set, foldersOpacity goes from 1 to 0 (slide out)
    const isAnimatingOut = isAnimating && selectedFolder && foldersOpacity !== undefined && foldersOpacity < 1 && !isGoingBackToFolders;
    // When going back to folders: isAnimating is true, foldersOpacity transitions from 0 to 1
    const isAnimatingIn = isAnimating && isGoingBackToFolders && foldersOpacity !== undefined && foldersOpacity >= 0;
    
    // Use simple fade transitions if NOT in 2x3 layout
    const useSimpleFade = !isTwoByThreeLayout;
    
    // Determine position in 2x3 grid (0-5) - only needed for directional transitions
    const row = Math.floor(index / 3); // 0 = top row, 1 = bottom row
    const col = index % 3; // 0 = left, 1 = middle, 2 = right
    
    // Assign slide out direction based on position (only for 2x3 layout)
    let slideOutDirection = '';
    if (isTwoByThreeLayout) {
      if (row === 0) { // Top row
        if (col === 0) slideOutDirection = 'left';      // Top left
        else if (col === 1) slideOutDirection = 'up';   // Top middle
        else slideOutDirection = 'right';                // Top right
      } else { // Bottom row
        if (col === 0) slideOutDirection = 'left';      // Bottom left
        else if (col === 1) slideOutDirection = 'down'; // Bottom middle
        else slideOutDirection = 'right';                // Bottom right
      }
    }
    
    // Slide in direction is the opposite of slide out (for going back to folders)
    // If it slid out to the left, it should slide in from the left (coming from left)
    // So the slide-in direction is the same as slide-out direction
    let slideInDirection = slideOutDirection;
    
    // Non-selected: slide out in assigned direction over 1s (or simple fade)
    let slideOutStyle = {};
    if (!isSelected && isAnimatingOut) {
      if (useSimpleFade) {
        // Simple fade out
        slideOutStyle = {
          opacity: 0,
          transition: 'opacity 1s ease-in-out'
        };
      } else {
        // Directional slide out
        let transform = '';
        switch (slideOutDirection) {
          case 'left':
            transform = 'translateX(-100vw)';
            break;
          case 'right':
            transform = 'translateX(100vw)';
            break;
          case 'up':
            transform = 'translateY(-100vh)';
            break;
          case 'down':
            transform = 'translateY(100vh)';
            break;
        }
        slideOutStyle = {
          transform,
          opacity: 0,
          transition: 'transform 1s ease-in-out, opacity 1s ease-in-out'
        };
      }
    }
    
    // All folders: slide in from opposite direction over 1s (or simple fade in)
    let slideInStyle = {};
    if (isAnimatingIn && foldersOpacity !== undefined) {
      if (useSimpleFade) {
        // Simple fade in
        slideInStyle = {
          opacity: foldersOpacity,
          transition: 'opacity 1s ease-in-out'
        };
      } else {
        // Directional slide in
        let initialTransform = '';
        switch (slideInDirection) {
          case 'left':
            initialTransform = 'translateX(-100vw)';
            break;
          case 'right':
            initialTransform = 'translateX(100vw)';
            break;
          case 'up':
            initialTransform = 'translateY(-100vh)';
            break;
          case 'down':
            initialTransform = 'translateY(100vh)';
            break;
        }
        
        if (foldersOpacity === 0) {
          // Start off-screen with no transition
          slideInStyle = {
            transform: initialTransform,
            opacity: 0
          };
        } else {
          // Animate to center position - use keyframes or ensure transition is applied
          slideInStyle = {
            transform: 'translateX(0) translateY(0)',
            opacity: foldersOpacity,
            transition: 'transform 1s ease-in-out, opacity 1s ease-in-out'
          };
        }
      }
    }
    
    // Selected: fade out over 1s (delayed 1s), then slide off screen in assigned direction (or simple fade)
    // Timeline: 0-1s delay, 1-2s fade out, 2-3s slide off screen
    // Only apply when going forward (clicking a folder), not when going back
    let fadeOutStyle = {};
    if (isSelected && isAnimatingOut && selectedFolder && !isAnimatingIn && !isGoingBackToFolders) {
      if (useSimpleFade) {
        // Simple fade out
        fadeOutStyle = {
          opacity: 0,
          transition: 'opacity 1s ease-in-out 0.7s'
        };
      } else {
        // Directional fade out then slide
        let slideTransform = '';
        switch (slideOutDirection) {
          case 'left':
            slideTransform = 'translateX(-100vw)';
            break;
          case 'right':
            slideTransform = 'translateX(100vw)';
            break;
          case 'up':
            slideTransform = 'translateY(-100vh)';
            break;
          case 'down':
            slideTransform = 'translateY(100vh)';
            break;
        }
        
        // Use opacity transition for fade (0.7s delay, 0.8s duration)
        // Then use transform transition for slide (instant once opacity reaches 0)
        fadeOutStyle = {
          opacity: 0,
          transform: slideTransform,
          transition: 'opacity 0.8s ease-in-out 0.7s, transform 0.1s ease-in-out 1.5s'
        };
      }
    }
    
    // Default opacity when not animating
    const defaultOpacity = foldersOpacity !== undefined ? foldersOpacity : 1;
    
    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => onCardClick?.(card)}
        className={cn(
          "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden w-full cursor-pointer",
          "h-[calc(100vh-250px)] md:h-auto",
          hovered !== null && hovered !== index && !isAnimating && "blur-sm scale-[0.98]"
        )}
        style={{
          ...(Object.keys(slideInStyle).length > 0 ? slideInStyle : {}),
          ...(Object.keys(slideOutStyle).length > 0 ? slideOutStyle : {}),
          ...(Object.keys(fadeOutStyle).length > 0 ? fadeOutStyle : {}),
          ...(Object.keys(slideInStyle).length === 0 && Object.keys(slideOutStyle).length === 0 && Object.keys(fadeOutStyle).length === 0 ? { opacity: defaultOpacity } : {})
        }}
      >
        <img
          src={card.src}
          alt={card.title}
          className="object-cover object-center absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        <div
          className={cn(
            "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
            hovered === index ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
            {card.title}
          </div>
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";

type Card = {
  title: string;
  src: string;
  folder?: any;
};

interface FocusCardsProps {
  cards: Card[];
  onCardClick?: (card: Card) => void;
  isAnimating?: boolean;
  selectedFolder?: any;
  onPositionUpdate?: (position: { x: number; y: number }) => void;
  animationState?: 'normal' | 'collapsing' | 'collapsed' | 'expanding';
  foldersOpacity?: number;
  isGoingBackToFolders?: boolean;
}

export function FocusCards({ cards, onCardClick, isAnimating, selectedFolder, onPositionUpdate, animationState, foldersOpacity, isGoingBackToFolders }: FocusCardsProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isTwoByThreeLayout, setIsTwoByThreeLayout] = useState(false);

  // Check if we're in 2x3 layout (3 columns, 2 rows)
  useEffect(() => {
    const checkLayout = () => {
      if (!gridRef.current) return;
      
      const computedStyle = window.getComputedStyle(gridRef.current);
      const gridTemplateColumns = computedStyle.gridTemplateColumns;
      
      // Check if we have 3 columns (for lg and up)
      const columnCount = gridTemplateColumns.split(' ').length;
      const hasThreeColumns = columnCount === 3;
      
      // For 2x3 layout, we need exactly 3 columns and the grid should naturally form 2 rows with 6 items
      // Check window width to determine if we're in desktop mode (lg breakpoint)
      const isDesktop = window.innerWidth >= 1024;
      
      // Only 2x3 layout if we have 3 columns AND we're on desktop (lg breakpoint)
      setIsTwoByThreeLayout(hasThreeColumns && isDesktop);
    };

    // Check on mount and resize
    checkLayout();
    const resizeObserver = new ResizeObserver(checkLayout);
    if (gridRef.current) {
      resizeObserver.observe(gridRef.current);
    }
    window.addEventListener('resize', checkLayout);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkLayout);
    };
  }, []);

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full py-4"
      style={{
        gridTemplateRows: 'auto',
        minHeight: 'calc(100vh - 250px)'
      }}
    >
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
          isAnimating={isAnimating}
          selectedFolder={selectedFolder}
          onCardClick={onCardClick}
          selectedFolderPosition={undefined}
          animationState={animationState}
          foldersOpacity={foldersOpacity}
          isGoingBackToFolders={isGoingBackToFolders}
          isTwoByThreeLayout={isTwoByThreeLayout}
        />
      ))}
    </div>
  );
}