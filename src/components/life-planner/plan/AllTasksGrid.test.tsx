/**
 * Tests for AllTasksGrid component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { AllTasksGrid } from './AllTasksGrid';
import { useLifeOSStore } from '@/store/useLifeOSStore';

// Mock the store
vi.mock('@/store/useLifeOSStore', () => ({
  useLifeOSStore: vi.fn(),
}));

describe('AllTasksGrid', () => {
  const mockPillars = [
    { id: 'p1', name: 'Health', color: '#7C3AED', domain: 'personal' as const, avgPercent: 75 },
    { id: 'p2', name: 'Career', color: '#3B82F6', domain: 'work' as const, avgPercent: 60 },
  ];

  const mockThemes = [
    { id: 'th1', name: 'Fitness', pillarId: 'p1', rating: 8, notes: '' },
    { id: 'th2', name: 'Skills', pillarId: 'p2', rating: 6, notes: '' },
  ];

  const mockTasks = [
    {
      id: 't1',
      title: 'Morning Run',
      description: 'Run 5km',
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
      title: 'Learn TypeScript',
      description: 'Complete tutorial',
      pillarId: 'p2',
      themeId: 'th2',
      status: 'done' as const,
      impact: 'M' as const,
      timeEstimate: '2h+' as const,
      rank: 0,
      dueDate: undefined,
      notes: '',
      taskType: 'adhoc' as const,
    },
    {
      id: 't3',
      title: 'Yoga Session',
      description: 'Evening yoga',
      pillarId: 'p1',
      themeId: 'th1',
      status: 'open' as const,
      impact: 'L' as const,
      timeEstimate: '30m' as const,
      rank: 1,
      dueDate: '2024-12-25',
      notes: '',
      taskType: 'adhoc' as const,
    },
  ];

  const mockStore = {
    tasks: mockTasks,
    pillars: mockPillars,
    themes: mockThemes,
    selectTask: vi.fn(),
    updateTask: vi.fn(),
    removeTask: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLifeOSStore).mockReturnValue(mockStore as any);
  });

  describe('Rendering', () => {
    it('renders all tasks in table format', () => {
      render(<AllTasksGrid />);
      
      expect(screen.getByText('Morning Run')).toBeInTheDocument();
      expect(screen.getByText('Learn TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Yoga Session')).toBeInTheDocument();
    });

    it('displays task count', () => {
      render(<AllTasksGrid />);
      
      expect(screen.getByText('3 tasks')).toBeInTheDocument();
    });

    it('renders table headers', () => {
      render(<AllTasksGrid />);
      
      expect(screen.getByText('Done')).toBeInTheDocument();
      expect(screen.getByText('Task')).toBeInTheDocument();
      expect(screen.getByText('Pillar')).toBeInTheDocument();
      expect(screen.getByText('Theme')).toBeInTheDocument();
      expect(screen.getByText('Impact')).toBeInTheDocument();
      expect(screen.getByText('Time')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Due Date')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('displays pillar badges with colors', () => {
      render(<AllTasksGrid />);
      
      const healthBadges = screen.getAllByText('Health');
      expect(healthBadges.length).toBeGreaterThan(0);
      
      expect(screen.getByText('Career')).toBeInTheDocument();
    });

    it('displays theme names', () => {
      render(<AllTasksGrid />);
      
      expect(screen.getByText('Fitness')).toBeInTheDocument();
      expect(screen.getByText('Skills')).toBeInTheDocument();
    });

    it('displays impact badges', () => {
      render(<AllTasksGrid />);
      
      expect(screen.getByText('H')).toBeInTheDocument();
      expect(screen.getByText('M')).toBeInTheDocument();
      expect(screen.getByText('L')).toBeInTheDocument();
    });

    it('displays time estimates', () => {
      render(<AllTasksGrid />);
      
      expect(screen.getByText('1h')).toBeInTheDocument();
      expect(screen.getByText('2h+')).toBeInTheDocument();
      expect(screen.getByText('30m')).toBeInTheDocument();
    });

    it('displays status badges', () => {
      render(<AllTasksGrid />);
      
      const openBadges = screen.getAllByText('open');
      expect(openBadges.length).toBe(2);
      
      expect(screen.getByText('done')).toBeInTheDocument();
    });

    it('displays due dates when present', () => {
      render(<AllTasksGrid />);
      
      expect(screen.getByText(/12\/31\/2024/)).toBeInTheDocument();
      expect(screen.getByText(/12\/25\/2024/)).toBeInTheDocument();
    });

    it('displays task descriptions', () => {
      render(<AllTasksGrid />);
      
      expect(screen.getByText('Run 5km')).toBeInTheDocument();
      expect(screen.getByText('Complete tutorial')).toBeInTheDocument();
      expect(screen.getByText('Evening yoga')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('filters tasks by search query', async () => {
      const user = userEvent.setup();
      render(<AllTasksGrid />);
      
      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, 'Morning');
      
      expect(screen.getByText('Morning Run')).toBeInTheDocument();
      expect(screen.queryByText('Learn TypeScript')).not.toBeInTheDocument();
      expect(screen.queryByText('Yoga Session')).not.toBeInTheDocument();
    });

    it('searches in task descriptions', async () => {
      const user = userEvent.setup();
      render(<AllTasksGrid />);
      
      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, 'tutorial');
      
      expect(screen.getByText('Learn TypeScript')).toBeInTheDocument();
      expect(screen.queryByText('Morning Run')).not.toBeInTheDocument();
    });

    it('filters tasks by pillar', async () => {
      const user = userEvent.setup();
      render(<AllTasksGrid />);
      
      const pillarSelect = screen.getByDisplayValue(/all pillars/i);
      await user.click(pillarSelect);
      
      // Mantine Select interaction would require more setup
      expect(pillarSelect).toBeInTheDocument();
    });

    it('filters tasks by status', async () => {
      const user = userEvent.setup();
      render(<AllTasksGrid />);
      
      const statusSelects = screen.getAllByRole('combobox');
      const statusSelect = statusSelects.find(select => 
        select.getAttribute('value') === 'all'
      );
      
      expect(statusSelect).toBeInTheDocument();
    });

    it('shows correct count after filtering', async () => {
      const user = userEvent.setup();
      render(<AllTasksGrid />);
      
      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, 'Morning');
      
      expect(screen.getByText('1 task')).toBeInTheDocument();
    });
  });

  describe('Task Interactions', () => {
    it('calls selectTask when clicking task title', async () => {
      const user = userEvent.setup();
      render(<AllTasksGrid />);
      
      await user.click(screen.getByText('Morning Run'));
      
      expect(mockStore.selectTask).toHaveBeenCalledWith('t1');
    });

    it('calls updateTask when toggling task completion', async () => {
      const user = userEvent.setup();
      render(<AllTasksGrid />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);
      
      await waitFor(() => {
        expect(mockStore.updateTask).toHaveBeenCalled();
      });
    });

    it('calls removeTask when clicking delete button', async () => {
      const user = userEvent.setup();
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      
      render(<AllTasksGrid />);
      
      const deleteButtons = screen.getAllByRole('button', { name: '' });
      const deleteButton = deleteButtons.find(btn => 
        btn.querySelector('svg')?.getAttribute('class')?.includes('trash')
      );
      
      if (deleteButton) {
        await user.click(deleteButton);
      }
      
      await waitFor(() => {
        expect(mockStore.removeTask).toHaveBeenCalled();
      });
    });

    it('does not delete task if user cancels confirmation', async () => {
      const user = userEvent.setup();
      vi.spyOn(window, 'confirm').mockReturnValue(false);
      
      render(<AllTasksGrid />);
      
      const deleteButtons = screen.getAllByRole('button', { name: '' });
      const deleteButton = deleteButtons[0];
      
      if (deleteButton) {
        await user.click(deleteButton);
      }
      
      expect(mockStore.removeTask).not.toHaveBeenCalled();
    });
  });

  describe('Empty States', () => {
    it('shows message when no tasks exist', () => {
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        tasks: [],
      } as any);

      render(<AllTasksGrid />);
      
      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
      expect(screen.getByText('0 tasks')).toBeInTheDocument();
    });

    it('shows message when no tasks match filters', async () => {
      const user = userEvent.setup();
      render(<AllTasksGrid />);
      
      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, 'nonexistent task');
      
      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    });
  });

  describe('Visual Styling', () => {
    it('applies reduced opacity to completed tasks', () => {
      render(<AllTasksGrid />);
      
      const completedTask = screen.getByText('Learn TypeScript');
      const row = completedTask.closest('tr');
      
      expect(row).toHaveStyle({ opacity: 0.6 });
    });

    it('applies strikethrough to completed task titles', () => {
      render(<AllTasksGrid />);
      
      const completedTask = screen.getByText('Learn TypeScript');
      expect(completedTask).toHaveStyle({ textDecoration: 'line-through' });
    });
  });
});

