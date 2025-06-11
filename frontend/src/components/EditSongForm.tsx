import { useState } from 'react';
import { TextInput, Button, NumberInput, Switch, Stack } from '@mantine/core';
import type { Song } from '../types';
import { useSongs } from '../hooks/useSong';

interface Props {
  song: Song;
  onUpdated: () => void;
}

export default function EditSongForm({ song, onUpdated }: Props) {
  const [title, setTitle] = useState(song.title);
  const [subtitle, setSubtitle] = useState(song.subtitle || '');
  const [type, setType] = useState(song.type || '');
  const [language, setLanguage] = useState(song.language || '');
  const [year, setYear] = useState<number | ''>(song.year || '');
  const [explicitContent, setExplicitContent] = useState(song.explicitContent);

  const { updateSong } = useSongs();

  const handleUpdate = async () => {
    try {
      // Aquí deberías usar tu songService.updateSong
      await updateSong(song.id, {
        title,
        subtitle,
        type,
        language,
        year: typeof year === 'number' ? year : undefined,
        explicitContent,
      });

      onUpdated();
    } catch (err) {
      console.error('Error al actualizar la canción:', err);
    }
  };

  return (
    <Stack>
      <TextInput label="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextInput label="Subtítulo" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
      <TextInput label="Tipo" value={type} onChange={(e) => setType(e.target.value)} />
      <TextInput label="Idioma" value={language} onChange={(e) => setLanguage(e.target.value)} />
      <NumberInput label="Año" value={year ?? ''} onChange={(val) => setYear(val as number)} />
      <Switch label="Contenido explícito" checked={explicitContent} onChange={(e) => setExplicitContent(e.currentTarget.checked)} />
      <Button onClick={handleUpdate}>Guardar cambios</Button>
    </Stack>
  );
}