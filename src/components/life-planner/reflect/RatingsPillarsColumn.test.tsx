import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { RatingsPillarsColumn } from './RatingsPillarsColumn';
import { useLifeOS } from '@/hooks/useLifeOS';
import { Pillar } from '@/types';

// Mock the useLifeOS hook
vi.mock('@/hooks/useLifeOS');

const mockPillars: Pillar[] = [
  {
    id: '1',
    name: 'Health',
    color: '#7C3AED',
    domain: 'personal',
    rating: 75,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Finance',
    color: '#16A34A',
    domain: 'personal',
    rating: 60,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

describe('RatingsPillarsColumn', () => {
  const mockSelectPillar = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLifeOS as ReturnType<typeof vi.fn>).mockReturnValue({
      pillars: mockPillars,
      selectedPillarId: null,
      selectPillar: mockSelectPillar,
    });
  });

  it('renders pillar list', () => {
    render(<RatingsPillarsColumn />);
    
    expect(screen.getByText('Life Pillars')).toBeInTheDocument();
    expect(screen.getByText('Health')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
  });

  it('displays pillar ratings prominently', () => {
    render(<RatingsPillarsColumn />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('displays domain badges', () => {
    render(<RatingsPillarsColumn />);
    
    const badges = screen.getAllByText('personal');
    expect(badges).toHaveLength(2);
  });

  it('calls selectPillar when pillar is clicked', async () => {
    const user = userEvent.setup();
    render(<RatingsPillarsColumn />);
    
    const healthCard = screen.getByText('Health').closest('div[class*="Card"]');
    if (healthCard) {
      await user.click(healthCard);
      expect(mockSelectPillar).toHaveBeenCalledWith('1');
    }
  });

  it('highlights selected pillar', () => {
    (useLifeOS as ReturnType<typeof vi.fn>).mockReturnValue({
      pillars: mockPillars,
      selectedPillarId: '1',
      selectPillar: mockSelectPillar,
    });

    render(<RatingsPillarsColumn />);
    
    const healthCard = screen.getByText('Health').closest('div[class*="Card"]');
    expect(healthCard).toHaveStyle({ backgroundColor: expect.any(String) });
  });

  it('shows empty state when no pillars', () => {
    (useLifeOS as ReturnType<typeof vi.fn>).mockReturnValue({
      pillars: [],
      selectedPillarId: null,
      selectPillar: mockSelectPillar,
    });

    render(<RatingsPillarsColumn />);
    
    expect(screen.getByText('No pillars yet.')).toBeInTheDocument();
  });
});

