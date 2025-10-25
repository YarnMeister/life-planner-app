import { Container, Title, Text, Stack, Button, Paper, Group } from '@mantine/core';
import { IconCode, IconDatabase, IconPalette } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
      <Container size="md">
        <Stack gap="xl" align="center">
          <Paper p="xl" shadow="md" radius="lg" withBorder w="100%">
            <Stack gap="lg" align="center">
              <Title order={1} ta="center" c="blue">
                React + Vite + Neon Template
              </Title>
              
              <Text size="lg" ta="center" c="dimmed">
                A production-ready starter template with React, TypeScript, Drizzle ORM, 
                PostgreSQL, and Mantine UI components.
              </Text>

              <Group justify="center" mt="md">
                <Button 
                  size="lg" 
                  leftSection={<IconPalette size={20} />}
                  onClick={() => navigate('/mantine-demo')}
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
                  Built with React 18, TypeScript, and Vite for blazing fast development
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
              <Title order={5}>Quick Start</Title>
              <Text size="sm" c="dimmed">
                1. Add your pages in <code>src/pages/</code>
              </Text>
              <Text size="sm" c="dimmed">
                2. Create database schema in <code>drizzle/schema.ts</code>
              </Text>
              <Text size="sm" c="dimmed">
                3. Build UI with Mantine and shadcn/ui components
              </Text>
              <Text size="sm" c="dimmed">
                4. See <code>README.md</code> for full setup instructions
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </div>
  );
};

export default Index;


