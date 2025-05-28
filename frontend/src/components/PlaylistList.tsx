import {
  Box,
  Card,
  Text,
  Group,
  Stack,
  Title,
  ActionIcon,
  SimpleGrid
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconTrash } from '@tabler/icons-react';
import type { Playlist, Song } from '../types';
import { usePlaylists } from '../hooks/usePlaylists';

interface PlaylistListProps {
  onChange: () => void;
  onSelect?: (playlist: Playlist) => void;
}

export default function PlaylistList({ onChange, onSelect }: PlaylistListProps) {
  const navigate = useNavigate();

  const { playlists, deletePlaylist, removeSongFromPlaylist } = usePlaylists();

  const handleDeletePlaylist = async (id: number) => {
    await deletePlaylist(id);
    onChange();
  };

  return (
    <Box>
      <Title order={4} mb="xs">Playlists</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg" mb="xl">
        {playlists.map((playlist: Playlist) => (
          <Box
            key={playlist.id}
            onClick={() => {
              if (onSelect) {
                onSelect(playlist);
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <Card
              shadow="sm"
              p="md"
              radius="md"
              style={{
                backgroundColor: '#2a2a3c',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Group align="center" justify="space-between">
                <Group>
                  <Box w={48} h={48} style={{ backgroundColor: '#5b5be0', borderRadius: 12 }} />
                  <Box>
                    <Text fw={700} size="lg" c="white">{playlist.title}</Text>
                    <Text size="sm" c="gray">{playlist.songs?.length || 0} songs</Text>
                  </Box>
                </Group>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePlaylist(playlist.id);
                  }}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </Group>
            </Card>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}