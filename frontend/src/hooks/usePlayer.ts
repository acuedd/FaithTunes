import { useDispatch, useSelector } from "react-redux";
import {
  play,
  togglePlay,
  setVolume,
  setCurrentTime,
  setDuration,
  setSongs,
  setCurrentSong,
  nextSong,
  previousSong
} from "../store/slices/playerSlice";
import type { Song } from "../types";
import type { RootState } from "../store";

export function usePlayer() {
  const dispatch = useDispatch();

  const {
    isPlaying,
    volume,
    currentTime,
    duration,
    songs,
    currentSong
  } = useSelector((state: RootState) => state.player);

  const togglePlayHandler = () => dispatch(togglePlay());

  const setVolumeHandler = (vol: number) => dispatch(setVolume(vol));

  const setCurrentTimeHandler = (time: number) => dispatch(setCurrentTime(time));

  const setDurationHandler = (dur: number) => dispatch(setDuration(dur));

  const setSongsHandler = (songsList: Song[]) => dispatch(setSongs(songsList as []));

  const setCurrentSongHandler = (song: Song | null) => {
    dispatch(setCurrentSong(song as Song | null));
    if (song) {
      dispatch(setCurrentTime(0));
      dispatch(play());
    }
  }

  const playHandler = () => dispatch(play());
  const playNextHandler = () => dispatch(nextSong());
  const playPreviousHandler = () => dispatch(previousSong());

  return {
    isPlaying,
    volume,
    currentTime,
    duration,
    songs,
    currentSong,
    togglePlayHandler,
    setVolumeHandler,
    setCurrentTimeHandler,
    setDurationHandler,
    setSongsHandler,
    setCurrentSongHandler,
    playNextHandler,
    playPreviousHandler,
    playHandler
  };
}