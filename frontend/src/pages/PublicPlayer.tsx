import {
  AppShell,
  Burger,
  Drawer,
  Group,
  ScrollArea,
  Title,
  Stack,
  Button,
  Text
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHome, IconUser, IconPlus } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useSongs } from '../hooks/useSong';
import { usePlaylists } from '../hooks/usePlaylists';

export default function PublicPlayer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getPublicSongs, songs } = useSongs();
  const { fetchPlaylists, clearSelectionPlaylist } = usePlaylists();

  const queryParams = new URLSearchParams(location.search);
  const initialTab = (queryParams.get('tab') as 'songs' | 'playlists') || 'songs';
  const [activeTab, setActiveTab] = useState<'songs' | 'playlists'>(initialTab);
  console.log('🚀 ~ PublicPlayer ~ activeTab:', activeTab)


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
      getPublicSongs()
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout
      playlistsLength={0}
      songsLength={0}
      hideSidebar={true}
    >
      <Group mb="md" gap="sm">
        <Button
          radius="xl"
          variant={activeTab === 'songs' ? 'filled' : 'outline'}
          color={activeTab === 'songs' ? 'grape' : 'gray'}
          onClick={() => {
            navigate('/public?tab=songs'); // Push to history
          }}
        >
          Songs
        </Button>
        <Button
          radius="xl"
          variant={activeTab === 'playlists' ? 'filled' : 'outline'}
          color={activeTab === 'playlists' ? 'grape' : 'gray'}
          onClick={() => {
            navigate('/public?tab=playlists'); // Push to history
          }}
        >
          Playlists
        </Button>
      </Group>

    </Layout>
  )
}