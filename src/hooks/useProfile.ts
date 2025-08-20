import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { ProfileData } from '../services/api';

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTechDiff, setShowTechDiff] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        setShowTechDiff(false);
        
        // Set a 4-second timer to show tech diff page
        const techDiffTimer = setTimeout(() => {
          setShowTechDiff(true);
        }, 4000);
        
        const data = await apiService.getProfile();
        
        // Clear the timer if we get data successfully
        clearTimeout(techDiffTimer);
        setProfile(data);
        setShowTechDiff(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        console.error('Error fetching profile:', err);
        setShowTechDiff(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const downloadResume = async () => {
    if (!profile?.resumeUrl) {
      setError('No resume available for download');
      return;
    }

    try {
      await apiService.downloadResume(profile.resumeUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download resume');
      console.error('Error downloading resume:', err);
    }
  };

  return {
    profile,
    loading,
    error,
    showTechDiff,
    downloadResume,
  };
}; 