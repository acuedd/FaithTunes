import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Song } from '../../types';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  songQueue: Song[];
  playlistQueue: Song[];
  currentTime: number;
  duration: number;
  volume: number;
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  songQueue: [],
  playlistQueue: [],
  currentTime: 0,
  duration: 0,
  volume: 1,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    setCurrentSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
      state.currentTime = 0;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setSongQueue: (state, action: PayloadAction<Song[]>) => {
      state.songQueue = action.payload;
    },
    setPlaylistQueue: (state, action: PayloadAction<Song[]>) => {
      state.playlistQueue = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    nextSong: (state) => {
      const currentIndex = state.songQueue.findIndex(
        (s) => s.id === state.currentSong?.id
      );
      const next = state.songQueue[currentIndex + 1];
      if (next) {
        state.currentSong = next;
        state.currentTime = 0;
      }
    },
    previousSong: (state) => {
      const currentIndex = state.songQueue.findIndex(
        (s) => s.id === state.currentSong?.id
      );
      const prev = state.songQueue[currentIndex - 1];
      if (prev) {
        state.currentSong = prev;
        state.currentTime = 0;
      }
    },
  },
});

export const {
  play,
  pause,
  setCurrentSong,
  setIsPlaying,
  setSongQueue,
  setPlaylistQueue,
  setCurrentTime,
  setDuration,
  setVolume,
  nextSong,
  previousSong,
} = playerSlice.actions;

export default playerSlice.reducer;