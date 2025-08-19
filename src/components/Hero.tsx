import { Sparkles } from './ui/sparkles';
import { TextGenerateEffect } from './ui/text-generate-effect';
import { BackgroundGradient } from './ui/background-gradient';
import { useProfile } from '../hooks/useProfile';

export const Hero = (): React.JSX.Element => {
  const { profile, loading, error, downloadResume } = useProfile();

  if (loading) {
    return (
      <BackgroundGradient className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-gray-300 mt-4">Loading profile...</p>
        </div>
      </BackgroundGradient>
    );
  }

  if (error) {
    return (
      <BackgroundGradient className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading profile: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </BackgroundGradient>
    );
  }

  return (
    <BackgroundGradient className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8 px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Profile Image */}
          {profile?.profileImageUrl && (
            <div className="flex-shrink-0">
              <img
                src={profile.profileImageUrl}
                alt="Miles Keaveny"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-400 shadow-lg"
              />
            </div>
          )}
          
          {/* Name with Sparkles */}
          <div className="flex-shrink-0">
            <Sparkles
              className="text-6xl md:text-8xl font-bold text-white"
              particleColor="#ffffff"
              particleDensity={100}
            >
              Miles Keaveny
            </Sparkles>
          </div>
        </div>
        
        <div className="space-y-4">
          <TextGenerateEffect 
            words="Full Stack Developer & Creative Technologist"
            className="text-2xl md:text-4xl text-blue-400"
          />
          
          {/* Description from backend */}
          {profile?.description && (
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {profile.description}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 transform hover:scale-105">
            View My Work
          </button>
          
          {/* Resume Download Button */}
          {profile?.resumeUrl && (
            <button 
              onClick={downloadResume}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </button>
          )}
          
          <button className="px-8 py-3 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105">
            Get In Touch
          </button>
        </div>

        <div className="pt-12">
          <div className="flex justify-center space-x-6 text-gray-400">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-sm">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">3+</div>
              <div className="text-sm">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-sm">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundGradient>
  );
}; 