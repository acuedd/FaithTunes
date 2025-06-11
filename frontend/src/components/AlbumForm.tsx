import { TextInput, FileInput, Stack, Image, Autocomplete } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { useArtist } from '../hooks/useArtist';

interface Props {
  onFormDataChange: (formData: FormData) => void;
  defaultValues?: {
    title?: string;
    release_date?: string;
    cover_url?: string;
    artist_id?: number;
  };
}

export default function AlbumForm({ onFormDataChange, defaultValues }: Props) {
  const { artists } = useArtist();

  const [title, setTitle] = useState(defaultValues?.title || '');
  const [releaseDate, setReleaseDate] = useState<Date | null>(
    defaultValues?.release_date ? new Date(defaultValues.release_date) : null
  );
  const [cover, setCover] = useState<File | null>(null);
  const [artistId, setArtistId] = useState<string>('');
  const [artistName, setArtistName] = useState<string>('');

  useEffect(() => {
    if (!title || !artistId) return;

    const formData = new FormData();
    formData.append('title', title);
    if (releaseDate) {
      formData.append('release_date', releaseDate.toISOString().split('T')[0]);
    }
    if (cover) {
      formData.append('cover', cover);
    }
    formData.append('artist_id', artistId);

    // Llama onFormDataChange una sola vez después de construir todo
    const timeout = setTimeout(() => {
      onFormDataChange(formData);
    }, 0);

    return () => clearTimeout(timeout);
  }, [title, releaseDate, cover, artistId]);

  return (
    <Stack>
      <TextInput
        label="Título del álbum"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <DateInput
        label="Fecha de lanzamiento"
        value={releaseDate}
        onChange={(value) => setReleaseDate(value ? new Date(value) : null)}
      />

      <Autocomplete
        label="Artista"
        data={artists.map((a) => ({ value: String(a.id), label: a.name }))}
        value={artistName}
        onChange={(value) => {
          setArtistName(value);
          const matchedArtist = artists.find((a) => a.name === value);
          if (matchedArtist) {
            setArtistId(String(matchedArtist.id));
          }
        }}
        required
      />

      <FileInput
        label="Imagen de portada (opcional)"
        accept="image/*"
        onChange={setCover}
      />

      {cover && typeof cover !== 'string' && (() => {
        const previewUrl = URL.createObjectURL(cover);
        return <Image src={previewUrl} height={120} fit="contain" />;
      })()}
    </Stack>
  );
}
