import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const useFetch = (url, options = {}) => {

    const {
        method = "GET",
        body = null,
        autoFetch = true,
        dependencies = []
    } = options;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {

        try {

            setLoading(true);
            setError(null);

            const response = await api({
                url,
                method,
                data: body
            });

            setData(response.data.data);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);
        }

    }, [url, method, body]);

    useEffect(() => {

        if (autoFetch) {
            fetchData();
        }

    }, [fetchData, autoFetch, ...dependencies]);

    return {
        data,
        setData,
        loading,
        error,
        refetch: fetchData
    };
};

export default useFetch;