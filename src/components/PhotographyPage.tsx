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
    setFolderAnimationState('collapsing'); // Start collapse animation
  };

  const handleBackToFolders = () => {
    // Start reverse transition
    setIsTransitioningBackToFolders(true);
    setShouldAnimateFirstPhoto(false);
    setShouldEmergeRemainingPhotos(false);
    setShouldRenderRemainingPhotos(false);
    setFirstPhotoReady(false);
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
function PhotoGrid({ photos, folderName, isTransitioningToPhotos, collapsedFolderPosition, shouldAnimateFirstPhoto, isTransitioningBackToFolders, shouldEmergeRemainingPhotos, shouldRenderRemainingPhotos, firstPhotoReady }: { 
  photos: string[], 
  folderName: string,
  isTransitioningToPhotos?: boolean,
  collapsedFolderPosition?: { x: number; y: number } | null,
  shouldAnimateFirstPhoto?: boolean,
  isTransitioningBackToFolders?: boolean,
  shouldEmergeRemainingPhotos?: boolean,
  shouldRenderRemainingPhotos?: boolean,
  firstPhotoReady?: boolean
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

  // Calculate transition path for each remaining photo
  const calculatePhotoTransitionPath = (index: number) => {
    if (!firstPhotoPosition) return 'none';
    
    // Get the current photo's grid position
    const currentPhotoPosition = remainingPhotoPositions[index];
    if (!currentPhotoPosition) return 'none';
    
    // Calculate the offset to position this photo at the first photo's location (starting position)
    const deltaX = firstPhotoPosition.x - currentPhotoPosition.x;
    const deltaY = firstPhotoPosition.y - currentPhotoPosition.y;
    
    console.log(`Photo ${index} transition path:`, {
      firstPhotoPosition: firstPhotoPosition,
      currentPhotoPosition: currentPhotoPosition,
      deltaX: deltaX,
      deltaY: deltaY,
      transform: `translateX(${deltaX}px) translateY(${deltaY}px)`
    });
    
    // Return the transform that positions this photo at the first photo's location (starting position)
    return `translateX(${deltaX}px) translateY(${deltaY}px)`;
  };

  // Calculate transform for first photo
  const getFirstPhotoTransform = () => {
    if (!collapsedFolderPosition || !firstPhotoPosition) return 'none';
    
    // Calculate the offset from grid position to collapsed position
    const deltaX = collapsedFolderPosition.x - firstPhotoPosition.x;
    const deltaY = collapsedFolderPosition.y - firstPhotoPosition.y;
    
    console.log('First photo transform:', {
      collapsedPosition: collapsedFolderPosition,
      firstPhotoPosition: firstPhotoPosition,
      deltaX: deltaX,
      deltaY: deltaY,
      isTransitioningBackToFolders: isTransitioningBackToFolders
    });
    
    // For reverse transition: start at grid position, animate to collapsed position
    if (isTransitioningBackToFolders) {
      return `translateX(${deltaX}px) translateY(${deltaY}px)`;
    }
    
    // For forward transition: start at collapsed position, animate to grid position
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
        
        // First photo should be hidden until both folder is ready to disappear AND photo is ready to appear
        const shouldHideFirstPhoto = isSelectedPhoto && (!firstPhotoReady || !shouldAnimateFirstPhoto);
        
        // Only render remaining photos when they should be rendered AND should emerge
        if (!isSelectedPhoto && (!shouldRenderRemainingPhotos || !shouldEmergeRemainingPhotos)) {
          return null;
        }
        
        return (
          <div
            key={index}
            ref={isSelectedPhoto ? firstPhotoRef : (shouldEmergeFromBehind ? (ref) => {
              remainingPhotoRefs.current[index] = ref;
            } : undefined)}
            className={`rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full ${
              shouldAnimateFromCollapsed ? 'transition-all duration-700 ease-in-out animate-from-collapsed-to-grid' : ''
            } ${
              shouldAnimateBackToFolder ? 'transition-all duration-700 ease-in-out animate-from-grid-to-collapsed' : ''
            } ${
              shouldEmergeFromBehind ? 'animate-emerge-from-behind' : ''
            }`}
            style={{
              zIndex: isSelectedPhoto ? 50 : (shouldEmergeFromSelected ? 10 : (shouldEmergeFromBehind ? 5 : 20)),
              transform: shouldEmergeFromSelected 
                ? calculatePhotoTransitionPath(index)
                : (shouldAnimateFromCollapsed || shouldAnimateBackToFolder)
                ? getFirstPhotoTransform()
                : shouldEmergeFromBehind 
                ? calculatePhotoTransitionPath(index)
                : 'none',
              opacity: shouldEmergeFromBehind ? 0 : (shouldEmergeFromSelected ? 0 : (shouldHideFirstPhoto ? 0 : 1)),
              animationDelay: shouldEmergeFromSelected ? `${index * 100}ms` : (shouldEmergeFromBehind ? `${(index - 1) * 150}ms` : '0ms'),
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