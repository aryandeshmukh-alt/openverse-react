import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddTodoPage } from './AddTodoPage';
import { createTodo } from '../api/todos';
import { refreshTokenRequest } from '../api/auth';
import { renderWithProviders } from '../test/renderWithProviders';

vi.mock('../api/todos', async (importOriginal) => ({
  ...(await importOriginal()),
  createTodo: vi.fn(),
}));

vi.mock('../api/auth', () => ({
  refreshTokenRequest: vi.fn(),
}));

function setup() {
  const user = userEvent.setup();
  const utils = renderWithProviders(<AddTodoPage />, {
    route: '/add',
    path: '/add',
    loggedIn: true,
  });
  return {
    user,
    ...utils,
    title: screen.getByLabelText('Title'),
    dueDate: screen.getByLabelText('Due Date'),
    submit: screen.getByRole('button', { name: 'Create Todo' }),
  };
}

async function fillForm({ user, title, dueDate }) {
  await user.type(title, 'Buy milk');
  await user.type(dueDate, '2026-12-25');
}

describe('AddTodoPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders an empty form with a disabled submit button', () => {
    const { title, dueDate, submit } = setup();

    expect(screen.getByRole('heading', { name: 'Create New Todo' })).toBeInTheDocument();
    expect(title).toHaveValue('');
    expect(dueDate).toHaveValue('');
    expect(submit).toBeDisabled();
  });

  it('enables the button only when title and due date are both filled', async () => {
    const { user, title, dueDate, submit } = setup();

    await user.type(title, 'Buy milk');
    expect(submit).toBeDisabled();

    await user.type(dueDate, '2026-12-25');
    expect(submit).toBeEnabled();
  });

  it('keeps the button disabled when the title is only spaces', async () => {
    const { user, title, dueDate, submit } = setup();

    await user.type(title, '   ');
    await user.type(dueDate, '2026-12-25');

    expect(submit).toBeDisabled();
  });

  it('shows a validation error when the form is submitted without data', () => {
    const { submit } = setup();

    fireEvent.submit(submit.closest('form'));

    expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    expect(createTodo).not.toHaveBeenCalled();
  });

  it('creates the todo with the token and redirects home', async () => {
    createTodo.mockResolvedValue({ id: 201 });
    const { user, title, dueDate, submit } = setup();

    await fillForm({ user, title, dueDate });
    await user.click(submit);

    expect(await screen.findByTestId('other-route')).toBeInTheDocument();
    expect(createTodo).toHaveBeenCalledTimes(1);
    expect(createTodo).toHaveBeenCalledWith(
      { title: 'Buy milk', dueDate: '2026-12-25' },
      'fake-token-123'
    );
  });

  it('shows a loading label and disables the inputs while saving', async () => {
    createTodo.mockReturnValue(new Promise(() => {}));
    const { user, title, dueDate, submit } = setup();

    await fillForm({ user, title, dueDate });
    await user.click(submit);

    expect(await screen.findByRole('button', { name: 'Creating...' })).toBeDisabled();
    expect(title).toBeDisabled();
    expect(dueDate).toBeDisabled();
  });

  it('shows the API error and stays on the page when creation fails', async () => {
    createTodo.mockRejectedValue(new Error('Failed to create todo'));
    const { user, title, dueDate, submit } = setup();

    await fillForm({ user, title, dueDate });
    await user.click(submit);

    expect(await screen.findByText('Failed to create todo')).toBeInTheDocument();
    expect(screen.queryByTestId('other-route')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Todo' })).toBeEnabled();
  });

  it('refreshes the token and retries when the first request is unauthorized', async () => {
    createTodo
      .mockRejectedValueOnce(new Error('UNAUTHORIZED'))
      .mockResolvedValueOnce({ id: 201 });
    refreshTokenRequest.mockResolvedValue({ accessToken: 'new-token' });
    const { user, title, dueDate, submit, store } = setup();

    await fillForm({ user, title, dueDate });
    await user.click(submit);

    expect(await screen.findByTestId('other-route')).toBeInTheDocument();
    expect(refreshTokenRequest).toHaveBeenCalledWith('fake-refresh-token');
    expect(createTodo).toHaveBeenCalledTimes(2);
    expect(createTodo).toHaveBeenLastCalledWith(
      { title: 'Buy milk', dueDate: '2026-12-25' },
      'new-token'
    );
    expect(store.getState().auth.token).toBe('new-token');
  });

  it('logs out and shows an error when the token refresh fails', async () => {
    createTodo.mockRejectedValue(new Error('UNAUTHORIZED'));
    refreshTokenRequest.mockRejectedValue(new Error('Token refresh failed'));
    const { user, title, dueDate, submit, store } = setup();

    await fillForm({ user, title, dueDate });
    await user.click(submit);

    expect(
      await screen.findByText('Session expired. Please login again.')
    ).toBeInTheDocument();
    expect(createTodo).toHaveBeenCalledTimes(1);
    expect(store.getState().auth.isLoggedIn).toBe(false);
  });
});
