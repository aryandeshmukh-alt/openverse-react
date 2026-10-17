import { useEffect, useState } from "react";

const useFetch = (fetchFunction) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchFunction();

        if (isMounted) {
          setData(result ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchFunction]);

  return { data, loading, error };
};

export default useFetch;