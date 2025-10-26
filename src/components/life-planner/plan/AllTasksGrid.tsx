'use client';

import { useState, useMemo } from 'react';
import {
  SimpleGrid,
  Card,
  Text,
  Group,
  Badge,
  ActionIcon,
  Stack,
  Checkbox,
  TextInput,
  Select,
} from '@mantine/core';
import { IconEdit, IconTrash, IconSearch } from '@tabler/icons-react';
import { useLifeOS } from '@/hooks/useLifeOS';

export function AllTasksGrid() {
  const {
    tasks,
    pillars,
    themes,
    selectTask,
    updateTask,
    removeTask,
  } = useLifeOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'done'>('all');
  const [pillarFilter, setPillarFilter] = useState<string>('all');

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Apply pillar filter
    if (pillarFilter !== 'all') {
      result = result.filter((task) => task.pillarId === pillarFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((task) =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [tasks, pillarFilter, statusFilter, searchQuery]);

  const handleTaskComplete = async (taskId: string, currentStatus: 'open' | 'done') => {
    try {
      await updateTask(taskId, { status: currentStatus === 'open' ? 'done' : 'open' });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await removeTask(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const impactColors = {
    H: 'red',
    M: 'yellow',
    L: 'green',
  };

  return (
    <Stack gap="md" style={{ height: '100%' }}>
      {/* Filters */}
      <Group>
        <TextInput
          placeholder="Search tasks..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="All Pillars"
          value={pillarFilter}
          onChange={(value) => setPillarFilter(value || 'all')}
          data={[
            { value: 'all', label: 'All Pillars' },
            ...pillars.map((p) => ({ value: p.id, label: p.name })),
          ]}
          style={{ width: 180 }}
        />
        <Select
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as 'all' | 'open' | 'done')}
          data={[
            { value: 'all', label: 'All' },
            { value: 'open', label: 'Open' },
            { value: 'done', label: 'Done' },
          ]}
          style={{ width: 120 }}
        />
      </Group>

      {/* Tasks grid */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {filteredTasks.length === 0 ? (
          <Text c="dimmed" size="sm" ta="center" mt="xl">
            No tasks found
          </Text>
        ) : (
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing="md"
          >
            {filteredTasks.map((task) => {
              const pillar = pillars.find((p) => p.id === task.pillarId);
              const theme = themes.find((t) => t.id === task.themeId);

              return (
                <Card
                  key={task.id}
                  padding="md"
                  withBorder
                  style={{
                    borderLeft: pillar ? `4px solid ${pillar.color}` : undefined,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack gap="sm" style={{ flex: 1 }}>
                    {/* Header with checkbox and actions */}
                    <Group justify="space-between" wrap="nowrap">
                      <Checkbox
                        checked={task.status === 'done'}
                        onChange={() => handleTaskComplete(task.id, task.status)}
                      />
                      <Group gap={4} wrap="nowrap">
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          onClick={() => selectTask(task.id)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          size="sm"
                          onClick={() => handleDelete(task.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>

                    {/* Task title */}
                    <Text
                      fw={500}
                      size="sm"
                      style={{ cursor: 'pointer' }}
                      onClick={() => selectTask(task.id)}
                      td={task.status === 'done' ? 'line-through' : undefined}
                      c={task.status === 'done' ? 'dimmed' : undefined}
                    >
                      {task.title}
                    </Text>

                    {/* Task description */}
                    {task.description && (
                      <Text size="xs" c="dimmed" lineClamp={2}>
                        {task.description}
                      </Text>
                    )}

                    {/* Pillar and Theme */}
                    <Group gap="xs">
                      {pillar && (
                        <Badge size="xs" variant="light" color={pillar.color}>
                          {pillar.name}
                        </Badge>
                      )}
                      {theme && (
                        <Badge size="xs" variant="outline">
                          {theme.name}
                        </Badge>
                      )}
                    </Group>

                    {/* Task metadata */}
                    <Group gap="xs" mt="auto">
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
                      {task.dueDate && (
                        <Badge size="xs" variant="light" color="orange">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </Badge>
                      )}
                    </Group>
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>
        )}
      </div>
    </Stack>
  );
}

