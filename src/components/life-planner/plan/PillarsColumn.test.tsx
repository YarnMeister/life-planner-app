/**
 * Tests for PillarsColumn component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { PillarsColumn } from './PillarsColumn';
import { useLifeOSStore } from '@/store/useLifeOSStore';

// Mock the store
vi.mock('@/store/useLifeOSStore', () => ({
  useLifeOSStore: vi.fn(),
}));

describe('PillarsColumn', () => {
  const mockPillars = [
    { id: 'p1', name: 'Health', color: '#7C3AED', domain: 'personal' as const, avgPercent: 75 },
    { id: 'p2', name: 'Career', color: '#3B82F6', domain: 'work' as const, avgPercent: 60 },
    { id: 'p3', name: 'Family', color: '#EF4444', domain: 'personal' as const, avgPercent: 80 },
  ];

  const mockStore = {
    pillars: mockPillars,
    selectedPillarId: null,
    selectPillar: vi.fn(),
    addPillar: vi.fn(),
    updatePillar: vi.fn(),
    deletePillar: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLifeOSStore).mockReturnValue(mockStore as any);
  });

  describe('Rendering', () => {
    it('renders all pillars', () => {
      render(<PillarsColumn />);
      
      expect(screen.getByText('Health')).toBeInTheDocument();
      expect(screen.getByText('Career')).toBeInTheDocument();
      expect(screen.getByText('Family')).toBeInTheDocument();
    });

    it('displays pillar percentages', () => {
      render(<PillarsColumn />);
      
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('60%')).toBeInTheDocument();
      expect(screen.getByText('80%')).toBeInTheDocument();
    });

    it('shows "Add Pillar" button', () => {
      render(<PillarsColumn />);
      
      expect(screen.getByRole('button', { name: /add pillar/i })).toBeInTheDocument();
    });

    it('displays domain filter buttons', () => {
      render(<PillarsColumn />);
      
      expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /work/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /personal/i })).toBeInTheDocument();
    });
  });

  describe('Domain Filtering', () => {
    it('shows all pillars by default', () => {
      render(<PillarsColumn />);
      
      expect(screen.getByText('Health')).toBeInTheDocument();
      expect(screen.getByText('Career')).toBeInTheDocument();
      expect(screen.getByText('Family')).toBeInTheDocument();
    });

    it('filters to work pillars only', async () => {
      const user = userEvent.setup();
      render(<PillarsColumn />);
      
      await user.click(screen.getByRole('button', { name: /work/i }));
      
      expect(screen.getByText('Career')).toBeInTheDocument();
      expect(screen.queryByText('Health')).not.toBeInTheDocument();
      expect(screen.queryByText('Family')).not.toBeInTheDocument();
    });

    it('filters to personal pillars only', async () => {
      const user = userEvent.setup();
      render(<PillarsColumn />);
      
      await user.click(screen.getByRole('button', { name: /personal/i }));
      
      expect(screen.getByText('Health')).toBeInTheDocument();
      expect(screen.getByText('Family')).toBeInTheDocument();
      expect(screen.queryByText('Career')).not.toBeInTheDocument();
    });

    it('returns to all pillars when clicking All', async () => {
      const user = userEvent.setup();
      render(<PillarsColumn />);
      
      // Filter to work
      await user.click(screen.getByRole('button', { name: /work/i }));
      expect(screen.queryByText('Health')).not.toBeInTheDocument();
      
      // Click All
      await user.click(screen.getByRole('button', { name: /all/i }));
      expect(screen.getByText('Health')).toBeInTheDocument();
      expect(screen.getByText('Career')).toBeInTheDocument();
      expect(screen.getByText('Family')).toBeInTheDocument();
    });
  });

  describe('Pillar Selection', () => {
    it('calls selectPillar when clicking a pillar', async () => {
      const user = userEvent.setup();
      render(<PillarsColumn />);
      
      await user.click(screen.getByText('Health'));
      
      expect(mockStore.selectPillar).toHaveBeenCalledWith('p1');
    });

    it('highlights selected pillar', () => {
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        selectedPillarId: 'p1',
      } as any);
      
      render(<PillarsColumn />);
      
      const healthCard = screen.getByText('Health').closest('.mantine-Card-root');
      expect(healthCard).toHaveClass('selected'); // Assuming you add a 'selected' class
    });
  });

  describe('Create Pillar Modal', () => {
    it('opens create modal when clicking Add Pillar', async () => {
      const user = userEvent.setup();
      render(<PillarsColumn />);
      
      await user.click(screen.getByRole('button', { name: /add pillar/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/create pillar/i)).toBeInTheDocument();
      });
    });

    it('creates a new pillar with valid data', async () => {
      const user = userEvent.setup();
      mockStore.addPillar.mockResolvedValueOnce(undefined);
      
      render(<PillarsColumn />);
      
      // Open modal
      await user.click(screen.getByRole('button', { name: /add pillar/i }));
      
      // Fill form
      await user.type(screen.getByLabelText(/name/i), 'New Pillar');
      await user.click(screen.getByLabelText(/personal/i));
      
      // Submit
      await user.click(screen.getByRole('button', { name: /create/i }));
      
      await waitFor(() => {
        expect(mockStore.addPillar).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'New Pillar',
            domain: 'personal',
          })
        );
      });
    });

    it('closes modal after successful creation', async () => {
      const user = userEvent.setup();
      mockStore.addPillar.mockResolvedValueOnce(undefined);
      
      render(<PillarsColumn />);
      
      await user.click(screen.getByRole('button', { name: /add pillar/i }));
      await user.type(screen.getByLabelText(/name/i), 'New Pillar');
      await user.click(screen.getByLabelText(/personal/i));
      await user.click(screen.getByRole('button', { name: /create/i }));
      
      await waitFor(() => {
        expect(screen.queryByText(/create pillar/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Edit Pillar Modal', () => {
    it('opens edit modal when clicking edit button', async () => {
      const user = userEvent.setup();
      render(<PillarsColumn />);
      
      const editButtons = screen.getAllByLabelText(/edit/i);
      await user.click(editButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/edit pillar/i)).toBeInTheDocument();
      });
    });

    it('pre-fills form with existing pillar data', async () => {
      const user = userEvent.setup();
      render(<PillarsColumn />);
      
      const editButtons = screen.getAllByLabelText(/edit/i);
      await user.click(editButtons[0]);
      
      await waitFor(() => {
        const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
        expect(nameInput.value).toBe('Health');
      });
    });

    it('updates pillar with new data', async () => {
      const user = userEvent.setup();
      mockStore.updatePillar.mockResolvedValueOnce(undefined);
      
      render(<PillarsColumn />);
      
      const editButtons = screen.getAllByLabelText(/edit/i);
      await user.click(editButtons[0]);
      
      const nameInput = screen.getByLabelText(/name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Health');
      
      await user.click(screen.getByRole('button', { name: /save/i }));
      
      await waitFor(() => {
        expect(mockStore.updatePillar).toHaveBeenCalledWith(
          'p1',
          expect.objectContaining({
            name: 'Updated Health',
          })
        );
      });
    });
  });

  describe('Delete Pillar', () => {
    it('opens delete confirmation modal', async () => {
      const user = userEvent.setup();
      render(<PillarsColumn />);
      
      const deleteButtons = screen.getAllByLabelText(/delete/i);
      await user.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/delete pillar/i)).toBeInTheDocument();
      });
    });

    it('deletes pillar when confirmed', async () => {
      const user = userEvent.setup();
      mockStore.deletePillar.mockResolvedValueOnce(undefined);

      render(<PillarsColumn />);

      const deleteButtons = screen.getAllByLabelText(/delete/i);
      await user.click(deleteButtons[0]);

      await user.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(() => {
        expect(mockStore.deletePillar).toHaveBeenCalledWith('p1');
      });
    });

    it('does not delete when cancelled', async () => {
      const user = userEvent.setup();
      render(<PillarsColumn />);

      const deleteButtons = screen.getAllByLabelText(/delete/i);
      await user.click(deleteButtons[0]);

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(mockStore.deletePillar).not.toHaveBeenCalled();
    });
  });

  describe('Empty State', () => {
    it('shows empty message when no pillars exist', () => {
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        pillars: [],
      } as any);
      
      render(<PillarsColumn />);
      
      expect(screen.getByText(/no pillars/i)).toBeInTheDocument();
    });

    it('shows empty message when filter returns no results', async () => {
      const user = userEvent.setup();
      vi.mocked(useLifeOSStore).mockReturnValue({
        ...mockStore,
        pillars: [mockPillars[0]], // Only personal pillar
      } as any);
      
      render(<PillarsColumn />);
      
      await user.click(screen.getByRole('button', { name: /work/i }));
      
      expect(screen.getByText(/no pillars/i)).toBeInTheDocument();
    });
  });
});

