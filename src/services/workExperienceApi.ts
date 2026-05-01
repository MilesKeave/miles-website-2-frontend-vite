import { API_BASE_URL } from '../config/api';

export interface BulletPoint {
  text: string;
  subPoints?: string[];
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  date: string;
  location: string;
  companyName: string;
  bulletPoints?: BulletPoint[];
  description?: string;
  technologiesUsed: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkExperienceData {
  jobTitle: string;
  date: string;
  location: string;
  companyName: string;
  bulletPoints: BulletPoint[];
  technologiesUsed: string[];
}

export const workExperienceApi = {
  async getAllWorkExperience(): Promise<WorkExperience[]> {
    const response = await fetch(`${API_BASE_URL}/work-experience/getAll`);
    if (!response.ok) {
      throw new Error('Failed to fetch work experience');
    }
    return response.json();
  },

  async getWorkExperienceByCompanyAndTitle(companyName: string, jobTitle: string): Promise<WorkExperience> {
    const encodedCompanyName = encodeURIComponent(companyName);
    const encodedJobTitle = encodeURIComponent(jobTitle);
    const response = await fetch(`${API_BASE_URL}/work-experience/${encodedCompanyName}/${encodedJobTitle}`);
    if (!response.ok) {
      throw new Error('Failed to fetch work experience');
    }
    return response.json();
  },

  async createWorkExperience(data: CreateWorkExperienceData): Promise<WorkExperience> {
    const response = await fetch(`${API_BASE_URL}/work-experience/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create work experience');
    }
    return response.json();
  },

  async deleteWorkExperience(companyName: string, jobTitle: string): Promise<void> {
    const encodedCompanyName = encodeURIComponent(companyName);
    const encodedJobTitle = encodeURIComponent(jobTitle);
    const response = await fetch(`${API_BASE_URL}/work-experience/${encodedCompanyName}/${encodedJobTitle}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete work experience');
    }
  },

  async deleteAllWorkExperience(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/work-experience/deleteAll`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete all work experience');
    }
  },
};
