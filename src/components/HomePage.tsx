import { useProfile } from '../hooks/useProfile';
import { TechDiffPage } from './TechDiffPage';

export const HomePage = (): React.JSX.Element => {
  const { profile, loading, error, showTechDiff, downloadResume } = useProfile();

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
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-white">Home</h1>
        
        {/* Profile Image */}
        {profile?.profileImageUrl && (
          <div className="flex justify-center">
            <img
              src={profile.profileImageUrl}
              alt="Miles Keaveny"
              className="w-32 h-32 md:w-40 md:h-40 object-contain hover:scale-110 transition-transform duration-200"
            />
          </div>
        )}
        
        {profile?.resumeUrl && (
          <button 
            onClick={downloadResume}
            className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Resume
          </button>
        )}
        
        {error && (
          <p className="text-red-400">Error: {error}</p>
        )}
      </div>
    </div>
  );
}; 