"use client";

import React, { useState, useEffect } from "react";
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
  }) => {
    const isSelected = selectedFolder && card.folder?.id === selectedFolder.id;
    const isAnimatingOut = isAnimating && selectedFolder && foldersOpacity !== undefined && foldersOpacity < 1;
    const isAnimatingIn = isAnimating && !selectedFolder && foldersOpacity !== undefined;
    
    // Determine position in 2x3 grid (0-5)
    const row = Math.floor(index / 3); // 0 = top row, 1 = bottom row
    const col = index % 3; // 0 = left, 1 = middle, 2 = right
    
    // Assign slide out direction based on position
    let slideOutDirection = '';
    if (row === 0) { // Top row
      if (col === 0) slideOutDirection = 'left';      // Top left
      else if (col === 1) slideOutDirection = 'up';   // Top middle
      else slideOutDirection = 'right';                // Top right
    } else { // Bottom row
      if (col === 0) slideOutDirection = 'left';      // Bottom left
      else if (col === 1) slideOutDirection = 'down'; // Bottom middle
      else slideOutDirection = 'right';                // Bottom right
    }
    
    // Slide in direction is the same as slide out (for going back to folders)
    let slideInDirection = slideOutDirection;
    
    // Non-selected: slide out in assigned direction over 1s
    let slideOutStyle = {};
    if (!isSelected && isAnimatingOut) {
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
    
    // Non-selected: slide in from opposite direction over 1s
    let slideInStyle = {};
    if (!isSelected && isAnimatingIn && foldersOpacity !== undefined) {
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
    
    // Selected: fade out over 3s
    const fadeOutStyle = isSelected && isAnimatingOut ? {
      opacity: foldersOpacity,
      transition: 'opacity 3s ease-in-out'
    } : {};
    
    // Default opacity when not animating
    const defaultOpacity = foldersOpacity !== undefined ? foldersOpacity : 1;
    
    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => onCardClick?.(card)}
        className={cn(
          "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden w-full cursor-pointer",
          hovered !== null && hovered !== index && !isAnimating && "blur-sm scale-[0.98]"
        )}
        style={{
          height: '100%',
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
}

export function FocusCards({ cards, onCardClick, isAnimating, selectedFolder, onPositionUpdate, animationState, foldersOpacity }: FocusCardsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full py-4"
      style={{
        gridTemplateRows: 'repeat(2, minmax(200px, 1fr))',
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
        />
      ))}
    </div>
  );
}