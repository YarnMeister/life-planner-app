'use client';

import { Stack } from '@mantine/core';
import { TaskCard } from './TaskCard';
import type { Task, Pillar, Theme } from '@/types';

interface MobileTaskListProps {
  tasks: Task[];
  pillars: Pillar[];
  themes: Theme[];
  onTaskComplete: (taskId: string) => void;
  onTaskSelect: (taskId: string) => void;
  completingTaskIds: Set<string>;
}

export function MobileTaskList({
  tasks,
  pillars,
  themes,
  onTaskComplete,
  onTaskSelect,
  completingTaskIds,
}: MobileTaskListProps) {
  return (
    <Stack gap="xs" style={{ flex: 1, overflow: 'auto' }}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          pillar={pillars.find((p) => p.id === task.pillarId)}
          theme={themes.find((t) => t.id === task.themeId)}
          onComplete={onTaskComplete}
          onSelect={onTaskSelect}
          isCompleting={completingTaskIds.has(task.id)}
        />
      ))}
    </Stack>
  );
}

