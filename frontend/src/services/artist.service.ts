import api from '../api/axiosInstance';
import type { Artist } from '../types';

export const getArtists = async (): Promise<Artist[]> => {
  const response = await api.get('/artists');
  return response.data;
};

export const getArtist = async (id: number): Promise<Artist> => {
  const response = await api.get(`/artists/${id}`);
  return response.data;
};

export const createArtist = async (formData: FormData): Promise<Artist> => {
  const response = await api.post('/artists', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateArtist = async (id: number, formData: FormData): Promise<Artist> => {
  const response = await api.patch(`/artists/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteArtist = async (id: number): Promise<void> => {
  await api.delete(`/artists/${id}`);
};