/**
 * Tests for PlanTab component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@/tests/test-utils';
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
  const mockUseLifeOS = {};

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLifeOS).mockReturnValue(mockUseLifeOS as any);
  });

  describe('View Mode Toggle', () => {
    it('renders view mode toggle controls', () => {
      render(<PlanTab />);

      // Mantine SegmentedControl uses radio buttons, not regular buttons
      expect(screen.getByRole('radio', { name: /hierarchy/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /grid/i })).toBeInTheDocument();
    });

    it('defaults to hierarchy view', () => {
      render(<PlanTab />);

      expect(screen.getByTestId('pillars-column')).toBeInTheDocument();
      expect(screen.getByTestId('themes-column')).toBeInTheDocument();
      expect(screen.getByTestId('tasks-table')).toBeInTheDocument();
      expect(screen.queryByTestId('all-tasks-grid')).not.toBeInTheDocument();
    });

    it('switches to grid view when grid control is clicked', async () => {
      const user = userEvent.setup();
      render(<PlanTab />);

      const gridControl = screen.getByRole('radio', { name: /grid/i });
      await user.click(gridControl);

      expect(screen.getByTestId('all-tasks-grid')).toBeInTheDocument();
      expect(screen.queryByTestId('pillars-column')).not.toBeInTheDocument();
      expect(screen.queryByTestId('themes-column')).not.toBeInTheDocument();
      expect(screen.queryByTestId('tasks-table')).not.toBeInTheDocument();
    });

    it('switches back to hierarchy view when hierarchy control is clicked', async () => {
      const user = userEvent.setup();
      render(<PlanTab />);

      // Switch to grid
      const gridControl = screen.getByRole('radio', { name: /grid/i });
      await user.click(gridControl);

      // Switch back to hierarchy
      const hierarchyControl = screen.getByRole('radio', { name: /hierarchy/i });
      await user.click(hierarchyControl);

      expect(screen.getByTestId('pillars-column')).toBeInTheDocument();
      expect(screen.getByTestId('themes-column')).toBeInTheDocument();
      expect(screen.getByTestId('tasks-table')).toBeInTheDocument();
      expect(screen.queryByTestId('all-tasks-grid')).not.toBeInTheDocument();
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

      const gridControl = screen.getByRole('radio', { name: /grid/i });
      await user.click(gridControl);

      expect(screen.getByTestId('all-tasks-grid')).toBeInTheDocument();
      expect(screen.getByTestId('task-detail-panel')).toBeInTheDocument();
    });
  });
});

