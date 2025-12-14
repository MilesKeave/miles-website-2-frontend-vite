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
      
      // Create ordered list based on index attribute
      const orderedProjects: Project[] = [];
      const projectsWithoutIndex: Project[] = [];
      
      // Separate projects with index and without index
      fetchedProjects.forEach((project) => {
        if (project.index !== undefined && project.index !== null) {
          // Project has an index - place it at that position
          orderedProjects[project.index] = project;
        } else {
          // Project doesn't have index - add to list to place later
          projectsWithoutIndex.push(project);
        }
      });
      
      // Fill in gaps and add projects without index
      let nextPosition = 0;
      for (let i = 0; i < orderedProjects.length; i++) {
        if (orderedProjects[i] === undefined) {
          // Empty slot - fill with next project without index
          if (projectsWithoutIndex.length > 0) {
            orderedProjects[i] = projectsWithoutIndex.shift()!;
          }
        }
        nextPosition = i + 1;
      }
      
      // Add remaining projects without index to the end
      projectsWithoutIndex.forEach((project) => {
        orderedProjects.push(project);
      });
      
      // Filter out any undefined slots (in case index was beyond array length)
      const finalOrderedProjects = orderedProjects.filter((project) => project !== undefined);
      
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
