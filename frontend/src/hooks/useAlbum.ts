// src/hooks/useAlbum.ts
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { setAlbums } from '../store/slices/albumSlice';
import {
  createAlbum,
  updateAlbum,
  deleteAlbum,
  getAlbum,
} from '../services/albums.service';
import { fetchAlbums } from '../store/slices/albumSlice';

export const useAlbum = () => {
  const dispatch = useDispatch<AppDispatch>();

  const albums = useSelector((state: RootState) => state.albums.albums);
  const loading = useSelector((state: RootState) => state.albums.loading);
  const error = useSelector((state: RootState) => state.albums.error);


  const refreshAlbums = useCallback(() => {
    dispatch(fetchAlbums());
  }, [dispatch]);

  useEffect(() => {
    refreshAlbums();
  }, [refreshAlbums]);

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
    refreshAlbums,
  };
};