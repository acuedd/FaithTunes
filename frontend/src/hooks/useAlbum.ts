// src/hooks/useAlbum.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { setAlbums } from '../store/slices/albumSlice';
import {
  getAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  getAlbum,
} from '../services/albums.service';

export const useAlbum = () => {
  const dispatch = useDispatch<AppDispatch>();

  const albums = useSelector((state: RootState) => state.albums.albums);
  const loading = useSelector((state: RootState) => state.albums.loading);
  const error = useSelector((state: RootState) => state.albums.error);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAlbums();
        dispatch(setAlbums(data));
      } catch (err) {
        console.error('Error loading albums:', err);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleCreateAlbum = async (formData: FormData) => {
    return await createAlbum(formData);
  };

  const handleUpdateAlbum = async (id: number, formData: FormData) => {
    return await updateAlbum(id, formData);
  };

  const handleDeleteAlbum = async (id: number) => {
    await deleteAlbum(id);
  };

  const handleGetAlbum = async (id: number) => {
    return await getAlbum(id);
  };

  return {
    albums,
    loading,
    error,
    createAlbum: handleCreateAlbum,
    updateAlbum: handleUpdateAlbum,
    deleteAlbum: handleDeleteAlbum,
    getAlbum: handleGetAlbum,
  };
};