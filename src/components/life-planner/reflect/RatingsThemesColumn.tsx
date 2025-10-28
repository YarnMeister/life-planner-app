'use client';

import { useState, useEffect } from 'react';
import { Stack, Card, Text, Slider, Group, Loader } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useLifeOS } from '@/hooks/useLifeOS';
import { Theme } from '@/types';

interface ThemeRatingCardProps {
  theme: Theme;
  pillarColor: string;
  onRatingChange: (themeId: string, rating: number) => void;
  isSaving: boolean;
}

function ThemeRatingCard({ theme, pillarColor, onRatingChange, isSaving }: ThemeRatingCardProps) {
  const [localRating, setLocalRating] = useState(theme.rating);
  const [debouncedRating] = useDebouncedValue(localRating, 500);

  // Update when theme rating changes from external source
  useEffect(() => {
    setLocalRating(theme.rating);
  }, [theme.rating]);

  // Save when debounced value changes
  useEffect(() => {
    if (debouncedRating !== theme.rating) {
      onRatingChange(theme.id, debouncedRating);
    }
  }, [debouncedRating, theme.id, theme.rating, onRatingChange]);

  return (
    <Card padding="md" withBorder style={{ borderLeft: `4px solid ${pillarColor}` }}>
      <Stack gap="sm">
        <Group justify="space-between">
          <Text fw={500}>{theme.name}</Text>
          {isSaving && <Loader size="xs" />}
        </Group>
        
        <div>
          <Text size="sm" fw={600} mb="xs" c={pillarColor}>
            {localRating}%
          </Text>
          <Slider
            value={localRating}
            onChange={setLocalRating}
            min={0}
            max={100}
            step={5}
            marks={[
              { value: 0, label: '0%' },
              { value: 50, label: '50%' },
              { value: 100, label: '100%' },
            ]}
            color={pillarColor}
            styles={{
              markLabel: { fontSize: '10px' },
            }}
          />
        </div>

        {theme.lastReflectionNote && (
          <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
            Note: {theme.lastReflectionNote}
          </Text>
        )}
      </Stack>
    </Card>
  );
}

export function RatingsThemesColumn() {
  const { pillars, themes, selectedPillarId, updateTheme } = useLifeOS();
  const [savingThemeIds, setSavingThemeIds] = useState<Set<string>>(new Set());

  // Get selected pillar
  const selectedPillar = pillars.find((p) => p.id === selectedPillarId);

  // Filter themes by selected pillar
  const filteredThemes = themes.filter((theme) => theme.pillarId === selectedPillarId);

  const handleRatingChange = async (themeId: string, rating: number) => {
    setSavingThemeIds((prev) => new Set(prev).add(themeId));
    
    try {
      await updateTheme(themeId, { rating });
    } catch (error) {
      console.error('Failed to update theme rating:', error);
      // Error notification will be handled by the hook
    } finally {
      setSavingThemeIds((prev) => {
        const next = new Set(prev);
        next.delete(themeId);
        return next;
      });
    }
  };

  if (!selectedPillarId) {
    return (
      <Stack gap="md" style={{ height: '100%' }}>
        <Text fw={600} size="lg">Core Areas</Text>
        <Text c="dimmed" size="sm" ta="center" mt="xl">
          Select a pillar to rate its core areas
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="md" style={{ height: '100%' }}>
      {/* Header */}
      <div>
        <Text fw={600} size="lg">Core Areas</Text>
        {selectedPillar && (
          <Text size="sm" c="dimmed">
            {selectedPillar.name}
          </Text>
        )}
      </div>

      {/* Themes list with sliders */}
      <Stack gap="md" style={{ flex: 1, overflow: 'auto' }}>
        {filteredThemes.length === 0 ? (
          <Text c="dimmed" size="sm" ta="center" mt="xl">
            No core areas yet.
          </Text>
        ) : (
          filteredThemes.map((theme) => (
            <ThemeRatingCard
              key={theme.id}
              theme={theme}
              pillarColor={selectedPillar?.color || '#3B82F6'}
              onRatingChange={handleRatingChange}
              isSaving={savingThemeIds.has(theme.id)}
            />
          ))
        )}
      </Stack>
    </Stack>
  );
}

