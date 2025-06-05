import api from '../api/axiosInstance';
import type { Album } from '../types';

export const getAlbums = async (): Promise<Album[]> => {
  const response = await api.get('/albums');
  return response.data;
};

export const getAlbum = async (id: number): Promise<Album> => {
  const response = await api.get(`/albums/${id}`);
  return response.data;
};

export const createAlbum = async (formData: FormData): Promise<Album> => {
  const response = await api.post('/albums', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateAlbum = async (id: number, formData: FormData): Promise<Album> => {
  const response = await api.patch(`/albums/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteAlbum = async (id: number): Promise<void> => {
  await api.delete(`/albums/${id}`);
};