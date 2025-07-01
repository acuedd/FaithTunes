import { ScrollArea, TextInput, Title, Box } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import type { Song } from '../types';
import { useSongs } from '../hooks/useSong';
import { usePlaylists } from '../hooks/usePlaylists';
import { usePlayer } from '../hooks/usePlayer';
import { SongItem } from './SongItem';
import { SongActionsHandlersProvider } from '../context/SongActionsHandlersContext';


interface Props {
  songs: Song[];
  onEdit?: (song: Song) => void;
}

export default function SongList({ songs, onEdit }: Props) {
  const { deleteSong, updateAuthorization } = useSongs();
  const { setCurrentSong, setSongQueue, playSong } = usePlayer();
  const { addSongToPlaylist, removeSongFromPlaylist, playlists } = usePlaylists();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id: number) => {
    await deleteSong(id);
  };

  const handleToggleAuth = (id: number, value: boolean) => {
    updateAuthorization(id, value);
  };

  const handlePlay = (song: Song) => {
    setCurrentSong(song);
    setSongQueue(songs);
    playSong(song);
  };

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollArea h="100vh" px="md">
      <TextInput
        mb="sm"
        placeholder="Buscar canción..."
        leftSection={<IconSearch size={16} />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
      />
      <Title order={4} mb="xs">
        Canciones
      </Title>
      <Box>
        <SongActionsHandlersProvider
          value={{
            onEdit,
            onDelete: handleDelete,
            onToggleAuth: handleToggleAuth,
            playlists,
            addToPlaylist: addSongToPlaylist,
            removeFromPlaylist: removeSongFromPlaylist,
          }}
        >
          {filteredSongs.map((song, index) => (
            <SongItem
              key={song.id}
              song={song}
              index={index}
              onPlay={handlePlay}
            />
          ))}
        </SongActionsHandlersProvider>
      </Box>
    </ScrollArea>
  );
}