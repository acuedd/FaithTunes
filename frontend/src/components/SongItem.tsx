import { Paper, Group, Text, ActionIcon, Image, Box } from '@mantine/core';
import { IconPlayerPlay } from '@tabler/icons-react';
import type { Song } from '../types';
import { SongActionsMenu } from './SongActionMenu';
import { useAuth } from '../hooks/useAuth';

interface SongItemProps {
  song: Song;
  index: number;
  onPlay: (song: Song) => void;
}

export function SongItem({ song, index, onPlay }: SongItemProps) {
  const { isAdmin, isAuthenticated } = useAuth();
  return (
    <Paper radius="md" p="md" withBorder mb="sm">
      <Group justify="space-between">
        <Group>
          <Text c="dimmed" w={30}>
            {String(index + 1).padStart(2, '0')}
          </Text>
          <ActionIcon color="blue" variant="light" onClick={() => onPlay(song)}>
            <IconPlayerPlay size={18} />
          </ActionIcon>

          {song.image && (
            <Image src={song.image} width={50} height={50} radius="sm" alt={song.title} />
          )}
          <Box>
            <Text fw={500}>{song.title}</Text>
            <Text size="sm" c="dimmed">{song.subtitle}</Text>
            {isAuthenticated && (
              <Text size="xs" c={song.authorized ? 'green' : 'red'} mt={4}>
                {song.authorized ? 'Autorizada' : 'No autorizada'}
              </Text>
            )}
          </Box>
        </Group>
        <SongActionsMenu
          song={song}
        />
      </Group>
    </Paper>
  );
}