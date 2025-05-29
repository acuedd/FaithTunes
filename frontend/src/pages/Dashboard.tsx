import {
  AppShell,
  Title,
  Button,
  Group,
  Stack,
  Text,
  ScrollArea,
  Drawer,
  Burger,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Song } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useSongs } from '../hooks/useSong';
import { usePlaylists } from '../hooks/usePlaylists';
import SongList from '../components/SongList';
import PlaylistList from '../components/PlaylistList';
import CreatePlaylistModal from '../components/CreatePlaylistModal';
import PlayerFooter from '../components/PlayerFooter';
import UploadSongModal from '../components/UploadSongModal';
import EditSongModal from '../components/EditSongModal';
import PlaylistDetail from '../components/PlaylistDetail';

import Layout from '../components/Layout';

export default function Dashboard() {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchSongs, songs } = useSongs();
  const { fetchPlaylists, clearSelectionPlaylist } = usePlaylists();
  const { selectedPlaylist, pickPlaylist, playlists } = usePlaylists();
  const [drawerOpened, { toggle: toggleDrawer }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const queryParams = new URLSearchParams(location.search);
  const initialTab = (queryParams.get('tab') as 'songs' | 'playlists') || 'songs';
  const [uploadOpen, setUploadOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [songToEdit, setSongToEdit] = useState<Song | null>(null);
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
      logoutUser();
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (song: Song) => {
    setSongToEdit(song);
    setEditOpen(true);
  };

  return (
    <Layout
      playlistsLength={playlists.length}
      songsLength={songs.length}
      children2={
        <>
          <PlayerFooter />
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
        </>
      }
      setUploadOpen={setUploadOpen}
      setCreateOpen={setCreateOpen}
    >
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
    </Layout>
  );
}
