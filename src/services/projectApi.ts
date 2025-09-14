const API_BASE_URL = 'http://localhost:8080/api';

export interface Project {
  id: string;
  projectName: string;
  projectImageUrl: string;
  onClickValue: string;
  paragraph: string;
  githubLink: string;
  youtubeLink: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  projectName: string;
  onClickValue: string;
  paragraph: string;
  githubLink: string;
  youtubeLink: string;
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
    formData.append('onClickValue', data.onClickValue);
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
};
