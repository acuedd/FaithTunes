import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import type { Playlist, Song } from '../types';
import type { RootState } from '../store';
import {
  setPlaylists,
  setSelectedPlaylist,
  clearSelectedPlaylist,
} from '../store/slices/playlistSlice';

const API = import.meta.env.VITE_API_URL;

export function usePlaylists() {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const playlists = useSelector((state: RootState) => state.playlist.playlists);
  const selectedPlaylist = useSelector((state: RootState) => state.playlist.selectedPlaylist);
  const dispatch = useDispatch();

  const getAuthHeaders = useCallback(() => ({
    Authorization: `Bearer ${token}`,
  }), [token]);

  const fetchPlaylists = useCallback(async (): Promise<Playlist[]> => {
    const res = await axios.get(`${API}/playlists`, {
      headers: getAuthHeaders(),
    });
    dispatch(setPlaylists(res.data));
    return res.data;
  }, [getAuthHeaders, dispatch]);

  const createPlaylist = useCallback(async (formData: FormData): Promise<Playlist> => {
    const res = await axios.post(`${API}/playlists`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    await fetchPlaylists();
    return res.data;
  }, [getAuthHeaders, fetchPlaylists]);

  const deletePlaylist = useCallback(async (id: number): Promise<void> => {
    await axios.delete(`${API}/playlists/${id}`, {
      headers: getAuthHeaders(),
    });
    await fetchPlaylists();
  }, [getAuthHeaders, fetchPlaylists]);

  const addSongToPlaylist = useCallback(async (
    playlistId: number,
    songId: number
  ): Promise<Playlist> => {
    const res = await axios.post(
      `${API}/playlists/${playlistId}/songs`,
      { songId },
      { headers: getAuthHeaders() }
    );
    await fetchPlaylists();
    return res.data;
  }, [getAuthHeaders, fetchPlaylists]);

  const removeSongFromPlaylist = useCallback(async (
    playlistId: number,
    songId: number
  ): Promise<void> => {
    await axios.delete(`${API}/playlists/${playlistId}/songs/${songId}`, {
      headers: getAuthHeaders(),
    });
    await fetchPlaylists();
  }, [getAuthHeaders, fetchPlaylists]);


  const pickPlaylist = (playlist: Playlist) => dispatch(setSelectedPlaylist(playlist));
  const clearSelectionPlaylist = () => dispatch(clearSelectedPlaylist());
  const setAllPlaylists = (data: Playlist[]) => dispatch(setPlaylists(data));

  return {
    playlists,
    selectedPlaylist,
    fetchPlaylists,
    createPlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    // new state helpers:
    pickPlaylist,
    clearSelectionPlaylist,
    setAllPlaylists,
  };
}