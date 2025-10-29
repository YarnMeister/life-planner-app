'use client';

import { useState, useMemo } from 'react';
import {
  Stack,
  Group,
  Text,
  Button,
  ActionIcon,
  Box,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconPlus, IconCheckbox, IconCircleCheck, IconFilter } from '@tabler/icons-react';
import { useLifeOS } from '@/hooks/useLifeOS';
import type { Domain } from '@/types';
import { DomainFilter } from './do/DomainFilter';
import { MobileTaskList } from './do/MobileTaskList';
import { TaskListView } from './do/TaskListView';
import { computeTaskCounts, prioritizeTasks } from './do/taskUtils';

interface DoTabProps {
  onOpenCapture: () => void;
}

export function DoTab({ onOpenCapture }: DoTabProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [domainFilter, setDomainFilter] = useState<Domain>('all');
  const [completingTaskIds, setCompletingTaskIds] = useState<Set<string>>(new Set());

  const {
    tasks,
    pillars,
    themes,
    updateTask,
    selectTask,
  } = useLifeOS();

  // Calculate task counts by domain
  const taskCounts = useMemo(
    () => computeTaskCounts(tasks, pillars),
    [tasks, pillars]
  );

  // Prioritize tasks using the algorithm
  const prioritizedTasks = useMemo(
    () => prioritizeTasks(tasks, themes, pillars, domainFilter),
    [tasks, themes, pillars, domainFilter]
  );

  // Handle task completion with animation
  const handleTaskComplete = async (taskId: string) => {
    // Add to completing set (triggers opacity change)
    setCompletingTaskIds((prev) => new Set(prev).add(taskId));

    try {
      // Update task status
      await updateTask(taskId, {
        status: 'done',
        completedAt: new Date().toISOString(),
      });

      // Wait for animation to complete
      setTimeout(() => {
        setCompletingTaskIds((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
      }, 300);
    } catch (error) {
      console.error('Failed to complete task:', error);
      // Remove from completing set on error
      setCompletingTaskIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  // Empty state - no tasks at all (never created any)
  if (tasks.length === 0) {
    return (
      <Stack gap="md" style={{ height: '100%' }} p="md">
        <Stack align="center" gap="md" mt="xl">
          <IconCheckbox size={48} color="var(--mantine-color-dimmed)" />
          <Text c="dimmed" size="sm" ta="center">
            No tasks yet. Create tasks in the Plan tab to get started.
          </Text>
          <Button onClick={onOpenCapture}>Quick Capture</Button>
        </Stack>
      </Stack>
    );
  }

  // All tasks completed (have tasks but all are done/archived)
  if (tasks.filter((t) => t.status !== 'done' && t.status !== 'archived').length === 0) {
    return (
      <Stack gap="md" style={{ height: '100%' }} p="md">
        <Stack align="center" gap="md" mt="xl">
          <IconCircleCheck size={48} color="var(--mantine-color-green-6)" />
          <Text fw={600} size="lg">
            All done! 🎉
          </Text>
          <Text c="dimmed" size="sm" ta="center">
            You&apos;ve completed all your tasks. Great work!
          </Text>
        </Stack>
      </Stack>
    );
  }

  // No tasks in current filter
  if (prioritizedTasks.length === 0) {
    return (
      <Stack gap="md" style={{ height: '100%' }} p="md">
        {/* Header */}
        {isMobile ? (
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text fw={600} size="lg">
                  Do
                </Text>
                <Text size="sm" c="dimmed">
                  {taskCounts.all} tasks
                </Text>
              </div>
              <ActionIcon variant="filled" size="lg" onClick={onOpenCapture}>
                <IconPlus size={20} />
              </ActionIcon>
            </Group>
            <DomainFilter
              value={domainFilter}
              onChange={setDomainFilter}
              taskCounts={taskCounts}
            />
          </Stack>
        ) : (
          <Group justify="space-between">
            <div>
              <Text fw={600} size="lg">
                Do
              </Text>
              <Text size="sm" c="dimmed">
                {taskCounts.all} task{taskCounts.all !== 1 ? 's' : ''} to complete
              </Text>
            </div>
            <Group gap="md">
              <DomainFilter
                value={domainFilter}
                onChange={setDomainFilter}
                taskCounts={taskCounts}
              />
              <Button leftSection={<IconPlus size={16} />} onClick={onOpenCapture}>
                Quick Capture
              </Button>
            </Group>
          </Group>
        )}

        {/* Empty filter state */}
        <Stack align="center" gap="md" mt="xl">
          <IconFilter size={48} color="var(--mantine-color-dimmed)" />
          <Text c="dimmed" size="sm" ta="center">
            No {domainFilter} tasks found.
          </Text>
          <Button variant="subtle" onClick={() => setDomainFilter('all')}>
            Show All Tasks
          </Button>
        </Stack>
      </Stack>
    );
  }

  // Main view with tasks
  return isMobile ? (
    <Box p="md" style={{ height: '100%', overflow: 'auto' }}>
      <Stack gap="md" style={{ height: '100%' }}>
        {/* Mobile Header */}
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text fw={600} size="lg">
                Do
              </Text>
              <Text size="sm" c="dimmed">
                {prioritizedTasks.length} tasks
              </Text>
            </div>
            <ActionIcon variant="filled" size="lg" onClick={onOpenCapture}>
              <IconPlus size={20} />
            </ActionIcon>
          </Group>
          <DomainFilter
            value={domainFilter}
            onChange={setDomainFilter}
            taskCounts={taskCounts}
          />
        </Stack>

        {/* Mobile Task List */}
        <MobileTaskList
          tasks={prioritizedTasks}
          pillars={pillars}
          themes={themes}
          onTaskComplete={handleTaskComplete}
          onTaskSelect={selectTask}
          completingTaskIds={completingTaskIds}
        />
      </Stack>
    </Box>
  ) : (
    <Stack gap="md" style={{ height: '100%' }} p="md">
      {/* Desktop Header */}
      <Group justify="space-between">
        <div>
          <Text fw={600} size="lg">
            Do
          </Text>
          <Text size="sm" c="dimmed">
            {prioritizedTasks.length} task{prioritizedTasks.length !== 1 ? 's' : ''} to
            complete
          </Text>
        </div>
        <Group gap="md">
          <DomainFilter
            value={domainFilter}
            onChange={setDomainFilter}
            taskCounts={taskCounts}
          />
          <Button leftSection={<IconPlus size={16} />} onClick={onOpenCapture}>
            Quick Capture
          </Button>
        </Group>
      </Group>

      {/* Desktop Task List */}
      <TaskListView
        tasks={prioritizedTasks}
        pillars={pillars}
        themes={themes}
        onTaskComplete={handleTaskComplete}
        onTaskSelect={selectTask}
        completingTaskIds={completingTaskIds}
      />
    </Stack>
  );
}
