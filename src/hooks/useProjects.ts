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
      
      const orderedProjects: Project[] = [];
      const projectsWithoutIndex: Project[] = [];

      fetchedProjects.forEach((project) => {
        if (project.index !== undefined && project.index !== null) {
          orderedProjects[project.index] = project;
        } else {
          projectsWithoutIndex.push(project);
        }
      });

      let nextPosition = 0;
      for (let i = 0; i < orderedProjects.length; i++) {
        if (orderedProjects[i] === undefined) {
          if (projectsWithoutIndex.length > 0) {
            orderedProjects[i] = projectsWithoutIndex.shift()!;
          }
        }
        nextPosition = i + 1;
      }

      projectsWithoutIndex.forEach((project) => {
        orderedProjects.push(project);
      });

      const finalOrderedProjects = orderedProjects.filter((project) => project !== undefined);

      finalOrderedProjects.forEach((project) => {
        if (project.projectImageUrl) {
          const img = new Image();
          img.src = project.projectImageUrl;
        }
        if (project.projectImageUrl2) {
          const img = new Image();
          img.src = project.projectImageUrl2;
        }
      });

      setProjects(finalOrderedProjects);
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
