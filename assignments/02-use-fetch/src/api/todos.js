import { fetchWrapper } from "./fetchWrapper";

const TODOS_URL = "https://jsonplaceholder.typicode.com/todos";

export const getTodos = async () => {
    const response = await fetchWrapper(TODOS_URL, {
        method: "GET",
        headers: {
            "Content-Type":"application/json",
        }
    });
    return response.json();
};