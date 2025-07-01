import React from 'react';
import {
  Box,
  Text,
  Title,
  Group,
  Image,
  Stack,
  Button,
} from '@mantine/core';
import { IconPlayerPlay, IconArrowsShuffle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SongList from './SongList';
import { usePlaylists } from '../hooks/usePlaylists';
import { useSongs } from '../hooks/useSong';
import { useEffect } from 'react';
import { usePlayer } from '../hooks/usePlayer';

export default function PlaylistDetail() {
  const navigate = useNavigate();
  const { selectedPlaylist } = usePlaylists();
  const { setSongQueue, setCurrentSong, playSong } = usePlayer();

  const handlePlay = () => {
    if (selectedPlaylist?.songs?.length) {
      setSongQueue(selectedPlaylist.songs);
      setCurrentSong(selectedPlaylist.songs[0]);
      playSong(selectedPlaylist.songs[0]);
    }
  };

  const handleShufflePlay = () => {
    if (selectedPlaylist?.songs?.length) {
      const shuffled = [...selectedPlaylist.songs].sort(() => 0.5 - Math.random());
      setSongQueue(shuffled);
      setCurrentSong(shuffled[0]);
      playSong(shuffled[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Box px="lg" py="md">
        <Group align="flex-start" mb="xl">
          {selectedPlaylist?.image ? (
            <Image src={selectedPlaylist.image} alt="cover" width={150} height={150} radius="md" />
          ) : (
            <Box w={150} h={150} style={{ backgroundColor: '#5b5be0', borderRadius: 12 }} />
          )}
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Playlist by <b>{selectedPlaylist?.user?.name || 'Unknown'}</b>
            </Text>
            <Title order={2}>{selectedPlaylist?.title}</Title>
            {selectedPlaylist?.description && <Text>{selectedPlaylist.description}</Text>}
            <Text size="sm" c="dimmed">
              {selectedPlaylist?.songs.length} songs
            </Text>
          </Stack>
        </Group>
        <Group mb="md">
          <Button
            onClick={handlePlay}
            color="grape"
            size="lg"
            w={48}
            h={48}
            p={0}
          >
            <IconPlayerPlay size={32} />
          </Button>
          <Button
            onClick={handleShufflePlay}
            variant="outline"
            color="gray"
            size="lg"
            w={48}
            h={48}
            p={0}
          >
            <IconArrowsShuffle size={28} />
          </Button>
        </Group>
        <SongList
          songs={selectedPlaylist?.songs || []}
          onEdit={() => { }}
        />
      </Box>
    </motion.div>
  );
}
