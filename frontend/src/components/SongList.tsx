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
  TextInput,
} from '@mantine/core';
import {
  IconPlayerPlay,
  IconTrash,
  IconPlus,
  IconEdit,
  IconDotsVertical,
  IconSearch,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import type { Song } from '../types';
import { useSongs } from '../hooks/useSong';
import { usePlaylists } from '../hooks/usePlaylists';
import { usePlayer } from '../hooks/usePlayer';
import { useState } from 'react';

interface Props {
  songs: Song[];
  onEdit?: (song: Song) => void;
}

export default function SongList({ songs, onEdit }: Props) {
  const {
    deleteSong,
    updateAuthorization,
  } = useSongs();

  const { setCurrentSongHandler } = usePlayer();

  const { addSongToPlaylist, removeSongFromPlaylist, playlists } = usePlaylists();

  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id: number) => {
    await deleteSong(id);
  };

  return (
    <ScrollArea h="100vh" px="md">
      <TextInput
        mb="sm"
        placeholder="Buscar canción..."
        leftSection={<IconSearch size={16} />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
      />
      <Title order={4} mb="xs" >
        Canciones
      </Title>
      <Box>
        {songs
          .filter((song) =>
            song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((song, index) => (
            <Paper
              key={song.id}
              radius="md"
              p="md"
              withBorder
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
                    <Text fw={500} >
                      {song.title}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {song.subtitle}
                    </Text>
                    {song.authorized ? (
                      <Group gap={4} mt={4}>
                        <Text size="xs" c="green">Autorizada</Text>
                      </Group>
                    ) : (
                      <Group gap={4} mt={4}>
                        <Text size="xs" c="red">No autorizada</Text>
                      </Group>
                    )}
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
                    <Menu.Item
                      onClick={() => updateAuthorization(song.id, !song.authorized)}
                      color={song.authorized ? 'red' : 'green'}
                    >
                      <Group gap={8}>
                        {song.authorized ? (
                          <>
                            <IconX size={16} />
                            <span>Desautorizar</span>
                          </>
                        ) : (
                          <>
                            <IconCheck size={16} />
                            <span>Autorizar</span>
                          </>
                        )}
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