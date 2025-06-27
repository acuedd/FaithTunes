// src/services/song.service.ts
import type { Song } from '../types';
import api from '../api/axiosInstance';

export const getSongs = async (): Promise<Song[]> => {
  const res = await api.get('/songs');
  return res.data;
};

export const uploadSong = async (formData: FormData): Promise<Song> => {
  const res = await api.post('/songs/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getSongById = async (id: number): Promise<Song> => {
  const res = await api.get(`/songs/${id}`);
  return res.data;
};

export const updateSong = async (id: number, data: Partial<Song>): Promise<Song> => {
  const res = await api.patch(`/songs/${id}`, data);
  return res.data;
};

export const deleteSong = async (id: number): Promise<void> => {
  await api.delete(`/songs/${id}`);
};

export const getPublicSongs = async (): Promise<Song[]> => {
  const res = await api.get('/songs/public');
  return res.data;
};