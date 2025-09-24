import React, { useEffect } from "react";
import { Lightbulb } from "lucide-react"; // Assuming lucide-react icons

const AIChartRecommendation = ({ recommendedChart, setRecommendedChart, xAxis, yAxis, filteredData, darkMode }) => {
    //  AI Chart Recommendation logic
    useEffect(() => {
        if (!xAxis || !yAxis || filteredData.length === 0) {
            setRecommendedChart("Please select X and Y axes and ensure data is loaded.");
            return;
        }

        const xValues = filteredData.map(row => row[xAxis]);
        const uniqueXCategories = new Set(xValues).size;
        const yValues = filteredData.map(row => parseFloat(row[yAxis])).filter(val => !isNaN(val));

        const isXAxisDateLike = xValues.some(val => val && !isNaN(new Date(val)));

        const yRange = yValues.length > 0 ? Math.max(...yValues) - Math.min(...yValues) : 0;
        const yAvg = yValues.length > 0 ? yValues.reduce((sum, val) => sum + val, 0) / yValues.length : 0;

        if (isXAxisDateLike && yValues.length > 10) {
            setRecommendedChart("Line Chart (excellent for showing trends over time)");
        } else if (uniqueXCategories > 15 && yRange / yAvg < 0.5) {
            setRecommendedChart("Line Chart (good for spotting trends across many categories)");
        } else if (uniqueXCategories > 0 && uniqueXCategories <= 5) {
            setRecommendedChart("Pie Chart (ideal for showing proportion of a whole with few categories)");
        } else if (uniqueXCategories > 5 && uniqueXCategories <= 20) {
            setRecommendedChart("Bar Chart (effective for comparing distinct categories)");
        } else if (uniqueXCategories > 20 && yValues.length > 0) {
            setRecommendedChart("Bar Chart or Aggregated Line Chart (consider grouping categories)");
        } else {
            setRecommendedChart("No specific recommendation based on current data properties.");
        }
    }, [xAxis, yAxis, filteredData, setRecommendedChart]);

    return (
        <div className={`mt-6 rounded-xl p-6 ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'} shadow-lg col-span-1 md:col-span-2`}>
            <h3 className="text-xl font-bold mb-4 flex items-center text-indigo-400">
                <Lightbulb size={20} className="mr-2 text-yellow-400" /> AI Chart Suggestion
            </h3>
            <p className={`text-sm mb-2 italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Based on selected data, we recommend using:
            </p>
            <p className="text-lg font-semibold text-indigo-500">{recommendedChart}</p>
        </div>
    );
};

export default AIChartRecommendation;