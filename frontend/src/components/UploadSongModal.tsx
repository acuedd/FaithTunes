import { Modal } from '@mantine/core';
import UploadSongForm from './UploadSongForm';

interface Props {
  opened: boolean;
  onClose: () => void;
  onUploaded: () => void;
}

export default function UploadSongModal({ opened, onClose, onUploaded }: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Subir nueva canción"
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
      <UploadSongForm onUploaded={onUploaded} />
    </Modal>
  );
}
