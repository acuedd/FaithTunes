import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Song } from '../../types';

interface SongState {
  songs: Song[];
  currentSong: Song | null;
  songQueue: Song[];
  isPlaying: boolean;
}

const initialState: SongState = {
  songs: [],
  currentSong: null,
  songQueue: [],
  isPlaying: false,
};

const songSlice = createSlice({
  name: 'song',
  initialState,
  reducers: {
    addSong: (state, action: PayloadAction<Song>) => {
      state.songs.push(action.payload);
    },
    updateSongById: (state, action: PayloadAction<Song>) => {
      const index = state.songs.findIndex(song => song.id === action.payload.id);
      if (index !== -1) {
        state.songs[index] = action.payload;
      }
    },
    deleteSongById: (state, action: PayloadAction<number>) => {
      state.songs = state.songs.filter(song => song.id !== action.payload);
    },
    setSongs: (state, action: PayloadAction<Song[]>) => {
      state.songs = action.payload;
    },
    setCurrentSong: (state, action: PayloadAction<Song | null>) => {
      state.currentSong = action.payload;
    },
    setSongQueue: (state, action: PayloadAction<Song[]>) => {
      state.songQueue = action.payload;
    },
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    nextSong: (state) => {
      const currentIndex = state.songQueue.findIndex(song => song.id === state.currentSong?.id);
      if (currentIndex !== -1 && currentIndex < state.songQueue.length - 1) {
        state.currentSong = state.songQueue[currentIndex + 1];
      }
    },
    previousSong: (state) => {
      const currentIndex = state.songQueue.findIndex(song => song.id === state.currentSong?.id);
      if (currentIndex > 0) {
        state.currentSong = state.songQueue[currentIndex - 1];
      }
    },
  },
});

export const {
  setSongs,
  setCurrentSong,
  setSongQueue,
  play,
  pause,
  nextSong,
  previousSong,
  addSong,
  updateSongById,
  deleteSongById,
} = songSlice.actions;
export default songSlice.reducer;