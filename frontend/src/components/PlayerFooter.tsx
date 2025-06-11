import {
  Box,
  Group,
  Text,
  Image,
  ActionIcon,
  Slider,
  rem,
} from '@mantine/core';
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconVolume,
} from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import { usePlayer } from '../hooks/usePlayer';

export default function PlayerFooter() {
  const {
    currentSong,
    isPlaying,
    togglePlayHandler,
    setCurrentTimeHandler,
    setDurationHandler,
    currentTime: progress,
    duration,
    playNextHandler,
    playPreviousHandler,
  } = usePlayer();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    togglePlayHandler();
  };

  const formatTime = (s: number) => {
    const minutes = Math.floor(s / 60);
    const seconds = Math.floor(s % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        setCurrentTimeHandler(audioRef.current.currentTime);
        setDurationHandler(audioRef.current.duration);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [setCurrentTimeHandler, setDurationHandler]);

  if (!currentSong) return null;

  return (
    <Box
      pos="fixed"
      bottom={0}
      left={0}
      right={0}
      h={rem(80)}
      bg="#1a1a1a"
      px="md"
      style={{
        borderTop: '1px solid #333',
        zIndex: 1000,
        color: 'white',
      }}
    >
      <Group justify="space-between" align="center" h="100%">
        <Group>
          {currentSong.image && (
            <Image src={currentSong.image} alt="cover" width={50} height={50} radius="sm" />
          )}
          <Box>
            <Text size="sm" fw={600} color="white">
              {currentSong.title}
            </Text>
            {currentSong.subtitle && (
              <Text size="xs" c="dimmed">
                {currentSong.subtitle}
              </Text>
            )}
          </Box>
        </Group>

        <Group>
          <ActionIcon variant="transparent" color="gray" onClick={playPreviousHandler}>
            <IconPlayerSkipBack size={18} />
          </ActionIcon>

          <ActionIcon variant="filled" color="blue" onClick={handleTogglePlay} radius="xl">
            {isPlaying ? <IconPlayerPause size={18} /> : <IconPlayerPlay size={18} />}
          </ActionIcon>

          <ActionIcon variant="transparent" color="gray" onClick={playNextHandler}>
            <IconPlayerSkipForward size={18} />
          </ActionIcon>
        </Group>

        <Group style={{ flex: 1 }} px="md">
          <Text size="xs" c="dimmed">
            {formatTime(progress)}
          </Text>
          <Slider
            value={(progress / duration) * 100 || 0}
            onChange={() => { }}
            style={{ flexGrow: 1 }}
          />
          <Text size="xs" c="dimmed">
            {formatTime(duration)}
          </Text>
        </Group>

        <Group>
          <IconVolume size={16} />
        </Group>
      </Group>

      <audio
        ref={audioRef}
        src={currentSong.permaUrl}
        autoPlay
        onEnded={playNextHandler}
        style={{ display: 'none' }}
      />
    </Box>
  );
}