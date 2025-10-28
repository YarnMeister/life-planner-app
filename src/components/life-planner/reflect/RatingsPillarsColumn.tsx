'use client';

import { Stack, Card, Text, Group, Badge } from '@mantine/core';
import { useLifeOS } from '@/hooks/useLifeOS';

export function RatingsPillarsColumn() {
  const { pillars, selectedPillarId, selectPillar } = useLifeOS();

  return (
    <Stack gap="md" style={{ height: '100%' }}>
      {/* Header */}
      <Text fw={600} size="lg">Life Pillars</Text>

      {/* Pillars list - read-only */}
      <Stack gap="xs" style={{ flex: 1, overflow: 'auto' }}>
        {pillars.length === 0 ? (
          <Text c="dimmed" size="sm" ta="center" mt="xl">
            No pillars yet.
          </Text>
        ) : (
          pillars.map((pillar) => (
            <Card
              key={pillar.id}
              padding="md"
              withBorder
              style={{
                borderLeft: `4px solid ${pillar.color}`,
                cursor: 'pointer',
                backgroundColor: selectedPillarId === pillar.id ? 'var(--mantine-color-blue-0)' : undefined,
              }}
              onClick={() => selectPillar(pillar.id)}
            >
              <Group justify="space-between" wrap="nowrap">
                <div style={{ flex: 1 }}>
                  <Group gap="xs">
                    <Text fw={500}>{pillar.name}</Text>
                    <Badge size="xs" variant="light">
                      {pillar.domain}
                    </Badge>
                  </Group>
                  <Text size="xl" fw={700} c={pillar.color} mt="xs">
                    {pillar.rating}%
                  </Text>
                </div>
              </Group>
            </Card>
          ))
        )}
      </Stack>
    </Stack>
  );
}

