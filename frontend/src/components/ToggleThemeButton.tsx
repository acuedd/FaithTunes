import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function ToggleThemeButton() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
      variant="outline"
      aria-label="Toggle theme"
    >
      {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
    </ActionIcon>
  );
}