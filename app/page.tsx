'use client';

import { Container, Title, Text, Stack, Button, Paper, Group, Badge } from '@mantine/core';
import { IconCode, IconDatabase, IconPalette, IconLogout, IconShieldCheck, IconLifebuoy } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Text>Loading...</Text>
      </div>
    );
  }

  // Middleware handles redirect, but show nothing if user is null
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
      <Container size="md">
        <Stack gap="xl" align="center">
          {/* User Info Badge */}
          <Paper p="md" shadow="sm" radius="md" withBorder w="100%">
            <Group justify="space-between" align="center">
              <Group gap="sm">
                <IconShieldCheck size={20} color="green" />
                <div>
                  <Text size="xs" c="dimmed">Logged in as</Text>
                  <Text size="sm" fw={600}>{user?.email}</Text>
                </div>
              </Group>
              <Button
                variant="light"
                color="red"
                leftSection={<IconLogout size={16} />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Group>
          </Paper>

          <Paper p="xl" shadow="md" radius="lg" withBorder w="100%">
            <Stack gap="lg" align="center">
              <Badge size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                🚀 Life Planner Migration
              </Badge>
              
              <Title order={1} ta="center" c="blue">
                Life Planner + Next.js Template
              </Title>
              
              <Text size="lg" ta="center" c="dimmed">
                Successfully migrated from Vite to Next.js with Mantine UI, 
                authentication, and database integration.
              </Text>

              <Group justify="center" mt="md">
                <Button 
                  size="lg" 
                  leftSection={<IconLifebuoy size={20} />}
                  onClick={() => router.push('/dashboard')}
                >
                  Open Life Planner
                </Button>
                <Button 
                  size="lg" 
                  variant="light"
                  leftSection={<IconPalette size={20} />}
                  onClick={() => router.push('/mantine-demo')}
                >
                  View Mantine Demo
                </Button>
              </Group>
            </Stack>
          </Paper>

          <Group grow w="100%">
            <Paper p="md" shadow="sm" radius="md" withBorder>
              <Stack gap="sm" align="center">
                <IconCode size={32} color="#3B82F6" />
                <Title order={4}>Modern Stack</Title>
                <Text size="sm" ta="center" c="dimmed">
                  Built with React 18, TypeScript, and Next.js for blazing fast development
                </Text>
              </Stack>
            </Paper>

            <Paper p="md" shadow="sm" radius="md" withBorder>
              <Stack gap="sm" align="center">
                <IconDatabase size={32} color="#3B82F6" />
                <Title order={4}>Database Ready</Title>
                <Text size="sm" ta="center" c="dimmed">
                  Drizzle ORM with PostgreSQL (Neon) and migration management
                </Text>
              </Stack>
            </Paper>

            <Paper p="md" shadow="sm" radius="md" withBorder>
              <Stack gap="sm" align="center">
                <IconPalette size={32} color="#3B82F6" />
                <Title order={4}>UI Components</Title>
                <Text size="sm" ta="center" c="dimmed">
                  Mantine UI + shadcn/ui for beautiful, accessible components
                </Text>
              </Stack>
            </Paper>
          </Group>

          <Paper p="md" shadow="sm" radius="md" withBorder w="100%">
            <Stack gap="xs">
              <Title order={5}>Migration Status</Title>
              <Text size="sm" c="dimmed">
                ✅ Next.js foundation established
              </Text>
              <Text size="sm" c="dimmed">
                ✅ Zustand store migrated
              </Text>
              <Text size="sm" c="dimmed">
                ✅ Mantine UI components ready
              </Text>
              <Text size="sm" c="dimmed">
                🔄 Component migration in progress
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </div>
  );
}

