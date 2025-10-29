'use client';

import { SegmentedControl } from '@mantine/core';
import type { Domain } from '@/types';

interface DomainFilterProps {
  value: Domain;
  onChange: (value: Domain) => void;
  taskCounts?: Record<Domain, number>;
}

export function DomainFilter({ value, onChange, taskCounts }: DomainFilterProps) {
  return (
    <SegmentedControl
      value={value}
      onChange={(val) => onChange(val as Domain)}
      data={[
        {
          label: taskCounts ? `All (${taskCounts.all})` : 'All',
          value: 'all',
        },
        {
          label: taskCounts ? `Work (${taskCounts.work})` : 'Work',
          value: 'work',
        },
        {
          label: taskCounts ? `Personal (${taskCounts.personal})` : 'Personal',
          value: 'personal',
        },
      ]}
    />
  );
}

