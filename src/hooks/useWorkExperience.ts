import { useState, useEffect } from 'react';
import { workExperienceApi } from '../services/workExperienceApi';
import type { WorkExperience } from '../services/workExperienceApi';

export const useWorkExperience = () => {
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedWorkExperiences = await workExperienceApi.getAllWorkExperience();
      setWorkExperiences(fetchedWorkExperiences);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch work experience');
      console.error('Error fetching work experience:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkExperiences();
  }, []);

  const refreshWorkExperiences = () => {
    fetchWorkExperiences();
  };

  return {
    workExperiences,
    loading,
    error,
    refreshWorkExperiences,
  };
};
