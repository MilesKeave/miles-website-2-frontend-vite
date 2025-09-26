"use client";

import React, { useState, useRef, useEffect } from "react";
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
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
    const isSelected = selectedFolder?.id === card.folder?.id;
    const shouldCollapse = animationState === 'collapsing' && !isSelected;
    const shouldExpand = animationState === 'expanding' && !isSelected;
    const isCollapsed = animationState === 'collapsed' && !isSelected;
    
    
    // Calculate the path to the selected folder
    const getTransform = () => {
      if (!shouldCollapse && !shouldExpand && !isCollapsed) return 'none';
      if (!selectedFolderPosition) return 'none';
      
      const deltaX = selectedFolderPosition.x - cardPosition.x;
      const deltaY = selectedFolderPosition.y - cardPosition.y;
      
      
      // For collapsing: move to selected folder position
      if (shouldCollapse) {
        return `translateX(${deltaX}px) translateY(${deltaY}px) scale(0.3)`;
      }
      
      // For collapsed state: stay in collapsed position (no animation)
      if (isCollapsed) {
        return `translateX(${deltaX}px) translateY(${deltaY}px) scale(0.3)`;
      }
      
      // For expanding: start from selected folder position and animate to original
      if (shouldExpand) {
        return `translateX(${deltaX}px) translateY(${deltaY}px) scale(0.3)`;
      }
      
      return 'none';
    };
    
    // Update card position when ref changes or when animation starts
    useEffect(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const position = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        setCardPosition(position);
      }
    }, [isAnimating]); // Recalculate when animation starts
    
    return (
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => onCardClick?.(card)}
        className={cn(
          "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full cursor-pointer",
          // Add transition for collapsing and expanding, but not for collapsed state
          shouldCollapse && "transition-all duration-700 ease-in-out",
          shouldExpand && "transition-all duration-700 ease-in-out animate-expand-from-collapsed",
          hovered !== null && hovered !== index && !isAnimating && "blur-sm scale-[0.98]"
        )}
        style={{
          zIndex: isSelected ? 50 : (shouldCollapse || shouldExpand || isCollapsed ? 10 : 20),
          transform: getTransform(),
          opacity: (shouldCollapse || shouldExpand || isCollapsed) ? 0.1 : 1,
          border: isSelected ? '2px solid red' : (shouldCollapse || shouldExpand || isCollapsed) ? '2px solid blue' : 'none',
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
}

export function FocusCards({ cards, onCardClick, isAnimating, selectedFolder, onPositionUpdate, animationState }: FocusCardsProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedFolderPosition, setSelectedFolderPosition] = useState<{ x: number; y: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);



  // Calculate selected folder position immediately when selectedFolder changes
  useEffect(() => {
    if (selectedFolder && gridRef.current) {
      const selectedIndex = cards.findIndex(card => card.folder?.id === selectedFolder.id);
      
      if (selectedIndex !== -1) {
        // Use requestAnimationFrame to ensure DOM is ready but still synchronous
        requestAnimationFrame(() => {
          const cardElement = gridRef.current?.children[selectedIndex] as HTMLElement;
          if (cardElement) {
            const cardRect = cardElement.getBoundingClientRect();
            const x = cardRect.left + cardRect.width / 2;
            const y = cardRect.top + cardRect.height / 2;
            
            setSelectedFolderPosition({ x, y });
            onPositionUpdate?.({ x, y });
          }
        });
      }
    }
  }, [selectedFolder, cards]);

  return (
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
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
          selectedFolderPosition={selectedFolderPosition}
          animationState={animationState}
        />
      ))}
    </div>
  );
}