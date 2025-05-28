import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import axios from 'axios';
import type { Song } from '../types';
import type { RootState } from '../store';
import {
  setSongs,
  addSong,
  deleteSongById,
  updateSongById,
  setCurrentSong,
  setSongQueue,
  play,
  pause,
  nextSong,
  previousSong,
} from '../store/slices/songSlice';

const API = import.meta.env.VITE_API_URL;

export function useSongs() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const songs = useSelector((state: RootState) => state.song.songs);
  const currentSong = useSelector((state: RootState) => state.song.currentSong);
  const songQueue = useSelector((state: RootState) => state.song.songQueue);
  const isPlaying = useSelector((state: RootState) => state.song.isPlaying);


  const fetchSongs = useCallback(async (): Promise<Song[]> => {
    const res = await axios.get(`${API}/songs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setSongs(res.data));
    return res.data;
  }, [token, dispatch]);

  const uploadSong = useCallback(async (formData: FormData): Promise<Song> => {
    const res = await axios.post(`${API}/songs/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    await fetchSongs();
    return res.data;
  }, [token]);

  const getSongById = useCallback(async (id: number): Promise<Song> => {
    const res = await axios.get(`${API}/songs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }, [token]);

  const updateSong = useCallback(async (id: number, data: Partial<Song>): Promise<Song> => {
    const res = await axios.patch(`${API}/songs/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchSongs();
    return res.data;
  }, [token]);

  const deleteSong = useCallback(async (id: number): Promise<void> => {
    await axios.delete(`${API}/songs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(deleteSongById(id));
  }, [token, dispatch]);

  const setCurrent = (song: Song | null) => dispatch(setCurrentSong(song));
  const setQueue = (queue: Song[]) => dispatch(setSongQueue(queue));
  const togglePlay = () => dispatch(play());
  const togglePause = () => dispatch(pause());
  const next = () => dispatch(nextSong());
  const previous = () => dispatch(previousSong());
  const setAllSongs = (songs: Song[]) => dispatch(setSongs(songs));

  return {
    songs,
    currentSong,
    songQueue,
    isPlaying,
    setAllSongs,
    fetchSongs,
    uploadSong,
    getSongById,
    updateSong,
    deleteSong,
    setCurrent,
    setQueue,
    togglePlay,
    togglePause,
    next,
    previous,
  };
}