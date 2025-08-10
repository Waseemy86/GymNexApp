import { useEffect, useState } from 'react';

export default function useFetch(fetchFunction, params = null, auto = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = params ? await fetchFunction(params) : await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auto) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refetch: fetchData };
}