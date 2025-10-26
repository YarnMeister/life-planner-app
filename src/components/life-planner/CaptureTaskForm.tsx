'use client';

import { Modal, Title, Text } from '@mantine/core';

interface CaptureTaskFormProps {
  opened: boolean;
  onClose: () => void;
}

export function CaptureTaskForm({ opened, onClose }: CaptureTaskFormProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Capture Task">
      <Text>This is the Capture Task form - coming soon!</Text>
    </Modal>
  );
}
