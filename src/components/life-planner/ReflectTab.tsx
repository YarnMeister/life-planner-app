'use client';

import { useState, useEffect } from 'react';
import { Stack, Group, Box, Button, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSparkles } from '@tabler/icons-react';
import { useLifeOS } from '@/hooks/useLifeOS';
import { RatingsPillarsColumn } from './reflect/RatingsPillarsColumn';
import { RatingsThemesColumn } from './reflect/RatingsThemesColumn';
import { ReflectModal } from './reflect/ReflectModal';

export function ReflectTab() {
  const [modalOpened, setModalOpened] = useState(false);
  const [lastReflection, setLastReflection] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { loadPillars, loadThemes } = useLifeOS();

  // Load last reflection timestamp
  useEffect(() => {
    const data = localStorage.getItem('lifeOS:lastReflection');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setLastReflection(parsed.timestamp);
      } catch (error) {
        console.error('Failed to parse last reflection data:', error);
      }
    }
  }, []);

  const formatLastReflection = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleReflectionComplete = async () => {
    // Reload data to get updated ratings
    await Promise.all([loadPillars(), loadThemes()]);

    // Update last reflection timestamp
    const data = localStorage.getItem('lifeOS:lastReflection');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setLastReflection(parsed.timestamp);
      } catch (error) {
        console.error('Failed to parse last reflection data:', error);
      }
    }
  };

  // Mobile view - simplified for now
  if (isMobile) {
    return (
      <Box p="md" style={{ height: '100%', overflow: 'auto' }}>
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text fw={600} size="lg">Reflect</Text>
              {lastReflection && (
                <Text size="sm" c="dimmed">
                  Last reflection: {formatLastReflection(lastReflection)}
                </Text>
              )}
            </div>
            <Button
              leftSection={<IconSparkles size={16} />}
              onClick={() => setModalOpened(true)}
            >
              Start Reflection
            </Button>
          </Group>

          <RatingsPillarsColumn />
          <RatingsThemesColumn />
        </Stack>

        <ReflectModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          onComplete={handleReflectionComplete}
        />
      </Box>
    );
  }

  // Desktop view - two-column layout
  return (
    <Stack gap="md" style={{ height: '100%', overflow: 'hidden' }}>
      {/* Header with Start Reflection button */}
      <Group justify="space-between">
        <div>
          <Text fw={600} size="lg">Reflect on Your Life Areas</Text>
          {lastReflection && (
            <Text size="sm" c="dimmed">
              Last reflection: {formatLastReflection(lastReflection)}
            </Text>
          )}
        </div>
        <Button
          leftSection={<IconSparkles size={16} />}
          onClick={() => setModalOpened(true)}
          size="md"
        >
          Start Reflection
        </Button>
      </Group>

      {/* Two-column layout */}
      <Group align="flex-start" gap="md" style={{ flex: 1, overflow: 'hidden' }}>
        <Box style={{ flex: '0 0 280px', height: '100%' }}>
          <RatingsPillarsColumn />
        </Box>
        <Box style={{ flex: '0 1 560px', maxWidth: '600px', height: '100%' }}>
          <RatingsThemesColumn />
        </Box>
      </Group>

      {/* Reflection modal */}
      <ReflectModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onComplete={handleReflectionComplete}
      />
    </Stack>
  );
}
