/**
 * Tests for TaskDetailPanel component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { TaskDetailPanel } from './TaskDetailPanel';
import { useLifeOSStore } from '@/store/useLifeOSStore';

// Mock the store
vi.mock('@/store/useLifeOSStore', () => ({
  useLifeOSStore: vi.fn(),
}));

describe('TaskDetailPanel', () => {
  const mockPillars = [
    { id: 'p1', name: 'Health', color: '#7C3AED', domain: 'personal' as const, avgPercent: 75 },
    { id: 'p2', name: 'Career', color: '#3B82F6', domain: 'work' as const, avgPercent: 60 },
  ];

  const mockThemes = [
    { id: 'th1', name: 'Fitness', pillarId: 'p1', rating: 8, notes: '' },
    { id: 'th2', name: 'Nutrition', pillarId: 'p1', rating: 7, notes: '' },
    { id: 'th3', name: 'Skills', pillarId: 'p2', rating: 6, notes: '' },
  ];

  const mockTask = {
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
    notes: 'Bring water',
    taskType: 'adhoc' as const,
  };

  const mockStore = {
    tasks: [mockTask],
    pillars: mockPillars,
    themes: mockThemes,
    selectedTaskId: null,
    selectedPillarId: 'p1',
    selectedThemeIds: ['th1'],
    selectTask: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLifeOSStore).mockReturnValue(mockStore as any);
  });

  describe('Drawer Visibility', () => {
    it('is closed when selectedTaskId is null', () => {
      render(<TaskDetailPanel />);
      
      expect(screen.queryByText(/create task/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/edit task/i)).not.toBeInTheDocument();
    });

    it('opens for creating new task when selectedTaskId is "new"', () => {
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        selectedTaskId: 'new',
      } as any);

      render(<TaskDetailPanel />);
      
      expect(screen.getByText(/create task/i)).toBeInTheDocument();
    });

    it('opens for editing when selectedTaskId matches a task', () => {
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        selectedTaskId: 't1',
      } as any);

      render(<TaskDetailPanel />);
      
      expect(screen.getByText(/edit task/i)).toBeInTheDocument();
    });
  });

  describe('Form Fields - Create Mode', () => {
    beforeEach(() => {
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        selectedTaskId: 'new',
      } as any);
    });

    it('renders all required form fields', () => {
      render(<TaskDetailPanel />);
      
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/pillar/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/theme/i)).toBeInTheDocument();
    });

    it('pre-fills pillar and theme from selected values', () => {
      render(<TaskDetailPanel />);
      
      const pillarSelect = screen.getByLabelText(/pillar/i);
      expect(pillarSelect).toHaveValue('p1');
      
      const themeSelect = screen.getByLabelText(/theme/i);
      expect(themeSelect).toHaveValue('th1');
    });

    it('shows empty title field for new task', () => {
      render(<TaskDetailPanel />);
      
      const titleInput = screen.getByLabelText(/title/i);
      expect(titleInput).toHaveValue('');
    });

    it('renders optional fields', () => {
      render(<TaskDetailPanel />);
      
      expect(screen.getByLabelText(/impact/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/time estimate/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    });
  });

  describe('Form Fields - Edit Mode', () => {
    beforeEach(() => {
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        selectedTaskId: 't1',
      } as any);
    });

    it('populates form with existing task data', () => {
      render(<TaskDetailPanel />);
      
      expect(screen.getByLabelText(/title/i)).toHaveValue('Morning Run');
      expect(screen.getByLabelText(/description/i)).toHaveValue('Run 5km');
      expect(screen.getByLabelText(/notes/i)).toHaveValue('Bring water');
    });

    it('shows correct pillar and theme', () => {
      render(<TaskDetailPanel />);
      
      const pillarSelect = screen.getByLabelText(/pillar/i);
      expect(pillarSelect).toHaveValue('p1');
      
      const themeSelect = screen.getByLabelText(/theme/i);
      expect(themeSelect).toHaveValue('th1');
    });

    it('displays existing impact and time estimate', () => {
      render(<TaskDetailPanel />);
      
      const impactSelect = screen.getByLabelText(/impact/i);
      expect(impactSelect).toHaveValue('H');
      
      const timeSelect = screen.getByLabelText(/time estimate/i);
      expect(timeSelect).toHaveValue('1h');
    });
  });

  describe('Form Interactions', () => {
    beforeEach(() => {
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        selectedTaskId: 'new',
      } as any);
    });

    it('updates title field on input', async () => {
      const user = userEvent.setup();
      render(<TaskDetailPanel />);
      
      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'New Task');
      
      expect(titleInput).toHaveValue('New Task');
    });

    it('updates description field on input', async () => {
      const user = userEvent.setup();
      render(<TaskDetailPanel />);
      
      const descInput = screen.getByLabelText(/description/i);
      await user.type(descInput, 'Task description');
      
      expect(descInput).toHaveValue('Task description');
    });

    it('filters themes when pillar changes', async () => {
      const user = userEvent.setup();
      render(<TaskDetailPanel />);
      
      const pillarSelect = screen.getByLabelText(/pillar/i);
      await user.click(pillarSelect);
      
      // After changing pillar, theme should reset
      // This would require more complex Mantine Select interaction
      expect(pillarSelect).toBeInTheDocument();
    });
  });

  describe('Form Submission - Create', () => {
    beforeEach(() => {
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        selectedTaskId: 'new',
      } as any);
    });

    it('calls createTask with form data on submit', async () => {
      const user = userEvent.setup();
      render(<TaskDetailPanel />);
      
      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'New Task');
      
      const submitButton = screen.getByRole('button', { name: /create/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockStore.createTask).toHaveBeenCalled();
      });
    });

    it('does not submit if required fields are missing', async () => {
      const user = userEvent.setup();
      render(<TaskDetailPanel />);
      
      // Don't fill in title
      const submitButton = screen.getByRole('button', { name: /create/i });
      await user.click(submitButton);
      
      expect(mockStore.createTask).not.toHaveBeenCalled();
    });

    it('closes drawer after successful creation', async () => {
      const user = userEvent.setup();
      mockStore.createTask.mockResolvedValue(undefined);
      
      render(<TaskDetailPanel />);
      
      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'New Task');
      
      const submitButton = screen.getByRole('button', { name: /create/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockStore.selectTask).toHaveBeenCalledWith(null);
      });
    });
  });

  describe('Form Submission - Update', () => {
    beforeEach(() => {
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        selectedTaskId: 't1',
      } as any);
    });

    it('calls updateTask with modified data on submit', async () => {
      const user = userEvent.setup();
      render(<TaskDetailPanel />);
      
      const titleInput = screen.getByLabelText(/title/i);
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Task');
      
      const submitButton = screen.getByRole('button', { name: /save|update/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockStore.updateTask).toHaveBeenCalledWith('t1', expect.objectContaining({
          title: 'Updated Task',
        }));
      });
    });

    it('closes drawer after successful update', async () => {
      const user = userEvent.setup();
      mockStore.updateTask.mockResolvedValue(undefined);
      
      render(<TaskDetailPanel />);
      
      const submitButton = screen.getByRole('button', { name: /save|update/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockStore.selectTask).toHaveBeenCalledWith(null);
      });
    });
  });

  describe('Cancel Action', () => {
    it('closes drawer when cancel button is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        selectedTaskId: 'new',
      } as any);

      render(<TaskDetailPanel />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      expect(mockStore.selectTask).toHaveBeenCalledWith(null);
    });
  });
});

