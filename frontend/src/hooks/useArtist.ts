import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import {
  fetchArtists,
  createArtist as createArtistThunk,
  updateArtist as updateArtistThunk,
  deleteArtist as deleteArtistThunk,
} from '../store/slices/artistSlice';

export const useArtist = () => {
  const dispatch = useDispatch<AppDispatch>();

  const artists = useSelector((state: RootState) => state.artists.artists);
  const loading = useSelector((state: RootState) => state.artists.loading);
  const error = useSelector((state: RootState) => state.artists.error);

  const refreshArtists = useCallback(() => {
    dispatch(fetchArtists());
  }, [dispatch]);

  const createArtist = async (formData: FormData) => {
    return await dispatch(createArtistThunk(formData)).unwrap();
  };

  const updateArtist = async (id: number, formData: FormData) => {
    return await dispatch(updateArtistThunk({ id, formData })).unwrap();
  };

  const deleteArtist = async (id: number) => {
    return await dispatch(deleteArtistThunk(id)).unwrap();
  };

  return {
    artists,
    loading,
    error,
    createArtist,
    updateArtist,
    deleteArtist,
    refreshArtists, // función manual
  };
};