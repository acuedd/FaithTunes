import {
  Box,
  Group,
  Image,
  Text,
  ActionIcon,
  ScrollArea,
  Paper,
  Title,
  Menu,
} from '@mantine/core';
import {
  IconPlayerPlay,
  IconTrash,
  IconPlus,
  IconEdit,
  IconDotsVertical,
} from '@tabler/icons-react';
import type { Song } from '../types';
import { useSongs } from '../hooks/useSong';
import { usePlaylists } from '../hooks/usePlaylists';
import { usePlayer } from '../hooks/usePlayer';

interface Props {
  songs: Song[];
  onEdit?: (song: Song) => void;
}

export default function SongList({ songs, onEdit }: Props) {
  const {
    deleteSong,
  } = useSongs();

  const { setCurrentSongHandler } = usePlayer();

  const { addSongToPlaylist, removeSongFromPlaylist, playlists } = usePlaylists();

  const handleDelete = async (id: number) => {
    await deleteSong(id);
  };

  return (
    <ScrollArea h="100vh" px="md">
      <Title order={4} mb="xs" c="white">
        Canciones
      </Title>
      <Box>
        {songs.map((song, index) => (
          <Paper
            key={song.id}
            radius="md"
            p="md"
            withBorder
            bg="dark.7"
            mb="sm"
          >
            <Group justify="space-between">
              <Group>
                <Text c="dimmed" w={30}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <ActionIcon
                  color="blue"
                  variant="light"
                  onClick={() => setCurrentSongHandler(song)}
                >
                  <IconPlayerPlay size={18} />
                </ActionIcon>

                {song.image && (
                  <Image
                    src={song.image}
                    width={50}
                    height={50}
                    radius="sm"
                    alt={song.title}
                  />
                )}
                <Box>
                  <Text fw={500} c="white">
                    {song.title}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {song.subtitle}
                  </Text>
                </Box>
              </Group>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon color="gray" variant="light">
                    <IconDotsVertical size={18} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  {onEdit && (
                    <Menu.Item onClick={() => onEdit(song)}>
                      <Group gap={8}>
                        <IconEdit size={16} />
                        <span>Editar</span>
                      </Group>
                    </Menu.Item>
                  )}
                  <Menu.Item onClick={() => handleDelete(song.id)} color="red">
                    <Group gap={8}>
                      <IconTrash size={16} />
                      <span>Eliminar</span>
                    </Group>
                  </Menu.Item>
                  <Menu.Item closeMenuOnClick={false}>
                    <Menu shadow="md" width={220} position="right-start" offset={5}>
                      <Menu.Target>
                        <Group gap={8}>
                          <IconPlus size={16} />
                          <span>Playlist</span>
                        </Group>
                      </Menu.Target>
                      <Menu.Dropdown>
                        {playlists.map((pl) => {
                          const isInPlaylist = pl.songs?.some((s) => s.id === song.id);

                          return (
                            <Menu.Item
                              key={pl.id}
                              onClick={() => {
                                if (isInPlaylist) {
                                  removeSongFromPlaylist(pl.id, song.id);
                                } else {
                                  addSongToPlaylist(pl.id, song.id);
                                }
                              }}
                              rightSection={isInPlaylist ? <Text size="sm">✔</Text> : null}
                            >
                              {pl.title}
                            </Menu.Item>
                          );
                        })}
                      </Menu.Dropdown>
                    </Menu>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Paper>
        ))}
      </Box>
    </ScrollArea>
  );
}