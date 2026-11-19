import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { getTodos, getTodoById, createTodo } from '../api/todos';
import { useAuthRequest } from './useAuthRequest';

export function useTodos(params) {
  const authRequest = useAuthRequest();

  return useQuery({
    queryKey: ['todos', params],
    queryFn: () => authRequest((token) => getTodos(params, token)),
    placeholderData: keepPreviousData,
  });
}

export function useTodo(id) {
  const authRequest = useAuthRequest();

  return useQuery({
    queryKey: ['todo', id],
    queryFn: () => authRequest((token) => getTodoById(id, token)),
  });
}

export function useCreateTodo() {
  const authRequest = useAuthRequest();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todo) => authRequest((token) => createTodo(todo, token)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
