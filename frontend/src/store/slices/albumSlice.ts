// src/store/slices/albumSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from "@reduxjs/toolkit";
import { getAlbums } from '../../services/albums.service';
import type { Album } from '../../types';

interface AlbumState {
  albums: Album[];
  loading: boolean;
  error: string | null;
}

const initialState: AlbumState = {
  albums: [],
  loading: false,
  error: null,
};

export const fetchAlbums = createAsyncThunk('albums/fetchAll', async () => {
  const albums = await getAlbums();
  return albums;
});

const albumSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {
    setAlbums(state, action: PayloadAction<Album[]>) {
      state.albums = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.albums = action.payload;
        state.loading = false;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error fetching albums';
      });
  },
});

export const { setAlbums } = albumSlice.actions;
export default albumSlice.reducer;