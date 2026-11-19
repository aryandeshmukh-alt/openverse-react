import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomePage } from './HomePage';
import { getTodos } from '../api/todos';
import { renderWithProviders } from '../test/renderWithProviders';

vi.mock('../api/todos', async (importOriginal) => ({
  ...(await importOriginal()),
  getTodos: vi.fn(),
}));

const todos = [
  { id: 1, title: 'Learn React', completed: false },
  { id: 2, title: 'Learn Go', completed: true, dueDate: '2026-12-01' },
  { id: 3, title: 'Learn Redux', completed: false },
];

function setup() {
  const user = userEvent.setup();
  const utils = renderWithProviders(<HomePage />, { loggedIn: true });
  return { user, ...utils };
}

function lastCallParams() {
  return getTodos.mock.calls.at(-1)[0];
}

describe('HomePage todo list', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getTodos.mockResolvedValue({ todos, total: 25 });
  });

  it('shows a loading message and then the todos', async () => {
    setup();

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    expect(await screen.findByText('Learn React')).toBeInTheDocument();
    expect(screen.getByText('Learn Go')).toBeInTheDocument();
    expect(screen.getByText('Learn Redux')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('requests the first page with the default filters and the auth token', async () => {
    setup();
    await screen.findByText('Learn React');

    expect(getTodos).toHaveBeenCalledWith(
      { page: 1, search: '', sort: 'id', status: 'all' },
      'fake-token-123'
    );
  });

  it('links every todo to its detail page', async () => {
    setup();

    const link = (await screen.findByText('Learn Go')).closest('a');
    expect(link).toHaveAttribute('href', '/todos/2');
  });

  it('shows the due date only for todos that have one', async () => {
    setup();
    await screen.findByText('Learn React');

    expect(screen.getByText('Due: 2026-12-01')).toBeInTheDocument();
    expect(screen.getAllByText(/^Due:/)).toHaveLength(1);
  });

  it('shows a link to add a todo', async () => {
    setup();

    const addLink = await screen.findByRole('link', { name: 'Add Todo' });
    expect(addLink).toHaveAttribute('href', '/add');
  });

  it('shows an empty message when there are no todos', async () => {
    getTodos.mockResolvedValue({ todos: [], total: 0 });
    setup();

    expect(await screen.findByText('No todos found.')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });

  it('shows the error message when loading fails', async () => {
    getTodos.mockRejectedValue(new Error('Failed to fetch todos'));
    setup();

    expect(await screen.findByText('Failed to fetch todos')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('works out the number of pages from the total count', async () => {
    setup();

    expect(await screen.findByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('moves between pages with the pagination buttons', async () => {
    const { user } = setup();
    await screen.findByText('Learn React');

    const previous = screen.getByRole('button', { name: 'Previous' });
    const next = screen.getByRole('button', { name: 'Next' });
    expect(previous).toBeDisabled();

    await user.click(next);
    await waitFor(() => expect(lastCallParams().page).toBe(2));
    expect(await screen.findByText('Page 2 of 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Previous' }));
    await waitFor(() => expect(lastCallParams().page).toBe(1));
    expect(await screen.findByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('disables Next on the last page', async () => {
    const { user } = setup();
    await screen.findByText('Learn React');

    await user.click(screen.getByRole('button', { name: 'Next' }));
    await screen.findByText('Page 2 of 3');
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(await screen.findByText('Page 3 of 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('sends the search text to the server after the user stops typing', async () => {
    const { user } = setup();
    await screen.findByText('Learn React');

    await user.type(screen.getByPlaceholderText('Search todos...'), 'react');

    await waitFor(() => expect(lastCallParams().search).toBe('react'));
    expect(getTodos.mock.calls.some(([params]) => params.search === 'r')).toBe(false);
  });

  it('sends the status filter to the server', async () => {
    const { user } = setup();
    await screen.findByText('Learn React');

    const [, statusSelect] = screen.getAllByRole('combobox');
    await user.selectOptions(statusSelect, 'completed');

    await waitFor(() => expect(lastCallParams().status).toBe('completed'));
  });

  it('sends the sort order to the server', async () => {
    const { user } = setup();
    await screen.findByText('Learn React');

    const [sortSelect] = screen.getAllByRole('combobox');
    await user.selectOptions(sortSelect, 'title');

    await waitFor(() => expect(lastCallParams().sort).toBe('title'));
  });

  it('goes back to the first page when a filter changes', async () => {
    const { user } = setup();
    await screen.findByText('Learn React');

    await user.click(screen.getByRole('button', { name: 'Next' }));
    await screen.findByText('Page 2 of 3');

    const [, statusSelect] = screen.getAllByRole('combobox');
    await user.selectOptions(statusSelect, 'pending');

    expect(await screen.findByText('Page 1 of 3')).toBeInTheDocument();
    await waitFor(() => {
      expect(lastCallParams()).toMatchObject({ page: 1, status: 'pending' });
    });
  });
});
