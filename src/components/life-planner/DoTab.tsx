'use client';

import { Container, Title, Text, Stack, Button } from '@mantine/core';

interface DoTabProps {
  onOpenCapture: () => void;
}

export function DoTab({ onOpenCapture }: DoTabProps) {
  return (
    <Container size="xl">
      <Stack gap="md">
        <Title order={2}>Do Tab</Title>
        <Text>This is the Do tab - coming soon!</Text>
        <Text size="sm" c="dimmed">
          This will contain the task management interface.
        </Text>
        <Button onClick={onOpenCapture}>
          Open Capture Form (Test)
        </Button>
      </Stack>
    </Container>
  );
}
