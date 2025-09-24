// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//     Bar,
//     Line,
//     Pie,
//     Doughnut,
//     Radar,
//     PolarArea,
//     Bubble,
//     Scatter,
// } from "react-chartjs-2";
// import { motion } from "framer-motion";

// const ChartContainer = ({
//     chartType,
//     setChartType,
//     xAxis,
//     yAxis,
//     setXAxis,
//     setYAxis,
//     columns,
//     filteredData,
//     darkMode,
//     chartTitle,
//     setChartTitle,
//     chartSubtitle,
//     setChartSubtitle,
//     annotationText,
// }) => {
//     const chartRef = useRef(null);
//     const chartAreaRef = useRef(null);
//     const [topN, setTopN] = useState("20");
//     const [customTopN, setCustomTopN] = useState("");
//     const [chartColor, setChartColor] = useState("#facc15");
//     const [pointRadius] = useState(4);
//     const [lineTension] = useState(0.4);
//     const [enableAnimation] = useState(true);

//     const generateChartData = useCallback(() => {
//         if (!xAxis || !yAxis || filteredData.length === 0) return null;
//         const grouped = {};
//         filteredData.forEach((row) => {
//             const x = row[xAxis];
//             const y = parseFloat(row[yAxis]);
//             if (x !== undefined && x !== null && !isNaN(y)) {
//                 if (!grouped[x]) grouped[x] = 0;
//                 grouped[x] += y;
//             }
//         });
//         const labels = Object.keys(grouped);
//         const data = Object.values(grouped);
//         return {
//             labels,
//             datasets: [
//                 {
//                     label: `${yAxis} by ${xAxis}`,
//                     data,
//                     backgroundColor:
//                         chartType === "pie"
//                             ? labels.map((_, i) => `hsl(${(i * 50) % 360}, 70%, 60%)`)
//                             : chartColor,
//                     borderColor: darkMode ? "#333" : "#fff",
//                     borderWidth: 1,
//                     hoverBackgroundColor:
//                         chartType === "pie"
//                             ? labels.map((_, i) => `hsl(${(i * 50) % 360}, 85%, 70%)`)
//                             : chartColor + "AA",
//                     pointRadius: chartType === "line" ? pointRadius : 0,
//                     pointHoverRadius: chartType === "line" ? pointRadius + 2 : 0,
//                     tension: chartType === "line" ? lineTension : 0,
//                 },
//             ],
//         };
//     }, [xAxis, yAxis, filteredData, chartType, chartColor, darkMode, lineTension, pointRadius]);

//     const getTopNChartData = (data, topN) => {
//         const N = parseInt(topN);
//         return {
//             ...data,
//             labels: data.labels.slice(0, N),
//             datasets: data.datasets.map((ds) => ({
//                 ...ds,
//                 data: ds.data.slice(0, N),
//             })),
//         };
//     };

//     useEffect(() => {
//         if (!chartRef.current) return;
//         const ctx = chartRef.current.getContext("2d");
//         const gradient = ctx.createLinearGradient(0, 0, 0, 400);
//         gradient.addColorStop(0, "#facc15");
//         gradient.addColorStop(1, "#f59e0b");
//         setChartColor(gradient);
//     }, []);

//     const chartData = generateChartData();
//     if (!chartData) return null;

//     const chartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         animation: enableAnimation
//             ? { duration: 1200, easing: "easeInOutQuart" }
//             : false,
//         interaction: { mode: "nearest", axis: "xy", intersect: false },
//         plugins: {
//             legend: {
//                 position: "top",
//                 labels: {
//                     color: darkMode ? "#ddd" : "#222",
//                     usePointStyle: true,
//                     pointStyle: "circle",
//                     font: { size: 14, weight: "600", family: "Inter" },
//                 },
//             },
//             title: {
//                 display: !!chartTitle,
//                 text: chartTitle,
//                 color: darkMode ? "#f5f5f5" : "#111",
//                 font: { size: 22, weight: "bold" },
//             },
//             subtitle: {
//                 display: !!chartSubtitle,
//                 text: chartSubtitle,
//                 color: darkMode ? "#aaa" : "#444",
//                 font: { size: 16, style: "italic" },
//             },
//             tooltip: {
//                 backgroundColor: darkMode ? "#1f1f1f" : "#fff",
//                 borderColor: "#ccc",
//                 borderWidth: 1,
//                 titleColor: darkMode ? "#fff" : "#000",
//                 bodyColor: darkMode ? "#ddd" : "#333",
//                 usePointStyle: true,
//                 padding: 12,
//             },
//         },
//         scales:
//             chartType === "pie"
//                 ? {}
//                 : {
//                     x: {
//                         grid: { color: darkMode ? "#444" : "#ddd", borderDash: [6, 4] },
//                         ticks: { color: darkMode ? "#ccc" : "#333", font: { size: 13 } },
//                         title: {
//                             display: true,
//                             text: xAxis || "X-Axis",
//                             color: darkMode ? "#aaa" : "#444",
//                             font: { size: 14, weight: "600" },
//                         },
//                     },
//                     y: {
//                         grid: { color: darkMode ? "#444" : "#ddd", borderDash: [6, 4] },
//                         ticks: { color: darkMode ? "#ccc" : "#333", font: { size: 13 } },
//                         title: {
//                             display: true,
//                             text: yAxis || "Y-Axis",
//                             color: darkMode ? "#aaa" : "#444",
//                             font: { size: 14, weight: "600" },
//                         },
//                     },
//                 },
//         elements: {
//             line: {
//                 tension: lineTension,
//                 borderWidth: 3,
//                 borderColor: chartColor,
//                 backgroundColor: chartColor,
//             },
//             point: {
//                 radius: pointRadius,
//                 backgroundColor: chartColor,
//                 hoverRadius: 6,
//                 hoverBorderColor: "#fff",
//             },
//             bar: {
//                 backgroundColor: chartColor,
//                 borderRadius: 6,
//                 borderSkipped: false,
//             },
//         },
//     };

//     const renderChart = () => {
//         const data = getTopNChartData(chartData, topN);
//         const props = { data, options: chartOptions };
//         switch (chartType.toLowerCase()) {
//             case "bar": return <Bar {...props} />;
//             case "line": return <Line {...props} />;
//             case "pie": return <Pie {...props} />;
//             case "doughnut": return <Doughnut {...props} />;
//             case "radar": return <Radar {...props} />;
//             case "polararea": return <PolarArea {...props} />;
//             case "bubble": return <Bubble {...props} />;
//             case "scatter": return <Scatter {...props} />;
//             default: return <p className="text-center text-red-500">Chart type not supported</p>;
//         }
//     };

//     return (
//         <div>
//             {/* 🔤 Inputs */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                 <input type="text" value={chartTitle} onChange={(e) => setChartTitle(e.target.value)} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} placeholder="Chart Title" />
//                 <input type="text" value={chartSubtitle} onChange={(e) => setChartSubtitle(e.target.value)} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} placeholder="Chart Subtitle" />
//                 <select value={xAxis} onChange={(e) => setXAxis(e.target.value)} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}>
//                     <option value="">Select X-Axis</option>
//                     {columns.map((col, i) => <option key={i}>{col}</option>)}
//                 </select>
//                 <select value={yAxis} onChange={(e) => setYAxis(e.target.value)} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}>
//                     <option value="">Select Y-Axis</option>
//                     {columns.map((col, i) => <option key={i}>{col}</option>)}
//                 </select>
//             </div>

//             {/* 🔘 Chart Type Buttons */}
//             <div className="flex flex-wrap gap-3 mb-6">
//                 {["bar", "line", "pie", "doughnut", "radar", "polararea", "bubble", "scatter"].map((type) => (
//                     <button key={type} onClick={() => setChartType(type)} className={`px-4 py-2 rounded-lg shadow-md font-medium ${chartType === type ? 'bg-yellow-400 text-black' : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}>{type.toUpperCase()}</button>
//                 ))}
//             </div>

//             {/* 🔽 Filters */}
//             <div className="flex flex-wrap justify-end gap-4 mb-6">
//                 <div>
//                     <label className="text-sm font-semibold text-white block mb-1">Show Top</label>
//                     <select value={topN} onChange={(e) => setTopN(Number(e.target.value))} className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 shadow-md text-sm focus:ring-2 focus:ring-yellow-500">
//                         <option value="10">Top 10</option>
//                         <option value="20">Top 20</option>
//                         <option value={chartData?.labels?.length || 1000}>All</option>
//                     </select>
//                 </div>
//                 <div>
//                     <label className="text-sm font-semibold text-white block mb-1">Custom</label>
//                     <input type="number" min="1" max={chartData?.labels?.length || 1000} value={customTopN} onChange={(e) => {
//                         const input = e.target.value;
//                         const value = parseInt(input);
//                         if (input === "") return setCustomTopN("");
//                         if (!isNaN(value)) {
//                             setTopN(value);
//                             setCustomTopN(value);
//                         }
//                     }} onBlur={() => { if (customTopN === "") setCustomTopN(topN); }} placeholder="Enter number" className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 shadow-md text-sm focus:ring-2 focus:ring-yellow-500" />
//                 </div>
//             </div>

//             {/* 📊 Chart Area */}
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.95, y: 30 }}
//                 animate={{ opacity: 1, scale: 1, y: 0 }}
//                 transition={{ duration: 0.6, ease: "easeOut" }}
//                 ref={chartAreaRef}
//                 className={`relative w-full h-[300px] md:h-[450px] rounded-xl p-4 shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex items-center justify-center`}
//             >
//                 {renderChart()}
//                 {annotationText && (
//                     <p className="absolute bottom-2 text-center text-xs text-gray-400 italic w-full px-4">{annotationText}</p>
//                 )}
//             </motion.div>

//             <canvas ref={chartRef} style={{ display: 'none' }} />
//         </div>
//     );
// };

// export default ChartContainer;
