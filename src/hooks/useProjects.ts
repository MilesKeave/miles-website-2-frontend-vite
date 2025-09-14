import { useState, useEffect } from 'react';
import { projectApi } from '../services/projectApi';
import type { Project } from '../services/projectApi';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProjects = await projectApi.getAllProjects();
      setProjects(fetchedProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const refreshProjects = () => {
    fetchProjects();
  };

  return {
    projects,
    loading,
    error,
    refreshProjects,
  };
};
