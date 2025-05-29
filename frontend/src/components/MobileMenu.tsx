import {
  Drawer,
  Stack,
  Button,
  Text,
  AppShell,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

interface MobileMenuProps {
  setUploadOpen?: (open: boolean) => void;
  setCreateOpen?: (open: boolean) => void;
  playlistsLength: number;
  songsLength: number;
}

export function MobileMenu({
  setUploadOpen,
  setCreateOpen,
  playlistsLength,
  songsLength,
}: MobileMenuProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [drawerOpened, { toggle: toggleDrawer }] = useDisclosure(false);


  return (
    <>
      {isMobile && (
        <Drawer
          opened={drawerOpened}
          onClose={toggleDrawer}
          title="Menú"
          padding="md"
          position="left"
          overlayProps={{ opacity: 0.5, blur: 4 }}
          transitionProps={{ transition: 'slide-left', duration: 250 }}
        >
          <Stack>
            {setUploadOpen && setCreateOpen && (
              <>
                <Button onClick={() => setUploadOpen(true)}>Subir canción</Button>
                <Button onClick={() => setCreateOpen(true)}>Crear playlist</Button>
              </>
            )}
            <Text size="sm" c="dimmed">
              Listas: {playlistsLength}
            </Text>
            <Text size="sm" c="dimmed">
              Canciones: {songsLength}
            </Text>
          </Stack>
        </Drawer>
      )}

      <AppShell.Navbar p="md">
        {!isMobile && (
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
          </Stack>
        )}
      </AppShell.Navbar>
    </>
  );
}
