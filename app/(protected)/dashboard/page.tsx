'use client';

import { useState, useEffect } from 'react';
import { AppShell, Tabs, Loader, Center } from '@mantine/core';
import { IconBulb, IconRun, IconHeart } from '@tabler/icons-react';
import { PlanTab } from '@/components/life-planner/PlanTab';
import { DoTab } from '@/components/life-planner/DoTab';
import { ReflectTab } from '@/components/life-planner/ReflectTab';
import { CaptureTaskForm } from '@/components/life-planner/CaptureTaskForm';
import { useLifeOS } from '@/hooks/useLifeOS';

export default function DashboardPage() {
  const [captureFormOpened, setCaptureFormOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('plan');
  const { loadPillars, loadThemes, loadTasks, isLoading } = useLifeOS();

  // Load all data once at dashboard level
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadPillars(), loadThemes(), loadTasks()]);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Show loading state while data is being fetched
  if (isLoading) {
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

