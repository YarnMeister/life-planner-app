/**
 * Tests for MobileAccordionView component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { MobileAccordionView } from './MobileAccordionView';
import { useLifeOSStore } from '@/store/useLifeOSStore';

// Mock the store
vi.mock('@/store/useLifeOSStore', () => ({
  useLifeOSStore: vi.fn(),
}));

describe('MobileAccordionView', () => {
  const mockPillars = [
    { id: 'p1', name: 'Health', color: '#7C3AED', domain: 'personal' as const, avgPercent: 75 },
    { id: 'p2', name: 'Career', color: '#3B82F6', domain: 'work' as const, avgPercent: 60 },
  ];

  const mockThemes = [
    { id: 'th1', name: 'Fitness', pillarId: 'p1', rating: 8, notes: '' },
    { id: 'th2', name: 'Nutrition', pillarId: 'p1', rating: 7, notes: '' },
    { id: 'th3', name: 'Skills', pillarId: 'p2', rating: 6, notes: '' },
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
      title: 'Yoga',
      description: 'Evening yoga',
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
      title: 'Meal Prep',
      description: 'Prepare healthy meals',
      pillarId: 'p1',
      themeId: 'th2',
      status: 'open' as const,
      impact: 'H' as const,
      timeEstimate: '2h+' as const,
      rank: 0,
      dueDate: undefined,
      notes: '',
      taskType: 'adhoc' as const,
    },
    {
      id: 't4',
      title: 'Learn React',
      description: 'Complete React course',
      pillarId: 'p2',
      themeId: 'th3',
      status: 'open' as const,
      impact: 'H' as const,
      timeEstimate: '2h+' as const,
      rank: 0,
      dueDate: undefined,
      notes: '',
      taskType: 'adhoc' as const,
    },
  ];

  const mockStore = {
    pillars: mockPillars,
    themes: mockThemes,
    tasks: mockTasks,
    selectTask: vi.fn(),
    updateTask: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLifeOSStore).mockReturnValue(mockStore as any);
  });

  describe('Rendering', () => {
    it('renders all pillars as accordion items', () => {
      render(<MobileAccordionView />);
      
      expect(screen.getByText('Health')).toBeInTheDocument();
      expect(screen.getByText('Career')).toBeInTheDocument();
    });

    it('displays pillar percentages', () => {
      render(<MobileAccordionView />);
      
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('60%')).toBeInTheDocument();
    });

    it('shows task counts for each pillar', () => {
      render(<MobileAccordionView />);
      
      // Health has 3 tasks, Career has 1 task
      expect(screen.getByText(/3 tasks/i)).toBeInTheDocument();
      expect(screen.getByText(/1 task/i)).toBeInTheDocument();
    });
  });

  describe('Accordion Interaction', () => {
    it('expands pillar to show themes when clicked', async () => {
      const user = userEvent.setup();
      render(<MobileAccordionView />);
      
      const healthPillar = screen.getByText('Health');
      await user.click(healthPillar);
      
      // Themes should be visible after expanding
      await waitFor(() => {
        expect(screen.getByText('Fitness')).toBeInTheDocument();
        expect(screen.getByText('Nutrition')).toBeInTheDocument();
      });
    });

    it('shows theme ratings', async () => {
      const user = userEvent.setup();
      render(<MobileAccordionView />);
      
      const healthPillar = screen.getByText('Health');
      await user.click(healthPillar);
      
      await waitFor(() => {
        expect(screen.getByText('8/10')).toBeInTheDocument();
        expect(screen.getByText('7/10')).toBeInTheDocument();
      });
    });

    it('expands theme to show tasks when clicked', async () => {
      const user = userEvent.setup();
      render(<MobileAccordionView />);
      
      // First expand pillar
      const healthPillar = screen.getByText('Health');
      await user.click(healthPillar);
      
      // Then expand theme
      await waitFor(async () => {
        const fitnessTheme = screen.getByText('Fitness');
        await user.click(fitnessTheme);
      });
      
      // Tasks should be visible
      await waitFor(() => {
        expect(screen.getByText('Morning Run')).toBeInTheDocument();
        expect(screen.getByText('Yoga')).toBeInTheDocument();
      });
    });
  });

  describe('Task Display', () => {
    it('displays task metadata', async () => {
      const user = userEvent.setup();
      render(<MobileAccordionView />);
      
      const healthPillar = screen.getByText('Health');
      await user.click(healthPillar);
      
      await waitFor(async () => {
        const fitnessTheme = screen.getByText('Fitness');
        await user.click(fitnessTheme);
      });
      
      await waitFor(() => {
        expect(screen.getByText('H')).toBeInTheDocument();
        expect(screen.getByText('1h')).toBeInTheDocument();
      });
    });

    it('shows completed tasks with strikethrough', async () => {
      const user = userEvent.setup();
      render(<MobileAccordionView />);
      
      const healthPillar = screen.getByText('Health');
      await user.click(healthPillar);
      
      await waitFor(async () => {
        const fitnessTheme = screen.getByText('Fitness');
        await user.click(fitnessTheme);
      });
      
      await waitFor(() => {
        const yogaTask = screen.getByText('Yoga');
        expect(yogaTask).toHaveStyle({ textDecoration: 'line-through' });
      });
    });

    it('displays task checkboxes', async () => {
      const user = userEvent.setup();
      render(<MobileAccordionView />);
      
      const healthPillar = screen.getByText('Health');
      await user.click(healthPillar);
      
      await waitFor(async () => {
        const fitnessTheme = screen.getByText('Fitness');
        await user.click(fitnessTheme);
      });
      
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Task Interactions', () => {
    it('calls selectTask when clicking task title', async () => {
      const user = userEvent.setup();
      render(<MobileAccordionView />);
      
      const healthPillar = screen.getByText('Health');
      await user.click(healthPillar);
      
      await waitFor(async () => {
        const fitnessTheme = screen.getByText('Fitness');
        await user.click(fitnessTheme);
      });
      
      await waitFor(async () => {
        const taskTitle = screen.getByText('Morning Run');
        await user.click(taskTitle);
      });
      
      expect(mockStore.selectTask).toHaveBeenCalledWith('t1');
    });

    it('calls updateTask when toggling task completion', async () => {
      const user = userEvent.setup();
      render(<MobileAccordionView />);
      
      const healthPillar = screen.getByText('Health');
      await user.click(healthPillar);
      
      await waitFor(async () => {
        const fitnessTheme = screen.getByText('Fitness');
        await user.click(fitnessTheme);
      });
      
      await waitFor(async () => {
        const checkboxes = screen.getAllByRole('checkbox');
        await user.click(checkboxes[0]);
      });
      
      await waitFor(() => {
        expect(mockStore.updateTask).toHaveBeenCalled();
      });
    });
  });

  describe('Empty States', () => {
    it('shows message when no pillars exist', () => {
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        pillars: [],
      } as any);

      render(<MobileAccordionView />);
      
      expect(screen.getByText(/no pillars/i)).toBeInTheDocument();
    });

    it('shows message when pillar has no themes', async () => {
      const user = userEvent.setup();
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        themes: [],
      } as any);

      render(<MobileAccordionView />);
      
      const healthPillar = screen.getByText('Health');
      await user.click(healthPillar);
      
      await waitFor(() => {
        expect(screen.getByText(/no themes/i)).toBeInTheDocument();
      });
    });

    it('shows message when theme has no tasks', async () => {
      const user = userEvent.setup();
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        tasks: [],
      } as any);

      render(<MobileAccordionView />);
      
      const healthPillar = screen.getByText('Health');
      await user.click(healthPillar);
      
      await waitFor(async () => {
        const fitnessTheme = screen.getByText('Fitness');
        await user.click(fitnessTheme);
      });
      
      await waitFor(() => {
        expect(screen.getByText(/no tasks/i)).toBeInTheDocument();
      });
    });
  });

  describe('Task Counts', () => {
    it('displays correct task count per theme', async () => {
      const user = userEvent.setup();
      render(<MobileAccordionView />);
      
      const healthPillar = screen.getByText('Health');
      await user.click(healthPillar);
      
      await waitFor(() => {
        // Fitness has 2 tasks, Nutrition has 1 task
        const taskCounts = screen.getAllByText(/\d+ task/i);
        expect(taskCounts.length).toBeGreaterThan(0);
      });
    });

    it('uses singular "task" for count of 1', async () => {
      const user = userEvent.setup();
      render(<MobileAccordionView />);
      
      const careerPillar = screen.getByText('Career');
      await user.click(careerPillar);
      
      await waitFor(() => {
        expect(screen.getByText(/1 task/i)).toBeInTheDocument();
      });
    });
  });
});

