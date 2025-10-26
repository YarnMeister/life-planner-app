import { Container, Title, Text, Stack, Button, Paper, Group, Badge } from '@mantine/core';
import { IconCode, IconDatabase, IconPalette, IconLifebuoy } from '@tabler/icons-react';
import Link from 'next/link';

export default function HomePage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
      <Container size="md">
        <Stack gap="xl" align="center">

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
                <Link href="/dashboard">
                  <Button 
                    size="lg" 
                    leftSection={<IconLifebuoy size={20} />}
                  >
                    Open Life Planner
                  </Button>
                </Link>
                <Link href="/mantine-demo">
                  <Button 
                    size="lg" 
                    variant="light"
                    leftSection={<IconPalette size={20} />}
                  >
                    View Mantine Demo
                  </Button>
                </Link>
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

