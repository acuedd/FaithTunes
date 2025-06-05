import { useEffect, useState } from 'react';
import { TextInput, Button, Modal, Table, Group, Title, Box, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useArtist } from '../hooks/useArtist';
import type { Artist } from '../types';
import Layout from '../components/Layout';

export default function ArtistPage() {
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<Artist | null>(null);
  const [image, setImage] = useState<File | null>(null);

  type ArtistFormValues = Partial<Omit<Artist, 'id' | 'slug' | 'photoUrl'>> & {
    name: string;
    genres: string[];
    labels: string[];
    socialLinks: {
      instagram: string;
      youtube: string;
      spotify: string;
    };
  };

  const form = useForm<ArtistFormValues>({
    initialValues: {
      name: '',
      realName: '',
      country: '',
      birthDate: '',
      socialLinks: {
        instagram: '',
        youtube: '',
        spotify: '',
      },
      bio: '',
      genres: [],
      labels: [],
    },
  });

  const { artists, createArtist, updateArtist, deleteArtist, refreshArtists } = useArtist();

  const handleSubmit = async (values: {
    name: string;
    realName?: string;
    country?: string;
    birthDate?: string;
    socialLinks: {
      instagram: string;
      youtube: string;
      spotify: string;
    };
    bio?: string;
    genres: string[];
    labels: string[];
  }) => {
    const formData = new FormData();
    formData.append('name', values.name);
    if (values.realName) formData.append('realName', values.realName);
    if (values.country) formData.append('country', values.country);
    if (values.birthDate) formData.append('birthDate', values.birthDate);

    // Enviar socialLinks como JSON string
    formData.append('socialLinks', JSON.stringify(values.socialLinks));

    // Enviar genres y labels como JSON string (¡clave!)
    formData.append('genres', JSON.stringify(values.genres));
    formData.append('labels', JSON.stringify(values.labels));

    if (values.bio) formData.append('bio', values.bio);
    if (image) formData.append('photo', image);

    if (editing) {
      await updateArtist(editing.id, formData);
    } else {
      await createArtist(formData);
    }

    refreshArtists();
    setOpened(false);
    setEditing(null);
    form.reset();
    setImage(null);
  };

  const handleDelete = async (id: number) => {
    await deleteArtist(id);
  };

  function handleEdit(artist: Artist): void {
    setEditing(artist);
    form.setValues({
      name: artist.name || '',
      realName: artist.realName || '',
      country: artist.country || '',
      birthDate: artist.birthDate || '',
      socialLinks: {
        instagram: artist.socialLinks?.instagram || '',
        youtube: artist.socialLinks?.youtube || '',
        spotify: artist.socialLinks?.spotify || '',
      },
      bio: artist.bio || '',
      genres: artist.genres || [],
      labels: artist.labels || [],
    });
    setImage(null);
    setOpened(true);
  }
  return (
    <Layout songsLength={0} playlistsLength={0}>
      <div>
        <Title order={2} mb="md">Artistas</Title>
        <Button onClick={() => setOpened(true)}>Nuevo Artista</Button>
        <Box mt="md">
          <Group gap="md" justify="start" wrap="wrap">
            {artists.map((artist) => (
              <Box
                key={artist.id}
                w={180}
                p="sm"
                bg="dark.6"
                style={{
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onClick={() => handleEdit(artist)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Box
                  w="100%"
                  h={180}
                  mb="xs"
                  bg="dark.4"
                  style={{
                    borderRadius: 10,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {artist.photoUrl ? (
                    <img
                      src={artist.photoUrl}
                      alt={artist.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ color: '#aaa', fontSize: 14 }}>Sin imagen</span>
                  )}
                </Box>
                <Title
                  order={5}
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {artist.name}
                </Title>
                {artist.realName && <Box c="dimmed" style={{ fontSize: 12 }}>{artist.realName}</Box>}
                {artist.country && <Box c="dimmed" style={{ fontSize: 12 }}>{artist.country}</Box>}
                <Group justify="space-between" mt="xs">
                  <Button size="xs" onClick={(e) => { e.stopPropagation(); handleEdit(artist); }}>
                    Editar
                  </Button>
                  <Button size="xs" color="red" onClick={(e) => { e.stopPropagation(); handleDelete(artist.id); }}>
                    Eliminar
                  </Button>
                </Group>
              </Box>
            ))}
          </Group>
        </Box>

        <Modal opened={opened} onClose={() => { setOpened(false); setEditing(null); form.reset(); }} title="Artista">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput label="Nombre Artístico" required {...form.getInputProps('name')} />
            <TextInput label="Nombre Real" mt="sm" {...form.getInputProps('realName')} />
            <TextInput label="País" mt="sm" {...form.getInputProps('country')} />
            <DateInput label="Fecha de Nacimiento" mt="sm" {...form.getInputProps('birthDate')} />
            <TextInput label="Instagram" mt="sm" {...form.getInputProps('socialLinks.instagram')} />
            <TextInput label="YouTube" mt="sm" {...form.getInputProps('socialLinks.youtube')} />
            <TextInput label="Spotify" mt="sm" {...form.getInputProps('socialLinks.spotify')} />
            <TextInput
              label="Géneros (separados por coma)"
              mt="sm"
              value={form.values.genres.join(', ')}
              onChange={(e) => form.setFieldValue('genres', e.currentTarget.value.split(',').map(v => v.trim()))}
            />
            <TextInput
              label="Sellos Discográficos (separados por coma)"
              mt="sm"
              value={form.values.labels.join(', ')}
              onChange={(e) => form.setFieldValue('labels', e.currentTarget.value.split(',').map(v => v.trim()))}
            />
            <TextInput label="Biografía" mt="sm" {...form.getInputProps('bio')} />
            <Stack w={220} gap="sm" mt="sm">
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
                  'Sube una imagen del artista'
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
            <Button mt="md" type="submit">Guardar</Button>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}