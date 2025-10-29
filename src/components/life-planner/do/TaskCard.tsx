'use client';

import { Card, Group, Text, Badge, Checkbox, ActionIcon } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import type { Task, Pillar, Theme } from '@/types';

interface TaskCardProps {
  task: Task;
  pillar?: Pillar;
  theme?: Theme;
  onComplete: (taskId: string) => void;
  onSelect: (taskId: string) => void;
  isCompleting?: boolean;
}

export function TaskCard({
  task,
  pillar,
  theme,
  onComplete,
  onSelect,
  isCompleting = false,
}: TaskCardProps) {
  const impactColors = {
    H: 'red',
    M: 'yellow',
    L: 'green',
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time parts for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card
      padding="md"
      withBorder
      style={{
        borderLeft: `4px solid ${pillar?.color || '#3B82F6'}`,
        opacity: isCompleting ? 0 : 1,
        transform: isCompleting ? 'translateX(-20px)' : 'translateX(0)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onClick={() => onSelect(task.id)}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm" style={{ flex: 1 }}>
          <Checkbox
            checked={false}
            onChange={(e) => {
              e.stopPropagation();
              onComplete(task.id);
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <div style={{ flex: 1 }}>
            <Text fw={500} size="sm">
              {task.title}
            </Text>
            <Group gap="xs" mt={4}>
              <Text size="xs" c="dimmed">
                {theme?.name || 'No theme'}
              </Text>
              {task.impact && (
                <Badge size="xs" color={impactColors[task.impact]}>
                  {task.impact}
                </Badge>
              )}
              {task.timeEstimate && (
                <Badge size="xs" variant="light">
                  {task.timeEstimate}
                </Badge>
              )}
            </Group>
            {task.dueDate && (
              <Text size="xs" c="dimmed" mt={4}>
                Due: {formatDueDate(task.dueDate)}
              </Text>
            )}
            {task.description && (
              <Text size="xs" c="dimmed" mt={4} lineClamp={2}>
                {task.description}
              </Text>
            )}
          </div>
        </Group>
        <ActionIcon
          variant="subtle"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(task.id);
          }}
        >
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Group>
    </Card>
  );
}

