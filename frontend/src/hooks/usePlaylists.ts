import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Playlist } from '../types';
import type { RootState } from '../store';
import {
  setPlaylists,
  setSelectedPlaylist,
  clearSelectedPlaylist,
} from '../store/slices/playlistSlice';
import {
  getPlaylists as fetchPlaylistsService,
  createPlaylist as createPlaylistService,
  deletePlaylist as deletePlaylistService,
  addSongToPlaylist as addSongToPlaylistService,
  removeSongFromPlaylist as removeSongFromPlaylistService,
} from '../services/playlists.service';

export function usePlaylists() {
  const playlists = useSelector((state: RootState) => state.playlist.playlists);
  const selectedPlaylist = useSelector((state: RootState) => state.playlist.selectedPlaylist);
  const dispatch = useDispatch();

  const fetchPlaylists = useCallback(async (): Promise<Playlist[]> => {
    const data = await fetchPlaylistsService();
    dispatch(setPlaylists(data));
    return data;
  }, [dispatch]);

  const createPlaylist = useCallback(async (formData: FormData): Promise<Playlist> => {
    const playlist = await createPlaylistService(formData);
    await fetchPlaylists();
    return playlist;
  }, [fetchPlaylists]);

  const deletePlaylist = useCallback(async (id: number): Promise<void> => {
    await deletePlaylistService(id);
    await fetchPlaylists();
  }, [fetchPlaylists]);

  const addSongToPlaylist = useCallback(async (
    playlistId: number,
    songId: number
  ): Promise<Playlist> => {
    const playlist = await addSongToPlaylistService(playlistId, songId);
    await fetchPlaylists();
    return playlist;
  }, [fetchPlaylists]);

  const removeSongFromPlaylist = useCallback(async (
    playlistId: number,
    songId: number
  ): Promise<void> => {
    await removeSongFromPlaylistService(playlistId, songId);
    await fetchPlaylists();
  }, [fetchPlaylists]);


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