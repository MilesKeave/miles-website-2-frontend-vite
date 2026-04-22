import { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { FlipWords } from './ui/flip-words';

export const HomePage = (): React.JSX.Element => {
  const { profile, downloadResume } = useProfile();
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  const isActive = isHovered || isTapped;

  // Preload hover image for smooth transition once URL is available from API
  useEffect(() => {
    if (profile?.profileHoverImageUrl) {
      const img = new Image();
      img.src = profile.profileHoverImageUrl;
    }
  }, [profile?.profileHoverImageUrl]);

  const rotatingWords = [
    "adventurer",
    "designer", 
    "engineer",
    "developer",
    "photographer",
    "soccer player"
  ];

  return (
    <div className="home-page" onClick={() => setIsTapped(false)}>
      {/* Name Text - Full Width */}
      <div className="name-text">
        Miles Keaveny, <FlipWords words={rotatingWords} duration={2500} className="text-white" />
      </div>
      <div className="description-text">
        {profile?.description}
      </div>

      {/* Button Container */}
      <div className="button-container">
        <a 
          href="mailto:miles.j.keaveny@gmail.com"
          className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200 inline-block text-center"
        >
          Get In Touch
        </a>
        {profile?.resumeUrl ? (
          <button 
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Resume button clicked, resumeUrl:', profile.resumeUrl);
              try {
                await downloadResume();
                console.log('Download initiated successfully');
              } catch (error) {
                console.error('Error downloading resume:', error);
                alert('Failed to download resume. Please check the console for details.');
              }
            }}
            className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg ml-8 flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Resume
          </button>
        ) : (
          <button 
            type="button"
            disabled
            className="px-6 py-3 bg-gray-600 text-gray-400 font-semibold rounded-lg ml-8 flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Resume
          </button>
        )}
      </div>

      {/* Profile Image - Bottom Left Corner (centered in left 50% of screen) */}
      {profile?.profileImageUrl && (
        <div className="profile-image-container">
          {/* Grid stack: both images occupy the same cell so neither collapses */}
          <div
            style={{ display: 'grid' }}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') setIsHovered(true); }}
            onPointerLeave={(e) => { if (e.pointerType === 'mouse') setIsHovered(false); }}
            onClick={(e) => { e.stopPropagation(); setIsTapped(true); }}
          >
            {/* Base image */}
            <img
              src={profile.profileImageUrl}
              alt="Miles Keaveny"
              className="profile-image"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              style={{
                gridArea: '1/1',
                opacity: isActive && profile.profileHoverImageUrl ? 0 : 1,
              }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            {/* Hover image — always in DOM so it stays decoded and ready */}
            {profile.profileHoverImageUrl && (
              <img
                src={profile.profileHoverImageUrl}
                alt="Miles Keaveny"
                className="profile-image"
                loading="eager"
                decoding="sync"
                style={{
                  gridArea: '1/1',
                  opacity: isActive ? 1 : 0,
                }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};