import React, { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
);

const labels = ["Jan", "Feb", "Mar", "Apr", "May"];

const datasetConfig = {
    label: "Monthly Sales",
    data: [12, 19, 3, 5, 8],
    fill: true,
    tension: 0.4, // smooth line for 3D effect
    backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
    ],
    borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
    ],
    borderWidth: 2,
    borderJoinStyle: "round",
    pointStyle: "rectRounded",
};

const options = {
    responsive: true,
    plugins: {
        legend: {
            labels: {
                color: "#fff",
            },
        },
        tooltip: {
            backgroundColor: "#333",
            titleColor: "#fff",
            bodyColor: "#eee",
        },
    },
    scales: {
        x: {
            ticks: { color: "#ccc" },
            grid: { color: "#444" },
        },
        y: {
            ticks: { color: "#ccc" },
            grid: { color: "#444" },
        },
    },
};

const ChartContainer = () => {
    const [chartType, setChartType] = useState("line");

    const chartData = {
        labels,
        datasets: [datasetConfig],
    };

    const renderChart = () => {
        switch (chartType) {
            case "bar":
                return <Bar data={chartData} options={options} />;
            case "pie":
                return <Pie data={chartData} options={options} />;
            default:
                return <Line data={chartData} options={options} />;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-3xl mx-auto mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">📊 Analytics Overview</h2>
                <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="p-2 rounded border dark:bg-gray-700 dark:text-white"
                >
                    <option value="line">Line (3D)</option>
                    <option value="bar">Bar (Colorful)</option>
                    <option value="pie">Pie (Colorful)</option>
                </select>
            </div>
            {renderChart()}
        </div>
    );
};

export default ChartContainer;
