'use client';

import { MantineProvider as BaseMantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '@/theme/mantine-theme';
import { ReactNode, useEffect, useState } from 'react';

interface MantineProviderProps {
  children: ReactNode;
}

/**
 * Client-side Mantine provider with color scheme persistence
 * Wraps the application with Mantine theming and notifications
 */
export function MantineProvider({ children }: MantineProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial hydration, render without color scheme to prevent mismatch
  if (!mounted) {
    return (
      <BaseMantineProvider theme={theme} defaultColorScheme="light">
        <Notifications />
        {children}
      </BaseMantineProvider>
    );
  }

  return (
    <BaseMantineProvider theme={theme} defaultColorScheme="light">
      <Notifications />
      {children}
    </BaseMantineProvider>
  );
}

/**
 * Script to inject color scheme before hydration
 * Add this to the <head> in the root layout
 */
export function MantineColorSchemeScript() {
  return <ColorSchemeScript defaultColorScheme="light" />;
}

