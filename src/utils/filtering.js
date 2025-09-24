// Utility functions to filter Excel table data based on user-selected filters

// 🔹 This function filters data rows based on selected filter criteria
export const filterData = (data, filters) => {
    return data.filter((row) => {
        // Check every filter condition
        return Object.entries(filters).every(([key, value]) => {
            // If filter is not applied, skip
            if (!value || value === "All") return true;

            const cellValue = row[key];

            // Case-insensitive matching for strings
            if (typeof cellValue === "string") {
                return cellValue.toLowerCase() === value.toLowerCase();
            }

            // Direct match for numbers or other types
            return cellValue === value;
        });
    });
};
