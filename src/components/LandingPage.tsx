import { useProfile } from '../hooks/useProfile';
import { TechDiffPage } from './TechDiffPage';
import { BackgroundBeams } from './ui/background-beams';
import { NameTitle } from './NameTitle';

export const LandingPage = (): React.JSX.Element => {
  const { profile, loading, error, showTechDiff } = useProfile();

  // Show tech diff page if loading for more than 4 seconds
  if (showTechDiff) {
    return <TechDiffPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <BackgroundBeams />
      
      {/* Name and Profile Image - Side by Side */}
      <div className="flex items-center justify-center gap-8 px-4 relative z-10">
        {/* Profile Image */}
        {profile?.profileImageUrl && (
          <div className="flex-shrink-0">
            <img
              src={profile.profileImageUrl}
              alt="Miles Keaveny"
              className="w-32 h-32 md:w-40 md:h-40 object-contain hover:scale-110 transition-transform duration-200"
              style={{ mixBlendMode: 'normal' }}
              onError={(e) => {
                console.log('Image failed to load:', profile.profileImageUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* Name Title Component */}
        <NameTitle />
      </div>
    </div>
  );
}; 