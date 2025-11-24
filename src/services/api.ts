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

  async getResumeUrl(): Promise<string | null> {
    try {
      const profile = await this.getProfile();
      return profile.resumeUrl || null;
    } catch (error) {
      console.error('Error fetching resume URL:', error);
      throw error;
    }
  },

  async downloadResume(resumeUrl: string): Promise<void> {
    try {
      if (!resumeUrl) {
        throw new Error('Resume URL is empty');
      }

      // Use direct download method - works seamlessly without CORS issues
      // The download attribute will trigger browser download without opening a new tab
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = 'Miles_Keaveny_Resume.pdf';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up immediately
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
      
    } catch (error) {
      console.error('Error downloading resume:', error);
      throw error;
    }
  }
}; 