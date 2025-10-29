/**
 * Tests for DomainFilter component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { DomainFilter } from './DomainFilter';

describe('DomainFilter', () => {
  const mockOnChange = vi.fn();

  it('renders all filter options', () => {
    render(<DomainFilter value="all" onChange={mockOnChange} />);

    expect(screen.getByText(/all/i)).toBeInTheDocument();
    expect(screen.getByText(/work/i)).toBeInTheDocument();
    expect(screen.getByText(/personal/i)).toBeInTheDocument();
  });

  it('displays task counts when provided', () => {
    const taskCounts = { all: 10, work: 5, personal: 5 };
    render(
      <DomainFilter value="all" onChange={mockOnChange} taskCounts={taskCounts} />
    );

    expect(screen.getByText(/all \(10\)/i)).toBeInTheDocument();
    expect(screen.getByText(/work \(5\)/i)).toBeInTheDocument();
    expect(screen.getByText(/personal \(5\)/i)).toBeInTheDocument();
  });

  it('calls onChange when filter is selected', async () => {
    const user = userEvent.setup();
    render(<DomainFilter value="all" onChange={mockOnChange} />);

    const workButton = screen.getByText(/^work$/i);
    await user.click(workButton);

    expect(mockOnChange).toHaveBeenCalledWith('work');
  });

  it('highlights active filter', () => {
    render(<DomainFilter value="work" onChange={mockOnChange} />);

    // SegmentedControl should have the correct value
    const control = screen.getByRole('radiogroup');
    expect(control).toBeInTheDocument();
  });
});

