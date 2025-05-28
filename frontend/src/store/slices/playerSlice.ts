import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Song } from '../../types';

interface PlayerState {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  songs: [],
  currentSong: Song | null;
}

const initialState: PlayerState = {
  isPlaying: false,
  volume: 1.0, // Default volume level (1.0 = 100%)
  currentTime: 0,
  duration: 0,
  songs: [],
  currentSong: null,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setSongs: (state, action: PayloadAction<[]>) => {
      state.songs = action.payload;
    },
    setCurrentSong: (state, action: PayloadAction<Song | null>) => {
      state.currentSong = action.payload;
    },
    nextSong: (state) => {
      const currentIndex = state.songs.findIndex(song => song === state.currentSong);
      if (currentIndex !== -1 && currentIndex < state.songs.length - 1) {
        state.currentSong = state.songs[currentIndex + 1];
      }
    },
    previousSong: (state) => {
      const currentIndex = state.songs.findIndex(song => song === state.currentSong);
      if (currentIndex > 0) {
        state.currentSong = state.songs[currentIndex - 1];
      }
    },
  },
});

export const { togglePlay, setVolume, setCurrentTime, setDuration, setSongs, setCurrentSong, nextSong, previousSong } = playerSlice.actions;
export default playerSlice.reducer;