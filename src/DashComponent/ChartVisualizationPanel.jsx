import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, Download, Settings, Palette, CornerUpRight, Type, Text, LineChart, BarChart2, PieChart, GitGraph, Layers, RadioTower } from "lucide-react"; // More icons for better visual appeal
import Lottie from "lottie-react";
import ChartAnimation from "../assets/animations/ChartHead.json" // Assuming this is a Lottie animation for a header

// 1. Import ALL chart components from react-chartjs-2
import { Bar, Line, Pie, Radar, PolarArea, Bubble, Doughnut, Scatter } from "react-chartjs-2"; // Added Doughnut and Scatter

// 2. Import and register necessary Chart.js components
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    Filler,
    // New imports for Doughnut, Scatter
    DoughnutController,
    ScatterController,
    // Keep existing controllers
    RadarController,
    PolarAreaController,
    BubbleController,
} from 'chart.js';

// Register them all
ChartJS.register(
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    Filler,
    DoughnutController,
    ScatterController,
    RadarController,
    PolarAreaController,
    BubbleController
);


const ChartVisualizationPanel = ({
    activeTab,
    chartTitle,
    setChartTitle,
    chartSubtitle,
    setChartSubtitle,
    xAxis,
    setXAxis,
    yAxis,
    setYAxis,
    columns,
    chartType,
    setChartType,
    chartData,
    topN,
    setTopN,
    customTopN,
    setCustomTopN,
    chartAreaRef,
    chartOptions, // This will need to be dynamically updated based on chart type for new features
    exportAsCSV,
    exportAsPDF,
    exportAsPNG,
    chartColor,
    setChartColor,
    lineTension,
    setLineTension,
    pointRadius,
    setPointRadius,
    annotationText,
    setAnnotationText,
    darkMode,
    // New props for additional customizations
    showGrid,
    setShowGrid,
    showLegend,
    setShowLegend,
    labelRotation,
    setLabelRotation,
    barBorderRadius,
    setBarBorderRadius,
    pieCutout,
    setPieCutout,
    radarLineTension, // Separate line tension for radar if needed
    setRadarLineTension,
    bubbleMinRadius,
    setBubbleMinRadius,
    bubbleMaxRadius,
    setBubbleMaxRadius,
    scatterPointSize,
    setScatterPointSize
}) => {
    if (activeTab !== "chart") return null;

    // Define all available chart types with icons for better visual selection
    const availableChartTypes = [
        { name: 'bar', icon: <BarChart2 size={20} /> },
        { name: 'line', icon: <LineChart size={20} /> },
        { name: 'pie', icon: <PieChart size={20} /> },
        { name: 'doughnut', icon: <PieChart size={20} className="transform rotate-180" /> }, // Doughnut often uses same icon, maybe rotated
        { name: 'radar', icon: <GitGraph size={20} /> },
        { name: 'polarArea', icon: <Layers size={20} /> },
        // { name: 'bubble', icon: <RadioTower size={20} /> },
        // { name: 'scatter', icon: <CornerUpRight size={20} /> },
    ];

    // Helper to determine if TopN filter is applicable
    const isTopNAplicable = ['bar', 'line', 'bubble', 'scatter'].includes(chartType);

    return (
        <motion.div
            key="chart-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8" // Added spacing between sections
        >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-yellow-400 border-b pb-3 border-yellow-700/50 flex items-center">
                <Lottie animationData={ChartAnimation} loop={true} autoPlay={true} className="w-12 h-12 mr-2" />
                Chart Visualization
            </h2>

            {/* Input controls for Chart Metadata */}
            <div className={`p-6 rounded-xl shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Type size={20} className="mr-2 text-blue-400" /> Chart Metadata
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input
                        type="text"
                        value={chartTitle}
                        onChange={(e) => setChartTitle(e.target.value)}
                        className={`p-3 rounded-lg border focus:ring-2 focus:ring-yellow-500 transition-colors duration-200 ${darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'}`}
                        placeholder="Chart Title"
                        aria-label="Chart Title"
                    />
                    <input
                        type="text"
                        value={chartSubtitle}
                        onChange={(e) => setChartSubtitle(e.target.value)}
                        className={`p-3 rounded-lg border focus:ring-2 focus:ring-yellow-500 transition-colors duration-200 ${darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'}`}
                        placeholder="Chart Subtitle"
                        aria-label="Chart Subtitle"
                    />
                    <select
                        value={xAxis}
                        onChange={(e) => setXAxis(e.target.value)}
                        className={`p-3 rounded-lg border focus:ring-2 focus:ring-yellow-500 transition-colors duration-200 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                        aria-label="Select X-Axis"
                    >
                        <option value="">Select X-Axis</option>
                        {columns.map((col, i) => <option key={i}>{col}</option>)}
                    </select>
                    <select
                        value={yAxis}
                        onChange={(e) => setYAxis(e.target.value)}
                        className={`p-3 rounded-lg border focus:ring-2 focus:ring-yellow-500 transition-colors duration-200 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                        aria-label="Select Y-Axis"
                    >
                        <option value="">Select Y-Axis</option>
                        {columns.map((col, i) => <option key={i}>{col}</option>)}
                    </select>
                </div>
            </div>

            {/* Chart Type Selection */}
            <div className={`p-6 rounded-xl shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Palette size={20} className="mr-2 text-pink-400" /> Choose Chart Type
                </h3>
                <div className="flex flex-wrap gap-3">
                    {availableChartTypes.map(type => (
                        <button
                            key={type.name}
                            onClick={() => setChartType(type.name)}
                            className={`px-4 py-2 md:px-6 md:py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md flex items-center space-x-2
                            ${chartType === type.name ? 'bg-gradient-to-r from-yellow-500 to-amber-400 text-gray-900' :
                                    `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}`}
                        >
                            {type.icon} <span>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</span>
                        </button>
                    ))}
                </div>
            </div>


            {/* Chart Area and TopN Filter */}
            {chartData ? (
                <>
                    {isTopNAplicable && (
                        <div className={`p-6 rounded-xl shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex flex-wrap items-center justify-end gap-6`}>
                            <h3 className="text-xl font-semibold flex items-center mr-auto">
                                <Settings size={20} className="mr-2 text-green-400" /> Data Filtering
                            </h3>
                            <div className="flex flex-col">
                                <label htmlFor="topN-select" className="text-sm font-semibold mb-1 text-gray-400">Show Top</label>
                                <select
                                    id="topN-select"
                                    value={topN}
                                    onChange={(e) => setTopN(Number(e.target.value))}
                                    className={`px-4 py-2 rounded-xl border shadow-md text-sm ${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
                                >
                                    <option value="10">Top 10</option>
                                    <option value="20">Top 20</option>
                                    <option value={chartData?.labels?.length || 1000}>All</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="custom-topN" className="text-sm font-semibold mb-1 text-gray-400">Custom Top N</label>
                                <input
                                    type="number"
                                    id="custom-topN"
                                    min="1"
                                    max={chartData?.labels?.length || 1000}
                                    value={customTopN}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (e.target.value === "") {
                                            setCustomTopN("");
                                            return;
                                        }
                                        if (!isNaN(value)) {
                                            setTopN(value);
                                            setCustomTopN(value);
                                        }
                                    }}
                                    onBlur={() => {
                                        if (customTopN === "") {
                                            setCustomTopN(topN);
                                        }
                                    }}
                                    placeholder="Enter number"
                                    className={`px-4 py-2 rounded-xl border shadow-md text-sm ${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
                                />
                            </div>
                        </div>
                    )}

                    {/* Chart Display */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        ref={chartAreaRef}
                        className={`relative w-full h-[350px] md:h-[550px] rounded-2xl p-4 md:p-8 shadow-2xl border
                        ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-white to-gray-100 border-gray-200'}
                        flex flex-col items-center justify-center`}
                    >
                        {/* Conditional rendering for each chart type */}
                        {chartType === 'bar' && <Bar data={chartData} options={chartOptions} />}
                        {chartType === 'line' && <Line data={chartData} options={chartOptions} />}
                        {chartType === 'pie' && <Pie data={chartData} options={chartOptions} />}
                        {chartType === 'doughnut' && <Doughnut data={chartData} options={chartOptions} />}
                        {chartType === 'radar' && <Radar data={chartData} options={chartOptions} />}
                        {chartType === 'polarArea' && <PolarArea data={chartData} options={chartOptions} />}
                        {annotationText && (
                            <p className="absolute bottom-2 md:bottom-4 text-center text-xs md:text-sm text-gray-500 italic w-full px-4">
                                {annotationText}
                            </p>
                        )}
                    </motion.div>
                </>
            ) : (
                <div className={`p-6 md:p-10 text-center rounded-xl mb-6 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className="text-xl font-semibold mb-3">No chart data available.</p>
                    <p className="text-base">Please **upload an Excel file** and **select X and Y axes** to generate a chart.</p>
                </div>
            )}

            {/* Export Buttons */}
            <div className={`p-6 rounded-xl shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Download size={20} className="mr-2 text-orange-400" /> Export Options
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <button onClick={exportAsCSV} className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 shadow font-semibold flex items-center justify-center space-x-2 transition transform hover:scale-105">
                        <Download size={18} /> <span>Export CSV</span>
                    </button>
                    <button onClick={exportAsPDF} className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 shadow font-semibold flex items-center justify-center space-x-2 transition transform hover:scale-105">
                        <Download size={18} /> <span>Export PDF</span>
                    </button>
                    <button onClick={exportAsPNG} className="bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700 shadow font-semibold flex items-center justify-center space-x-2 transition transform hover:scale-105">
                        <Download size={18} /> <span>Export PNG</span>
                    </button>
                </div>
            </div>


            {/* Chart Customization */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Lightbulb size={20} className="mr-2 text-yellow-400" /> Advanced Chart Customization
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Universal Customizations */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">Chart Color</label>
                        <input
                            type="color"
                            value={chartColor}
                            onChange={(e) => setChartColor(e.target.value)}
                            className="w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                            title="Choose chart color"
                        />
                    </div>
                    <div>
                        <label htmlFor="show-grid-toggle" className="block text-sm font-semibold mb-2 text-gray-400">Show Grid Lines</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="show-grid-toggle"
                                className="sr-only peer"
                                checked={showGrid}
                                onChange={(e) => setShowGrid(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{showGrid ? 'On' : 'Off'}</span>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="show-legend-toggle" className="block text-sm font-semibold mb-2 text-gray-400">Show Legend</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="show-legend-toggle"
                                className="sr-only peer"
                                checked={showLegend}
                                onChange={(e) => setShowLegend(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{showLegend ? 'On' : 'Off'}</span>
                        </label>
                    </div>

                    {/* Chart-Type Specific Customizations */}
                    {(chartType === 'line' || chartType === 'radar') && (
                        <>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-400">Line Tension</label>
                                <input type="range" min="0" max="1" step="0.1" value={lineTension} onChange={(e) => setLineTension(parseFloat(e.target.value))} className="w-full h-8 cursor-pointer accent-yellow-500" />
                                <span className="text-xs text-gray-500">{lineTension}</span>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-400">Point Radius</label>
                                <input type="range" min="0" max="10" step="1" value={pointRadius} onChange={(e) => setPointRadius(parseInt(e.target.value))} className="w-full h-8 cursor-pointer accent-yellow-500" />
                                <span className="text-xs text-gray-500">{pointRadius}px</span>
                            </div>
                        </>
                    )}

                    {(chartType === 'bar') && (
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-400">Bar Corner Radius</label>
                            <input type="range" min="0" max="15" step="1" value={barBorderRadius} onChange={(e) => setBarBorderRadius(parseInt(e.target.value))} className="w-full h-8 cursor-pointer accent-yellow-500" />
                            <span className="text-xs text-gray-500">{barBorderRadius}px</span>
                        </div>
                    )}

                    {(chartType === 'pie' || chartType === 'doughnut') && (
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-400">Pie Cutout (%)</label>
                            <input type="range" min="0" max="90" step="5" value={pieCutout} onChange={(e) => setPieCutout(parseInt(e.target.value))} className="w-full h-8 cursor-pointer accent-yellow-500" />
                            <span className="text-xs text-gray-500">{pieCutout}%</span>
                        </div>
                    )}

                    {(chartType === 'bubble') && (
                        <>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-400">Min Bubble Radius</label>
                                <input type="range" min="1" max="20" step="1" value={bubbleMinRadius} onChange={(e) => setBubbleMinRadius(parseInt(e.target.value))} className="w-full h-8 cursor-pointer accent-yellow-500" />
                                <span className="text-xs text-gray-500">{bubbleMinRadius}px</span>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-400">Max Bubble Radius</label>
                                <input type="range" min="20" max="100" step="5" value={bubbleMaxRadius} onChange={(e) => setBubbleMaxRadius(parseInt(e.target.value))} className="w-full h-8 cursor-pointer accent-yellow-500" />
                                <span className="text-xs text-gray-500">{bubbleMaxRadius}px</span>
                            </div>
                        </>
                    )}

                    {(chartType === 'scatter') && (
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-400">Scatter Point Size</label>
                            <input type="range" min="1" max="15" step="1" value={scatterPointSize} onChange={(e) => setScatterPointSize(parseInt(e.target.value))} className="w-full h-8 cursor-pointer accent-yellow-500" />
                            <span className="text-xs text-gray-500">{scatterPointSize}px</span>
                        </div>
                    )}

                    <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-semibold mb-2 text-gray-400">Chart Notes / Annotations</label>
                        <textarea
                            value={annotationText}
                            onChange={(e) => setAnnotationText(e.target.value)}
                            rows={3}
                            className={`w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'}`}
                            placeholder="Add any important notes or data sources here..."
                        />
                        <p className="text-xs text-gray-500 mt-1">These notes will be displayed below the chart and included in exports.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ChartVisualizationPanel;