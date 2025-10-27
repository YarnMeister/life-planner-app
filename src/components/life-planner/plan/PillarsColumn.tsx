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
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { useLifeOS } from '@/hooks/useLifeOS';
import { Pillar, PillarDomain } from '@/types';

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
    removePillar,
  } = useLifeOS();

  const [domainFilter, setDomainFilter] = useState<'all' | 'work' | 'personal'>('all');
  const [modalOpened, setModalOpened] = useState(false);
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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this pillar? All associated themes and tasks will be deleted.')) {
      try {
        await removePillar(id);
      } catch (error) {
        console.error('Failed to delete pillar:', error);
      }
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
                    {pillar.avgPercent}% average
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
                      handleDelete(pillar.id);
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

