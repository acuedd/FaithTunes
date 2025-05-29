import { useEffect, useState } from 'react';
import {
  AppShell,
  Table,
  Button,
  Modal,
  TextInput,
  Group,
  Title,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useSongs } from '../hooks/useSong';
import { usePlaylists } from '../hooks/usePlaylists';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useUser } from '../hooks/useUser';
import type { User } from '../types';
import { Header } from '../components/Header';
import { MobileMenu } from '../components/MobileMenu';

export default function UserAdmin() {
  const [drawerOpened, { toggle: toggleDrawer }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { getUsers, createUser, updateUser, deleteUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [opened, setOpened] = useState(false);
  const [form, setForm] = useState<Partial<User> & { password?: string }>({});
  const [isEditing, setIsEditing] = useState(false);
  const { playlists } = usePlaylists();
  const { songs } = useSongs();

  const handleSave = async () => {
    if (isEditing && form.id) {
      await updateUser(form.id, form);
    } else {
      await createUser(form);
    }
    setOpened(false);
    setForm({});
    const data = await getUsers();
    setUsers(data);
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    (async () => {
      const data = await getUsers();
      setUsers(data);
    })();
  }, [getUsers]);

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm' }}
      styles={{

      }}
    >
      <Header onToggleDrawer={toggleDrawer} />
      <MobileMenu
        playlistsLength={playlists.length}
        songsLength={songs.length}
      />
      <AppShell.Main>
        <Title order={2}>Administración de Usuarios</Title>
        <Button my="md" onClick={() => { setForm({}); setIsEditing(false); setOpened(true); }}>
          Crear nuevo usuario
        </Button>
        <Table striped highlightOnHover withColumnBorders>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Group gap="xs">
                    <ActionIcon
                      color="blue"
                      onClick={() => {
                        setForm(user);
                        setIsEditing(true);
                        setOpened(true);
                      }}
                    >
                      <IconEdit />
                    </ActionIcon>
                    <ActionIcon color="red" onClick={() => handleDelete(user.id)}>
                      <IconTrash />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal opened={opened} onClose={() => setOpened(false)} title={isEditing ? 'Editar usuario' : 'Nuevo usuario'}>
          <TextInput
            label="Nombre"
            value={form.name || ''}
            onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
            required
          />
          <TextInput
            label="Email"
            value={form.email || ''}
            onChange={(e) => setForm({ ...form, email: e.currentTarget.value })}
            required
          />
          <TextInput
            label="Rol"
            value={form.role || ''}
            onChange={(e) => setForm({ ...form, role: e.currentTarget.value as 'admin' | 'user' })}
            required
          />
          {!isEditing && (
            <TextInput
              label="Contraseña"
              type="password"
              onChange={(e) => setForm({ ...form, password: e.currentTarget.value })}
              required
            />
          )}
          <Button fullWidth mt="md" onClick={handleSave}>
            Guardar
          </Button>
        </Modal>
      </AppShell.Main>
    </AppShell >
  );
}