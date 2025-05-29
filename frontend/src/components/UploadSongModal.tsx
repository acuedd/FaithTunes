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

        },
        title: {

        },
        body: {

        },
        content: {

        },
      }}
    >
      <UploadSongForm onUploaded={onUploaded} />
    </Modal>
  );
}
