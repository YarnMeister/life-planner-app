'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  Text,
  Group,
  Badge,
  ActionIcon,
  Stack,
  Checkbox,
  TextInput,
  Select,
  ScrollArea,
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'doing' | 'done' | 'blocked' | 'archived'>('all');
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

  const handleTaskComplete = async (taskId: string, currentStatus: string) => {
    try {
      await updateTask(taskId, { status: currentStatus === 'done' ? 'todo' : 'done' });
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
          onChange={(value) => setStatusFilter(value as 'all' | 'todo' | 'doing' | 'done' | 'blocked' | 'archived')}
          data={[
            { value: 'all', label: 'All' },
            { value: 'todo', label: 'To Do' },
            { value: 'doing', label: 'Doing' },
            { value: 'done', label: 'Done' },
            { value: 'blocked', label: 'Blocked' },
            { value: 'archived', label: 'Archived' },
          ]}
          style={{ width: 140 }}
        />
      </Group>

      {/* Tasks count */}
      <Text size="sm" c="dimmed">
        {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
      </Text>

      {/* Tasks table */}
      <ScrollArea style={{ flex: 1 }}>
        {filteredTasks.length === 0 ? (
          <Text c="dimmed" size="sm" ta="center" mt="xl">
            No tasks found
          </Text>
        ) : (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 40 }}>Done</Table.Th>
                <Table.Th style={{ width: 300 }}>Task</Table.Th>
                <Table.Th style={{ width: 150 }}>Pillar</Table.Th>
                <Table.Th style={{ width: 150 }}>Theme</Table.Th>
                <Table.Th style={{ width: 80 }}>Impact</Table.Th>
                <Table.Th style={{ width: 80 }}>Time</Table.Th>
                <Table.Th style={{ width: 100 }}>Status</Table.Th>
                <Table.Th style={{ width: 120 }}>Due Date</Table.Th>
                <Table.Th style={{ width: 300 }}>Description</Table.Th>
                <Table.Th style={{ width: 100 }}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredTasks.map((task) => {
                const pillar = pillars.find((p) => p.id === task.pillarId);
                const theme = themes.find((t) => t.id === task.themeId);

                return (
                  <Table.Tr
                    key={task.id}
                    style={{
                      opacity: task.status === 'done' ? 0.6 : 1,
                      borderLeft: pillar ? `4px solid ${pillar.color}` : undefined,
                    }}
                  >
                    {/* Checkbox */}
                    <Table.Td>
                      <Checkbox
                        checked={task.status === 'done'}
                        onChange={() => handleTaskComplete(task.id, task.status)}
                      />
                    </Table.Td>

                    {/* Task title */}
                    <Table.Td>
                      <Text
                        size="sm"
                        fw={500}
                        style={{ cursor: 'pointer' }}
                        onClick={() => selectTask(task.id)}
                        td={task.status === 'done' ? 'line-through' : undefined}
                      >
                        {task.title}
                      </Text>
                    </Table.Td>

                    {/* Pillar */}
                    <Table.Td>
                      {pillar && (
                        <Badge size="sm" variant="light" color={pillar.color}>
                          {pillar.name}
                        </Badge>
                      )}
                    </Table.Td>

                    {/* Theme */}
                    <Table.Td>
                      {theme && (
                        <Text size="sm">{theme.name}</Text>
                      )}
                    </Table.Td>

                    {/* Impact */}
                    <Table.Td>
                      {task.impact && (
                        <Badge size="sm" color={impactColors[task.impact]}>
                          {task.impact}
                        </Badge>
                      )}
                    </Table.Td>

                    {/* Time estimate */}
                    <Table.Td>
                      {task.timeEstimate && (
                        <Badge size="sm" variant="light">
                          {task.timeEstimate}
                        </Badge>
                      )}
                    </Table.Td>

                    {/* Status */}
                    <Table.Td>
                      <Badge
                        size="sm"
                        color={
                          task.status === 'done' ? 'green' :
                          task.status === 'doing' ? 'blue' :
                          task.status === 'blocked' ? 'red' :
                          task.status === 'archived' ? 'gray' :
                          'cyan'
                        }
                        variant="light"
                      >
                        {task.status}
                      </Badge>
                    </Table.Td>

                    {/* Due date */}
                    <Table.Td>
                      {task.dueDate && (
                        <Text size="sm">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </Text>
                      )}
                    </Table.Td>

                    {/* Description */}
                    <Table.Td>
                      {task.description && (
                        <Text size="xs" c="dimmed" lineClamp={2}>
                          {task.description}
                        </Text>
                      )}
                    </Table.Td>

                    {/* Actions */}
                    <Table.Td>
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
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        )}
      </ScrollArea>
    </Stack>
  );
}

