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
  Menu,
  Avatar,
  Burger,
} from '@mantine/core';
import { ToggleThemeButton } from '../components/ToggleThemeButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { IconLogout, IconPlus, IconUser } from '@tabler/icons-react';

interface HeaderProps {
  onToggleDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleDrawer }) => {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const navigate = useNavigate();

  return (
    <AppShell.Header style={{}}>
      <Group justify="space-between" p="sm">
        <Group>
          <Burger onClick={onToggleDrawer} hiddenFrom="sm" size="sm" />
          <Title order={3}>MusicApp 🎶</Title>
        </Group>
        <Group>
          <ToggleThemeButton />
          <Menu shadow="md" width={200} position="bottom-end" withinPortal>
            <Menu.Target>
              <Avatar
                radius="xl"
                size="md"
                variant="filled"
                color="grape"
                style={{ cursor: 'pointer' }}
              >
                <IconUser size={18} />
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => navigate('/profile')}>Mi perfil</Menu.Item>

              {user?.role === 'admin' && (
                <Menu.Item onClick={() => navigate('/users')}>Admin usuarios</Menu.Item>
              )}

              <Menu.Divider />
              <Menu.Item color="red" onClick={() => { logoutUser(); navigate('/login'); }}>
                Cerrar sesión
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  );
}