'use client';

import { Container, Title, Text, Stack } from '@mantine/core';

export function ReflectTab() {
  return (
    <Container size="xl">
      <Stack gap="md">
        <Title order={2}>Reflect Tab</Title>
        <Text>This is the Reflect tab - coming soon!</Text>
        <Text size="sm" c="dimmed">
          This will contain the reflection and rating interface.
        </Text>
      </Stack>
    </Container>
  );
}
