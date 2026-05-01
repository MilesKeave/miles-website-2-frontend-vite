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
    const isAnimatingOut = isAnimating && selectedFolder && foldersOpacity !== undefined && foldersOpacity < 1 && !isGoingBackToFolders;
    const isAnimatingIn = isAnimating && isGoingBackToFolders && foldersOpacity !== undefined && foldersOpacity >= 0;

    const useSimpleFade = !isTwoByThreeLayout;

    const row = Math.floor(index / 3);
    const col = index % 3;

    let slideOutDirection = '';
    if (isTwoByThreeLayout) {
      if (row === 0) {
        if (col === 0) slideOutDirection = 'left';
        else if (col === 1) slideOutDirection = 'up';
        else slideOutDirection = 'right';
      } else {
        if (col === 0) slideOutDirection = 'left';
        else if (col === 1) slideOutDirection = 'down';
        else slideOutDirection = 'right';
      }
    }

    let slideInDirection = slideOutDirection;

    let slideOutStyle = {};
    if (!isSelected && isAnimatingOut) {
      if (useSimpleFade) {
        slideOutStyle = {
          opacity: 0,
          transition: 'opacity 1s ease-in-out'
        };
      } else {
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
    
    let slideInStyle = {};
    if (isAnimatingIn && foldersOpacity !== undefined) {
      if (useSimpleFade) {
        slideInStyle = {
          opacity: foldersOpacity,
          transition: 'opacity 1s ease-in-out'
        };
      } else {
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
          slideInStyle = {
            transform: initialTransform,
            opacity: 0
          };
        } else {
          slideInStyle = {
            transform: 'translateX(0) translateY(0)',
            opacity: foldersOpacity,
            transition: 'transform 1s ease-in-out, opacity 1s ease-in-out'
          };
        }
      }
    }
    
    let fadeOutStyle = {};
    if (isSelected && isAnimatingOut && selectedFolder && !isAnimatingIn && !isGoingBackToFolders) {
      if (useSimpleFade) {
        fadeOutStyle = {
          opacity: 0,
          transition: 'opacity 1s ease-in-out 0.7s'
        };
      } else {
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
        
        fadeOutStyle = {
          opacity: 0,
          transform: slideTransform,
          transition: 'opacity 0.8s ease-in-out 0.7s, transform 0.1s ease-in-out 1.5s'
        };
      }
    }
    
    const defaultOpacity = foldersOpacity !== undefined ? foldersOpacity : 1;
    
    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => onCardClick?.(card)}
        className={cn(
          "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden w-full cursor-pointer",
          "h-[calc((100vh-280px)/3)] md:h-auto",
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
          loading="lazy"
          decoding="async"
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

  useEffect(() => {
    const checkLayout = () => {
      if (!gridRef.current) return;

      const computedStyle = window.getComputedStyle(gridRef.current);
      const gridTemplateColumns = computedStyle.gridTemplateColumns;
      const columnCount = gridTemplateColumns.split(' ').length;
      const hasThreeColumns = columnCount === 3;
      const isDesktop = window.innerWidth >= 1024;

      setIsTwoByThreeLayout(hasThreeColumns && isDesktop);
    };

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
      className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-10 max-w-5xl mx-auto md:px-8 w-full py-4 pb-24 md:pb-4"
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