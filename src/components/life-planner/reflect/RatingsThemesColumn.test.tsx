import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/tests/test-utils';
import { RatingsThemesColumn } from './RatingsThemesColumn';
import { useLifeOS } from '@/hooks/useLifeOS';
import { Pillar, Theme } from '@/types';

// Mock the useLifeOS hook
vi.mock('@/hooks/useLifeOS');

// Mock useDebouncedValue
vi.mock('@mantine/hooks', () => ({
  useDebouncedValue: (value: number) => [value],
}));

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
];

const mockThemes: Theme[] = [
  {
    id: 't1',
    pillarId: '1',
    name: 'Cardio',
    rating: 60,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 't2',
    pillarId: '1',
    name: 'Strength',
    rating: 80,
    lastReflectionNote: 'Feeling strong!',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

describe('RatingsThemesColumn', () => {
  const mockUpdateTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLifeOS as ReturnType<typeof vi.fn>).mockReturnValue({
      pillars: mockPillars,
      themes: mockThemes,
      selectedPillarId: '1',
      updateTheme: mockUpdateTheme,
    });
  });

  it('renders themes for selected pillar', () => {
    render(<RatingsThemesColumn />);
    
    expect(screen.getByText('Core Areas')).toBeInTheDocument();
    expect(screen.getByText('Health')).toBeInTheDocument();
    expect(screen.getByText('Cardio')).toBeInTheDocument();
    expect(screen.getByText('Strength')).toBeInTheDocument();
  });

  it('displays theme ratings', () => {
    render(<RatingsThemesColumn />);
    
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  // Note: Last reflection note removed from compact layout to keep cards slim
  // it('displays last reflection note', () => {
  //   render(<RatingsThemesColumn />);
  //
  //   expect(screen.getByText(/Feeling strong!/)).toBeInTheDocument();
  // });

  it('shows prompt when no pillar selected', () => {
    (useLifeOS as ReturnType<typeof vi.fn>).mockReturnValue({
      pillars: mockPillars,
      themes: mockThemes,
      selectedPillarId: null,
      updateTheme: mockUpdateTheme,
    });

    render(<RatingsThemesColumn />);
    
    expect(screen.getByText('Select a pillar to rate its core areas')).toBeInTheDocument();
  });

  it('shows empty state when no themes', () => {
    (useLifeOS as ReturnType<typeof vi.fn>).mockReturnValue({
      pillars: mockPillars,
      themes: [],
      selectedPillarId: '1',
      updateTheme: mockUpdateTheme,
    });

    render(<RatingsThemesColumn />);
    
    expect(screen.getByText('No core areas yet.')).toBeInTheDocument();
  });

  it('renders sliders for each theme', () => {
    render(<RatingsThemesColumn />);
    
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
  });
});

