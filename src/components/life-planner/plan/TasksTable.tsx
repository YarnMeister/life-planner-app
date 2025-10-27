'use client';

import { useState, useMemo } from 'react';
import {
  Stack,
  Button,
  Table,
  Text,
  Group,
  ActionIcon,
  Badge,
  TextInput,
  Select,
  Checkbox,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconGripVertical,
} from '@tabler/icons-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useLifeOS } from '@/hooks/useLifeOS';
import { Task } from '@/types';

interface SortableRowProps {
  task: Task;
  pillarColor?: string;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

function SortableRow({ task, pillarColor: _pillarColor, onEdit, onDelete, onSelect }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const impactColors = {
    H: 'red',
    M: 'yellow',
    L: 'green',
  };

  return (
    <Table.Tr ref={setNodeRef} style={style}>
      <Table.Td>
        <ActionIcon variant="subtle" {...attributes} {...listeners} style={{ cursor: 'grab' }}>
          <IconGripVertical size={16} />
        </ActionIcon>
      </Table.Td>
      <Table.Td>
        <Checkbox
          checked={task.status === 'done'}
          onChange={() => {/* Will be handled by task detail panel */}}
        />
      </Table.Td>
      <Table.Td>
        <Text
          size="sm"
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect(task.id)}
        >
          {task.title}
        </Text>
      </Table.Td>
      <Table.Td>
        {task.impact && (
          <Badge size="sm" color={impactColors[task.impact]}>
            {task.impact}
          </Badge>
        )}
      </Table.Td>
      <Table.Td>
        <Text size="sm">{task.timeEstimate || '-'}</Text>
      </Table.Td>
      <Table.Td>
        <Badge
          size="sm"
          variant="light"
          color={task.status === 'done' ? 'green' : 'blue'}
        >
          {task.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap={4} wrap="nowrap">
          <ActionIcon
            variant="subtle"
            size="sm"
            onClick={() => onEdit(task)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            size="sm"
            onClick={() => onDelete(task.id)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  );
}

export function TasksTable() {
  const {
    tasks,
    pillars,
    selectedThemeIds,
    selectTask,
    removeTask,
    reorderTasksInTheme,
  } = useLifeOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'doing' | 'done' | 'blocked' | 'archived'>('all');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter tasks by selected themes
  const filteredTasks = useMemo(() => {
    let result = tasks.filter((task) => selectedThemeIds.includes(task.themeId));

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

    // Sort by rank
    return result.sort((a, b) => a.rank - b.rank);
  }, [tasks, selectedThemeIds, statusFilter, searchQuery]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex((task) => task.id === active.id);
    const newIndex = filteredTasks.findIndex((task) => task.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedTasks = arrayMove(filteredTasks, oldIndex, newIndex);
    const taskIds = reorderedTasks.map((task) => task.id);

    // Get the theme ID from the first task (all filtered tasks should have the same theme)
    const themeId = filteredTasks[0]?.themeId;
    if (themeId) {
      try {
        await reorderTasksInTheme(themeId, taskIds);
      } catch (error) {
        console.error('Failed to reorder tasks:', error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await removeTask(id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleEdit = (task: Task) => {
    selectTask(task.id);
  };

  if (selectedThemeIds.length === 0) {
    return (
      <Stack align="center" justify="center" style={{ height: '100%' }}>
        <Text c="dimmed" size="sm">
          Select one or more themes to view tasks
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="md" style={{ height: '100%' }}>
      {/* Header with filters */}
      <Group justify="space-between">
        <Text fw={600} size="lg">Tasks</Text>
        <Button
          leftSection={<IconPlus size={16} />}
          size="xs"
          onClick={() => selectTask('new')}
        >
          Add Task
        </Button>
      </Group>

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

      {/* Tasks table */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {filteredTasks.length === 0 ? (
          <Text c="dimmed" size="sm" ta="center" mt="xl">
            No tasks found. Create one to get started.
          </Text>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: 40 }}></Table.Th>
                  <Table.Th style={{ width: 40 }}></Table.Th>
                  <Table.Th>Task</Table.Th>
                  <Table.Th style={{ width: 80 }}>Impact</Table.Th>
                  <Table.Th style={{ width: 100 }}>Time</Table.Th>
                  <Table.Th style={{ width: 100 }}>Status</Table.Th>
                  <Table.Th style={{ width: 100 }}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <SortableContext
                  items={filteredTasks.map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredTasks.map((task) => {
                    const pillar = pillars.find((p) => p.id === task.pillarId);
                    return (
                      <SortableRow
                        key={task.id}
                        task={task}
                        pillarColor={pillar?.color}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSelect={selectTask}
                      />
                    );
                  })}
                </SortableContext>
              </Table.Tbody>
            </Table>
          </DndContext>
        )}
      </div>
    </Stack>
  );
}

