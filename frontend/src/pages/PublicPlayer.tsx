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
import { useState, useEffect, useContext } from 'react';
import { Header } from '../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useSongs } from '../hooks/useSong';
import { usePlaylists } from '../hooks/usePlaylists';
import SongList from '../components/SongList';
import { useAppContext } from '../context/AppContext';
import PlaylistList from '../components/PlaylistList';
import PlayerFooter from '../components/PlayerFooter';
import PlaylistDetail from '../components/PlaylistDetail';

export default function PublicPlayer() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = (queryParams.get('tab') as 'songs' | 'playlists') || 'songs';
  const [activeTab, setActiveTab] = useState<'songs' | 'playlists'>(initialTab);

  const { getPublicSongs, songs } = useSongs();
  const { getPublicPlaylists, clearSelectionPlaylist, selectedPlaylist, pickPlaylist, playlists } = usePlaylists();

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
      getPublicSongs();
      getPublicPlaylists();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <Layout
      playlistsLength={0}
      songsLength={0}
      hideSidebar={true}
      children2={
        <PlayerFooter />
      }
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
      <ScrollArea h="100%">
        {selectedPlaylist && activeTab === 'playlists' ?
          (
            <PlaylistDetail />
          ) : activeTab === 'songs' ? (
            <SongList
              songs={songs}
              onEdit={undefined}
            />
          ) : (
            <PlaylistList
              onChange={fetchData}
              onSelect={(playlist) => {
                pickPlaylist(playlist);
                navigate(`/public?tab=playlists&playlistselected=${playlist.id}`);
              }}
            />
          )}
      </ScrollArea>
    </Layout>
  )
}