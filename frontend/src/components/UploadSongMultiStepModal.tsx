import {
  Modal,
  Stepper,
  Button,
  Select,
  Group,
  Stack,
  Radio,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import UploadSongForm from './UploadSongForm';
import { useAlbum } from '../hooks/useAlbum';
import AlbumForm from './AlbumForm';
import { useArtist } from '../hooks/useArtist';

interface Props {
  opened: boolean;
  onClose: () => void;
  onUploaded: () => void;
}

export default function UploadSongMultiStepModal({ opened, onClose, onUploaded }: Props) {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<'new' | 'existing' | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string>('');
  const [albumId, setAlbumId] = useState<number | null>(null);
  const { albums, createAlbum, loading } = useAlbum();
  const { artists, refreshArtists } = useArtist();

  const [newAlbumData, setNewAlbumData] = useState<FormData | null>(null);

  useEffect(() => {
    refreshArtists(); // Llama manualmente si se necesita
  }, []);

  const handleNext = async () => {
    if (mode === 'existing') {
      if (!selectedAlbum) return;
      const album = albums.find((a) => a.id === Number(selectedAlbum));
      if (album) setAlbumId(album.id);
      setActive(1);
    } else if (mode === 'new' && newAlbumData) {
      const album = await createAlbum(newAlbumData);
      setAlbumId(album.id);
      setActive(1);
    }

  };

  const resetState = () => {
    setActive(0);
    setMode(null);
    setSelectedAlbum('');
    setAlbumId(null);
    setNewAlbumData(null);
  };

  const handleUploaded = () => {
    onUploaded();
    resetState();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        onClose();
        resetState();
      }}
      title="Subir nueva canción"
      centered
      size="lg"
      overlayProps={{ blur: 2, backgroundOpacity: 0.55 }}
    >
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="Álbum">
          <Stack>
            <Radio.Group
              label="¿Qué deseas hacer?"
              value={mode}
              onChange={(value) => setMode(value as 'new' | 'existing')}
              required
            >
              <Radio value="new" label="Crear un nuevo álbum" />
              <Radio value="existing" label="Elegir uno existente" />
            </Radio.Group>

            {mode === 'new' && (
              <AlbumForm
                onFormDataChange={(formData) => {
                  setNewAlbumData(formData)
                }
                }
              />
            )}

            {mode === 'existing' && (
              <Select
                label="Selecciona un álbum"
                value={selectedAlbum}
                onChange={(value) => setSelectedAlbum(value || '')}
                data={albums.map((a) => ({ value: String(a.id), label: a.title }))}
              />
            )}

            <Group justify="flex-end">
              <Button onClick={handleNext} loading={loading} disabled={!mode}>Siguiente</Button>
            </Group>
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Subir canción">
          {albumId && <UploadSongForm onUploaded={handleUploaded} albumId={albumId} />}
        </Stepper.Step>

        <Stepper.Completed>
          ¡Canción subida correctamente!
        </Stepper.Completed>
      </Stepper>
    </Modal>
  );
}
