// src/types.ts

export interface Song {
  id: number;
  title: string;
  subtitle?: string;
  permaUrl: string;
  explicitContent: boolean;
  image?: string;
  type?: string;         // tipo de canción (e.g., "pop", "rock", etc.)
  language?: string;     // idioma de la canción
  year?: number;         // año de publicación
  playCount: number;
}

export interface Playlist {
  id: number;
  title: string;
  description?: string;
  featured: boolean;
  songs: Song[];
  image?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}