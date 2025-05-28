import {
  AppShell,
  Title,
  Button,
  Group,
  Stack,
  Text,
  Box,
  Loader,
  Modal,
  ActionIcon,
  Image,
  ScrollArea,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import SongList from '../components/SongList';
import PlaylistList from '../components/PlaylistList';
import CreatePlaylistModal from '../components/CreatePlaylistModal';
import PlayerFooter from '../components/PlayerFooter';
import { IconLogout, IconMusic, IconPlaylist, IconPlus, IconUser } from '@tabler/icons-react';
import { useSongs } from '../hooks/useSong';
import { usePlaylists } from '../hooks/usePlaylists';
import type { Playlist, Song } from '../types';
import UploadSongModal from '../components/UploadSongModal';
import EditSongModal from '../components/EditSongModal';
import PlaylistDetail from '../components/PlaylistDetail';

export default function Dashboard() {
  const { accessToken, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = (queryParams.get('tab') as 'songs' | 'playlists') || 'songs';
  const { fetchSongs, deleteSong, songs } = useSongs();
  const { fetchPlaylists, addSongToPlaylist, clearSelectionPlaylist } = usePlaylists();
  const { selectedPlaylist, pickPlaylist, playlists } = usePlaylists();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [songToEdit, setSongToEdit] = useState<Song | null>(null);
  const [playlistSelectOpen, setPlaylistSelectOpen] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'songs' | 'playlists'>(initialTab);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get('tab');
    const playlistId = query.get('playlistselected');

    if (tab === 'songs' || tab === 'playlists') {
      setActiveTab(tab);
    }

    if (tab !== 'playlists' || !playlistId) {
      clearSelectionPlaylist();
    }
  }, [location.search]);

  const fetchData = async () => {
    try {
      const [songsData, playlistsData] = await Promise.all([
        fetchSongs(),
        fetchPlaylists(),
      ]);
    } catch (err) {
      console.error(err);
      logout();
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddToPlaylist = async (songId: number, playlistId: number) => {
    try {
      await addSongToPlaylist(playlistId, songId);
      setPlaylistSelectOpen(null);
    } catch (err) {
      console.error('Error al añadir canción a la playlist:', err);
    }
  };

  const handleEditClick = (song: Song) => {
    setSongToEdit(song);
    setEditOpen(true);
  };

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm' }}
      styles={{
        main: {
          backgroundColor: '#1e1e2f',
          color: 'white',
          paddingBottom: '80px',
        },
      }}
    >
      <AppShell.Header style={{ backgroundColor: '#12121c' }}>
        <Group justify="space-between" p="sm">
          <Title order={3} c="white">MusicApp 🎶</Title>
          <Button
            variant="outline"
            color="red"
            leftSection={<IconLogout size={16} />}
            onClick={() => { logout(); navigate('/login'); }}
          >
            Salir
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar style={{ backgroundColor: '#12121c', color: 'white' }} p="md">
        <Stack gap="sm">
          <Button fullWidth variant="light" onClick={() => setUploadOpen(true)} leftSection={<IconPlus size={14} />}>
            Subir canción
          </Button>
          <Button fullWidth variant="light" onClick={() => setCreateOpen(true)}>
            Crear playlist
          </Button>
          <Text size="sm" c="dimmed">Listas: {playlists.length}</Text>
          <Text size="sm" c="dimmed">Canciones: {songs.length}</Text>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Group mb="md" gap="sm">
          <Button
            radius="xl"
            variant={activeTab === 'songs' ? 'filled' : 'outline'}
            color={activeTab === 'songs' ? 'grape' : 'gray'}
            onClick={() => {
              navigate('/dashboard?tab=songs'); // Push to history
            }}
          >
            Songs
          </Button>
          <Button
            radius="xl"
            variant={activeTab === 'playlists' ? 'filled' : 'outline'}
            color={activeTab === 'playlists' ? 'grape' : 'gray'}
            onClick={() => {
              navigate('/dashboard?tab=playlists'); // Push to history
            }}
          >
            Playlists
          </Button>
        </Group>
        <ScrollArea h="100%">
          {selectedPlaylist && activeTab === 'playlists' ? (
            <PlaylistDetail />
          ) : activeTab === 'songs' ? (
            <SongList
              songs={songs}
              onEdit={handleEditClick}
            />
          ) : (
            <PlaylistList
              onChange={fetchData}
              onSelect={(playlist) => {
                pickPlaylist(playlist);
                navigate(`/dashboard?tab=playlists&playlistselected=${playlist.id}`);
              }}
            />
          )}
        </ScrollArea>
      </AppShell.Main>

      {<PlayerFooter />}

      <UploadSongModal
        opened={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={() => {
          setUploadOpen(false);
          fetchData();
        }}
      />

      <EditSongModal
        opened={editOpen}
        onClose={() => setEditOpen(false)}
        song={songToEdit}
        onUpdated={() => {
          setEditOpen(false);
          fetchData();
        }}
      />

      <CreatePlaylistModal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={fetchData}
      />
    </AppShell>
  );
}
