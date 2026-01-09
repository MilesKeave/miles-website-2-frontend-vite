import { FocusCards } from "@/components/ui/focus-cards";
import { usePhotography } from "../hooks/usePhotography";
import { useState, useEffect, useRef } from "react";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";

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
  const [showFolders, setShowFolders] = useState(true);
  const [previewPhotoIndex, setPreviewPhotoIndex] = useState<number | null>(null);
  const [photosOpacity, setPhotosOpacity] = useState(0);
  const [foldersOpacity, setFoldersOpacity] = useState(1);
  const [showBackButton, setShowBackButton] = useState(false);
  const [isButtonTransitioningOut, setIsButtonTransitioningOut] = useState(false);
  const [showAlbumTitle, setShowAlbumTitle] = useState(false);
  const [isTitleTransitioning, setIsTitleTransitioning] = useState(false);
  const [isGoingBackToFolders, setIsGoingBackToFolders] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Convert photo folders to focus cards format
  const cards = photoFolders.map(folder => ({
    title: folder.name,
    src: folder.mainImageUrl,
    folder: folder
  }));

  const handleFolderClick = (folder: PhotoFolder) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsGoingBackToFolders(false); // Reset going back state when clicking a folder
    setSelectedFolder(folder);
    setPhotosOpacity(0); // Start with photos at 0 (they'll be positioned off-screen)
    setFoldersOpacity(0); // Start animations (non-selected slide out in 1s, selected fades out in 3s)
    setShowPhotos(true); // Show photos container but positioned off-screen
    setShowBackButton(false); // Hide button until photos start sliding in
    
    // After selected folder fades out (1.5s), slide in photos immediately
    setTimeout(() => {
      setShowFolders(false);
      // Scroll to top when showing photos
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      // Use requestAnimationFrame to ensure initial state is rendered before animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhotosOpacity(1); // Start slide in animation (from opposite directions)
          setShowBackButton(true); // Show button when photos start sliding in
          // Start title transition at the same time
          setIsTitleTransitioning(true);
          setShowAlbumTitle(true);
        });
      });
      // Allow animation to complete
      setTimeout(() => {
        setIsAnimating(false);
        setIsTitleTransitioning(false);
      }, 1100); // 1 second slide in + small buffer
    }, 1600); // 1.6 seconds - start photos right after selected folder fades out (1.5s) + small buffer
  };

  const handleBackToFolders = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsGoingBackToFolders(true); // Mark that we're going back to folders
    setPhotosOpacity(0); // Start slide out animations
    setFoldersOpacity(0); // Start with folders at 0 (they'll be positioned off-screen)
    setShowFolders(true); // Show folders container but positioned off-screen
    setIsButtonTransitioningOut(true); // Start button slide-out animation
    
    // After button and photos slide out (1 second), hide button and photos, then slide in folders
    setTimeout(() => {
      setShowBackButton(false); // Hide button after transition
      setIsButtonTransitioningOut(false); // Reset transition state
      setShowPhotos(false);
      // Start title transition back at the same time as folders slide in
      setIsTitleTransitioning(true);
      setShowAlbumTitle(false);
      // Use requestAnimationFrame to ensure initial state is rendered before animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFoldersOpacity(1); // Start slide in animation (from opposite directions)
        });
      });
      // Allow animation to complete
      setTimeout(() => {
        setIsAnimating(false);
        setIsTitleTransitioning(false);
        setIsGoingBackToFolders(false); // Reset going back state
        setSelectedFolder(null);
      }, 1100); // 1 second slide in + small buffer
    }, 1000); // 1 second slide out duration
  };

  // Keyboard navigation for photo preview
  useEffect(() => {
    if (previewPhotoIndex !== null && selectedFolder?.photoUrls) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
          const prevIndex = previewPhotoIndex === 0 
            ? selectedFolder.photoUrls.length - 1 
            : previewPhotoIndex - 1;
          setPreviewPhotoIndex(prevIndex);
        } else if (e.key === 'ArrowRight') {
          const nextIndex = previewPhotoIndex === selectedFolder.photoUrls.length - 1 
            ? 0 
            : previewPhotoIndex + 1;
          setPreviewPhotoIndex(nextIndex);
        } else if (e.key === 'Escape') {
          setPreviewPhotoIndex(null);
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [previewPhotoIndex, selectedFolder]);

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
    <div className="photography-page-container bg-black overflow-hidden">
      <div className="container mx-auto px-4 py-8 h-full flex flex-col">
        {/* Title and Button Container - Always present to maintain layout */}
        <div className="flex-shrink-0 flex flex-col">
          {/* Title Row - Title centered */}
          <div className="relative h-16 mt-8 flex items-center justify-center px-4">
            {/* Back Button - Mobile: absolutely positioned on left, Desktop: absolutely positioned aligned with photo grid */}
            {showPhotos && selectedFolder && showBackButton && (
              <>
                {/* Mobile Button */}
                <div 
                  className="absolute left-4 md:hidden z-10"
                  style={{
                    animation: isButtonTransitioningOut 
                      ? 'slideOutLeft 1s ease-out forwards'
                      : 'slideInFromLeft 1s ease-out',
                    WebkitAnimation: isButtonTransitioningOut
                      ? 'slideOutLeft 1s ease-out forwards'
                      : 'slideInFromLeft 1s ease-out'
                  }}
                >
                  <button
                    onClick={handleBackToFolders}
                    className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-lg p-px text-xs font-semibold leading-6 text-white inline-block"
                  >
                  <span className="absolute inset-0 overflow-hidden rounded-lg">
                    <span className="absolute inset-0 rounded-lg bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </span>
                  <div className="relative flex items-center z-10 rounded-lg bg-zinc-950 py-2 px-2 ring-1 ring-white/10">
                    <span>Back</span>
                    <svg
                      fill="none"
                      height="16"
                      viewBox="0 0 24 24"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 flex-shrink-0"
                    >
                      <path
                        d="M10.75 8.75L14.25 12L10.75 15.25"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  </button>
                </div>
                
                {/* Desktop Button - Absolutely positioned on left, aligned with photo grid */}
                <div 
                  className="hidden md:block absolute left-0 right-0 z-10"
                  style={{
                    animation: isButtonTransitioningOut 
                      ? 'slideOutLeft 1s ease-out forwards'
                      : 'slideInFromLeft 1s ease-out',
                    WebkitAnimation: isButtonTransitioningOut
                      ? 'slideOutLeft 1s ease-out forwards'
                      : 'slideInFromLeft 1s ease-out'
                  }}
                >
                  <div className="max-w-5xl mx-auto w-full px-8">
                    <button
                      onClick={handleBackToFolders}
                      className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-lg p-px text-xs font-semibold leading-6 text-white block w-fit"
                    >
                  <span className="absolute inset-0 overflow-hidden rounded-lg">
                    <span className="absolute inset-0 rounded-lg bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </span>
                  <div className="relative flex items-center z-10 rounded-lg bg-zinc-950 py-2 px-4 ring-1 ring-white/10">
                    <span>Back to Photo Albums</span>
                    <svg
                      fill="none"
                      height="16"
                      viewBox="0 0 24 24"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 flex-shrink-0"
                    >
                      <path
                        d="M10.75 8.75L14.25 12L10.75 15.25"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  </button>
                  </div>
                </div>
              </>
            )}
            
            {/* Title Container - Centered, can expand fully */}
            <div className="relative w-full h-full overflow-visible flex items-center justify-center">
              {/* "My Photography" Title */}
              <h1 
                className="text-2xl md:text-4xl font-bold text-white text-center whitespace-nowrap"
                style={{
                  transform: showAlbumTitle ? 'translateX(-100%)' : 'translateX(0)',
                  opacity: showAlbumTitle ? 0 : 1,
                  animation: showAlbumTitle && isTitleTransitioning
                    ? 'titleSlideOutLeft 1s ease-out forwards'
                    : !showAlbumTitle && isTitleTransitioning
                    ? 'titleSlideInFromLeft 1s ease-out forwards'
                    : 'none',
                  WebkitAnimation: showAlbumTitle && isTitleTransitioning
                    ? 'titleSlideOutLeft 1s ease-out forwards'
                    : !showAlbumTitle && isTitleTransitioning
                    ? 'titleSlideInFromLeft 1s ease-out forwards'
                    : 'none',
                  transition: 'opacity 0.3s, transform 0.3s'
                }}
              >
                My Photography
              </h1>
              
              {/* Album Name Title */}
              {selectedFolder && (
                <h1 
                  className="text-2xl md:text-4xl font-bold text-white text-center absolute inset-0 flex items-center justify-center whitespace-nowrap"
                  style={{
                    transform: showAlbumTitle ? 'translateX(0)' : 'translateX(100%)',
                    opacity: showAlbumTitle ? 1 : 0,
                    animation: showAlbumTitle && isTitleTransitioning
                      ? 'titleSlideInFromRight 1s ease-out forwards'
                      : !showAlbumTitle && isTitleTransitioning
                      ? 'titleSlideOutRight 1s ease-out forwards'
                      : 'none',
                    WebkitAnimation: showAlbumTitle && isTitleTransitioning
                      ? 'titleSlideInFromRight 1s ease-out forwards'
                      : !showAlbumTitle && isTitleTransitioning
                      ? 'titleSlideOutRight 1s ease-out forwards'
                      : 'none',
                    transition: 'opacity 0.3s, transform 0.3s'
                  }}
                >
                  {selectedFolder.name}
                </h1>
              )}
            </div>
          </div>
        </div>
        
        <div ref={scrollContainerRef} className="relative flex-1 overflow-y-auto min-h-[calc(100dvh-10rem)] md:min-h-0 flex items-start pb-24 md:pb-0">
          {/* Folders - fade out when clicking */}
          {showFolders && (
            <div 
              className="w-full absolute inset-0 flex items-start"
              style={{ 
                pointerEvents: foldersOpacity === 0 ? 'none' : 'auto'
              }}
            >
            <FocusCards 
              cards={cards} 
              onCardClick={(card) => handleFolderClick(card.folder)}
              isAnimating={isAnimating}
              selectedFolder={selectedFolder}
                onPositionUpdate={() => {}}
                animationState="normal"
                foldersOpacity={foldersOpacity}
                isGoingBackToFolders={isGoingBackToFolders}
            />
            </div>
          )}
          
          {/* Photos - fade in after folders fade out */}
          {showPhotos && selectedFolder && (
            <div 
              className="w-full absolute inset-0 flex items-start"
              style={{
                pointerEvents: photosOpacity === 0 ? 'none' : 'auto'
              }}
            >
                  <PhotoGrid 
                    photos={selectedFolder.photoUrls.slice(0, 6)}
                onPhotoClick={(index) => setPreviewPhotoIndex(index)}
                isAnimating={isAnimating}
                photosOpacity={photosOpacity}
              />
            </div>
          )}
        </div>
        
        {/* Photo Preview Modal */}
        {previewPhotoIndex !== null && selectedFolder && selectedFolder.photoUrls && (
          (() => {
            const displayedPhotos = selectedFolder.photoUrls.slice(0, 6);
            const maxIndex = Math.min(previewPhotoIndex, displayedPhotos.length - 1);
            return (
              <div 
                className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
                onClick={() => setPreviewPhotoIndex(null)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewPhotoIndex(null);
                  }}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-bold z-[101] bg-black/50 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
                  aria-label="Close preview"
                >
                  ×
                </button>

                {displayedPhotos.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const prevIndex = maxIndex === 0 
                        ? displayedPhotos.length - 1 
                        : maxIndex - 1;
                      setPreviewPhotoIndex(prevIndex);
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-4xl font-bold z-[101] bg-black/50 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                )}

                <img
                  src={displayedPhotos[maxIndex]}
                  alt={`Photo ${maxIndex + 1} of ${displayedPhotos.length}`}
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />

                {displayedPhotos.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const nextIndex = maxIndex === displayedPhotos.length - 1 
                        ? 0 
                        : maxIndex + 1;
                      setPreviewPhotoIndex(nextIndex);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-4xl font-bold z-[101] bg-black/50 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                )}

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 rounded-full px-4 py-2 text-sm">
                  {maxIndex + 1} / {displayedPhotos.length}
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}

// Simplified Photo Grid Component
function PhotoGrid({ photos, onPhotoClick, isAnimating, photosOpacity }: { 
  photos: string[], 
  onPhotoClick?: (photoIndex: number) => void,
  isAnimating?: boolean,
  photosOpacity?: number
}) {
  const [isTwoByThreeLayout, setIsTwoByThreeLayout] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const isAnimatingOut = isAnimating && photosOpacity !== undefined && photosOpacity < 1;

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
      className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-10 max-w-5xl mx-auto md:px-8 w-full py-4 pb-24 md:pb-4"
      style={{
        gridTemplateRows: 'auto',
        minHeight: 'calc(100vh - 250px)'
      }}
    >
      {photos.map((photo, index) => {
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
        
        // Slide in direction is opposite of slide out
        let slideInDirection = '';
        if (isTwoByThreeLayout) {
          switch (slideOutDirection) {
            case 'left':
              slideInDirection = 'right';
              break;
            case 'right':
              slideInDirection = 'left';
              break;
            case 'up':
              slideInDirection = 'down';
              break;
            case 'down':
              slideInDirection = 'up';
              break;
          }
        }
        
        // Slide out in assigned direction over 1s (or simple fade)
        let slideOutStyle = {};
        if (isAnimatingOut) {
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
        
        // Slide in from opposite direction over 1s (or simple fade in)
        const isAnimatingIn = isAnimating && photosOpacity !== undefined && photosOpacity > 0;
        let slideInStyle = {};
        if (isAnimatingIn && photosOpacity !== undefined) {
          if (useSimpleFade) {
            // Simple fade in
            slideInStyle = {
              opacity: photosOpacity,
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
            
            if (photosOpacity === 0) {
              // Start off-screen with no transition
              slideInStyle = {
                transform: initialTransform,
                opacity: 0
              };
            } else {
              // Animate to center position
              slideInStyle = {
                transform: 'translateX(0) translateY(0)',
                opacity: photosOpacity,
                transition: 'transform 1s ease-in-out, opacity 1s ease-in-out'
              };
            }
          }
        }
        
        return (
          <div
            key={index}
            className="rounded-lg relative overflow-hidden w-full cursor-pointer transition-transform duration-300 ease-in-out md:hover:scale-110 h-[calc((100vh-280px)/3)] md:h-auto"
            style={{
              ...(Object.keys(slideInStyle).length > 0 ? slideInStyle : {}),
              ...(Object.keys(slideOutStyle).length > 0 ? slideOutStyle : {})
            }}
            onClick={() => onPhotoClick?.(index)}
          >
            <DirectionAwareHover 
              imageUrl={photo}
              className="absolute inset-0 w-full h-full"
              imageClassName="h-full w-full"
            >
              <div className="hidden">
                {/* Empty children to maintain component structure */}
              </div>
            </DirectionAwareHover>
          </div>
        );
      })}
    </div>
  );
}
