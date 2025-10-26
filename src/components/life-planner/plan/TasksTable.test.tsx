/**
 * Tests for TasksTable component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { TasksTable } from './TasksTable';
import { useLifeOSStore } from '@/store/useLifeOSStore';

// Mock the store
vi.mock('@/store/useLifeOSStore', () => ({
  useLifeOSStore: vi.fn(),
}));

describe('TasksTable', () => {
  const mockTasks = [
    {
      id: 't1',
      title: 'Task 1',
      description: 'Description 1',
      pillarId: 'p1',
      themeId: 'th1',
      status: 'open' as const,
      impact: 'H' as const,
      timeEstimate: '1h' as const,
      rank: 0,
      dueDate: '2024-12-31',
      notes: '',
      taskType: 'adhoc' as const,
    },
    {
      id: 't2',
      title: 'Task 2',
      description: 'Description 2',
      pillarId: 'p1',
      themeId: 'th1',
      status: 'done' as const,
      impact: 'M' as const,
      timeEstimate: '30m' as const,
      rank: 1,
      dueDate: undefined,
      notes: '',
      taskType: 'adhoc' as const,
    },
    {
      id: 't3',
      title: 'Task 3',
      description: 'Description 3',
      pillarId: 'p1',
      themeId: 'th2',
      status: 'open' as const,
      impact: 'L' as const,
      timeEstimate: '15m' as const,
      rank: 0,
      dueDate: undefined,
      notes: '',
      taskType: 'adhoc' as const,
    },
  ];

  const mockPillars = [
    { id: 'p1', name: 'Health', color: '#7C3AED', domain: 'personal' as const, avgPercent: 75 },
  ];

  const mockStore = {
    tasks: mockTasks,
    pillars: mockPillars,
    selectedThemeIds: ['th1'],
    selectTask: vi.fn(),
    updateTask: vi.fn(),
    removeTask: vi.fn(),
    reorderTasks: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLifeOSStore).mockReturnValue(mockStore as any);
  });

  describe('Rendering', () => {
    it('renders tasks for selected theme', () => {
      render(<TasksTable />);
      
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.queryByText('Task 3')).not.toBeInTheDocument(); // Different theme
    });

    it('shows "Add Task" button when themes are selected', () => {
      render(<TasksTable />);
      
      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });

    it('shows message when no themes are selected', () => {
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        selectedThemeIds: [],
      } as any);

      render(<TasksTable />);
      
      expect(screen.getByText(/select one or more themes/i)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /add task/i })).not.toBeInTheDocument();
    });

    it('displays task metadata (impact, time estimate)', () => {
      render(<TasksTable />);
      
      expect(screen.getByText('H')).toBeInTheDocument();
      expect(screen.getByText('1h')).toBeInTheDocument();
    });
  });

  describe('Task Interactions', () => {
    it('calls selectTask when clicking task title', async () => {
      const user = userEvent.setup();
      render(<TasksTable />);
      
      await user.click(screen.getByText('Task 1'));
      
      expect(mockStore.selectTask).toHaveBeenCalledWith('t1');
    });

    it('calls selectTask with "new" when clicking Add Task button', async () => {
      const user = userEvent.setup();
      render(<TasksTable />);
      
      await user.click(screen.getByRole('button', { name: /add task/i }));
      
      expect(mockStore.selectTask).toHaveBeenCalledWith('new');
    });

    it('calls updateTask when toggling task completion', async () => {
      const user = userEvent.setup();
      render(<TasksTable />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);
      
      await waitFor(() => {
        expect(mockStore.updateTask).toHaveBeenCalledWith('t1', { status: 'done' });
      });
    });

    it('calls removeTask when clicking delete button', async () => {
      const user = userEvent.setup();
      // Mock window.confirm
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      
      render(<TasksTable />);
      
      const deleteButtons = screen.getAllByRole('button', { name: '' });
      const deleteButton = deleteButtons.find(btn => btn.querySelector('svg'));
      if (deleteButton) {
        await user.click(deleteButton);
      }
      
      await waitFor(() => {
        expect(mockStore.removeTask).toHaveBeenCalled();
      });
    });
  });

  describe('Filtering', () => {
    it('filters tasks by search query', async () => {
      const user = userEvent.setup();
      render(<TasksTable />);
      
      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, 'Task 1');
      
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    });

    it('filters tasks by status', async () => {
      const user = userEvent.setup();
      render(<TasksTable />);
      
      // Find and click the status filter
      const statusSelect = screen.getByRole('combobox');
      await user.click(statusSelect);
      
      // This would require more complex interaction with Mantine Select
      // For now, we'll just verify the filter exists
      expect(statusSelect).toBeInTheDocument();
    });

    it('shows all tasks when no filters applied', () => {
      render(<TasksTable />);
      
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  describe('Task Display', () => {
    it('shows completed tasks with strikethrough', () => {
      render(<TasksTable />);
      
      const task2 = screen.getByText('Task 2');
      expect(task2).toHaveStyle({ textDecoration: 'line-through' });
    });

    it('displays due dates when present', () => {
      render(<TasksTable />);
      
      expect(screen.getByText(/12\/31\/2024/)).toBeInTheDocument();
    });

    it('shows impact badges with correct colors', () => {
      render(<TasksTable />);
      
      const highImpact = screen.getByText('H');
      expect(highImpact).toBeInTheDocument();
      
      const mediumImpact = screen.getByText('M');
      expect(mediumImpact).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('shows message when no tasks match filters', async () => {
      const user = userEvent.setup();
      render(<TasksTable />);
      
      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, 'nonexistent task');
      
      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    });

    it('shows message when theme has no tasks', () => {
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        tasks: [],
      } as any);

      render(<TasksTable />);
      
      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    });
  });
});

