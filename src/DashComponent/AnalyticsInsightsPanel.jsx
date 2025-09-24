import React from "react";
import { motion } from "framer-motion";
import {
    Info,
    TrendingUp,
    Zap,
    Columns,
    Target,
    ListChecks,
    Dices,
    BarChart2,
    CheckCircle,
    XCircle,
    HelpCircle,
    Star
} from "lucide-react";
import Swal from 'sweetalert2';

const AnalyticsInsightsPanel = ({
    darkMode,
    excelData,
    xAxis,
    yAxis,
    columns,
    totalRecords,
    topCategory,
    derivedMaxValue,
    derivedMinValue,
    derivedAverageValue, // Retaining this if you plan to use it in dataNarrative or future stats
    dataNarrative,

    whatIfScenarioColumn,
    setWhatIfScenarioColumn,
    whatIfChangeType,
    setWhatIfChangeType,
    whatIfValue,
    setWhatIfValue,
    simulatedResult,
    runWhatIfSimulation,

    compareColumnA,
    setCompareColumnA,
    compareColumnB,
    setCompareColumnB,
    comparisonInsight,
    runColumnComparison,

    runTrendAnalysis,
    runAnomalyDetection,
}) => {
    const isDataReadyForInsights = excelData.length > 0 && xAxis && yAxis;

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
        customClass: {
            popup: darkMode ? 'swal2-toast-dark' : ''
        }
    });

    const handleProFeatureClick = (featureName) => {
        Swal.fire({
            icon: 'info',
            title: 'Unlock Pro Features!',
            html: `**${featureName}** is an exclusive **Pro** feature.<br>Upgrade your plan to unlock advanced functionalities and supercharge your dashboards!`,
            showCancelButton: true,
            confirmButtonText: 'Learn More',
            cancelButtonText: 'Maybe Later',
            reverseButtons: true,
            customClass: {
                popup: darkMode ? 'dark-mode-swal' : ''
            }
        }).then((result) => {
            if (result.isConfirmed) {
                window.open('/pricing', '_blank'); // Redirect to your actual pricing page
            }
        });
    };

    return (
        <motion.div
            key="analytics-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`p-6 rounded-2xl ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-white to-gray-50 text-gray-800"} shadow-xl border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 flex items-center justify-center gap-3 text-cyan-400 border-b pb-4 border-cyan-700/50">
                <Target size={36} className="text-cyan-500" /> Dynamic Analytics & Insights
            </h2>

            {/* Core Metrics & Key Findings */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300`}>
                <h3 className="text-2xl font-bold mb-5 flex items-center gap-3">
                    <Info className="text-yellow-400" size={24} /> Key Metrics & Data Narrative
                </h3>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-5`}>
                    Get a quick overview of your dataset and an automatically generated narrative explaining key findings.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-blue-50 text-blue-800'} border ${darkMode ? 'border-gray-600' : 'border-blue-200'}`}
                    >
                        <h4 className="font-semibold text-md mb-1 text-blue-400">Total Records</h4>
                        <p className="text-3xl font-bold">{totalRecords || 0}</p>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-green-50 text-green-800'} border ${darkMode ? 'border-gray-600' : 'border-green-200'}`}
                    >
                        <h4 className="font-semibold text-md mb-1 text-green-400">Top Category ({xAxis || 'N/A'})</h4>
                        <p className="text-xl font-bold truncate">{topCategory || 'Not Available'}</p>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-yellow-50 text-yellow-800'} border ${darkMode ? 'border-gray-600' : 'border-yellow-200'}`}
                    >
                        <h4 className="font-semibold text-md mb-1 text-yellow-400">Max Value ({yAxis || 'N/A'})</h4>
                        <p className="text-xl font-bold">{derivedMaxValue !== null && derivedMaxValue !== undefined ? derivedMaxValue.toLocaleString() : 'N/A'}</p>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-red-50 text-red-800'} border ${darkMode ? 'border-gray-600' : 'border-red-200'}`}
                    >
                        <h4 className="font-semibold text-md mb-1 text-red-400">Min Value ({yAxis || 'N/A'})</h4>
                        <p className="text-xl font-bold">{derivedMinValue !== null && derivedMinValue !== undefined ? derivedMinValue.toLocaleString() : 'N/A'}</p>
                    </motion.div>
                </div>

                {isDataReadyForInsights && dataNarrative ? (
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border ${darkMode ? 'border-gray-600' : 'border-blue-200'}`}>
                        <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <ListChecks size={20} className="text-indigo-400" /> Insight Summary
                        </h4>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-blue-700'}`} dangerouslySetInnerHTML={{ __html: dataNarrative }}></p>
                    </div>
                ) : (
                    <div className={`${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'} p-4 rounded-lg text-center`}>
                        <HelpCircle size={24} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">To generate key insights, please **select both X-Axis and Y-Axis** in the Chart Builder.</p>
                    </div>
                )}
            </div>

            {/* What-If Scenario Analysis */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300`}>
                <h3 className="text-2xl font-bold mb-5 flex items-center gap-3">
                    <Dices className="text-purple-400" size={24} /> "What-If" Scenario Analysis
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-5`}>
                    Simulate changes to your data to project future outcomes or understand sensitivity. This advanced feature requires a robust data model and backend integration.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <select
                        value={whatIfScenarioColumn}
                        onChange={(e) => setWhatIfScenarioColumn(e.target.value)}
                        className={`p-3 rounded-lg border transition-colors duration-200 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                    >
                        <option value="">Select Column to Modify</option>
                        {columns.map((col, i) => <option key={i}>{col}</option>)}
                    </select>
                    <select
                        value={whatIfChangeType}
                        onChange={(e) => setWhatIfChangeType(e.target.value)}
                        className={`p-3 rounded-lg border transition-colors duration-200 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                    >
                        <option value="">Select Change Type</option>
                        <option value="increase_by_percent">Increase by %</option>
                        <option value="decrease_by_percent">Decrease by %</option>
                        <option value="set_to_value">Set to Absolute Value</option>
                        <option value="multiply_by">Multiply By</option>
                    </select>
                    <input
                        type="number"
                        value={whatIfValue}
                        onChange={(e) => setWhatIfValue(parseFloat(e.target.value))}
                        placeholder="Enter value (e.g., 10 for 10% or 500)"
                        className={`p-3 rounded-lg border w-full transition-colors duration-200 ${darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'}`}
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={runWhatIfSimulation || (() => Toast.fire({ icon: 'warning', title: 'Simulation logic not yet implemented. Please connect to a backend data model.' }))}
                    disabled={!whatIfScenarioColumn || !whatIfChangeType || isNaN(whatIfValue)}
                    className={`mt-4 w-full bg-orange-600 text-white px-5 py-3 rounded-lg hover:bg-orange-700 transition-all duration-200 shadow font-semibold flex items-center justify-center gap-2
                        ${(!whatIfScenarioColumn || !whatIfChangeType || isNaN(whatIfValue)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Zap size={20} /> Run Simulation
                </motion.button>
                {simulatedResult !== null && simulatedResult !== undefined && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'} border ${darkMode ? 'border-gray-600' : 'border-yellow-200'}`}
                    >
                        <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-500" /> Simulated Outcome
                        </h4>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-yellow-800'}`}>
                            {simulatedResult}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Column Comparison & Relationship Analysis */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300`}>
                <h3 className="text-2xl font-bold mb-5 flex items-center gap-3">
                    <Columns className="text-green-400" size={24} /> Column Comparison & Relationships
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-5`}>
                    Analyze the relationships between two selected columns. Ideal for understanding correlations and trends.
                    This feature requires specific backend logic to calculate correlations or other advanced insights.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <select
                        value={compareColumnA}
                        onChange={(e) => setCompareColumnA(e.target.value)}
                        className={`p-3 rounded-lg border transition-colors duration-200 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                    >
                        <option value="">Select Column A</option>
                        {columns.map((col, i) => <option key={i}>{col}</option>)}
                    </select>
                    <select
                        value={compareColumnB}
                        onChange={(e) => setCompareColumnB(e.target.value)}
                        className={`p-3 rounded-lg border transition-colors duration-200 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                    >
                        <option value="">Select Column B</option>
                        {columns.map((col, i) => <option key={i}>{col}</option>)}
                    </select>
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={runColumnComparison || (() => Toast.fire({ icon: 'warning', title: 'Comparison logic not yet implemented. Please select valid columns.' }))}
                    disabled={!compareColumnA || !compareColumnB || compareColumnA === compareColumnB}
                    className={`mt-4 w-full bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow font-semibold flex items-center justify-center gap-2
                        ${(!compareColumnA || !compareColumnB || compareColumnA === compareColumnB) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <BarChart2 size={20} /> Analyze Relationship
                </motion.button>
                {comparisonInsight && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'} border ${darkMode ? 'border-gray-600' : 'border-green-200'}`}
                    >
                        <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-500" /> Comparison Insight
                        </h4>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-green-800'}`}>
                            {comparisonInsight}
                        </p>
                    </motion.div>
                )}
                {compareColumnA && compareColumnB && compareColumnA === compareColumnB && (
                    <p className={`mt-2 text-sm text-red-400 flex items-center gap-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                        <XCircle size={16} /> Please select two different columns to compare.
                    </p>
                )}
            </div>

            {/* Advanced Analysis Tools (Pro Features) */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300`}>
                <h3 className="text-2xl font-bold mb-5 flex items-center gap-3">
                    <TrendingUp className="text-rose-400" size={24} /> Advanced Pro Analytics
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-5`}>
                    Unlock sophisticated analysis tools like **trend forecasting** and **anomaly detection** with our Pro plan.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleProFeatureClick("Trend Analysis")}
                        className={`flex items-center justify-center px-5 py-3 rounded-lg transition-all duration-300 shadow font-semibold relative bg-gray-400 text-gray-800 cursor-not-allowed`}
                    >
                        Forecast Trends <Star size={12} className="ml-2 text-yellow-300" />
                        <span className="absolute top-1 right-1 bg-yellow-500 text-gray-900 text-[0.6rem] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star size={10} /> PRO
                        </span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleProFeatureClick("Anomaly Detection")}
                        className={`flex items-center justify-center px-5 py-3 rounded-lg transition-all duration-300 shadow font-semibold relative bg-gray-400 text-gray-800 cursor-not-allowed`}
                    >
                        Detect Anomalies <Star size={12} className="ml-2 text-yellow-300" />
                        <span className="absolute top-1 right-1 bg-yellow-500 text-gray-900 text-[0.6rem] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star size={10} /> PRO
                        </span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default AnalyticsInsightsPanel;