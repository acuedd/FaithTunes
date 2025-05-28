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
import { IconMusic, IconUser } from '@tabler/icons-react';
import type { Playlist } from '../types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SongList from './SongList';
import { usePlaylists } from '../hooks/usePlaylists';
import { useSongs } from '../hooks/useSong';
import { useEffect } from 'react';

export default function PlaylistDetail() {
  const navigate = useNavigate();
  const { selectedPlaylist } = usePlaylists();

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

        <SongList
          songs={selectedPlaylist?.songs || []}
          onEdit={() => { }}
        />
      </Box>
    </motion.div>
  );
}
