'use client';

import { Container, Title, Text, Stack } from '@mantine/core';

export function PlanTab() {
  return (
    <Container size="xl">
      <Stack gap="md">
        <Title order={2}>Plan Tab</Title>
        <Text>This is the Plan tab - coming soon!</Text>
        <Text size="sm" c="dimmed">
          This will contain the pillars and themes planning interface.
        </Text>
      </Stack>
    </Container>
  );
}
