import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Playlist } from '../../types';

interface PlaylistState {
  playlists: Playlist[];
  selectedPlaylist: Playlist | null;
}

const initialState: PlaylistState = {
  playlists: [],
  selectedPlaylist: null,
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setPlaylists: (state, action: PayloadAction<Playlist[]>) => {
      state.playlists = action.payload;
    },
    setSelectedPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.selectedPlaylist = action.payload;
    },
    clearSelectedPlaylist: (state) => {
      state.selectedPlaylist = null;
    },
  },
});

export const { setPlaylists, setSelectedPlaylist, clearSelectedPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;