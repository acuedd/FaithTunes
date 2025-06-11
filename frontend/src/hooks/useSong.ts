import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
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
import {
  getSongs as fetchSongsAPI,
  uploadSong as uploadSongAPI,
  getSongById as getSongByIdAPI,
  updateSong as updateSongAPI,
  deleteSong as deleteSongAPI,
} from '../services/song.service';

export function useSongs() {
  const dispatch = useDispatch();
  const songs = useSelector((state: RootState) => state.song.songs);
  const currentSong = useSelector((state: RootState) => state.song.currentSong);
  const songQueue = useSelector((state: RootState) => state.song.songQueue);
  const isPlaying = useSelector((state: RootState) => state.song.isPlaying);


  const fetchSongs = useCallback(async (): Promise<Song[]> => {
    const res = await fetchSongsAPI();
    dispatch(setSongs(res));
    return res;
  }, [, dispatch]);

  const uploadSong = useCallback(async (formData: FormData): Promise<Song> => {
    const res = await uploadSongAPI(formData);
    await fetchSongs();
    return res;
  }, []);

  const getSongById = useCallback(async (id: number): Promise<Song> => {
    const res = await getSongByIdAPI(id);
    return res;
  }, []);

  const updateSong = useCallback(async (id: number, data: Partial<Song>): Promise<Song> => {
    const res = await updateSongAPI(id, data);
    await fetchSongs();
    return res;
  }, []);

  const deleteSong = useCallback(async (id: number): Promise<void> => {
    await deleteSongAPI(id);
    dispatch(deleteSongById(id));
  }, [dispatch]);

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