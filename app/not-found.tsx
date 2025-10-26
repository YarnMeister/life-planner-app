'use client';

import { Container, Title, Text, Button, Stack, Paper } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
      <Container size="sm">
        <Paper shadow="md" p="xl" radius="lg" withBorder>
          <Stack gap="lg" align="center">
            <Title order={1} size="4rem" c="blue">
              404
            </Title>
            <Title order={2} ta="center">
              Page Not Found
            </Title>
            <Text ta="center" c="dimmed" size="lg">
              Sorry, we couldn&apos;t find the page you&apos;re looking for.
            </Text>
            <Link href="/" passHref style={{ textDecoration: 'none' }}>
              <Button size="lg" leftSection={<IconHome size={20} />}>
                Back to Home
              </Button>
            </Link>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}

