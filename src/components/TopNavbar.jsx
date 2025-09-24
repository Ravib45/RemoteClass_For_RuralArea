// src/components/TopNavbar.jsx
import React from 'react';

const TopNavbar = ({ chartType, setChartType, xKey, setXKey, yKey, setYKey }) => {
    return (
        <div className="flex flex-wrap items-center justify-between bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
            <div className="flex flex-wrap gap-4 items-center">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Upload</button>

                <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="p-2 rounded bg-gray-200">
                    <option value="bar">Bar</option>
                    <option value="line">Line</option>
                    <option value="pie">Pie</option>
                </select>

                <input
                    type="text"
                    value={xKey}
                    onChange={(e) => setXKey(e.target.value)}
                    placeholder="X-axis key"
                    className="p-2 rounded bg-gray-100"
                />
                <input
                    type="text"
                    value={yKey}
                    onChange={(e) => setYKey(e.target.value)}
                    placeholder="Y-axis key"
                    className="p-2 rounded bg-gray-100"
                />
            </div>
        </div>
    );
};

export default TopNavbar;
