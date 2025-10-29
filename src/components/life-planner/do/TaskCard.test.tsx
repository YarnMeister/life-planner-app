/**
 * Tests for TaskCard component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { TaskCard } from './TaskCard';
import type { Task, Pillar, Theme } from '@/types';

describe('TaskCard', () => {
  const mockOnComplete = vi.fn();
  const mockOnSelect = vi.fn();

  const mockTask: Task = {
    id: 'task-1',
    themeId: 'theme-1',
    pillarId: 'pillar-1',
    title: 'Test Task',
    description: 'This is a test task description',
    status: 'todo',
    taskType: 'adhoc',
    impact: 'H',
    timeEstimate: '1h',
    dueDate: '2024-12-31',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockPillar: Pillar = {
    id: 'pillar-1',
    name: 'Health',
    color: '#7C3AED',
    domain: 'personal',
    rating: 75,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockTheme: Theme = {
    id: 'theme-1',
    pillarId: 'pillar-1',
    name: 'Cardio',
    rating: 50,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  it('renders task title', () => {
    render(
      <TaskCard
        task={mockTask}
        pillar={mockPillar}
        theme={mockTheme}
        onComplete={mockOnComplete}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('renders theme name', () => {
    render(
      <TaskCard
        task={mockTask}
        pillar={mockPillar}
        theme={mockTheme}
        onComplete={mockOnComplete}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Cardio')).toBeInTheDocument();
  });

  it('renders impact badge', () => {
    render(
      <TaskCard
        task={mockTask}
        pillar={mockPillar}
        theme={mockTheme}
        onComplete={mockOnComplete}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('H')).toBeInTheDocument();
  });

  it('renders time estimate badge', () => {
    render(
      <TaskCard
        task={mockTask}
        pillar={mockPillar}
        theme={mockTheme}
        onComplete={mockOnComplete}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('1h')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <TaskCard
        task={mockTask}
        pillar={mockPillar}
        theme={mockTheme}
        onComplete={mockOnComplete}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText(/this is a test task description/i)).toBeInTheDocument();
  });

  it('renders due date when provided', () => {
    render(
      <TaskCard
        task={mockTask}
        pillar={mockPillar}
        theme={mockTheme}
        onComplete={mockOnComplete}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText(/due:/i)).toBeInTheDocument();
  });

  it('calls onComplete when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={mockTask}
        pillar={mockPillar}
        theme={mockTheme}
        onComplete={mockOnComplete}
        onSelect={mockOnSelect}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockOnComplete).toHaveBeenCalledWith('task-1');
  });

  it('calls onSelect when card is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={mockTask}
        pillar={mockPillar}
        theme={mockTheme}
        onComplete={mockOnComplete}
        onSelect={mockOnSelect}
      />
    );

    const card = screen.getByText('Test Task').closest('div[class*="Card"]');
    if (card) {
      await user.click(card);
      expect(mockOnSelect).toHaveBeenCalledWith('task-1');
    }
  });

  it('shows completing animation state', () => {
    const { container } = render(
      <TaskCard
        task={mockTask}
        pillar={mockPillar}
        theme={mockTheme}
        onComplete={mockOnComplete}
        onSelect={mockOnSelect}
        isCompleting={true}
      />
    );

    // Check that the card has opacity 0 when completing
    const card = container.querySelector('div[class*="Card"]');
    expect(card).toHaveStyle({ opacity: '0' });
  });

  it('uses pillar color for left border', () => {
    const { container } = render(
      <TaskCard
        task={mockTask}
        pillar={mockPillar}
        theme={mockTheme}
        onComplete={mockOnComplete}
        onSelect={mockOnSelect}
      />
    );

    const card = container.querySelector('div[class*="Card"]');
    expect(card).toHaveStyle({ borderLeft: '4px solid #7C3AED' });
  });

  it('handles missing pillar gracefully', () => {
    render(
      <TaskCard
        task={mockTask}
        theme={mockTheme}
        onComplete={mockOnComplete}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('handles missing theme gracefully', () => {
    render(
      <TaskCard
        task={mockTask}
        pillar={mockPillar}
        onComplete={mockOnComplete}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('No theme')).toBeInTheDocument();
  });
});

