import { useState, useMemo } from "react";

const useFilters = (initialFilters = {}) => {

    const [filters, setFilters] = useState(initialFilters);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const resetFilters = () => {
        setFilters(initialFilters);
    };

    const queryString = useMemo(() => {

        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== "" && value !== null && value !== undefined) {
                params.append(key, value);
            }
        });

        return params.toString();

    }, [filters]);

    return {
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        queryString
    };
};

export default useFilters;