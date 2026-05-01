import { API_BASE_URL } from '../config/api';

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
  getAllPhotoFolders: async (): Promise<PhotoFolder[]> => {
    const response = await api.get('/photo-folders');
    return response;
  },

  getPhotoFolderById: async (id: string): Promise<PhotoFolder> => {
    const response = await api.get(`/photo-folders/${id}`);
    return response;
  },

  createOrUpdatePhotoFolder: async (request: PhotoFolderRequest): Promise<PhotoFolder> => {
    const response = await api.post('/photo-folders', request);
    return response;
  },

  deletePhotoFolder: async (id: string): Promise<void> => {
    await api.delete(`/photo-folders/${id}`);
  }
};
