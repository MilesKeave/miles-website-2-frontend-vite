import { Sparkles } from './ui/sparkles';
import { useProfile } from '../hooks/useProfile';
import { TechDiffPage } from './TechDiffPage';

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
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 px-4">
        {/* Profile Image */}
        {profile?.profileImageUrl && (
          <div className="flex-shrink-0">
            <img
              src={profile.profileImageUrl}
              alt="Miles Keaveny"
              className="w-32 h-32 md:w-40 md:h-40 object-contain"
              style={{ mixBlendMode: 'normal' }}
            />
          </div>
        )}

        {/* Name with Sparkles */}
        <div className="flex-shrink-0">
          <Sparkles
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white"
            particleColor="#ffffff"
            particleDensity={150}
          >
            Miles Keaveny
          </Sparkles>
        </div>
      </div>
    </div>
  );
}; 