const API_BASE_URL = 'http://localhost:8080/api';

// Type definitions
export interface PhotoFolder {
  id: string;
  name: string;
  description: string;
  mainImageUrl: string;
  photoUrls: string[];
  photoCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PhotoFolderRequest {
  name: string;
  description: string;
  imageUrls: string[];
}

// Simple fetch wrapper for API calls
const api = {
  get: async (url: string) => {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  post: async (url: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  delete: async (url: string) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  }
};

export const photographyApi = {
  // Get all photo folders
  getAllPhotoFolders: async (): Promise<PhotoFolder[]> => {
    const response = await api.get('/photo-folders');
    return response;
  },

  // Get photo folder by ID
  getPhotoFolderById: async (id: string): Promise<PhotoFolder> => {
    const response = await api.get(`/photo-folders/${id}`);
    return response;
  },

  // Create or update photo folder
  createOrUpdatePhotoFolder: async (request: PhotoFolderRequest): Promise<PhotoFolder> => {
    const response = await api.post('/photo-folders', request);
    return response;
  },

  // Delete photo folder
  deletePhotoFolder: async (id: string): Promise<void> => {
    await api.delete(`/photo-folders/${id}`);
  }
};
