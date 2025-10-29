/**
 * Tests for MobileTaskList component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/tests/test-utils';
import { MobileTaskList } from './MobileTaskList';
import type { Task, Pillar, Theme } from '@/types';

// Mock TaskCard component
vi.mock('./TaskCard', () => ({
  TaskCard: ({ task }: any) => <div data-testid={`task-card-${task.id}`}>{task.title}</div>,
}));

describe('MobileTaskList', () => {
  const mockOnTaskComplete = vi.fn();
  const mockOnTaskSelect = vi.fn();
  const completingTaskIds = new Set<string>();

  const mockPillars: Pillar[] = [
    {
      id: 'pillar-1',
      name: 'Health',
      color: '#7C3AED',
      domain: 'personal',
      rating: 75,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  const mockThemes: Theme[] = [
    {
      id: 'theme-1',
      pillarId: 'pillar-1',
      name: 'Cardio',
      rating: 50,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  const mockTasks: Task[] = [
    {
      id: 'task-1',
      themeId: 'theme-1',
      pillarId: 'pillar-1',
      title: 'Task 1',
      status: 'todo',
      taskType: 'adhoc',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'task-2',
      themeId: 'theme-1',
      pillarId: 'pillar-1',
      title: 'Task 2',
      status: 'todo',
      taskType: 'adhoc',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  it('renders all tasks', () => {
    render(
      <MobileTaskList
        tasks={mockTasks}
        pillars={mockPillars}
        themes={mockThemes}
        onTaskComplete={mockOnTaskComplete}
        onTaskSelect={mockOnTaskSelect}
        completingTaskIds={completingTaskIds}
      />
    );

    expect(screen.getByTestId('task-card-task-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-card-task-2')).toBeInTheDocument();
  });

  it('renders tasks in correct order', () => {
    render(
      <MobileTaskList
        tasks={mockTasks}
        pillars={mockPillars}
        themes={mockThemes}
        onTaskComplete={mockOnTaskComplete}
        onTaskSelect={mockOnTaskSelect}
        completingTaskIds={completingTaskIds}
      />
    );

    const taskCards = screen.getAllByTestId(/task-card-/);
    expect(taskCards).toHaveLength(2);
    expect(taskCards[0]).toHaveAttribute('data-testid', 'task-card-task-1');
    expect(taskCards[1]).toHaveAttribute('data-testid', 'task-card-task-2');
  });

  it('renders empty list when no tasks', () => {
    const { container } = render(
      <MobileTaskList
        tasks={[]}
        pillars={mockPillars}
        themes={mockThemes}
        onTaskComplete={mockOnTaskComplete}
        onTaskSelect={mockOnTaskSelect}
        completingTaskIds={completingTaskIds}
      />
    );

    const taskCards = container.querySelectorAll('[data-testid^="task-card-"]');
    expect(taskCards).toHaveLength(0);
  });
});

