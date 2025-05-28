// src/components/CreatePlaylistModal.tsx con notificaciones
import {
  Modal,
  TextInput,
  Textarea,
  Stack,
  Button,
  Group,
  Box,
  Title,
  Text,
  Flex,
  Switch,
} from '@mantine/core';
import { IconPhoto, IconSparkles } from '@tabler/icons-react';
import { useState } from 'react';
import { usePlaylists } from '../hooks/usePlaylists';
import { notifications } from '@mantine/notifications';

interface CreatePlaylistModalProps {
  opened: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreatePlaylistModal({ opened, onClose, onCreated }: CreatePlaylistModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  const { createPlaylist } = usePlaylists();

  const handleCreate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('isPublic', String(isPublic));
      if (image) formData.append('image', image);
      await createPlaylist(formData);
      notifications.show({
        title: '¡Playlist creada! 🎉',
        message: `Se creó la playlist "${title}" correctamente`,
        color: 'green',
      });
      onCreated();
      setTitle('');
      setDescription('');
      setImage(null);
      onClose();
    } catch (err) {
      console.error('Error al crear playlist:', err);
      notifications.show({
        title: 'Error',
        message: 'No se pudo crear la playlist. Intenta de nuevo.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={null}
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
      <Group align="flex-start" justify="space-between" wrap="nowrap">
        <Stack w={220} gap="sm">
          <Box
            w={220}
            h={220}
            bg="#2e2e40"
            style={{
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontWeight: 500,
              fontSize: 16,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              'Drag and drop playlist image'
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
              }}
            />
          </Box>
        </Stack>

        <Stack w="100%" gap="sm">
          <Group mb={4} align="center" gap={8}>
            <IconPhoto size={24} color="white" />
            <Title order={3} c="white" fw={700}>New playlist</Title>
          </Group>
          <TextInput
            label="Name"
            placeholder="Playlist name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            label="Description"
            placeholder="Add a description for your playlist..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autosize
            minRows={4}
          />
          <Group align="center" justify="space-between">
            <Text size="sm">¿Playlist pública?</Text>
            <Switch
              checked={isPublic}
              onChange={(event) => setIsPublic(event.currentTarget.checked)}
              color="teal"
              size="md"
            />
          </Group>
          <Group justify="space-between">
            <Text size="xs" c="dimmed">{description.length}/500</Text>
            <Button onClick={handleCreate} loading={loading} color="indigo">Create</Button>
          </Group>
        </Stack>
      </Group>
    </Modal>
  );
}
