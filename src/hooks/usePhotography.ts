import { useState, useEffect } from 'react';
import { photographyApi } from '../services/photographyApi';
import type { PhotoFolder } from '../services/photographyApi';

export const usePhotography = () => {
  const [photoFolders, setPhotoFolders] = useState<PhotoFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotoFolders = async () => {
    try {
      setLoading(true);
      setError(null);
      const folders = await photographyApi.getAllPhotoFolders();
      setPhotoFolders(folders);
    } catch (err) {
      setError('Failed to fetch photo folders');
      console.error('Error fetching photo folders:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPhotoFolder = async (name: string, description: string, imageUrls: string[]) => {
    try {
      const newFolder = await photographyApi.createOrUpdatePhotoFolder({
        name,
        description,
        imageUrls
      });
      setPhotoFolders(prev => [...prev, newFolder]);
      return newFolder;
    } catch (err) {
      setError('Failed to create photo folder');
      console.error('Error creating photo folder:', err);
      throw err;
    }
  };

  const deletePhotoFolder = async (id: string) => {
    try {
      await photographyApi.deletePhotoFolder(id);
      setPhotoFolders(prev => prev.filter(folder => folder.id !== id));
    } catch (err) {
      setError('Failed to delete photo folder');
      console.error('Error deleting photo folder:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPhotoFolders();
  }, []);

  return {
    photoFolders,
    loading,
    error,
    fetchPhotoFolders,
    createPhotoFolder,
    deletePhotoFolder
  };
};
