'use client';

import { useState } from 'react';
import {
  Accordion,
  Stack,
  Badge,
  Text,
  Group,
  ActionIcon,
  Checkbox,
  SegmentedControl,
} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useLifeOS } from '@/hooks/useLifeOS';

export function MobileAccordionView() {
  const {
    pillars,
    themes,
    tasks,
    selectTask,
    updateTask,
    removeTask,
  } = useLifeOS();

  const [domainFilter, setDomainFilter] = useState<'all' | 'work' | 'personal'>('all');

  // Filter pillars by domain
  const filteredPillars = pillars.filter((pillar) => {
    if (domainFilter === 'all') return true;
    return pillar.domain === domainFilter;
  });

  const handleTaskComplete = async (taskId: string, currentStatus: 'open' | 'done') => {
    try {
      await updateTask(taskId, { status: currentStatus === 'open' ? 'done' : 'open' });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
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
    <Stack gap="md">
      {/* Domain filter */}
      <SegmentedControl
        value={domainFilter}
        onChange={(value) => setDomainFilter(value as 'all' | 'work' | 'personal')}
        data={[
          { label: 'All', value: 'all' },
          { label: 'Work', value: 'work' },
          { label: 'Personal', value: 'personal' },
        ]}
        fullWidth
      />

      {/* Pillars accordion */}
      <Accordion variant="separated">
        {filteredPillars.map((pillar) => {
          const pillarThemes = themes.filter((t) => t.pillarId === pillar.id);

          return (
            <Accordion.Item key={pillar.id} value={pillar.id}>
              <Accordion.Control
                style={{
                  borderLeft: `4px solid ${pillar.color}`,
                }}
              >
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>{pillar.name}</Text>
                    <Text size="sm" c="dimmed">
                      {pillar.avgPercent}% • {pillarThemes.length} themes
                    </Text>
                  </div>
                  <Badge size="sm" variant="light">
                    {pillar.domain}
                  </Badge>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                {pillarThemes.length === 0 ? (
                  <Text size="sm" c="dimmed" ta="center" py="md">
                    No themes yet
                  </Text>
                ) : (
                  <Accordion variant="contained">
                    {pillarThemes.map((theme) => {
                      const themeTasks = tasks.filter((t) => t.themeId === theme.id);

                      return (
                        <Accordion.Item key={theme.id} value={theme.id}>
                          <Accordion.Control>
                            <Group justify="space-between">
                              <div>
                                <Text fw={500} size="sm">
                                  {theme.name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {theme.ratingPercent}% • {themeTasks.length} tasks
                                </Text>
                              </div>
                            </Group>
                          </Accordion.Control>
                          <Accordion.Panel>
                            {themeTasks.length === 0 ? (
                              <Text size="sm" c="dimmed" ta="center" py="sm">
                                No tasks yet
                              </Text>
                            ) : (
                              <Stack gap="xs">
                                {themeTasks.map((task) => (
                                  <Group
                                    key={task.id}
                                    justify="space-between"
                                    wrap="nowrap"
                                    p="xs"
                                    style={{
                                      borderRadius: 'var(--mantine-radius-sm)',
                                      backgroundColor: 'var(--mantine-color-gray-0)',
                                    }}
                                  >
                                    <Group gap="sm" style={{ flex: 1 }}>
                                      <Checkbox
                                        checked={task.status === 'done'}
                                        onChange={() => handleTaskComplete(task.id, task.status)}
                                      />
                                      <div style={{ flex: 1 }}>
                                        <Text
                                          size="sm"
                                          td={task.status === 'done' ? 'line-through' : undefined}
                                          c={task.status === 'done' ? 'dimmed' : undefined}
                                        >
                                          {task.title}
                                        </Text>
                                        <Group gap="xs" mt={4}>
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
                                      </div>
                                    </Group>
                                    <Group gap={4} wrap="nowrap">
                                      <ActionIcon
                                        variant="subtle"
                                        size="sm"
                                        onClick={() => selectTask(task.id)}
                                      >
                                        <IconEdit size={14} />
                                      </ActionIcon>
                                      <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        size="sm"
                                        onClick={() => handleDeleteTask(task.id)}
                                      >
                                        <IconTrash size={14} />
                                      </ActionIcon>
                                    </Group>
                                  </Group>
                                ))}
                              </Stack>
                            )}
                          </Accordion.Panel>
                        </Accordion.Item>
                      );
                    })}
                  </Accordion>
                )}
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Stack>
  );
}

