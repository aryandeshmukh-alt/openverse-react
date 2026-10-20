const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export async function getTodos () {
    const response = await fetch(API_URL);
    return response.json();
}

export async function getTodoById (id) {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json();
}

export async function addTodo (title) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ title, completed: false}),
    });
    return response.json();
}