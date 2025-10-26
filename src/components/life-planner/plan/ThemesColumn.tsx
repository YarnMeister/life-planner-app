'use client';

import { useState } from 'react';
import {
  Stack,
  Button,
  Card,
  Text,
  Group,
  ActionIcon,
  Modal,
  TextInput,
  Checkbox,
  Slider,
  Textarea,
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { useLifeOS } from '@/hooks/useLifeOS';
import { Theme } from '@/types';

interface ThemeFormData {
  name: string;
  ratingPercent: number;
  lastReflectionNote?: string;
}

export function ThemesColumn() {
  const {
    pillars,
    themes,
    selectedPillarId,
    selectedThemeIds,
    toggleThemeSelection,
    createTheme,
    updateTheme,
    removeTheme,
  } = useLifeOS();

  const [modalOpened, setModalOpened] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [formData, setFormData] = useState<ThemeFormData>({
    name: '',
    ratingPercent: 50,
    lastReflectionNote: '',
  });

  // Get selected pillar
  const selectedPillar = pillars.find((p) => p.id === selectedPillarId);

  // Filter themes by selected pillar
  const filteredThemes = themes.filter((theme) => theme.pillarId === selectedPillarId);

  const handleOpenCreate = () => {
    if (!selectedPillarId) return;
    setEditingTheme(null);
    setFormData({ name: '', ratingPercent: 50, lastReflectionNote: '' });
    setModalOpened(true);
  };

  const handleOpenEdit = (theme: Theme) => {
    setEditingTheme(theme);
    setFormData({
      name: theme.name,
      ratingPercent: theme.ratingPercent,
      lastReflectionNote: theme.lastReflectionNote || '',
    });
    setModalOpened(true);
  };

  const handleSubmit = async () => {
    if (!selectedPillarId) return;
    
    try {
      if (editingTheme) {
        await updateTheme(editingTheme.id, formData);
      } else {
        await createTheme({
          pillarId: selectedPillarId,
          ...formData,
        });
      }
      setModalOpened(false);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this theme? All associated tasks will be deleted.')) {
      try {
        await removeTheme(id);
      } catch (error) {
        console.error('Failed to delete theme:', error);
      }
    }
  };

  if (!selectedPillarId) {
    return (
      <Stack align="center" justify="center" style={{ height: '100%' }}>
        <Text c="dimmed" size="sm">
          Select a pillar to view themes
        </Text>
      </Stack>
    );
  }

  return (
    <>
      <Stack gap="md" style={{ height: '100%' }}>
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Text fw={600} size="lg">Core Areas</Text>
            {selectedPillar && (
              <Text size="sm" c="dimmed">
                {selectedPillar.name}
              </Text>
            )}
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            size="xs"
            onClick={handleOpenCreate}
          >
            Add Theme
          </Button>
        </Group>

        {/* Themes list with checkboxes */}
        <Stack gap="xs" style={{ flex: 1, overflow: 'auto' }}>
          {filteredThemes.length === 0 ? (
            <Text c="dimmed" size="sm" ta="center" mt="xl">
              No themes yet. Create one to get started.
            </Text>
          ) : (
            filteredThemes.map((theme) => (
              <Card
                key={theme.id}
                padding="md"
                withBorder
                style={{
                  borderLeft: selectedPillar ? `4px solid ${selectedPillar.color}` : undefined,
                }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="sm" style={{ flex: 1 }}>
                    <Checkbox
                      checked={selectedThemeIds.includes(theme.id)}
                      onChange={() => toggleThemeSelection(theme.id)}
                    />
                    <div style={{ flex: 1 }}>
                      <Text fw={500}>{theme.name}</Text>
                      <Text size="sm" c="dimmed">
                        Rating: {theme.ratingPercent}%
                      </Text>
                    </div>
                  </Group>
                  <Group gap={4} wrap="nowrap">
                    <ActionIcon
                      variant="subtle"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(theme);
                      }}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(theme.id);
                      }}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Card>
            ))
          )}
        </Stack>

        {selectedThemeIds.length > 0 && (
          <Text size="sm" c="dimmed">
            {selectedThemeIds.length} theme{selectedThemeIds.length !== 1 ? 's' : ''} selected
          </Text>
        )}
      </Stack>

      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editingTheme ? 'Edit Theme' : 'Create Theme'}
      >
        <Stack gap="md">
          <TextInput
            label="Name"
            placeholder="e.g., Body, Mind, Budgeting"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div>
            <Text size="sm" fw={500} mb="xs">
              Rating: {formData.ratingPercent}%
            </Text>
            <Slider
              value={formData.ratingPercent}
              onChange={(value) => setFormData({ ...formData, ratingPercent: value })}
              min={0}
              max={100}
              step={5}
              marks={[
                { value: 0, label: '0%' },
                { value: 50, label: '50%' },
                { value: 100, label: '100%' },
              ]}
            />
          </div>
          <Textarea
            label="Reflection Note (Optional)"
            placeholder="Add notes about this theme..."
            value={formData.lastReflectionNote}
            onChange={(e) => setFormData({ ...formData, lastReflectionNote: e.target.value })}
            minRows={3}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setModalOpened(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name}>
              {editingTheme ? 'Update' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

