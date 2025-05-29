import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Modal,
  TextInput,
  Group,
  Title,
  ActionIcon,
  Stack,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { useSongs } from '../hooks/useSong';
import { usePlaylists } from '../hooks/usePlaylists';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useUser } from '../hooks/useUser';
import type { User } from '../types';
import Layout from '../components/Layout';

export default function UserAdmin() {
  const { getUsers, createUser, updateUser, deleteUser } = useUser();
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [opened, setOpened] = useState(false);
  const [form, setForm] = useState<Partial<User> & { password?: string }>({});
  const [isEditing, setIsEditing] = useState(false);
  const { playlists } = usePlaylists();
  const { songs } = useSongs();

  const isMobile = useMediaQuery('(max-width: 768px)');

  const columnHelper = createColumnHelper<User>();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Nombre',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('role', {
      header: 'Rol',
      cell: info => info.getValue(),
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <Group gap="xs">
          <ActionIcon
            color="blue"
            onClick={() => {
              setForm(row.original);
              setIsEditing(true);
              setOpened(true);
            }}
          >
            <IconEdit />
          </ActionIcon>
          <ActionIcon color="red" onClick={() => handleDelete(row.original.id)}>
            <IconTrash />
          </ActionIcon>
        </Group>
      ),
    }),
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
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
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
        logoutUser();
        navigate('/login');
      }
    })();
  }, [getUsers, logoutUser, navigate]);

  return (
    <Layout playlistsLength={playlists.length} songsLength={songs.length}>
      <Title order={2}>Administración de Usuarios</Title>
      <Button my="md" onClick={() => { setForm({}); setIsEditing(false); setOpened(true); }}>
        Crear nuevo usuario
      </Button>
      {isMobile ? (
        <Stack>
          {users.map((user) => (
            <div key={user.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
              <Title order={4}>{user.name}</Title>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rol:</strong> {user.role}</p>
              <Group gap="xs" mt="sm">
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
            </div>
          ))}
        </Stack>
      ) : (
        <Table striped highlightOnHover withColumnBorders>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      )}

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
    </Layout>
  );
}