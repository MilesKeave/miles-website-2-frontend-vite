import { FocusCards } from "@/components/ui/focus-cards";
import { usePhotography } from "../hooks/usePhotography";
import { useState, useEffect, useRef } from "react";

interface PhotoFolder {
  id: string;
  name: string;
  description: string;
  mainImageUrl: string;
  photoUrls: string[];
  photoCount: number;
  createdAt: string;
  updatedAt: string;
}

export function PhotographyPage() {
  const { photoFolders, loading, error } = usePhotography();
  const [selectedFolder, setSelectedFolder] = useState<PhotoFolder | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [isTransitioningToPhotos, setIsTransitioningToPhotos] = useState(false);
  const [collapsedFolderPosition, setCollapsedFolderPosition] = useState<{ x: number; y: number } | null>(null);
  const [shouldAnimateFirstPhoto, setShouldAnimateFirstPhoto] = useState(false);
  const [folderAnimationState, setFolderAnimationState] = useState<'normal' | 'collapsing' | 'collapsed' | 'expanding'>('normal');
  const [isTransitioningBackToFolders, setIsTransitioningBackToFolders] = useState(false);
  const [shouldEmergeRemainingPhotos, setShouldEmergeRemainingPhotos] = useState(false);
  const [shouldRenderRemainingPhotos, setShouldRenderRemainingPhotos] = useState(false);
  const [firstPhotoReady, setFirstPhotoReady] = useState(false);
  const [isForwardTransition, setIsForwardTransition] = useState(false);
  const [shouldCollapseRemainingPhotos, setShouldCollapseRemainingPhotos] = useState(false);
  const [isBackwardsTransition, setIsBackwardsTransition] = useState(false);
  const [storedBackwardsPaths, setStoredBackwardsPaths] = useState<{ [key: number]: string }>({});
  const [isTransitioningBackwards, setIsTransitioningBackwards] = useState(false);

  // Convert photo folders to focus cards format
  const cards = photoFolders.map(folder => ({
    title: folder.name,
    src: folder.mainImageUrl,
    folder: folder
  }));

  const handleFolderClick = (folder: PhotoFolder) => {
    console.log('Folder clicked:', folder.name, 'Current animating:', isAnimating);
    
    if (isAnimating) return; // Prevent multiple clicks during animation
    
    console.log('Setting animation state...');
    setIsAnimating(true);
    setSelectedFolder(folder);
    setShouldAnimateFirstPhoto(false);
    setShouldRenderRemainingPhotos(false);
    setShouldEmergeRemainingPhotos(false);
    setFirstPhotoReady(false);
    setIsForwardTransition(true); // Forward transition: folder to photo
    setFolderAnimationState('collapsing'); // Start collapse animation
  };

  const handleBackToFolders = () => {
    console.log('🔄 handleBackToFolders called - starting backwards transition');
    // Start backwards transition - set this immediately to prevent flash
    setIsTransitioningBackwards(true);
    setIsBackwardsTransition(true);
    setShouldCollapseRemainingPhotos(true);
    setShouldEmergeRemainingPhotos(false);
    setShouldRenderRemainingPhotos(true);
    setIsForwardTransition(false);
    console.log('🔄 State changes applied:', {
      isTransitioningBackwards: true,
      isBackwardsTransition: true,
      shouldCollapseRemainingPhotos: true,
      shouldEmergeRemainingPhotos: false,
      shouldRenderRemainingPhotos: true,
      isForwardTransition: false
    });
  };

  // Function to calculate and store backwards paths for each photo
  const calculateAndStoreBackwardsPaths = (firstPhotoPos: { x: number; y: number }, remainingPositions: { [key: number]: { x: number; y: number } }) => {
    const paths: { [key: number]: string } = {};
    
    Object.entries(remainingPositions).forEach(([index, position]) => {
      const photoIndex = parseInt(index);
      // Calculate the path from current position back to first photo position
      const deltaX = firstPhotoPos.x - position.x;
      const deltaY = firstPhotoPos.y - position.y;
      paths[photoIndex] = `translateX(${deltaX}px) translateY(${deltaY}px)`;
    });
    
    setStoredBackwardsPaths(paths);
    console.log('Stored backwards paths:', paths);
  };

  // State-driven animation flow - no setTimeout dependencies
  useEffect(() => {
    if (folderAnimationState === 'collapsing') {
      // After folders finish collapsing, transition to photos
      const timer = setTimeout(() => {
        setFolderAnimationState('collapsed');
        setIsTransitioningToPhotos(true);
        setShowPhotos(true);
        setShouldAnimateFirstPhoto(true);
        setFirstPhotoReady(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [folderAnimationState]);

  useEffect(() => {
    if (shouldAnimateFirstPhoto && collapsedFolderPosition) {
      // After first photo starts animating, prepare remaining photos
      const timer = setTimeout(() => {
        setShouldRenderRemainingPhotos(true);
        setShouldEmergeRemainingPhotos(true);
      }, 700); // Wait for first photo to reach position
      return () => clearTimeout(timer);
    }
  }, [shouldAnimateFirstPhoto, collapsedFolderPosition]);

  useEffect(() => {
    if (shouldCollapseRemainingPhotos) {
      // After remaining photos finish collapsing, start first photo transition
      const timer = setTimeout(() => {
        setIsTransitioningBackToFolders(true);
        setShouldAnimateFirstPhoto(true);
        setFirstPhotoReady(true);
      }, 700); // Wait for remaining photos to collapse
      return () => clearTimeout(timer);
    }
  }, [shouldCollapseRemainingPhotos]);

  useEffect(() => {
    if (isTransitioningBackToFolders) {
      // After first photo glides back, hide photos and show folders
      const timer = setTimeout(() => {
        setShowPhotos(false);
        setIsTransitioningToPhotos(false);
        setFolderAnimationState('collapsed');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isTransitioningBackToFolders]);

  useEffect(() => {
    if (folderAnimationState === 'collapsed' && isTransitioningBackToFolders) {
      // After folders appear in collapsed state, expand them
      const timer = setTimeout(() => {
        setFolderAnimationState('expanding');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [folderAnimationState, isTransitioningBackToFolders]);

  useEffect(() => {
    if (folderAnimationState === 'expanding') {
      // After expansion completes, reset everything
      const timer = setTimeout(() => {
        setSelectedFolder(null);
        setIsAnimating(false);
        setFolderAnimationState('normal');
        setIsTransitioningBackToFolders(false);
        setShouldRenderRemainingPhotos(false);
        setShouldEmergeRemainingPhotos(false);
        setFirstPhotoReady(false);
        setIsTransitioningBackwards(false);
        setIsForwardTransition(false);
        setShouldCollapseRemainingPhotos(false);
        setIsBackwardsTransition(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [folderAnimationState]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading photography...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">Error loading photography: {error}</div>
      </div>
    );
  }

  // Show message if no photo folders exist
  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl text-center">
          <h1 className="text-4xl font-bold mb-4">My Photography</h1>
          <p>No photo folders found. Upload some photos via Postman to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">My Photography</h1>
        
        <div className="relative">
          {/* Show FocusCards during folder collapse animation */}
          {!showPhotos && (
            <FocusCards 
              cards={cards} 
              onCardClick={(card) => handleFolderClick(card.folder)}
              isAnimating={isAnimating}
              selectedFolder={selectedFolder}
              onPositionUpdate={setCollapsedFolderPosition}
              animationState={folderAnimationState}
            />
          )}
          
          {/* Show photos after transition completes */}
          {showPhotos && selectedFolder && (
            <>
              {/* Photo Grid */}
                  <PhotoGrid 
                    photos={selectedFolder.photoUrls}
                    folderName={selectedFolder.name}
                    isTransitioningToPhotos={isTransitioningToPhotos}
                    collapsedFolderPosition={collapsedFolderPosition}
                    shouldAnimateFirstPhoto={shouldAnimateFirstPhoto}
                    isTransitioningBackToFolders={isTransitioningBackToFolders}
                    shouldEmergeRemainingPhotos={shouldEmergeRemainingPhotos}
                    shouldRenderRemainingPhotos={shouldRenderRemainingPhotos}
                    firstPhotoReady={firstPhotoReady}
                    isForwardTransition={isForwardTransition}
                    shouldCollapseRemainingPhotos={shouldCollapseRemainingPhotos}
                    isBackwardsTransition={isBackwardsTransition}
                    storedBackwardsPaths={storedBackwardsPaths}
                    onCalculateBackwardsPaths={calculateAndStoreBackwardsPaths}
                    isTransitioningBackwards={isTransitioningBackwards}
                  />
            </>
          )}
        </div>
        
        {/* Back button - positioned outside the photo container */}
        {showPhotos && selectedFolder && (
          <button
            onClick={handleBackToFolders}
            className="fixed left-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors z-50"
          >
            ← Back to Folders
          </button>
        )}
      </div>
    </div>
  );
}

// Photo Grid Component - matches FocusCards layout exactly
function PhotoGrid({ photos, folderName, isTransitioningToPhotos, collapsedFolderPosition, shouldAnimateFirstPhoto, isTransitioningBackToFolders, shouldEmergeRemainingPhotos, shouldRenderRemainingPhotos, firstPhotoReady, isForwardTransition, shouldCollapseRemainingPhotos, isBackwardsTransition, storedBackwardsPaths, onCalculateBackwardsPaths, isTransitioningBackwards }: { 
  photos: string[], 
  folderName: string,
  isTransitioningToPhotos?: boolean,
  collapsedFolderPosition?: { x: number; y: number } | null,
  shouldAnimateFirstPhoto?: boolean,
  isTransitioningBackToFolders?: boolean,
  shouldEmergeRemainingPhotos?: boolean,
  shouldRenderRemainingPhotos?: boolean,
  firstPhotoReady?: boolean,
  isForwardTransition?: boolean,
  shouldCollapseRemainingPhotos?: boolean,
  isBackwardsTransition?: boolean,
  storedBackwardsPaths?: { [key: number]: string },
  onCalculateBackwardsPaths?: (firstPhotoPos: { x: number; y: number }, remainingPositions: { [key: number]: { x: number; y: number } }) => void,
  isTransitioningBackwards?: boolean
}) {
  const firstPhotoRef = useRef<HTMLDivElement>(null);
  const remainingPhotoRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [firstPhotoPosition, setFirstPhotoPosition] = useState<{ x: number; y: number } | null>(null);
  const [remainingPhotoPositions, setRemainingPhotoPositions] = useState<{ [key: number]: { x: number; y: number } }>({});

  // Calculate first photo position when it mounts
  useEffect(() => {
    if (firstPhotoRef.current) {
      const rect = firstPhotoRef.current.getBoundingClientRect();
      setFirstPhotoPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
    }
  }, []);


  // Calculate remaining photo positions when they should emerge
  useEffect(() => {
    if (shouldEmergeRemainingPhotos && shouldRenderRemainingPhotos) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        const newPositions: { [key: number]: { x: number; y: number } } = {};
        Object.entries(remainingPhotoRefs.current).forEach(([index, ref]) => {
          if (ref) {
            const rect = ref.getBoundingClientRect();
            newPositions[parseInt(index)] = {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2
            };
          }
        });
        setRemainingPhotoPositions(newPositions);
      });
    }
  }, [shouldEmergeRemainingPhotos, shouldRenderRemainingPhotos]);

  // Calculate and store backwards paths when forward animation positions are ready
  useEffect(() => {
    if (shouldEmergeRemainingPhotos && shouldRenderRemainingPhotos && firstPhotoPosition && Object.keys(remainingPhotoPositions).length > 0 && onCalculateBackwardsPaths) {
      // Calculate backwards paths from current positions back to first photo position
      onCalculateBackwardsPaths(firstPhotoPosition, remainingPhotoPositions);
    }
  }, [shouldEmergeRemainingPhotos, shouldRenderRemainingPhotos, firstPhotoPosition, remainingPhotoPositions, onCalculateBackwardsPaths]);

  // Calculate remaining photo positions when they should collapse
  useEffect(() => {
    if (shouldCollapseRemainingPhotos && shouldRenderRemainingPhotos && Object.keys(remainingPhotoPositions).length === 0) {
      // Only calculate positions once, when we first start the collapse
      const newPositions: { [key: number]: { x: number; y: number } } = {};
      Object.entries(remainingPhotoRefs.current).forEach(([index, ref]) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          newPositions[parseInt(index)] = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          };
        }
      });
      setRemainingPhotoPositions(newPositions);
    }
  }, [shouldCollapseRemainingPhotos, shouldRenderRemainingPhotos, remainingPhotoPositions]);

  // Calculate transition path for each remaining photo
  const calculatePhotoTransitionPath = (index: number) => {
    if (!firstPhotoPosition) return 'none';
    
    // For backwards transition, use stored paths calculated during forward animation
    if (isBackwardsTransition && storedBackwardsPaths && storedBackwardsPaths[index]) {
      return storedBackwardsPaths[index];
    }
    
    // For forward transition, calculate dynamically
    const currentPhotoPosition = remainingPhotoPositions[index];
    if (!currentPhotoPosition) return 'none';
    
    // Calculate the offset to position this photo at the first photo's location
    const deltaX = firstPhotoPosition.x - currentPhotoPosition.x;
    const deltaY = firstPhotoPosition.y - currentPhotoPosition.y;
    
    // For forward transition: photos start at first photo position, then animate to natural grid position
    // For backward transition: photos start at natural grid position, then animate to first photo position
    if (isBackwardsTransition) {
      // Backward: move from grid position to first photo position
      return `translateX(${deltaX}px) translateY(${deltaY}px)`;
    } else {
      // Forward: start at first photo position, then animate to natural position
      // This means we need to position them at the first photo's location initially
      return `translateX(${deltaX}px) translateY(${deltaY}px)`;
    }
  };

  // Calculate transform for first photo
  const getFirstPhotoTransform = () => {
    if (!collapsedFolderPosition || !firstPhotoPosition) return 'none';
    
    // Calculate the offset from grid position to collapsed position
    const deltaX = collapsedFolderPosition.x - firstPhotoPosition.x;
    const deltaY = collapsedFolderPosition.y - firstPhotoPosition.y;
    
    // For reverse transition: start at grid position, animate to collapsed position
    if (isTransitioningBackToFolders) {
      return `translateX(${deltaX}px) translateY(${deltaY}px)`;
    }
    
    // For forward transition: start at collapsed position, animate to grid position
    // The CSS animation will handle the transition from collapsed to grid
    return `translateX(${deltaX}px) translateY(${deltaY}px)`;
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
      {photos.map((photo, index) => {
        const isSelectedPhoto = index === 0; // First photo is the selected folder image
        const shouldEmergeFromSelected = isTransitioningToPhotos && !isSelectedPhoto && !shouldEmergeRemainingPhotos;
        const shouldAnimateFromCollapsed = isSelectedPhoto && shouldAnimateFirstPhoto && collapsedFolderPosition && firstPhotoPosition;
        const shouldAnimateBackToFolder = isSelectedPhoto && isTransitioningBackToFolders && collapsedFolderPosition && firstPhotoPosition;
        const shouldEmergeFromBehind = !isSelectedPhoto && shouldEmergeRemainingPhotos && shouldRenderRemainingPhotos;
        const shouldFadeOut = !isSelectedPhoto && shouldCollapseRemainingPhotos && shouldRenderRemainingPhotos && isBackwardsTransition;
        
        // Debug logging for backwards transition
        if (isBackwardsTransition && !isSelectedPhoto) {
          console.log(`🔍 Photo ${index} state check:`, {
            shouldEmergeRemainingPhotos,
            shouldRenderRemainingPhotos,
            shouldCollapseRemainingPhotos,
            isBackwardsTransition,
            shouldEmergeFromBehind,
            shouldFadeOut,
            isTransitioningBackwards
          });
        }
        
        // Different opacity rules for forward vs reverse transitions
        const shouldHideFirstPhoto = isSelectedPhoto && (
          // Forward transition: keep visible during transition (like reverse transition)
          (isForwardTransition && false) ||
          // Reverse transition: never hide (always visible during transition)
          (!isForwardTransition && false)
        );
        
        // Debug logging for CSS classes and transforms
        if (isSelectedPhoto) {
          console.log(`🔍 First Photo (${index}) debug:`, {
            isForwardTransition,
            isBackwardsTransition,
            shouldAnimateFromCollapsed,
            shouldAnimateBackToFolder,
            shouldHideFirstPhoto,
            firstPhotoReady,
            shouldAnimateFirstPhoto,
            collapsedFolderPosition: !!collapsedFolderPosition,
            firstPhotoPosition: !!firstPhotoPosition
          });
        }
        
        if (!isSelectedPhoto && shouldFadeOut) {
          const calculatedOpacity = shouldEmergeFromBehind ? 0 : (shouldEmergeFromSelected ? 0 : (shouldHideFirstPhoto ? 0 : 1));
          console.log(`Photo ${index} CSS debug:`, {
            shouldFadeOut,
            shouldRenderRemainingPhotos,
            shouldCollapseRemainingPhotos,
            isBackwardsTransition,
            collapseTransform: calculatePhotoTransitionPath(index),
            shouldEmergeFromBehind,
            shouldEmergeFromSelected,
            shouldHideFirstPhoto,
            calculatedOpacity,
            zIndex: isSelectedPhoto ? 50 : (shouldEmergeFromSelected ? 10 : (shouldEmergeFromBehind ? 5 : (shouldFadeOut ? 5 : 20)))
          });
        }
        
        // Only render remaining photos when they should be rendered AND (should emerge OR should fade out OR backwards transition)
        const shouldRender = shouldRenderRemainingPhotos && (shouldEmergeRemainingPhotos || shouldFadeOut || isBackwardsTransition);
        
        // For backwards transition, always render if we're in backwards mode to prevent flashing
        const shouldRenderBackwards = isBackwardsTransition && shouldRenderRemainingPhotos;
        
        // Additional safety: if we're in backwards transition, always render to prevent flashing
        const preventFlash = isBackwardsTransition || isTransitioningBackwards;
        
        const finalShouldRender = shouldRender || shouldRenderBackwards || preventFlash;
        
        // Debug render condition for backwards transition
        if (isBackwardsTransition && !isSelectedPhoto) {
          console.log(`🎯 Photo ${index} render check:`, {
            shouldRender,
            shouldRenderBackwards,
            preventFlash,
            finalShouldRender,
            shouldRenderRemainingPhotos,
            shouldEmergeRemainingPhotos,
            shouldCollapseRemainingPhotos,
            shouldFadeOut,
            isBackwardsTransition,
            isTransitioningBackwards
          });
        }
        
        if (!isSelectedPhoto && !finalShouldRender) {
          console.log(`❌ Photo ${index} - FILTERED OUT:`, {
            shouldRenderRemainingPhotos,
            shouldEmergeRemainingPhotos,
            shouldCollapseRemainingPhotos,
            shouldFadeOut,
            isBackwardsTransition,
            shouldRender,
            finalShouldRender
          });
          return null;
        }
        
        return (
          <div
            key={index}
            ref={isSelectedPhoto ? firstPhotoRef : ((shouldEmergeFromBehind || shouldFadeOut) ? (ref) => {
              remainingPhotoRefs.current[index] = ref;
            } : undefined)}
            className={`photo-container rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full ${
              shouldAnimateFromCollapsed ? 'animate-from-collapsed-to-grid' : ''
            } ${
              (isSelectedPhoto && (isTransitioningToPhotos || folderAnimationState === 'collapsing') && collapsedFolderPosition && firstPhotoPosition && !shouldAnimateFromCollapsed) ? 'transition-transform duration-700 ease-in-out' : ''
            } ${
              shouldAnimateBackToFolder ? 'transition-transform duration-700 ease-in-out animate-from-grid-to-collapsed' : ''
            } ${
              shouldEmergeFromBehind ? 'animate-emerge-from-behind' : ''
            } ${
              shouldFadeOut ? 'photo-fade-out' : ''
            }`}
            style={{
              zIndex: isSelectedPhoto ? 50 : (shouldEmergeFromSelected ? 10 : (shouldEmergeFromBehind ? 5 : (shouldFadeOut ? 5 : 20))),
              // Safari-specific hardware acceleration (CSS only, no functional changes)
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              WebkitPerspective: '1000px',
              perspective: '1000px',
              willChange: (isSelectedPhoto && isTransitioningToPhotos) || shouldEmergeFromBehind || shouldFadeOut ? 'transform, opacity' : 'auto',
              transform: (() => {
                let transform = 'none';
                
                // Only apply positioning transforms during specific animation phases
                if (shouldEmergeFromSelected && !isBackwardsTransition) {
                  // Forward: start at first photo position, then animate to natural position
                  transform = calculatePhotoTransitionPath(index);
                } else if (shouldAnimateFromCollapsed || shouldAnimateBackToFolder) {
                  // First photo animation - use Safari-compatible transform
                  const firstPhotoTransform = getFirstPhotoTransform();
                  if (firstPhotoTransform !== 'none') {
                    // For Safari, ensure we have the webkit prefix
                    transform = firstPhotoTransform;
                  } else {
                    transform = 'none';
                  }
                } else if (isSelectedPhoto && (isTransitioningToPhotos || folderAnimationState === 'collapsing') && collapsedFolderPosition && firstPhotoPosition) {
                  // Position first photo at collapsed folder position immediately when transition starts OR during folder collapse
                  const firstPhotoTransform = getFirstPhotoTransform();
                  if (firstPhotoTransform !== 'none') {
                    transform = firstPhotoTransform;
                  } else {
                    transform = 'none';
                  }
                } else if (isSelectedPhoto && isForwardTransition && collapsedFolderPosition && firstPhotoPosition) {
                  // For Safari: Position first photo at collapsed folder location immediately when folder is clicked
                  const firstPhotoTransform = getFirstPhotoTransform();
                  if (firstPhotoTransform !== 'none') {
                    transform = firstPhotoTransform;
                  } else {
                    transform = 'none';
                  }
                } else if (shouldEmergeFromBehind && !isBackwardsTransition) {
                  // Forward: start at first photo position, then animate to natural position
                  transform = calculatePhotoTransitionPath(index);
                } else if (shouldFadeOut) {
                  // Backward: simple fade out, no transform needed
                  transform = 'none';
                }
                
                // Debug transform for backwards transition
                if (isBackwardsTransition && !isSelectedPhoto && shouldFadeOut) {
                  console.log(`🎯 Photo ${index} transform:`, {
                    shouldFadeOut,
                    transform,
                    storedPath: storedBackwardsPaths?.[index]
                  });
                }
                
                return transform;
              })(),
              opacity: (() => {
                // For fade out, we want to start at opacity 1 and let CSS animation handle it
                if (shouldFadeOut) {
                  return 1; // Start at 1, CSS animation will fade to 0
                }
                
                // First photo should NEVER fade in - always fully visible during forward transition
                if (isSelectedPhoto && isTransitioningToPhotos) {
                  return 1; // Always fully visible, no fade-in
                }
                
                // For other states, use the existing logic
                const calculatedOpacity = (shouldEmergeFromBehind && !isBackwardsTransition) ? 0 : ((shouldEmergeFromSelected && !isBackwardsTransition) ? 0 : (shouldHideFirstPhoto ? 0 : 1));
                
                // Debug opacity for backwards transition
                if (isBackwardsTransition && !isSelectedPhoto) {
                  console.log(`👁️ Photo ${index} opacity check:`, {
                    shouldEmergeFromBehind,
                    isBackwardsTransition,
                    shouldEmergeFromSelected,
                    shouldHideFirstPhoto,
                    shouldFadeOut,
                    calculatedOpacity
                  });
                }
                
                return calculatedOpacity;
              })(),
              animationDelay: shouldEmergeFromSelected ? `${index * 100}ms` : (shouldEmergeFromBehind ? `${(index - 1) * 150}ms` : (shouldFadeOut ? `${(index - 1) * 200}ms` : '0ms')),
            } as React.CSSProperties}
          >
            <img
              src={photo}
              alt={`${folderName} photo ${index + 1}`}
              className="object-cover object-center absolute inset-0 w-full h-full"
              style={{
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </div>
        );
      })}
    </div>
  );
}