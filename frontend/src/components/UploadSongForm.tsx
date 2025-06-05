// src/components/UploadSongForm.tsx actualizado con campos adicionales

import { useState } from 'react';
import {
  TextInput,
  Button,
  Checkbox,
  Stack,
  FileInput,
  Textarea,
  NumberInput,
  Select,
} from '@mantine/core';
import { useSongs } from '../hooks/useSong';
import { notifications } from '@mantine/notifications';

interface UploadSongFormProps {
  onUploaded: () => void;
  albumId?: number; // Optional album ID if needed
}

export default function UploadSongForm({ onUploaded, albumId }: UploadSongFormProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [type, setType] = useState('');
  const [language, setLanguage] = useState('');
  const [year, setYear] = useState<number | undefined>(undefined);
  const [explicitContent, setExplicitContent] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { uploadSong } = useSongs();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('type', type);
    formData.append('language', language);
    formData.append('year', year ? String(year) : '');
    formData.append('explicitContent', String(explicitContent));
    formData.append('album_id', albumId ? String(albumId) : '');

    setUploading(true);
    try {
      await uploadSong(formData);
      notifications.show({
        title: '¡Canción subida! 🎶',
        message: `La canción "${title}" se subió correctamente`,
        color: 'green',
      });
      onUploaded();
    } catch (err) {
      console.error('Error al subir canción:', err);
      notifications.show({
        title: 'Error',
        message: 'No se pudo subir la canción. Intenta de nuevo.',
        color: 'red',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <Stack>
        <TextInput
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <TextInput
          label="Subtítulo"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />

        <Select
          label="Tipo"
          data={['song', 'podcast', 'audiobook']}
          value={type}
          onChange={(value) => setType(value || 'song')}
          required
        />

        <TextInput
          label="Idioma"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />

        <NumberInput
          label="Año"
          value={year}
          onChange={(value) => setYear(typeof value === 'number' ? value : undefined)}
          min={1900}
          max={2100}
        />

        <Checkbox
          label="Contenido explícito"
          checked={explicitContent}
          onChange={(e) => setExplicitContent(e.currentTarget.checked)}
        />

        <FileInput
          label="Archivo MP3"
          accept="audio/mpeg"
          value={file}
          onChange={setFile}
          required
        />

        <Button type="submit" loading={uploading} fullWidth>
          Subir canción
        </Button>
      </Stack>
    </form>
  );
}
