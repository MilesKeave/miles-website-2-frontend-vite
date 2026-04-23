export interface ProfileData {
  description: string;
  resumeUrl: string;
  profileImageUrl: string;
  profileHoverImageUrl: string;
}

import { API_BASE_URL } from '../config/api';

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

  async downloadResume(): Promise<void> {
    // Fetch through the backend proxy so we get same-origin bytes we can
    // hand to a blob URL — the `download` attribute only works same-origin.
    const response = await fetch(`${API_BASE_URL}/download-resume`);
    if (!response.ok) {
      throw new Error(`Resume download failed: ${response.status}`);
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'Miles_Keaveny_Resume.pdf';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }
}; 