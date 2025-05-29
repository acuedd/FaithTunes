import {
  AppShell,
  Burger,
  Drawer,
  Group,
  ScrollArea,
  Title,
  Stack,
  Button,
  Text
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHome, IconSettings, IconPlus } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { Header } from './Header';
import { useNavigate } from 'react-router-dom';

function NavLinks() {
  const navigate = useNavigate();

  return (
    <ScrollArea>
      <Stack gap="md" p="md">
        <Button variant="subtle" onClick={() => navigate('/')}>
          <Group>
            <IconHome size={20} />
            <span>Home</span>
          </Group>
        </Button>
      </Stack>
    </ScrollArea>
  );
}

interface LayoutProps {
  setUploadOpen?: (open: boolean) => void;
  setCreateOpen?: (open: boolean) => void;
  playlistsLength: number;
  songsLength: number;
  children2?: React.ReactNode;
}

export default function Layout({ children, children2, setUploadOpen, setCreateOpen, playlistsLength, songsLength }: React.PropsWithChildren<LayoutProps>) {
  const [opened, { toggle: toggleDrawer, close }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <AppShell
        padding="md"
        header={{ height: 60 }}
        navbar={
          !isMobile
            ? {
              width: 250,
              breakpoint: 'sm',
              collapsed: { mobile: true },
            }
            : undefined
        }
      >
        <Header onToggleDrawer={toggleDrawer} />
        {!isMobile && (
          <AppShell.Navbar p="md">
            <Stack gap="sm">
              {setUploadOpen && setCreateOpen && (
                <>
                  <Button
                    fullWidth
                    variant="light"
                    onClick={() => setUploadOpen(true)}
                    leftSection={<IconPlus size={14} />}
                  >
                    Subir canción
                  </Button>
                  <Button fullWidth variant="light" onClick={() => setCreateOpen(true)}>
                    Crear playlist
                  </Button>
                </>
              )}
              <Text size="sm" c="dimmed">
                Listas: {playlistsLength}
              </Text>
              <Text size="sm" c="dimmed">
                Canciones: {songsLength}
              </Text>
              <NavLinks />
            </Stack>
          </AppShell.Navbar>
        )}
        {isMobile && (
          <Drawer
            opened={opened}
            onClose={close}
            padding="md"
            title="Menú"
            overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
            position="left"
            transitionProps={{ transition: 'slide-left', duration: 300 }}
            zIndex={3000}
            styles={{
              inner: {
                marginLeft: '0px !important',
                left: '0px',
                right: 'auto',
                maxWidth: '100vw',
                width: '100%',
              },
            }}
          >
            {setUploadOpen && setCreateOpen && (
              <Stack gap="sm">
                <Button fullWidth onClick={() => setUploadOpen(true)}>Subir canción</Button>
                <Button fullWidth onClick={() => setCreateOpen(true)}>Crear playlist</Button>
              </Stack>
            )}
            <Text size="sm" c="dimmed">Listas: {playlistsLength}</Text>
            <Text size="sm" c="dimmed">Canciones: {songsLength}</Text>
            <NavLinks />
          </Drawer>
        )}
        <AppShell.Main>{children}</AppShell.Main>
        {children2}

      </AppShell >
    </>
  )
}