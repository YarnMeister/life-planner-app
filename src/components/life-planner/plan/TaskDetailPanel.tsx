'use client';

import { useState, useEffect } from 'react';
import {
  Drawer,
  Stack,
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  NumberInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useLifeOS } from '@/hooks/useLifeOS';

interface TaskFormData {
  title: string;
  description: string;
  pillarId: string;
  themeId: string;
  timeEstimate?: '15m' | '30m' | '1h' | '2h+';
  impact?: 'H' | 'M' | 'L';
  status: 'open' | 'done';
  dueDate?: string;
  notes: string;
  taskType?: 'adhoc' | 'recurring';
  recurrenceFrequency?: 'daily' | 'weekly' | 'monthly';
  recurrenceInterval?: number;
}

export function TaskDetailPanel() {
  const {
    tasks,
    pillars,
    themes,
    selectedTaskId,
    selectedPillarId,
    selectedThemeIds,
    selectTask,
    createTask,
    updateTask,
  } = useLifeOS();

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    pillarId: selectedPillarId || '',
    themeId: selectedThemeIds[0] || '',
    timeEstimate: undefined,
    impact: undefined,
    status: 'open',
    dueDate: undefined,
    notes: '',
    taskType: 'adhoc',
    recurrenceFrequency: undefined,
    recurrenceInterval: undefined,
  });

  const [dueDate, setDueDate] = useState<Date | null>(null);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);
  const isOpen = selectedTaskId !== null;
  const isEditing = selectedTask !== undefined && selectedTaskId !== 'new';

  // Update form when task is selected
  useEffect(() => {
    if (selectedTask && selectedTaskId !== 'new') {
      // Editing existing task
      setFormData({
        title: selectedTask.title,
        description: selectedTask.description || '',
        pillarId: selectedTask.pillarId,
        themeId: selectedTask.themeId,
        timeEstimate: selectedTask.timeEstimate,
        impact: selectedTask.impact,
        status: selectedTask.status,
        dueDate: selectedTask.dueDate,
        notes: selectedTask.notes || '',
        taskType: selectedTask.taskType || 'adhoc',
        recurrenceFrequency: selectedTask.recurrenceFrequency,
        recurrenceInterval: selectedTask.recurrenceInterval,
      });
      setDueDate(selectedTask.dueDate ? new Date(selectedTask.dueDate) : null);
    } else if (selectedTaskId === 'new') {
      // New task - use selected pillar and theme
      setFormData({
        title: '',
        description: '',
        pillarId: selectedPillarId || '',
        themeId: selectedThemeIds[0] || '',
        timeEstimate: undefined,
        impact: undefined,
        status: 'open',
        dueDate: undefined,
        notes: '',
        taskType: 'adhoc',
        recurrenceFrequency: undefined,
        recurrenceInterval: undefined,
      });
      setDueDate(null);
    }
  }, [selectedTask, selectedTaskId, selectedPillarId, selectedThemeIds]);

  const handleClose = () => {
    selectTask(null);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.pillarId || !formData.themeId) {
      console.error('Missing required fields:', {
        title: formData.title,
        pillarId: formData.pillarId,
        themeId: formData.themeId
      });
      return;
    }

    const taskData = {
      ...formData,
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : undefined,
      rank: selectedTask?.rank || 0,
    };

    console.log('Submitting task data:', taskData);

    try {
      if (isEditing && selectedTask) {
        await updateTask(selectedTask.id, taskData);
      } else {
        await createTask(taskData);
      }
      handleClose();
    } catch (error) {
      console.error('Failed to save task:', error);
      alert(`Failed to save task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Get themes for selected pillar
  const availableThemes = themes.filter((t) => t.pillarId === formData.pillarId);

  return (
    <Drawer
      opened={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Task' : 'Create Task'}
      position="right"
      size="md"
    >
      <Stack gap="md">
        <TextInput
          label="Title"
          placeholder="Task title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <Textarea
          label="Description"
          placeholder="Task description (optional)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          minRows={3}
        />

        <Select
          label="Pillar"
          placeholder="Select pillar"
          value={formData.pillarId}
          onChange={(value) => {
            setFormData({ ...formData, pillarId: value || '', themeId: '' });
          }}
          data={pillars.map((p) => ({ value: p.id, label: p.name }))}
          required
        />

        <Select
          label="Theme"
          placeholder="Select theme"
          value={formData.themeId}
          onChange={(value) => setFormData({ ...formData, themeId: value || '' })}
          data={availableThemes.map((t) => ({ value: t.id, label: t.name }))}
          required
          disabled={!formData.pillarId}
        />

        <Group grow>
          <Select
            label="Impact"
            placeholder="Select impact"
            value={formData.impact}
            onChange={(value) => setFormData({ ...formData, impact: value as 'H' | 'M' | 'L' | undefined })}
            data={[
              { value: 'H', label: 'High' },
              { value: 'M', label: 'Medium' },
              { value: 'L', label: 'Low' },
            ]}
            clearable
          />

          <Select
            label="Time Estimate"
            placeholder="Select time"
            value={formData.timeEstimate}
            onChange={(value) => setFormData({ ...formData, timeEstimate: value as '15m' | '30m' | '1h' | '2h+' | undefined })}
            data={[
              { value: '15m', label: '15 minutes' },
              { value: '30m', label: '30 minutes' },
              { value: '1h', label: '1 hour' },
              { value: '2h+', label: '2+ hours' },
            ]}
            clearable
          />
        </Group>

        <DateInput
          label="Due Date"
          placeholder="Select due date"
          value={dueDate}
          onChange={(value) => setDueDate(value as Date | null)}
          clearable
        />

        <Select
          label="Status"
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: value as 'open' | 'done' })}
          data={[
            { value: 'open', label: 'Open' },
            { value: 'done', label: 'Done' },
          ]}
        />

        <Select
          label="Task Type"
          value={formData.taskType}
          onChange={(value) => setFormData({ ...formData, taskType: value as 'adhoc' | 'recurring' })}
          data={[
            { value: 'adhoc', label: 'Ad-hoc' },
            { value: 'recurring', label: 'Recurring' },
          ]}
        />

        {formData.taskType === 'recurring' && (
          <Group grow>
            <Select
              label="Frequency"
              value={formData.recurrenceFrequency}
              onChange={(value) => setFormData({ ...formData, recurrenceFrequency: value as 'daily' | 'weekly' | 'monthly' | undefined })}
              data={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
              ]}
            />
            <NumberInput
              label="Interval"
              placeholder="e.g., 1, 2, 3"
              value={formData.recurrenceInterval}
              onChange={(value) => setFormData({ ...formData, recurrenceInterval: Number(value) })}
              min={1}
            />
          </Group>
        )}

        <Textarea
          label="Notes"
          placeholder="Additional notes (optional)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          minRows={3}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.pillarId || !formData.themeId}
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </Group>
      </Stack>
    </Drawer>
  );
}

