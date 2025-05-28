import { Modal } from '@mantine/core';
import EditSongForm from './EditSongForm';
import type { Song } from '../types';

interface Props {
  opened: boolean;
  onClose: () => void;
  song: Song | null;
  onUpdated: () => void;
}

export default function EditSongModal({ opened, onClose, song, onUpdated }: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Editar canción"
      centered
      size="lg"
      overlayProps={{ blur: 2, backgroundOpacity: 0.55 }}
      styles={{
        header: {
          backgroundColor: '#1e1e2f',
          color: 'white',
          borderBottom: '1px solid #2e2e40',
          fontWeight: 600,
          fontSize: '1.2rem',
        },
        title: {
          color: 'white',
          fontWeight: 600,
        },
        body: {
          backgroundColor: '#12121c',
          color: 'white',
          padding: '1.5rem',
        },
        content: {
          backgroundColor: '#1e1e2f',
          border: '1px solid #2e2e40',
          borderRadius: '10px',
          padding: '0',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.6)',
          minWidth: '400px',
          maxWidth: '600px',
        },
      }}
    >
      {song && <EditSongForm song={song} onUpdated={onUpdated} />}
    </Modal>
  );
}