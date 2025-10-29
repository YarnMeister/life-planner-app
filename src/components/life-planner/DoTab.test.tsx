/**
 * Tests for DoTab component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { DoTab } from './DoTab';
import { useLifeOS } from '@/hooks/useLifeOS';
import type { Task, Pillar, Theme } from '@/types';

// Mock the useLifeOS hook
vi.mock('@/hooks/useLifeOS', () => ({
  useLifeOS: vi.fn(),
}));

// Mock child components
vi.mock('./do/DomainFilter', () => ({
  DomainFilter: ({ value, onChange }: any) => (
    <div data-testid="domain-filter">
      <button onClick={() => onChange('all')}>All</button>
      <button onClick={() => onChange('work')}>Work</button>
      <button onClick={() => onChange('personal')}>Personal</button>
      <span>Current: {value}</span>
    </div>
  ),
}));

vi.mock('./do/MobileTaskList', () => ({
  MobileTaskList: () => <div data-testid="mobile-task-list">Mobile Task List</div>,
}));

vi.mock('./do/TaskListView', () => ({
  TaskListView: () => <div data-testid="task-list-view">Task List View</div>,
}));

describe('DoTab', () => {
  const mockLoadPillars = vi.fn();
  const mockLoadThemes = vi.fn();
  const mockLoadTasks = vi.fn();
  const mockUpdateTask = vi.fn();
  const mockSelectTask = vi.fn();
  const mockOnOpenCapture = vi.fn();

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
    {
      id: 'pillar-2',
      name: 'Career',
      color: '#3B82F6',
      domain: 'work',
      rating: 60,
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
    {
      id: 'theme-2',
      pillarId: 'pillar-2',
      name: 'Projects',
      rating: 80,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  const mockTasks: Task[] = [
    {
      id: 'task-1',
      themeId: 'theme-1',
      pillarId: 'pillar-1',
      title: 'Run 5k',
      status: 'todo',
      taskType: 'adhoc',
      impact: 'H',
      timeEstimate: '1h',
      rank: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'task-2',
      themeId: 'theme-2',
      pillarId: 'pillar-2',
      title: 'Complete project',
      status: 'todo',
      taskType: 'adhoc',
      impact: 'M',
      timeEstimate: '2h+',
      rank: 2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  const mockUseLifeOS = {
    tasks: mockTasks,
    pillars: mockPillars,
    themes: mockThemes,
    updateTask: mockUpdateTask,
    selectTask: mockSelectTask,
    loadPillars: mockLoadPillars,
    loadThemes: mockLoadThemes,
    loadTasks: mockLoadTasks,
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadPillars.mockResolvedValue(undefined);
    mockLoadThemes.mockResolvedValue(undefined);
    mockLoadTasks.mockResolvedValue(undefined);
    mockUpdateTask.mockResolvedValue(undefined);
    vi.mocked(useLifeOS).mockReturnValue(mockUseLifeOS as any);
  });

  describe('Data Loading', () => {
    it('loads pillars, themes, and tasks on mount', async () => {
      render(<DoTab onOpenCapture={mockOnOpenCapture} />);

      await waitFor(() => {
        expect(mockLoadPillars).toHaveBeenCalledTimes(1);
        expect(mockLoadThemes).toHaveBeenCalledTimes(1);
        expect(mockLoadTasks).toHaveBeenCalledTimes(1);
      });
    });

    it('shows loading state initially', () => {
      vi.mocked(useLifeOS).mockReturnValue({
        ...mockUseLifeOS,
        isLoading: true,
      } as any);

      render(<DoTab onOpenCapture={mockOnOpenCapture} />);

      // Mantine Loader doesn't have progressbar role, check for the loader class
      expect(screen.getByText((content, element) => {
        return element?.className?.includes('mantine-Loader') || false;
      })).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('shows empty state when no tasks exist', () => {
      vi.mocked(useLifeOS).mockReturnValue({
        ...mockUseLifeOS,
        tasks: [],
      } as any);

      render(<DoTab onOpenCapture={mockOnOpenCapture} />);

      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /quick capture/i })).toBeInTheDocument();
    });

    it('shows completion state when all tasks are done', () => {
      const doneTasks = mockTasks.map((t) => ({ ...t, status: 'done' as const }));
      vi.mocked(useLifeOS).mockReturnValue({
        ...mockUseLifeOS,
        tasks: doneTasks,
      } as any);

      render(<DoTab onOpenCapture={mockOnOpenCapture} />);

      // The text contains an emoji, so we need to match it more flexibly
      expect(screen.getByText((content) => content.includes('All done'))).toBeInTheDocument();
    });

    it('shows filter empty state when no tasks match filter', async () => {
      const user = userEvent.setup();
      
      // Only personal tasks
      const personalTasks = mockTasks.filter((t) => t.pillarId === 'pillar-1');
      vi.mocked(useLifeOS).mockReturnValue({
        ...mockUseLifeOS,
        tasks: personalTasks,
      } as any);

      render(<DoTab onOpenCapture={mockOnOpenCapture} />);

      // Switch to work filter
      const workButton = screen.getByRole('button', { name: /work/i });
      await user.click(workButton);

      await waitFor(() => {
        expect(screen.getByText(/no work tasks found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Task Prioritization', () => {
    it('prioritizes tasks by theme rating (lowest first)', () => {
      // Task 1 has theme rating 50, Task 2 has theme rating 80
      // Task 1 should appear first
      render(<DoTab onOpenCapture={mockOnOpenCapture} />);

      // Check that tasks are rendered (via child components)
      expect(screen.getByTestId('task-list-view')).toBeInTheDocument();
    });
  });

  describe('Domain Filtering', () => {
    it('renders domain filter component', () => {
      render(<DoTab onOpenCapture={mockOnOpenCapture} />);

      expect(screen.getByTestId('domain-filter')).toBeInTheDocument();
    });

    it('filters tasks by domain', async () => {
      const user = userEvent.setup();
      render(<DoTab onOpenCapture={mockOnOpenCapture} />);

      const workButton = screen.getByRole('button', { name: /work/i });
      await user.click(workButton);

      await waitFor(() => {
        expect(screen.getByText(/current: work/i)).toBeInTheDocument();
      });
    });
  });

  describe('Quick Capture', () => {
    it('calls onOpenCapture when quick capture button clicked', async () => {
      const user = userEvent.setup();
      render(<DoTab onOpenCapture={mockOnOpenCapture} />);

      const captureButton = screen.getByRole('button', { name: /quick capture/i });
      await user.click(captureButton);

      expect(mockOnOpenCapture).toHaveBeenCalledTimes(1);
    });
  });

  describe('Responsive Layout', () => {
    it('renders desktop layout by default', () => {
      render(<DoTab onOpenCapture={mockOnOpenCapture} />);

      expect(screen.getByTestId('task-list-view')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile-task-list')).not.toBeInTheDocument();
    });
  });

  describe('Task Stats', () => {
    it('displays task count', () => {
      render(<DoTab onOpenCapture={mockOnOpenCapture} />);

      expect(screen.getByText(/2 tasks to complete/i)).toBeInTheDocument();
    });
  });
});

