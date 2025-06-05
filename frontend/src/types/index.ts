// src/types.ts

export interface Song {
  id: number;
  title: string;
  subtitle?: string;
  permaUrl: string;
  explicitContent: boolean;
  image?: string;
  type?: string;
  language?: string;
  year?: number;
  playCount: number;
}

export interface Album {
  id: number;
  title: string;
  release_date?: string;
  cover_url?: string;
  artist_id: number;
  artist?: any;
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

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  password?: string;
}

export interface SocialLinks {
  instagram?: string;
  youtube?: string;
  spotify?: string;
  [key: string]: string | undefined;
}

export interface Artist {
  id: number;
  name: string;
  slug: string;
  realName?: string;
  photoUrl?: string;
  country?: string;
  birthDate?: string;
  socialLinks?: SocialLinks;
  bio?: string;
  genres?: string[];
  labels?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ArtistFormData extends Omit<Artist, 'id' | 'slug' | 'photoUrl'> {
  photo?: File | null;
}
