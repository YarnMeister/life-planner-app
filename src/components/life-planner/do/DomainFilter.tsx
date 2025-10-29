'use client';

import { SegmentedControl } from '@mantine/core';

interface DomainFilterProps {
  value: 'all' | 'work' | 'personal';
  onChange: (value: 'all' | 'work' | 'personal') => void;
  taskCounts?: {
    all: number;
    work: number;
    personal: number;
  };
}

export function DomainFilter({ value, onChange, taskCounts }: DomainFilterProps) {
  return (
    <SegmentedControl
      value={value}
      onChange={(val) => onChange(val as 'all' | 'work' | 'personal')}
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

