import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

function setup(props = {}) {
  const onPageChange = vi.fn();
  render(
    <Pagination page={2} totalPages={5} onPageChange={onPageChange} {...props} />
  );
  return { user: userEvent.setup(), onPageChange };
}

describe('Pagination', () => {
  it('shows the current page and the total', () => {
    setup();

    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  it('goes to the previous and next page', async () => {
    const { user, onPageChange } = setup();

    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
  });

  it('disables Previous on the first page', () => {
    setup({ page: 1 });

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
  });

  it('disables Next on the last page', () => {
    setup({ page: 5 });

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
  });

  it('disables both buttons when disabled is set', () => {
    setup({ disabled: true });

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
});
