import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createStore } from '../store';
import { loginSuccess } from '../store/authSlice';

export function renderWithProviders(ui, { route = '/', path = '/', loggedIn = false } = {}) {
  const store = createStore();
  if (loggedIn) {
    store.dispatch(
      loginSuccess({
        user: { email: 'test@test.com' },
        token: 'fake-token-123',
        refreshToken: 'fake-refresh-token',
      })
    );
  }

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const result = render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path={path} element={ui} />
            <Route path="*" element={<div data-testid="other-route">Navigated away</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );

  return { ...result, store, queryClient };
}
