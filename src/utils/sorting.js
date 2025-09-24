// utils/sorting.js

/**
 * Sorts the given data based on a provided key and direction (asc or desc).
 * Handles both string and numeric comparisons.
 * If no key is provided in sortConfig, it returns the data as-is.
 * 
 * @param {Array} data - The data array to be sorted.
 * @param {Object} sortConfig - An object with key and direction properties.
 * @returns {Array} - Sorted data array.
 */
export function sortData(data, sortConfig) {
    // If no sort key is defined, return data as is
    if (!sortConfig.key) return data;

    const { key, direction } = sortConfig;

    return [...data].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        // String comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return direction === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        // Numeric comparison (handles possible strings of numbers too)
        const numA = parseFloat(aValue);
        const numB = parseFloat(bValue);
        if (!isNaN(numA) && !isNaN(numB)) {
            return direction === "asc" ? numA - numB : numB - numA;
        }

        // If values are not comparable, return unchanged order
        return 0;
    });
}
