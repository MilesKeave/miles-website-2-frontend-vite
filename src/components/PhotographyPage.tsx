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

  // Convert photo folders to focus cards format
  const cards = photoFolders.map(folder => ({
    title: folder.name,
    src: folder.mainImageUrl,
    folder: folder
  }));

  const handleFolderClick = (folder: PhotoFolder, event?: React.MouseEvent) => {
    console.log('Folder clicked:', folder.name, 'Current animating:', isAnimating);
    
    if (isAnimating) return; // Prevent multiple clicks during animation
    
    console.log('Setting animation state...');
    setIsAnimating(true);
    setSelectedFolder(folder);
    setShouldAnimateFirstPhoto(false); // Reset animation control
    setFolderAnimationState('collapsing'); // Start collapse animation
    
    // Step 1: After folders collapse (700ms), start transition to photos
    setTimeout(() => {
      console.log('Starting transition to photos...');
      setFolderAnimationState('collapsed'); // Folders are now collapsed
      setIsTransitioningToPhotos(true);
      setShouldAnimateFirstPhoto(true); // Explicitly trigger first photo animation
    }, 700);
    
    // Step 2: Show photos after transition completes
    setTimeout(() => {
      console.log('Showing photos...');
      setShowPhotos(true);
    }, 1400); // 700ms (collapse) + 700ms (transition to photos)
  };

  const handleBackToFolders = () => {
    // Step 1: Start reverse transition - first photo glides back to original folder position
    setIsTransitioningBackToFolders(true);
    setShouldAnimateFirstPhoto(false); // Stop first photo animation
    
    // Step 2: After photo glides back, hide photos and show folder in collapsed state
    setTimeout(() => {
      setShowPhotos(false);
      setIsTransitioningToPhotos(false);
      setFolderAnimationState('collapsed'); // Start in collapsed state
    }, 700); // Match animation duration
    
    // Step 3: After folder appears, expand folders from collapsed state
    setTimeout(() => {
      setFolderAnimationState('expanding'); // Start expansion animation
    }, 800); // Small delay to ensure folder is visible
    
    // Step 4: After expansion completes, reset to normal
    setTimeout(() => {
      setSelectedFolder(null);
      setIsAnimating(false);
      setFolderAnimationState('normal');
      setIsTransitioningBackToFolders(false);
    }, 1500); // 800ms (folder appear) + 700ms (expansion)
  };

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
                    selectedFolder={selectedFolder}
                    isAnimating={isAnimating}
                    isTransitioningToPhotos={isTransitioningToPhotos}
                    collapsedFolderPosition={collapsedFolderPosition}
                    shouldAnimateFirstPhoto={shouldAnimateFirstPhoto}
                    isTransitioningBackToFolders={isTransitioningBackToFolders}
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
function PhotoGrid({ photos, folderName, selectedFolder, isAnimating, isTransitioningToPhotos, collapsedFolderPosition, shouldAnimateFirstPhoto, isTransitioningBackToFolders }: { 
  photos: string[], 
  folderName: string,
  selectedFolder?: any,
  isAnimating?: boolean,
  isTransitioningToPhotos?: boolean,
  collapsedFolderPosition?: { x: number; y: number } | null,
  shouldAnimateFirstPhoto?: boolean,
  isTransitioningBackToFolders?: boolean
}) {
  const firstPhotoRef = useRef<HTMLDivElement>(null);
  const [firstPhotoPosition, setFirstPhotoPosition] = useState<{ x: number; y: number } | null>(null);
  const [firstPhotoVisible, setFirstPhotoVisible] = useState(false);

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

  // Control first photo visibility based on explicit animation trigger
  useEffect(() => {
    if (shouldAnimateFirstPhoto && collapsedFolderPosition && firstPhotoPosition) {
      setTimeout(() => setFirstPhotoVisible(true), 50);
    } else {
      setFirstPhotoVisible(false);
    }
  }, [shouldAnimateFirstPhoto, collapsedFolderPosition, firstPhotoPosition]);

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
        const shouldEmergeFromSelected = isTransitioningToPhotos && !isSelectedPhoto;
        const shouldAnimateFromCollapsed = isSelectedPhoto && shouldAnimateFirstPhoto && collapsedFolderPosition && firstPhotoPosition;
        const shouldAnimateBackToFolder = isSelectedPhoto && isTransitioningBackToFolders && collapsedFolderPosition && firstPhotoPosition;
        
        return (
          <div
            key={index}
            ref={isSelectedPhoto ? firstPhotoRef : undefined}
            className={`rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-700 ease-in-out ${
              shouldAnimateFromCollapsed ? 'animate-from-collapsed-to-grid' : ''
            } ${
              shouldAnimateBackToFolder ? 'animate-from-grid-to-collapsed' : ''
            }`}
            style={{
              zIndex: isSelectedPhoto ? 50 : (shouldEmergeFromSelected ? 10 : 20),
              transform: shouldEmergeFromSelected 
                ? 'scale(0.3) translateX(-50%) translateY(-50%)' 
                : (shouldAnimateFromCollapsed || shouldAnimateBackToFolder)
                ? getFirstPhotoTransform()
                : 'none',
              opacity: shouldEmergeFromSelected ? 0.1 : (shouldAnimateFromCollapsed ? (firstPhotoVisible ? 1 : 0) : 1),
              animationDelay: shouldEmergeFromSelected ? `${index * 100}ms` : '0ms',
            }}
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