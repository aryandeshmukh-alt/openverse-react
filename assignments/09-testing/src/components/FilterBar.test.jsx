import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from './FilterBar';

function setup(props = {}) {
  const handlers = {
    onSearchChange: vi.fn(),
    onSortChange: vi.fn(),
    onStatusChange: vi.fn(),
  };
  render(
    <FilterBar search="" sort="id" status="all" {...handlers} {...props} />
  );
  return { user: userEvent.setup(), ...handlers };
}

describe('FilterBar', () => {
  it('shows the current values', () => {
    setup({ search: 'milk', sort: 'title', status: 'pending' });
    const [sortSelect, statusSelect] = screen.getAllByRole('combobox');

    expect(screen.getByPlaceholderText('Search todos...')).toHaveValue('milk');
    expect(sortSelect).toHaveValue('title');
    expect(statusSelect).toHaveValue('pending');
  });

  it('calls onSearchChange when the user types', async () => {
    const { user, onSearchChange } = setup();

    await user.type(screen.getByPlaceholderText('Search todos...'), 'a');

    expect(onSearchChange).toHaveBeenCalledWith('a');
  });

  it('calls onSortChange when a sort option is picked', async () => {
    const { user, onSortChange } = setup();
    const [sortSelect] = screen.getAllByRole('combobox');

    await user.selectOptions(sortSelect, 'title');

    expect(onSortChange).toHaveBeenCalledWith('title');
  });

  it('calls onStatusChange when a status option is picked', async () => {
    const { user, onStatusChange } = setup();
    const [, statusSelect] = screen.getAllByRole('combobox');

    await user.selectOptions(statusSelect, 'completed');

    expect(onStatusChange).toHaveBeenCalledWith('completed');
  });

  it('offers the expected sort and status options', () => {
    setup();
    const [sortSelect, statusSelect] = screen.getAllByRole('combobox');

    expect(Array.from(sortSelect.options).map((o) => o.value)).toEqual(['id', 'title']);
    expect(Array.from(statusSelect.options).map((o) => o.value)).toEqual([
      'all',
      'completed',
      'pending',
    ]);
  });
});
