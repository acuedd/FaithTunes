import { Paper, Group, Text, ActionIcon, Image, Box, Menu } from '@mantine/core';
import { IconCheck, IconDotsVertical, IconEdit, IconPlayerPlay, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import type { Song } from '../types';
import { useAppContext } from '../context/AppContext';
import { useSongActionsHandlers } from '../context/SongActionsHandlersContext';

interface SongActionsMenuProps {
  song: Song;
}

export function SongActionsMenu({ song }: Omit<SongActionsMenuProps, 'actions'>) {
  const { permissions } = useAppContext();
  const { onEdit, onDelete, onToggleAuth, playlists, addToPlaylist, removeFromPlaylist } = useSongActionsHandlers();

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon color="gray" variant="light">
          <IconDotsVertical size={18} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {permissions.showEdit && onEdit && (
          <Menu.Item onClick={() => onEdit(song)}>
            <Group gap={8}>
              <IconEdit size={16} />
              <span>Editar</span>
            </Group>
          </Menu.Item>
        )}
        {permissions.showDelete && (
          <Menu.Item onClick={() => onDelete(song.id)} color="red">
            <Group gap={8}>
              <IconTrash size={16} />
              <span>Eliminar</span>
            </Group>
          </Menu.Item>
        )}
        {permissions.showAuthorizationToggle && (
          <Menu.Item onClick={() => onToggleAuth(song.id, !song.authorized)} color={song.authorized ? 'red' : 'green'}>
            <Group gap={8}>
              {song.authorized ? <><IconX size={16} /><span>Desautorizar</span></> : <><IconCheck size={16} /><span>Autorizar</span></>}
            </Group>
          </Menu.Item>
        )}
        {permissions.showPlaylist && (
          <Menu.Item closeMenuOnClick={false}>
            <Menu shadow="md" width={220} position="right-start" offset={5}>
              <Menu.Target>
                <Group gap={8}><IconPlus size={16} /><span>Playlist</span></Group>
              </Menu.Target>
              <Menu.Dropdown>
                {playlists.map((pl) => {
                  const isInPlaylist = pl.songs?.some((s: { id: number }) => s.id === song.id);
                  return (
                    <Menu.Item
                      key={pl.id}
                      onClick={() =>
                        isInPlaylist ? removeFromPlaylist(pl.id, song.id) : addToPlaylist(pl.id, song.id)
                      }
                      rightSection={isInPlaylist ? <Text size="sm">✔</Text> : null}
                    >
                      {pl.title}
                    </Menu.Item>
                  );
                })}
              </Menu.Dropdown>
            </Menu>
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}