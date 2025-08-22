import { useProfile } from '../hooks/useProfile';
import { TechDiffPage } from './TechDiffPage';
import { BackgroundBeams } from './ui/background-beams';
import { FlipWords } from './ui/flip-words';
import './LandingPage.css';

export const LandingPage = (): React.JSX.Element => {
  const { profile, loading, error, showTechDiff } = useProfile();

  const rotatingWords = [
    "adventurer",
    "designer", 
    "engineer",
    "developer",
    "photographer",
    "soccer player"
  ];

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
    <div className="landing-page">
      <BackgroundBeams />
      
      {/* Name Text - Full Width */}
      <div className="name-text">
        Miles Keaveny, <FlipWords words={rotatingWords} duration={2500} className="text-white" />
      </div>
      <div className="description-text">
        {profile?.description}
      </div>

      {/* Button Container */}
      <div className="button-container">
        <button className="px-6 py-3 bg-white text-black font-semibold rounded-lg">
          Get In Touch
        </button>
        <button className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg ml-8 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Resume
        </button>
      </div>

      
      {/* Profile Image - Bottom Left Corner (centered in left 50% of screen) */}
      {profile?.profileImageUrl && (
        <div className="profile-image-container">
          <img
            src={profile.profileImageUrl}
            alt="Miles Keaveny"
            className="profile-image"
            style={{ mixBlendMode: 'normal' }}
            onError={(e) => {
              console.log('Image failed to load:', profile.profileImageUrl);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}; 