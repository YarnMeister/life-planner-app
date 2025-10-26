'use client';

import { useState, useEffect } from 'react';
import { Stack, Group, SegmentedControl, Box, Loader, Center } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconLayoutList, IconLayoutGrid } from '@tabler/icons-react';
import { useLifeOS } from '@/hooks/useLifeOS';
import { PillarsColumn } from './plan/PillarsColumn';
import { ThemesColumn } from './plan/ThemesColumn';
import { TasksTable } from './plan/TasksTable';
import { TaskDetailPanel } from './plan/TaskDetailPanel';
import { MobileAccordionView } from './plan/MobileAccordionView';
import { AllTasksGrid } from './plan/AllTasksGrid';

type ViewMode = 'hierarchy' | 'grid';

export function PlanTab() {
  const [viewMode, setViewMode] = useState<ViewMode>('hierarchy');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { loadPillars, loadThemes, loadTasks, isLoading } = useLifeOS();

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadPillars(),
        loadThemes(),
        loadTasks(),
      ]);
    };
    loadData();
  }, [loadPillars, loadThemes, loadTasks]);

  // Show loading state
  if (isLoading) {
    return (
      <Center style={{ height: '100%' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  // Mobile view - always show accordion
  if (isMobile) {
    return (
      <Box p="md" style={{ height: '100%', overflow: 'auto' }}>
        <MobileAccordionView />
        <TaskDetailPanel />
      </Box>
    );
  }

  // Desktop view - hierarchy or grid
  return (
    <Stack gap="md" style={{ height: '100%' }} p="md">
      {/* View mode toggle */}
      <Group justify="flex-end">
        <SegmentedControl
          value={viewMode}
          onChange={(value) => setViewMode(value as ViewMode)}
          data={[
            {
              value: 'hierarchy',
              label: (
                <Group gap="xs">
                  <IconLayoutList size={16} />
                  <span>Hierarchy</span>
                </Group>
              ),
            },
            {
              value: 'grid',
              label: (
                <Group gap="xs">
                  <IconLayoutGrid size={16} />
                  <span>Grid</span>
                </Group>
              ),
            },
          ]}
        />
      </Group>

      {/* Content based on view mode */}
      {viewMode === 'hierarchy' ? (
        <Group align="flex-start" gap="md" style={{ flex: 1, overflow: 'hidden' }}>
          {/* Three-column layout */}
          <Box style={{ width: '280px', height: '100%' }}>
            <PillarsColumn />
          </Box>
          <Box style={{ width: '280px', height: '100%' }}>
            <ThemesColumn />
          </Box>
          <Box style={{ flex: 1, height: '100%' }}>
            <TasksTable />
          </Box>
        </Group>
      ) : (
        <Box style={{ flex: 1, overflow: 'hidden' }}>
          <AllTasksGrid />
        </Box>
      )}

      {/* Task detail panel (drawer) */}
      <TaskDetailPanel />
    </Stack>
  );
}
