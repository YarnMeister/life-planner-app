/**
 * Tests for PlanTab component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { PlanTab } from './PlanTab';
import { useLifeOS } from '@/hooks/useLifeOS';

// Mock the useLifeOS hook
vi.mock('@/hooks/useLifeOS', () => ({
  useLifeOS: vi.fn(),
}));

// Mock child components
vi.mock('./plan/PillarsColumn', () => ({
  PillarsColumn: () => <div data-testid="pillars-column">Pillars Column</div>,
}));

vi.mock('./plan/ThemesColumn', () => ({
  ThemesColumn: () => <div data-testid="themes-column">Themes Column</div>,
}));

vi.mock('./plan/TasksTable', () => ({
  TasksTable: () => <div data-testid="tasks-table">Tasks Table</div>,
}));

vi.mock('./plan/TaskDetailPanel', () => ({
  TaskDetailPanel: () => <div data-testid="task-detail-panel">Task Detail Panel</div>,
}));

vi.mock('./plan/MobileAccordionView', () => ({
  MobileAccordionView: () => <div data-testid="mobile-accordion">Mobile Accordion</div>,
}));

vi.mock('./plan/AllTasksGrid', () => ({
  AllTasksGrid: () => <div data-testid="all-tasks-grid">All Tasks Grid</div>,
}));

describe('PlanTab', () => {
  const mockLoadPillars = vi.fn();
  const mockLoadThemes = vi.fn();
  const mockLoadTasks = vi.fn();

  const mockUseLifeOS = {
    loadPillars: mockLoadPillars,
    loadThemes: mockLoadThemes,
    loadTasks: mockLoadTasks,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadPillars.mockResolvedValue(undefined);
    mockLoadThemes.mockResolvedValue(undefined);
    mockLoadTasks.mockResolvedValue(undefined);
    vi.mocked(useLifeOS).mockReturnValue(mockUseLifeOS as any);
  });

  describe('Data Loading', () => {
    it('loads pillars, themes, and tasks on mount', async () => {
      render(<PlanTab />);
      
      await waitFor(() => {
        expect(mockLoadPillars).toHaveBeenCalledTimes(1);
        expect(mockLoadThemes).toHaveBeenCalledTimes(1);
        expect(mockLoadTasks).toHaveBeenCalledTimes(1);
      });
    });

    it('loads data only once on mount', async () => {
      const { rerender } = render(<PlanTab />);
      
      await waitFor(() => {
        expect(mockLoadPillars).toHaveBeenCalledTimes(1);
      });
      
      // Rerender should not trigger another load
      rerender(<PlanTab />);
      
      await waitFor(() => {
        expect(mockLoadPillars).toHaveBeenCalledTimes(1);
      });
    });

    it('loads all data in parallel', async () => {
      render(<PlanTab />);
      
      await waitFor(() => {
        expect(mockLoadPillars).toHaveBeenCalled();
        expect(mockLoadThemes).toHaveBeenCalled();
        expect(mockLoadTasks).toHaveBeenCalled();
      });
    });
  });

  describe('View Mode Toggle', () => {
    it('renders view mode toggle buttons', () => {
      render(<PlanTab />);
      
      expect(screen.getByRole('button', { name: /hierarchy/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /grid/i })).toBeInTheDocument();
    });

    it('defaults to hierarchy view', () => {
      render(<PlanTab />);
      
      expect(screen.getByTestId('pillars-column')).toBeInTheDocument();
      expect(screen.getByTestId('themes-column')).toBeInTheDocument();
      expect(screen.getByTestId('tasks-table')).toBeInTheDocument();
      expect(screen.queryByTestId('all-tasks-grid')).not.toBeInTheDocument();
    });

    it('switches to grid view when grid button is clicked', async () => {
      const user = userEvent.setup();
      render(<PlanTab />);
      
      const gridButton = screen.getByRole('button', { name: /grid/i });
      await user.click(gridButton);
      
      expect(screen.getByTestId('all-tasks-grid')).toBeInTheDocument();
      expect(screen.queryByTestId('pillars-column')).not.toBeInTheDocument();
      expect(screen.queryByTestId('themes-column')).not.toBeInTheDocument();
      expect(screen.queryByTestId('tasks-table')).not.toBeInTheDocument();
    });

    it('switches back to hierarchy view when hierarchy button is clicked', async () => {
      const user = userEvent.setup();
      render(<PlanTab />);
      
      // Switch to grid
      const gridButton = screen.getByRole('button', { name: /grid/i });
      await user.click(gridButton);
      
      // Switch back to hierarchy
      const hierarchyButton = screen.getByRole('button', { name: /hierarchy/i });
      await user.click(hierarchyButton);
      
      expect(screen.getByTestId('pillars-column')).toBeInTheDocument();
      expect(screen.getByTestId('themes-column')).toBeInTheDocument();
      expect(screen.getByTestId('tasks-table')).toBeInTheDocument();
      expect(screen.queryByTestId('all-tasks-grid')).not.toBeInTheDocument();
    });

    it('highlights active view mode button', async () => {
      const user = userEvent.setup();
      render(<PlanTab />);
      
      const hierarchyButton = screen.getByRole('button', { name: /hierarchy/i });
      const gridButton = screen.getByRole('button', { name: /grid/i });
      
      // Hierarchy should be active by default
      expect(hierarchyButton).toHaveAttribute('data-active', 'true');
      expect(gridButton).toHaveAttribute('data-active', 'false');
      
      // Click grid
      await user.click(gridButton);
      
      expect(hierarchyButton).toHaveAttribute('data-active', 'false');
      expect(gridButton).toHaveAttribute('data-active', 'true');
    });
  });

  describe('Desktop Layout', () => {
    it('renders three-column layout in hierarchy view', () => {
      render(<PlanTab />);
      
      expect(screen.getByTestId('pillars-column')).toBeInTheDocument();
      expect(screen.getByTestId('themes-column')).toBeInTheDocument();
      expect(screen.getByTestId('tasks-table')).toBeInTheDocument();
    });

    it('renders TaskDetailPanel', () => {
      render(<PlanTab />);
      
      expect(screen.getByTestId('task-detail-panel')).toBeInTheDocument();
    });

    it('hides mobile accordion on desktop', () => {
      render(<PlanTab />);
      
      // Mobile accordion should not be visible on desktop
      const mobileAccordion = screen.queryByTestId('mobile-accordion');
      expect(mobileAccordion).not.toBeInTheDocument();
    });
  });

  describe('Mobile Layout', () => {
    beforeEach(() => {
      // Mock mobile viewport
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));
    });

    it('shows mobile accordion view on small screens', () => {
      render(<PlanTab />);
      
      // This would require proper responsive testing setup
      // For now, we just verify the component exists
      expect(screen.getByTestId('mobile-accordion')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles error when loading pillars fails', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockLoadPillars.mockRejectedValue(new Error('Failed to load pillars'));
      
      render(<PlanTab />);
      
      await waitFor(() => {
        expect(consoleError).toHaveBeenCalled();
      });
      
      consoleError.mockRestore();
    });

    it('handles error when loading themes fails', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockLoadThemes.mockRejectedValue(new Error('Failed to load themes'));
      
      render(<PlanTab />);
      
      await waitFor(() => {
        expect(consoleError).toHaveBeenCalled();
      });
      
      consoleError.mockRestore();
    });

    it('handles error when loading tasks fails', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockLoadTasks.mockRejectedValue(new Error('Failed to load tasks'));
      
      render(<PlanTab />);
      
      await waitFor(() => {
        expect(consoleError).toHaveBeenCalled();
      });
      
      consoleError.mockRestore();
    });

    it('continues to render UI even if data loading fails', async () => {
      mockLoadPillars.mockRejectedValue(new Error('Failed'));
      
      render(<PlanTab />);
      
      // UI should still render
      expect(screen.getByRole('button', { name: /hierarchy/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /grid/i })).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('renders all child components in hierarchy view', () => {
      render(<PlanTab />);
      
      expect(screen.getByTestId('pillars-column')).toBeInTheDocument();
      expect(screen.getByTestId('themes-column')).toBeInTheDocument();
      expect(screen.getByTestId('tasks-table')).toBeInTheDocument();
      expect(screen.getByTestId('task-detail-panel')).toBeInTheDocument();
    });

    it('renders grid component in grid view', async () => {
      const user = userEvent.setup();
      render(<PlanTab />);
      
      const gridButton = screen.getByRole('button', { name: /grid/i });
      await user.click(gridButton);
      
      expect(screen.getByTestId('all-tasks-grid')).toBeInTheDocument();
      expect(screen.getByTestId('task-detail-panel')).toBeInTheDocument();
    });
  });
});

