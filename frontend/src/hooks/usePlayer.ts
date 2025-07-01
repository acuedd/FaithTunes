import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import {
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
} from '../store/slices/playerSlice';
import { useRef, useEffect } from 'react';
import type { Song } from '../types';

export function usePlayer() {
  const dispatch = useDispatch();
  const {
    currentSong,
    isPlaying,
    songQueue,
    playlistQueue,
    currentTime,
    duration,
    volume,
  } = useSelector((state: RootState) => state.player);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ⚠️ Esto te permite conectar desde PlayerFooter
  useEffect(() => {
    const audio = document.getElementById('audio-element') as HTMLAudioElement;
    if (audio) {
      audioRef.current = audio;
    }
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
      dispatch(play());
    } else {
      audioRef.current.pause();
      dispatch(pause());
    }
  };

  const playSong = (song: Song) => {
    dispatch(setCurrentSong(song));
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        dispatch(play());
      }
    }, 100); // delay leve para esperar seteo del src
  };

  return {
    currentSong,
    isPlaying,
    songQueue,
    playlistQueue,
    currentTime,
    duration,
    volume,
    setCurrentSong: (song: Song) => dispatch(setCurrentSong(song)),
    setPlaylist: (songs: Song[]) => dispatch(setPlaylistQueue(songs)),
    setSongQueue: (songs: Song[]) => dispatch(setSongQueue(songs)),
    setCurrentTime: (time: number) => dispatch(setCurrentTime(time)),
    setDuration: (dur: number) => dispatch(setDuration(dur)),
    setVolume: (v: number) => dispatch(setVolume(v)),
    nextSong: () => dispatch(nextSong()),
    previousSong: () => dispatch(previousSong()),
    togglePlayPause,
    playSong, // ✅ esta función reproduce desde cualquier lugar
  };
}