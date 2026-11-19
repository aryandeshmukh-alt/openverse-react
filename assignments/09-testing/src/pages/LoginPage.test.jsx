import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';
import { renderWithProviders } from '../test/renderWithProviders';

function setup() {
  const user = userEvent.setup();
  const utils = renderWithProviders(<LoginPage />, { route: '/login', path: '/login' });
  return {
    user,
    ...utils,
    email: screen.getByLabelText('Email'),
    password: screen.getByLabelText('Password'),
    submit: screen.getByRole('button', { name: 'Sign In' }),
  };
}

describe('LoginPage', () => {
  it('renders the email and password fields with a disabled submit button', () => {
    const { email, password, submit } = setup();

    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    expect(email).toHaveValue('');
    expect(password).toHaveValue('');
    expect(submit).toBeDisabled();
  });

  it('updates the fields as the user types', async () => {
    const { user, email, password } = setup();

    await user.type(email, 'someone@example.com');
    await user.type(password, 'secret');

    expect(email).toHaveValue('someone@example.com');
    expect(password).toHaveValue('secret');
  });

  it('keeps the button disabled until both fields are filled', async () => {
    const { user, email, password, submit } = setup();

    await user.type(email, 'someone@example.com');
    expect(submit).toBeDisabled();

    await user.type(password, 'secret');
    expect(submit).toBeEnabled();
  });

  it('shows an error and stays on the page for wrong credentials', async () => {
    const { user, email, password, submit, store } = setup();

    await user.type(email, 'wrong@example.com');
    await user.type(password, 'nope');
    await user.click(submit);

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
    expect(screen.queryByTestId('other-route')).not.toBeInTheDocument();
    expect(store.getState().auth.isLoggedIn).toBe(false);
  });

  it('logs in and redirects home with the right credentials', async () => {
    const { user, email, password, submit, store } = setup();

    await user.type(email, 'test@test.com');
    await user.type(password, '123456');
    await user.click(submit);

    expect(await screen.findByTestId('other-route')).toBeInTheDocument();
    await waitFor(() => expect(store.getState().auth.isLoggedIn).toBe(true));
    expect(store.getState().auth.user).toEqual({ email: 'test@test.com' });
    expect(store.getState().auth.error).toBeNull();
  });
});
