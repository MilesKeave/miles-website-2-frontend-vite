export interface ProfileData {
  description: string;
  resumeUrl: string;
  profileImageUrl: string;
}

const API_BASE_URL = 'http://localhost:8080/api';

export const apiService = {
  async getProfile(): Promise<ProfileData> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  async downloadResume(resumeUrl: string): Promise<void> {
    try {
      const response = await fetch(resumeUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Miles_Keaveny_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading resume:', error);
      throw error;
    }
  }
}; 