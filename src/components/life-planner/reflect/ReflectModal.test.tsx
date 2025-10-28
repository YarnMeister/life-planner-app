import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { ReflectModal } from './ReflectModal';
import { useLifeOS } from '@/hooks/useLifeOS';
import { Pillar, Theme } from '@/types';

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
];

const mockThemes: Theme[] = [
  {
    id: 't1',
    pillarId: '1',
    name: 'Cardio',
    rating: 60,
    previousRating: 50,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 't2',
    pillarId: '1',
    name: 'Strength',
    rating: 80,
    previousRating: 85,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

describe('ReflectModal', () => {
  const mockOnClose = vi.fn();
  const mockOnComplete = vi.fn();
  const mockUpdateTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLifeOS as ReturnType<typeof vi.fn>).mockReturnValue({
      pillars: mockPillars,
      themes: mockThemes,
      updateTheme: mockUpdateTheme,
    });
  });

  it('renders welcome step initially', () => {
    render(
      <ReflectModal
        opened={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );
    
    expect(screen.getByText('Welcome to your reflection session')).toBeInTheDocument();
    expect(screen.getByText('How are you feeling today?')).toBeInTheDocument();
  });

  it('shows mood selection buttons', () => {
    render(
      <ReflectModal
        opened={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );
    
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('Neutral')).toBeInTheDocument();
    expect(screen.getByText('Could be better')).toBeInTheDocument();
  });

  it('navigates to rating step', async () => {
    const user = userEvent.setup();
    render(
      <ReflectModal
        opened={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );
    
    const startButton = screen.getByText('Start Reflection');
    await user.click(startButton);

    // Text appears in both stepper description and main content, use getAllByText
    const ratingTexts = screen.getAllByText('Rate your core areas');
    expect(ratingTexts.length).toBeGreaterThan(0);
  });

  it('displays themes in rating step', async () => {
    const user = userEvent.setup();
    render(
      <ReflectModal
        opened={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );
    
    await user.click(screen.getByText('Start Reflection'));
    
    expect(screen.getByText('Cardio')).toBeInTheDocument();
    expect(screen.getByText('Strength')).toBeInTheDocument();
  });

  it('shows progress indicator', async () => {
    const user = userEvent.setup();
    render(
      <ReflectModal
        opened={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );
    
    await user.click(screen.getByText('Start Reflection'));
    
    expect(screen.getByText(/0 of 2 rated/)).toBeInTheDocument();
  });

  it('navigates to summary step', async () => {
    const user = userEvent.setup();
    render(
      <ReflectModal
        opened={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );
    
    await user.click(screen.getByText('Start Reflection'));
    await user.click(screen.getByText('Continue to Summary'));
    
    expect(screen.getByText('Reflection Summary')).toBeInTheDocument();
  });

  it('displays statistics in summary', async () => {
    const user = userEvent.setup();
    render(
      <ReflectModal
        opened={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );
    
    await user.click(screen.getByText('Start Reflection'));
    await user.click(screen.getByText('Continue to Summary'));
    
    expect(screen.getByText('Improved')).toBeInTheDocument();
    expect(screen.getByText('Declined')).toBeInTheDocument();
    expect(screen.getByText('Unchanged')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <ReflectModal
        opened={false}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );
    
    expect(screen.queryByText('Welcome to your reflection session')).not.toBeInTheDocument();
  });
});

