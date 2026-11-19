const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const PAGE_SIZE = 10;

function authHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

function checkResponse(response, message) {
  if (response.status === 401) {
    throw new Error('UNAUTHORIZED');
  }
  if (!response.ok) {
    throw new Error(message);
  }
}

export async function getTodos({ page, search, sort, status }, token) {
  const params = new URLSearchParams({
    _page: page,
    _limit: PAGE_SIZE,
    _sort: sort,
    _order: 'asc',
  });

  if (search.trim()) {
    params.set('q', search.trim());
  }
  if (status === 'completed') {
    params.set('completed', 'true');
  } else if (status === 'pending') {
    params.set('completed', 'false');
  }

  const response = await fetch(`${API_BASE_URL}/todos?${params}`, {
    headers: authHeaders(token),
  });
  checkResponse(response, 'Failed to fetch todos');

  return {
    todos: await response.json(),
    total: Number(response.headers.get('X-Total-Count')),
  };
}

export async function getTodoById(id, token) {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    headers: authHeaders(token),
  });
  checkResponse(response, 'Failed to fetch todo');
  return response.json();
}

export async function createTodo({ title, dueDate }, token) {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      title,
      dueDate,
      completed: false,
    }),
  });
  checkResponse(response, 'Failed to create todo');
  return response.json();
}
