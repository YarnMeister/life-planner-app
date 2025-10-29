/**
 * Tests for ThemesColumn component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { ThemesColumn } from './ThemesColumn';
import { useLifeOSStore } from '@/store/useLifeOSStore';

// Mock the store
vi.mock('@/store/useLifeOSStore', () => ({
  useLifeOSStore: vi.fn(),
}));

describe('ThemesColumn', () => {
  const mockThemes = [
    { id: 't1', name: 'Exercise', pillarId: 'p1', rating: 80, reflectionNotes: 'Going well' },
    { id: 't2', name: 'Nutrition', pillarId: 'p1', rating: 60, reflectionNotes: null },
    { id: 't3', name: 'Sleep', pillarId: 'p1', rating: 70, reflectionNotes: null },
  ];

  const mockStore = {
    pillars: mockPillars,
    themes: mockThemes,
    selectedPillarId: 'p1',
    selectedThemeIds: [],
    selectTheme: vi.fn(),
    addTheme: vi.fn(),
    updateTheme: vi.fn(),
    deleteTheme: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLifeOSStore).mockReturnValue(mockStore as any);
  });

  describe('Rendering', () => {
    it('renders all themes for selected pillar', () => {
      render(<ThemesColumn />);
      
      expect(screen.getByText('Exercise')).toBeInTheDocument();
      expect(screen.getByText('Nutrition')).toBeInTheDocument();
      expect(screen.getByText('Sleep')).toBeInTheDocument();
    });

    it('displays theme ratings', () => {
      render(<ThemesColumn />);
      
      expect(screen.getByText('80%')).toBeInTheDocument();
      expect(screen.getByText('60%')).toBeInTheDocument();
      expect(screen.getByText('70%')).toBeInTheDocument();
    });

    it('shows "Add Theme" button', () => {
      render(<ThemesColumn />);
      
      expect(screen.getByRole('button', { name: /add theme/i })).toBeInTheDocument();
    });

    it('displays checkboxes for multi-select', () => {
      render(<ThemesColumn />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);
    });
  });

  describe('Theme Selection', () => {
    it('calls selectTheme when checking a checkbox', async () => {
      const user = userEvent.setup();
      render(<ThemesColumn />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);
      
      expect(mockStore.selectTheme).toHaveBeenCalledWith('t1', true);
    });

    it('allows multiple theme selection', async () => {
      const user = userEvent.setup();
      render(<ThemesColumn />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);
      await user.click(checkboxes[1]);
      
      expect(mockStore.selectTheme).toHaveBeenCalledTimes(2);
      expect(mockStore.selectTheme).toHaveBeenCalledWith('t1', true);
      expect(mockStore.selectTheme).toHaveBeenCalledWith('t2', true);
    });

    it('unchecks theme when clicking again', async () => {
      const user = userEvent.setup();
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        selectedThemeIds: ['t1'],
      } as any);
      
      render(<ThemesColumn />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);
      
      expect(mockStore.selectTheme).toHaveBeenCalledWith('t1', false);
    });
  });

  describe('No Pillar Selected', () => {
    it('shows message when no pillar is selected', () => {
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        selectedPillarId: null,
      } as any);
      
      render(<ThemesColumn />);
      
      expect(screen.getByText(/select a pillar/i)).toBeInTheDocument();
    });

    it('hides Add Theme button when no pillar selected', () => {
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        selectedPillarId: null,
      } as any);
      
      render(<ThemesColumn />);
      
      expect(screen.queryByRole('button', { name: /add theme/i })).not.toBeInTheDocument();
    });
  });

  describe('Create Theme Modal', () => {
    it('opens create modal when clicking Add Theme', async () => {
      const user = userEvent.setup();
      render(<ThemesColumn />);
      
      await user.click(screen.getByRole('button', { name: /add theme/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/create theme/i)).toBeInTheDocument();
      });
    });

    it('creates a new theme with valid data', async () => {
      const user = userEvent.setup();
      mockStore.addTheme.mockResolvedValueOnce(undefined);
      
      render(<ThemesColumn />);
      
      await user.click(screen.getByRole('button', { name: /add theme/i }));
      
      await user.type(screen.getByLabelText(/name/i), 'New Theme');
      
      // Set rating slider
      const ratingSlider = screen.getByRole('slider');
      await user.click(ratingSlider);
      
      await user.click(screen.getByRole('button', { name: /create/i }));
      
      await waitFor(() => {
        expect(mockStore.addTheme).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'New Theme',
            pillarId: 'p1',
          })
        );
      });
    });

    it('includes reflection notes if provided', async () => {
      const user = userEvent.setup();
      mockStore.addTheme.mockResolvedValueOnce(undefined);
      
      render(<ThemesColumn />);
      
      await user.click(screen.getByRole('button', { name: /add theme/i }));
      
      await user.type(screen.getByLabelText(/name/i), 'New Theme');
      await user.type(screen.getByLabelText(/reflection notes/i), 'Some notes');
      
      await user.click(screen.getByRole('button', { name: /create/i }));
      
      await waitFor(() => {
        expect(mockStore.addTheme).toHaveBeenCalledWith(
          expect.objectContaining({
            reflectionNotes: 'Some notes',
          })
        );
      });
    });

    it('closes modal after successful creation', async () => {
      const user = userEvent.setup();
      mockStore.addTheme.mockResolvedValueOnce(undefined);
      
      render(<ThemesColumn />);
      
      await user.click(screen.getByRole('button', { name: /add theme/i }));
      await user.type(screen.getByLabelText(/name/i), 'New Theme');
      await user.click(screen.getByRole('button', { name: /create/i }));
      
      await waitFor(() => {
        expect(screen.queryByText(/create theme/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Edit Theme Modal', () => {
    it('opens edit modal when clicking edit button', async () => {
      const user = userEvent.setup();
      render(<ThemesColumn />);
      
      const editButtons = screen.getAllByLabelText(/edit/i);
      await user.click(editButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/edit theme/i)).toBeInTheDocument();
      });
    });

    it('pre-fills form with existing theme data', async () => {
      const user = userEvent.setup();
      render(<ThemesColumn />);
      
      const editButtons = screen.getAllByLabelText(/edit/i);
      await user.click(editButtons[0]);
      
      await waitFor(() => {
        const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
        expect(nameInput.value).toBe('Exercise');
      });
    });

    it('updates theme with new data', async () => {
      const user = userEvent.setup();
      mockStore.updateTheme.mockResolvedValueOnce(undefined);
      
      render(<ThemesColumn />);
      
      const editButtons = screen.getAllByLabelText(/edit/i);
      await user.click(editButtons[0]);
      
      const nameInput = screen.getByLabelText(/name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Exercise');
      
      await user.click(screen.getByRole('button', { name: /save/i }));
      
      await waitFor(() => {
        expect(mockStore.updateTheme).toHaveBeenCalledWith(
          't1',
          expect.objectContaining({
            name: 'Updated Exercise',
          })
        );
      });
    });
  });

  describe('Delete Theme', () => {
    it('opens delete confirmation modal', async () => {
      const user = userEvent.setup();
      render(<ThemesColumn />);
      
      const deleteButtons = screen.getAllByLabelText(/delete/i);
      await user.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/delete theme/i)).toBeInTheDocument();
      });
    });

    it('deletes theme when confirmed', async () => {
      const user = userEvent.setup();
      mockStore.deleteTheme.mockResolvedValueOnce(undefined);

      render(<ThemesColumn />);

      const deleteButtons = screen.getAllByLabelText(/delete/i);
      await user.click(deleteButtons[0]);

      await user.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(() => {
        expect(mockStore.deleteTheme).toHaveBeenCalledWith('t1');
      });
    });

    it('does not delete when cancelled', async () => {
      const user = userEvent.setup();
      render(<ThemesColumn />);

      const deleteButtons = screen.getAllByLabelText(/delete/i);
      await user.click(deleteButtons[0]);

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(mockStore.deleteTheme).not.toHaveBeenCalled();
    });
  });

  describe('Empty State', () => {
    it('shows empty message when no themes exist for pillar', () => {
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        themes: [],
      } as any);
      
      render(<ThemesColumn />);
      
      expect(screen.getByText(/no themes/i)).toBeInTheDocument();
    });
  });

  describe('Rating Display', () => {
    it('displays rating as percentage', () => {
      render(<ThemesColumn />);
      
      expect(screen.getByText('80%')).toBeInTheDocument();
    });

    it('shows visual rating indicator', () => {
      render(<ThemesColumn />);
      
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });
});

