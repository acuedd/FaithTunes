import { createContext, useContext } from 'react';
import type { Song } from '../types';

type SongActionsHandlers = {
  onEdit?: (song: Song) => void;
  onDelete: (id: number) => void;
  onToggleAuth: (id: number, value: boolean) => void;
  playlists: any[];
  addToPlaylist: (playlistId: number, songId: number) => void;
  removeFromPlaylist: (playlistId: number, songId: number) => void;
};

const SongActionsHandlersContext = createContext<SongActionsHandlers | null>(null);

export const useSongActionsHandlers = () => {
  const ctx = useContext(SongActionsHandlersContext);
  if (!ctx) throw new Error('useSongActionsHandlers must be used within a provider');
  return ctx;
};

export const SongActionsHandlersProvider = SongActionsHandlersContext.Provider;