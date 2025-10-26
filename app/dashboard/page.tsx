'use client';

import { useState } from 'react';
import { MantineProvider, AppShell, Tabs } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import { IconBulb, IconRun, IconHeart } from '@tabler/icons-react';
import { PlanTab } from '@/components/life-planner/PlanTab';
import { DoTab } from '@/components/life-planner/DoTab';
import { ReflectTab } from '@/components/life-planner/ReflectTab';
import { CaptureTaskForm } from '@/components/life-planner/CaptureTaskForm';

export default function DashboardPage() {
  const [captureFormOpened, setCaptureFormOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('plan');

  return (
    <MantineProvider defaultColorScheme="dark">
      <Notifications position="top-right" />
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
    </MantineProvider>
  );
}

