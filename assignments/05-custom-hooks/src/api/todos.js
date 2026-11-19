const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export async function getTodos(token) {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    throw new Error('UNAUTHORIZED');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }

  return response.json();
}

export async function getTodoById(id, token) {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    throw new Error('UNAUTHORIZED');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch todo');
  }

  return response.json();
}

export async function createTodo(title, dueDate, token) {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      dueDate,
      completed: false,
    }),
  });

  if (response.status === 401) {
    throw new Error('UNAUTHORIZED');
  }

  if (!response.ok) {
    throw new Error('Failed to create todo');
  }

  return response.json();
}
