import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Artist } from '../../types';
import { getArtists } from '../../services/artist.service';
import {
  createArtist as apiCreateArtist,
  updateArtist as apiUpdateArtist,
  deleteArtist as apiDeleteArtist,
} from '../../services/artist.service';

interface ArtistState {
  artists: Artist[];
  loading: boolean;
  error: string | null;
}

const initialState: ArtistState = {
  artists: [],
  loading: false,
  error: null,
};

export const fetchArtists = createAsyncThunk('artists/fetchAll', async () => {
  const artists = await getArtists();
  return artists;
});

export const createArtist = createAsyncThunk(
  'artists/create',
  async (formData: FormData) => {
    const artist = await apiCreateArtist(formData);
    return artist;
  }
);

export const updateArtist = createAsyncThunk(
  'artists/update',
  async ({ id, formData }: { id: number; formData: FormData }) => {
    const updated = await apiUpdateArtist(id, formData);
    return updated;
  }
);

export const deleteArtist = createAsyncThunk(
  'artists/delete',
  async (id: number) => {
    await apiDeleteArtist(id);
    return id;
  }
);

const artistSlice = createSlice({
  name: 'artists',
  initialState,
  reducers: {
    setArtists(state, action: PayloadAction<Artist[]>) {
      state.artists = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.artists = action.payload;
        state.loading = false;
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error fetching artists';
      })
      .addCase(createArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArtist.fulfilled, (state, action) => {
        state.artists.push(action.payload);
        state.loading = false;
      })
      .addCase(createArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error creating artist';
      })
      .addCase(updateArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArtist.fulfilled, (state, action) => {
        const index = state.artists.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.artists[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error updating artist';
      })
      .addCase(deleteArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArtist.fulfilled, (state, action) => {
        state.artists = state.artists.filter((a) => a.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error deleting artist';
      });
  },
});

export const { setArtists } = artistSlice.actions;
export default artistSlice.reducer;