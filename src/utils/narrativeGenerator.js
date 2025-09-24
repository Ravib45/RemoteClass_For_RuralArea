// utils/narrativeGenerator.js

/**
 * 🧠 Generates an automatic narrative/summary based on chart data and user filters.
 * This can be shown below the chart to help users understand insights easily.
 * 
 * @param {Array} data - The chart or table data (array of objects).
 * @param {Object} filters - Optional filter info like time range or category.
 * @returns {String} A user-friendly narrative/summary text.
 */
export function generateNarrative(data, filters = {}) {
    if (!Array.isArray(data) || data.length === 0) {
        return "No data available to generate insights.";
    }

    const totalEntries = data.length;
    const keys = Object.keys(data[0]);

    // Basic numeric averages if possible
    const numericKeys = keys.filter(key => typeof data[0][key] === 'number');

    const averages = {};
    numericKeys.forEach(key => {
        const sum = data.reduce((acc, row) => acc + (row[key] || 0), 0);
        averages[key] = (sum / totalEntries).toFixed(2);
    });

    // Filter summary (optional)
    const filterSummary = Object.entries(filters)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

    // 📝 Build the narrative string
    let narrative = `🔍 Analysis Summary:\n`;
    narrative += `• Total Records Analyzed: ${totalEntries}\n`;

    if (filterSummary) {
        narrative += `• Applied Filters: ${filterSummary}\n`;
    }

    if (numericKeys.length > 0) {
        narrative += `• Key Averages:\n`;
        numericKeys.forEach((key) => {
            narrative += `   - ${key}: ${averages[key]}\n`;
        });
    } else {
        narrative += `• No numeric fields found to analyze averages.\n`;
    }

    return narrative;
}
