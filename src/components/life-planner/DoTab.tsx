'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Stack,
  Group,
  Text,
  Button,
  ActionIcon,
  Center,
  Loader,
  Box,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconPlus, IconCheckbox, IconCircleCheck, IconFilter } from '@tabler/icons-react';
import { useLifeOS } from '@/hooks/useLifeOS';
import type { Domain } from '@/types';
import { DomainFilter } from './do/DomainFilter';
import { MobileTaskList } from './do/MobileTaskList';
import { TaskListView } from './do/TaskListView';
import { computeTaskCounts } from './do/taskUtils';

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
    loadPillars,
    loadThemes,
    loadTasks,
    isLoading,
  } = useLifeOS();

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadPillars(), loadThemes(), loadTasks()]);
    };
    loadData();
  }, [loadPillars, loadThemes, loadTasks]);

  // Calculate task counts by domain
  const taskCounts = useMemo(
    () => computeTaskCounts(tasks, pillars),
    [tasks, pillars]
  );

  // Prioritize tasks using the algorithm
  const prioritizedTasks = useMemo(() => {
    // Create lookup maps once before filtering/sorting (micro-optimization)
    const pillarDomainMap = new Map(pillars.map((p) => [p.id, p.domain]));
    const themeRatingMap = new Map(themes.map((t) => [t.id, t.rating]));

    // 1. Filter by domain
    let filtered = tasks.filter((task) => {
      if (domainFilter === 'all') return true;
      const domain = task.pillarId ? pillarDomainMap.get(task.pillarId) : undefined;
      return domain === domainFilter;
    });

    // 2. Filter out completed/archived tasks
    filtered = filtered.filter(
      (task) => task.status !== 'done' && task.status !== 'archived'
    );

    // 3. Sort by prioritization algorithm
    return filtered.sort((a, b) => {
      // Get theme ratings from lookup map
      const ratingA = themeRatingMap.get(a.themeId) ?? 100;
      const ratingB = themeRatingMap.get(b.themeId) ?? 100;

      // 1. Sort by theme rating (ascending - lowest first)
      if (ratingA !== ratingB) {
        return ratingA - ratingB;
      }

      // 2. Then by rank (ascending)
      const rankA = a.rank ?? 999;
      const rankB = b.rank ?? 999;
      if (rankA !== rankB) {
        return rankA - rankB;
      }

      // 3. Then by impact (H > M > L)
      const impactOrder = { H: 1, M: 2, L: 3 };
      const impactA = impactOrder[a.impact ?? 'L'];
      const impactB = impactOrder[b.impact ?? 'L'];
      return impactA - impactB;
    });
  }, [tasks, themes, pillars, domainFilter]);

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

  // Loading state
  if (isLoading) {
    return (
      <Center style={{ height: '100%' }}>
        <Loader size="lg" />
      </Center>
    );
  }

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
