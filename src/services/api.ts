export interface ProfileData {
  description: string;
  resumeUrl: string;
  profileImageUrl: string;
}

const API_BASE_URL = 'http://localhost:8080/api';

export const apiService = {
  async getProfile(): Promise<ProfileData> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE_URL}/profile`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out - backend may be having connectivity issues');
      }
      throw error;
    }
  },

  async downloadResume(resumeUrl: string): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(resumeUrl, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
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
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Download timed out');
      }
      throw error;
    }
  }
}; 