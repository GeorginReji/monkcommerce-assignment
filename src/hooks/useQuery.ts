import { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useQuery = <T, P extends Record<string, any>>({
    params,
    apiCall
}: {
    params: P;
    apiCall: (params: P) => Promise<T>
}) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState<string>("");
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setHasError(false);
            
            try {
                const result = await apiCall(params);
                
                setData(prevData => 
                    result === null
                        ? []
                        : params.page === 1 
                            ? result as T[] 
                            : [...prevData, ...(result as T[])]
                );

                setHasMore(result !== null && (result as T[]).length === params.limit);
            } catch (e) {
                setHasError(true);            
                setError(e instanceof Error ? e.message : 'An unknown error occurred');
                setData([]);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [JSON.stringify(params), apiCall]);

    return {
        data,
        setData,
        loading,
        hasError,
        error,
        hasMore
    };
};