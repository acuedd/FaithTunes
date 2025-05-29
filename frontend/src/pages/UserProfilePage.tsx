import {
  Card,
  Text,
  Button,
  Group,
  TextInput,
  Stack,
  Title,
  ActionIcon,
  PasswordInput,
  Switch,
} from '@mantine/core';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { IconEdit } from '@tabler/icons-react';
import { updateUser } from '../services/user.service';
import Layout from '../components/Layout';
import { useSongs } from '../hooks/useSong';
import { usePlaylists } from '../hooks/usePlaylists';
import { play } from '../store/slices/songSlice';

export default function Profile() {
  const { songs } = useSongs();
  const { playlists } = usePlaylists();
  const { user, logoutUser, setAuthTokens, accessToken, refreshToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  const handleUpdate = async () => {
    if (!user) return;
    try {
      const payload: any = {
        name: form.name,
        email: form.email,
      };
      if (changePassword && form.password) {
        payload.password = form.password;
      }

      const updated = await updateUser(user.id, payload);
      setAuthTokens(accessToken!, refreshToken!, updated);
      setIsEditing(false);
      setChangePassword(false);
      setForm({ ...form, password: '' });
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <Layout songsLength={songs.length} playlistsLength={playlists.length}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={2}>Perfil de Usuario</Title>
          {!isEditing && (
            <ActionIcon variant="light" color="blue" onClick={() => setIsEditing(true)}>
              <IconEdit size={20} />
            </ActionIcon>
          )}
        </Group>

        {isEditing ? (
          <Stack>
            <TextInput
              label="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
            />
            <TextInput
              label="Correo electrónico"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.currentTarget.value })}
            />

            <Switch
              label="¿Deseas cambiar la contraseña?"
              checked={changePassword}
              onChange={(e) => setChangePassword(e.currentTarget.checked)}
            />

            {changePassword && (
              <PasswordInput
                label="Nueva contraseña"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.currentTarget.value })}
              />
            )}

            <Group justify="flex-end">
              <Button variant="default" onClick={() => { setIsEditing(false); setChangePassword(false); }}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate}>Guardar</Button>
            </Group>
          </Stack>
        ) : (
          <Stack>
            <Text><strong>ID:</strong> {user.id}</Text>
            <Text><strong>Nombre:</strong> {user.name}</Text>
            <Text><strong>Email:</strong> {user.email}</Text>
            <Text><strong>Rol:</strong> {user.role}</Text>
          </Stack>
        )}

        <Group justify="flex-end" mt="lg">
          <Button color="red" onClick={logoutUser}>
            Cerrar sesión
          </Button>
        </Group>
      </Card>
    </Layout>
  );
}