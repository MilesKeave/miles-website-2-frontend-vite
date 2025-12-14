const API_BASE_URL = 'http://localhost:8080/api';

export interface Project {
  id: string;
  projectName: string;
  projectImageUrl: string;
  projectImageUrl2?: string;
  liveDemoLink: string;
  paragraph: string;
  githubLink: string;
  githubLink2?: string;
  youtubeLink: string;
  websiteLink: string;
  index?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  projectName: string;
  liveDemoLink: string;
  paragraph: string;
  githubLink: string;
  youtubeLink: string;
  websiteLink: string;
  projectImage: File;
}

export const projectApi = {
  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects/getAll`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  },

  // Get project by name
  async getProjectByName(projectName: string): Promise<Project> {
    const encodedName = encodeURIComponent(projectName);
    const response = await fetch(`${API_BASE_URL}/projects/${encodedName}`);
    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }
    return response.json();
  },

  // Create new project
  async createProject(data: CreateProjectData): Promise<Project> {
    const formData = new FormData();
    formData.append('projectName', data.projectName);
    formData.append('liveDemoLink', data.liveDemoLink);
    formData.append('paragraph', data.paragraph);
    formData.append('githubLink', data.githubLink);
    formData.append('youtubeLink', data.youtubeLink);
    formData.append('projectImage', data.projectImage);

    const response = await fetch(`${API_BASE_URL}/projects/create`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create project');
    }
    return response.json();
  },

  // Delete project by name
  async deleteProject(projectName: string): Promise<void> {
    const encodedName = encodeURIComponent(projectName);
    const response = await fetch(`${API_BASE_URL}/projects/${encodedName}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  },

  // Partial update project - only updates fields that are provided
  async updateProject(
    projectName: string,
    data: {
      liveDemoLink?: string;
      paragraph?: string;
      githubLink?: string;
      githubLink2?: string;
      youtubeLink?: string;
      websiteLink?: string;
      index?: number;
      projectImage?: File;
      projectImage2?: File;
    }
  ): Promise<Project> {
    const formData = new FormData();
    formData.append('projectName', projectName);
    
    if (data.liveDemoLink !== undefined) {
      formData.append('liveDemoLink', data.liveDemoLink);
    }
    if (data.paragraph !== undefined) {
      formData.append('paragraph', data.paragraph);
    }
    if (data.githubLink !== undefined) {
      formData.append('githubLink', data.githubLink);
    }
    if (data.githubLink2 !== undefined) {
      formData.append('githubLink2', data.githubLink2);
    }
    if (data.youtubeLink !== undefined) {
      formData.append('youtubeLink', data.youtubeLink);
    }
    if (data.websiteLink !== undefined) {
      formData.append('websiteLink', data.websiteLink);
    }
    if (data.index !== undefined) {
      formData.append('index', data.index.toString());
    }
    if (data.projectImage) {
      formData.append('projectImage', data.projectImage);
    }
    if (data.projectImage2) {
      formData.append('projectImage2', data.projectImage2);
    }

    const response = await fetch(`${API_BASE_URL}/projects/update`, {
      method: 'PATCH',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update project');
    }
    return response.json();
  },
};
