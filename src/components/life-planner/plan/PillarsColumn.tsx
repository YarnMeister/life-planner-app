'use client';

import { useState } from 'react';
import {
  Stack,
  Button,
  SegmentedControl,
  Card,
  Text,
  Group,
  ActionIcon,
  Modal,
  TextInput,
  ColorInput,
  Select,
  Badge,
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash, IconAlertTriangle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useLifeOS } from '@/hooks/useLifeOS';
import { Pillar, PillarDomain } from '@/types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface PillarFormData {
  name: string;
  color: string;
  domain: PillarDomain;
}

export function PillarsColumn() {
  const {
    pillars,
    selectedPillarId,
    selectPillar,
    createPillar,
    updatePillar,
    deletePillar,
  } = useLifeOS();

  const [domainFilter, setDomainFilter] = useState<'all' | 'work' | 'personal'>('all');
  const [modalOpened, setModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [pillarToDelete, setPillarToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingPillar, setEditingPillar] = useState<Pillar | null>(null);
  const [formData, setFormData] = useState<PillarFormData>({
    name: '',
    color: '#3B82F6',
    domain: 'personal',
  });

  // Filter pillars by domain
  const filteredPillars = pillars.filter((pillar) => {
    if (domainFilter === 'all') return true;
    return pillar.domain === domainFilter;
  });

  const handleOpenCreate = () => {
    setEditingPillar(null);
    setFormData({ name: '', color: '#3B82F6', domain: 'personal' });
    setModalOpened(true);
  };

  const handleOpenEdit = (pillar: Pillar) => {
    setEditingPillar(pillar);
    setFormData({
      name: pillar.name,
      color: pillar.color,
      domain: pillar.domain,
    });
    setModalOpened(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingPillar) {
        await updatePillar(editingPillar.id, formData);
      } else {
        await createPillar(formData);
      }
      setModalOpened(false);
    } catch (error) {
      console.error('Failed to save pillar:', error);
    }
  };

  const handleOpenDelete = (id: string) => {
    setPillarToDelete(id);
    setDeleteModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (!pillarToDelete) return;

    setIsDeleting(true);
    try {
      await deletePillar(pillarToDelete);
      setDeleteModalOpened(false);
      setPillarToDelete(null);
    } catch (error) {
      console.error('Failed to delete pillar:', error);

      // Check if it's the "Cannot delete pillar with existing themes" error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Cannot delete pillar with existing themes')) {
        notifications.show({
          title: 'Cannot Delete Pillar',
          message: 'This pillar has associated themes. Please delete or reassign all themes before deleting the pillar.',
          color: 'yellow',
          icon: <IconAlertTriangle size={16} />,
          autoClose: 8000,
        });
      } else {
        notifications.show({
          title: 'Error',
          message: 'Failed to delete pillar. Please try again.',
          color: 'red',
          autoClose: 5000,
        });
      }

      // Close modal even on error
      setDeleteModalOpened(false);
      setPillarToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Stack gap="md" style={{ height: '100%' }}>
        {/* Header with filter */}
        <Group justify="space-between">
          <Text fw={600} size="lg">Life Pillars</Text>
          <Button
            leftSection={<IconPlus size={16} />}
            size="xs"
            onClick={handleOpenCreate}
          >
            Add Pillar
          </Button>
        </Group>

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

        {/* Pillars list */}
        <Stack gap="xs" style={{ flex: 1, overflow: 'auto' }}>
          {filteredPillars.map((pillar) => (
            <Card
              key={pillar.id}
              padding="md"
              withBorder
              style={{
                cursor: 'pointer',
                borderLeft: `4px solid ${pillar.color}`,
                backgroundColor: selectedPillarId === pillar.id ? 'var(--mantine-color-blue-0)' : undefined,
              }}
              onClick={() => selectPillar(pillar.id)}
            >
              <Group justify="space-between" wrap="nowrap">
                <div style={{ flex: 1 }}>
                  <Group gap="xs">
                    <Text fw={500}>{pillar.name}</Text>
                    <Badge size="xs" variant="light">
                      {pillar.domain}
                    </Badge>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {pillar.rating}% rating
                  </Text>
                </div>
                <Group gap={4} wrap="nowrap">
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(pillar);
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
                      handleOpenDelete(pillar.id);
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>
      </Stack>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        opened={deleteModalOpened}
        onClose={() => {
          setDeleteModalOpened(false);
          setPillarToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Pillar"
        message="Are you sure you want to delete this pillar? This action cannot be undone."
        isDeleting={isDeleting}
      />

      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editingPillar ? 'Edit Pillar' : 'Create Pillar'}
      >
        <Stack gap="md">
          <TextInput
            label="Name"
            placeholder="e.g., Health, Finance, Work"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <ColorInput
            label="Color"
            value={formData.color}
            onChange={(color) => setFormData({ ...formData, color })}
            format="hex"
            swatches={[
              '#7C3AED', // Purple
              '#16A34A', // Green
              '#2563EB', // Blue
              '#F97316', // Orange
              '#DC2626', // Red
              '#0891B2', // Cyan
              '#CA8A04', // Yellow
              '#9333EA', // Violet
            ]}
          />
          <Select
            label="Domain"
            value={formData.domain}
            onChange={(value) => setFormData({ ...formData, domain: value as PillarDomain })}
            data={[
              { value: 'personal', label: 'Personal' },
              { value: 'work', label: 'Work' },
            ]}
            required
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setModalOpened(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name}>
              {editingPillar ? 'Update' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

