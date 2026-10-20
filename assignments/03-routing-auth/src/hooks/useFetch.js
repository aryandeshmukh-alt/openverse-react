import { useState, useEffect } from 'react';

export function useFetch (url) {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect( () => {
        if (!url) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(url);
                const json = await response.json();
                setData(json);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [url]);

    return { data, loading, error };
}