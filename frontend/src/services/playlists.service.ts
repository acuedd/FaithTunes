// src/services/playlist.service.ts
import api from '../api/axiosInstance';
import type { Playlist } from '../types';

export const getPlaylists = async (): Promise<Playlist[]> => {
  const res = await api.get('/playlists');
  return res.data;
};

export const createPlaylist = async (formData: FormData): Promise<Playlist> => {
  const res = await api.post('/playlists', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const deletePlaylist = async (id: number): Promise<void> => {
  await api.delete(`/playlists/${id}`);
};

export const addSongToPlaylist = async (playlistId: number, songId: number): Promise<Playlist> => {
  const res = await api.post(`/playlists/${playlistId}/songs`, { songId });
  return res.data;
};

export const removeSongFromPlaylist = async (playlistId: number, songId: number): Promise<void> => {
  await api.delete(`/playlists/${playlistId}/songs/${songId}`);
};