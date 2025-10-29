'use client';

import { useState, useEffect } from 'react';
import { AppShell, Tabs, Loader, Center } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBulb, IconRun, IconHeart, IconAlertCircle } from '@tabler/icons-react';
import { PlanTab } from '@/components/life-planner/PlanTab';
import { DoTab } from '@/components/life-planner/DoTab';
import { ReflectTab } from '@/components/life-planner/ReflectTab';
import { CaptureTaskForm } from '@/components/life-planner/CaptureTaskForm';
import { useLifeOS } from '@/hooks/useLifeOS';

export default function DashboardPage() {
  const [captureFormOpened, setCaptureFormOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('plan');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { loadPillars, loadThemes, loadTasks, isLoading } = useLifeOS();

  // Load all data once at dashboard level with error handling
  useEffect(() => {
    const loadData = async () => {
      const results = await Promise.allSettled([
        loadPillars(),
        loadThemes(),
        loadTasks(),
      ]);

      // Check for failures and show toast notifications
      const failures: string[] = [];

      if (results[0].status === 'rejected') {
        failures.push('pillars');
        console.error('Failed to load pillars:', results[0].reason);
      }

      if (results[1].status === 'rejected') {
        failures.push('themes');
        console.error('Failed to load themes:', results[1].reason);
      }

      if (results[2].status === 'rejected') {
        failures.push('tasks');
        console.error('Failed to load tasks:', results[2].reason);
      }

      // Show error notifications for failed resources
      if (failures.length > 0) {
        notifications.show({
          title: 'Failed to load some data',
          message: `Could not load: ${failures.join(', ')}. Some features may not work correctly.`,
          color: 'red',
          icon: <IconAlertCircle size={16} />,
          autoClose: 8000,
        });
      }

      setIsInitialLoad(false);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Show loading state only during initial load
  if (isInitialLoad && isLoading) {
    return (
      <AppShell padding="md" style={{ minHeight: '100vh' }}>
        <Center style={{ height: '100vh' }}>
          <Loader size="lg" />
        </Center>
      </AppShell>
    );
  }

  return (
    <AppShell padding="md" style={{ minHeight: '100vh' }}>
        <Tabs 
          value={activeTab} 
          onChange={setActiveTab}
          style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
        >
          <Tabs.List>
            <Tabs.Tab value="plan" leftSection={<IconBulb size={16} />}>
              Plan
            </Tabs.Tab>
            <Tabs.Tab value="reflect" leftSection={<IconHeart size={16} />}>
              Reflect
            </Tabs.Tab>
            <Tabs.Tab value="do" leftSection={<IconRun size={16} />}>
              Do
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="plan" style={{ flex: 1, overflow: 'hidden' }} pt="md">
            <PlanTab />
          </Tabs.Panel>

          <Tabs.Panel value="reflect" style={{ flex: 1, overflow: 'hidden' }} pt="md">
            <ReflectTab />
          </Tabs.Panel>

          <Tabs.Panel value="do" style={{ flex: 1 }} pt="md">
            <DoTab onOpenCapture={() => setCaptureFormOpened(true)} />
          </Tabs.Panel>
        </Tabs>

        <CaptureTaskForm opened={captureFormOpened} onClose={() => setCaptureFormOpened(false)} />
      </AppShell>
  );
}

