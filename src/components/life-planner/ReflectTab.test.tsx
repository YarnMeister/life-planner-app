import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { ReflectTab } from './ReflectTab';
import { useLifeOS } from '@/hooks/useLifeOS';

// Mock the useLifeOS hook
vi.mock('@/hooks/useLifeOS');

// Mock child components
vi.mock('./reflect/RatingsPillarsColumn', () => ({
  RatingsPillarsColumn: () => <div>RatingsPillarsColumn</div>,
}));

vi.mock('./reflect/RatingsThemesColumn', () => ({
  RatingsThemesColumn: () => <div>RatingsThemesColumn</div>,
}));

vi.mock('./reflect/ReflectModal', () => ({
  ReflectModal: ({ opened, onClose }: { opened: boolean; onClose: () => void }) => (
    opened ? <div>ReflectModal <button onClick={onClose}>Close</button></div> : null
  ),
}));

// Mock useMediaQuery
vi.mock('@mantine/hooks', () => ({
  useMediaQuery: () => false, // Desktop by default
}));

describe('ReflectTab', () => {
  const mockLoadPillars = vi.fn();
  const mockLoadThemes = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    (useLifeOS as ReturnType<typeof vi.fn>).mockReturnValue({
      loadPillars: mockLoadPillars,
      loadThemes: mockLoadThemes,
      isLoading: false,
    });
  });

  it('loads data on mount', async () => {
    render(<ReflectTab />);
    
    await waitFor(() => {
      expect(mockLoadPillars).toHaveBeenCalled();
      expect(mockLoadThemes).toHaveBeenCalled();
    });
  });

  it('renders header and components', () => {
    render(<ReflectTab />);
    
    expect(screen.getByText('Reflect on Your Life Areas')).toBeInTheDocument();
    expect(screen.getByText('Start Reflection')).toBeInTheDocument();
    expect(screen.getByText('RatingsPillarsColumn')).toBeInTheDocument();
    expect(screen.getByText('RatingsThemesColumn')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useLifeOS as ReturnType<typeof vi.fn>).mockReturnValue({
      loadPillars: mockLoadPillars,
      loadThemes: mockLoadThemes,
      isLoading: true,
    });

    render(<ReflectTab />);

    // Mantine Loader doesn't have progressbar role, check for the loader class instead
    expect(document.querySelector('.mantine-Loader-root')).toBeInTheDocument();
  });

  it('opens reflection modal when button clicked', async () => {
    const user = userEvent.setup();
    render(<ReflectTab />);
    
    const startButton = screen.getByText('Start Reflection');
    await user.click(startButton);
    
    expect(screen.getByText('ReflectModal')).toBeInTheDocument();
  });

  it('closes reflection modal', async () => {
    const user = userEvent.setup();
    render(<ReflectTab />);
    
    const startButton = screen.getByText('Start Reflection');
    await user.click(startButton);
    
    const closeButton = screen.getByText('Close');
    await user.click(closeButton);
    
    expect(screen.queryByText('ReflectModal')).not.toBeInTheDocument();
  });

  it('displays last reflection timestamp', () => {
    const timestamp = new Date().toISOString();
    localStorage.setItem('lifeOS:lastReflection', JSON.stringify({
      timestamp,
      themesRated: 5,
      improved: 2,
      declined: 1,
    }));

    render(<ReflectTab />);
    
    expect(screen.getByText(/Last reflection:/)).toBeInTheDocument();
  });

  it('formats last reflection as "Today"', () => {
    const timestamp = new Date().toISOString();
    localStorage.setItem('lifeOS:lastReflection', JSON.stringify({
      timestamp,
      themesRated: 5,
    }));

    render(<ReflectTab />);
    
    expect(screen.getByText(/Today/)).toBeInTheDocument();
  });

  it('formats last reflection as "Yesterday"', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    localStorage.setItem('lifeOS:lastReflection', JSON.stringify({
      timestamp: yesterday.toISOString(),
      themesRated: 5,
    }));

    render(<ReflectTab />);
    
    expect(screen.getByText(/Yesterday/)).toBeInTheDocument();
  });

  it('formats last reflection as days ago', () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    localStorage.setItem('lifeOS:lastReflection', JSON.stringify({
      timestamp: threeDaysAgo.toISOString(),
      themesRated: 5,
    }));

    render(<ReflectTab />);
    
    expect(screen.getByText(/3 days ago/)).toBeInTheDocument();
  });
});

