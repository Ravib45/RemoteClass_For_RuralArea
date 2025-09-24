import React from "react"; // Only React is needed here
import { Bar, Line, Pie } from "react-chartjs-2"; // Keep these for rendering different chart types
import Swal from 'sweetalert2'; // Keep if used for alerts

import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import ChartShareSection from "../DashComponent/ChartShareSection.jsx";
import DataTable from "../DashComponent/DataTable.jsx";
import AIChartRecommendation from "../DashComponent/AIChartRecommendation";
import ShareSavePanel from "../DashComponent/ShareSavePanel.jsx";
import DashboardSettingsPanel from "../DashComponent/DashboardSettingsPanel.jsx";
import AnalyticsInsightsPanel from "../DashComponent/AnalyticsInsightsPanel.jsx";
import ChartVisualizationPanel from "../DashComponent/ChartVisualizationPanel.jsx";
import Header from "../HeaderDash/Header.jsx"
import useDashboardLogic from "../hooks/useDashboardLogic";
import RecentFilesPanel from "../DashComponent/RecentFilesPanel";


import {
    X, UserCircle, Sun, Moon, Upload, Settings, BarChart, FileText,
    Share2, LayoutDashboard, Bookmark, GitCompare, XCircle, Menu, Info, Lightbulb, LogOut,
    ExternalLink
} from "lucide-react";

// Chart.js registrations - these are global and should be done once
// You could also move this registration into your main App.js or index.js if preferred,
// but keeping it here is fine if Dashboard is the primary place charts are used.
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const Dashboard = () => {

    // ✅ Destructure all states, refs, derived data, and functions from your custom hook
    const {
        excelData, setExcelData,
        columns, setColumns,
        xAxis, setXAxis,
        yAxis, setYAxis,
        chartType, setChartType,
        chartTitle, setChartTitle,
        chartSubtitle, setChartSubtitle,
        filename, setFilename,
        darkMode, setDarkMode,
        searchTerm, setSearchTerm,
        enableAnimation, setEnableAnimation,
        sheetNames, setSheetNames,
        selectedSheet, setSelectedSheet,
        sortConfig, setSortConfig,
        recentFiles, setRecentFiles,
        loading, setLoading,
        activeTab, setActiveTab,
        isSidebarOpen, setIsSidebarOpen,
        minValue, setMinValue,
        maxValue, setMaxValue,
        chartColor, setChartColor,
        annotationText, setAnnotationText,
        lineTension, setLineTension,
        pointRadius, setPointRadius,
        user, setUser,
        showLogin, setShowLogin,
        loginName, setLoginName,
        compareX1, setCompareX1,
        compareX2, setCompareX2,
        exportHistory, setExportHistory,
        autoRefresh, setAutoRefresh,
        voiceResult, setVoiceResult,
        savedTemplates, setSavedTemplates,
        shareEmail, setShareEmail,
        recommendedChart, setRecommendedChart,
        density, setDensity,
        whatIfScenario, setWhatIfScenario,
        whatIfValue, setWhatIfValue,
        dateFilterStart, setDateFilterStart,
        dateFilterEnd, setDateFilterEnd,
        // Refs
        mountRef, chartAreaRef, fileInputRef, chartRef,
        // Top N states
        topN, setTopN,
        customTopN, setCustomTopN,
        // Derived data/callbacks
        filteredData, // Used by DataTable and AnalyticsInsightsPanel
        sortedData, // Used by DataTable
        chartData, // The full chart data (before Top N)
        topNChartData, // ✅ The chart data after Top N filtering (use for rendering)
        chartOptions,
        topCategory,
        derivedMaxValue,
        dataNarrative,
        // Functions
        handleExportPDF, // For raw excel data PDF export
        handleFileUpload,
        handleSheetChange,
        exportAsCSV,
        exportAsPDF, // For chart PDF export
        exportAsPNG,
        resetDashboard,
        handleLogin,
        handleLogout,
        handleSaveTemplate,
        handleLoadTemplate,
        handleShareEmail,
        saveSettingsAsJSON,
        getTableDensityClass,
        getTablePaddingClass,
    } = useDashboardLogic();

    return (
        <div className={`min-h-screen flex relative overflow-hidden ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-black'} font-sans
                         md:grid md:grid-cols-[16rem_1fr]`}>
            {/* Three.js Background Canvas - Managed by hook, just provide the ref */}
            <div ref={mountRef} className="absolute inset-0 z-0 opacity-10"></div>

            {/* Auth Popup */}
            <AnimatePresence>
                {
                    !user && showLogin && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 flex justify-center items-center bg-black/70 z-50 p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className={`p-8 rounded-xl w-full max-w-sm shadow-2xl relative ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                            >
                                <button
                                    onClick={() => setShowLogin(false)}
                                    className={`absolute top-3 right-3 p-1 rounded-full ${darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
                                    aria-label="Close Login"
                                >
                                    <XCircle size={24} />
                                </button>
                                <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">Welcome!</h2>
                                <p className={`text-center mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Please enter your name to continue.</p>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className={`w-full mb-5 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                    onChange={(e) => setLoginName(e.target.value)}
                                    autoFocus
                                    required
                                />
                                <button
                                    onClick={handleLogin}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                                >Login</button>
                            </motion.div>
                        </motion.div>
                    )
                }
            </AnimatePresence>

            {/* Sidebar Component */}
            <Sidebar
                darkMode={darkMode}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                resetDashboard={resetDashboard}
                user={user}
                setUser={setUser}
                setShowLogin={setShowLogin}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col z-10">
                {/* Header Component */}
                <Header
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    user={user}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    fileInputRef={fileInputRef}
                    handleFileUpload={handleFileUpload}
                    sheetNames={sheetNames}
                    handleSheetChange={handleSheetChange}
                    selectedSheet={selectedSheet}
                    filename={filename}
                />

                {/* Main Content Area */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto relative z-10">
                    <AnimatePresence mode='wait'>
                        {activeTab === "chart" && (
                            <ChartVisualizationPanel
                                key="chart-tab"
                                activeTab={activeTab}
                                chartTitle={chartTitle}
                                setChartTitle={setChartTitle}
                                chartSubtitle={chartSubtitle}
                                setChartSubtitle={setChartSubtitle}
                                xAxis={xAxis}
                                setXAxis={setXAxis}
                                yAxis={yAxis}
                                setYAxis={setYAxis}
                                columns={columns}
                                chartType={chartType}
                                setChartType={setChartType}
                                chartData={topNChartData} //This should be the data to render 
                                topN={topN}
                                setTopN={setTopN}
                                customTopN={customTopN}
                                setCustomTopN={setCustomTopN}
                                chartAreaRef={chartAreaRef}
                                chartOptions={chartOptions}
                                exportAsCSV={exportAsCSV}
                                exportAsPDF={exportAsPDF}
                                exportAsPNG={exportAsPNG}
                                chartColor={chartColor}
                                setChartColor={setChartColor}
                                lineTension={lineTension}
                                setLineTension={setLineTension}
                                pointRadius={pointRadius}
                                setPointRadius={setPointRadius}
                                annotationText={annotationText}
                                setAnnotationText={setAnnotationText}
                                darkMode={darkMode}
                            />
                        )}

                        {activeTab === "data" && (
                            <motion.div
                                key="data-tab"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-yellow-400 border-b pb-3 border-yellow-700/50">
                                    📋 Raw Data Table
                                </h2>
                                <DataTable
                                    darkMode={darkMode}
                                    density={density}
                                    setDensity={setDensity}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    columns={columns}
                                    sortedData={sortedData} // ✅ Use sortedData from hook
                                    loading={loading}
                                    excelData={excelData}
                                    sortConfig={sortConfig}
                                    setSortConfig={setSortConfig}
                                />
                            </motion.div>
                        )}

                        {activeTab === "analytics" && (
                            <AnalyticsInsightsPanel
                                key="analytics-tab" // Key for AnimatePresence
                                darkMode={darkMode}
                                excelData={excelData}
                                xAxis={xAxis}
                                yAxis={yAxis}
                                topCategory={topCategory} // ✅ Use derived value from hook
                                derivedMaxValue={derivedMaxValue} // ✅ Use derived value from hook
                                dataNarrative={dataNarrative} // ✅ Use derived value from hook
                                whatIfScenario={whatIfScenario}
                                setWhatIfScenario={setWhatIfScenario}
                                whatIfValue={whatIfValue}
                                setWhatIfValue={setWhatIfValue}
                                columns={columns}
                                compareX1={compareX1}
                                setCompareX1={setCompareX1}
                                compareX2={compareX2}
                                setCompareX2={setCompareX2}
                            />
                        )}

                        {activeTab === "settings" && (
                            <DashboardSettingsPanel
                                key="settings-tab" // Key for AnimatePresence
                                darkMode={darkMode}
                                enableAnimation={enableAnimation}
                                setEnableAnimation={setEnableAnimation}
                                autoRefresh={autoRefresh}
                                setAutoRefresh={setAutoRefresh}
                                yAxis={yAxis}
                                minValue={minValue}
                                setMinValue={setMinValue}
                                maxValue={maxValue}
                                setMaxValue={setMaxValue}
                                dateFilterStart={dateFilterStart}
                                setDateFilterStart={setDateFilterStart}
                                dateFilterEnd={dateFilterEnd}
                                setDateFilterEnd={setDateFilterEnd}
                            />
                        )}

                        {activeTab === "share" && (
                            <ShareSavePanel
                                key="share-tab" // Key for AnimatePresence
                                darkMode={darkMode}
                                handleSaveTemplate={handleSaveTemplate}
                                handleLoadTemplate={handleLoadTemplate}
                                savedTemplates={savedTemplates}
                                saveSettingsAsJSON={saveSettingsAsJSON}
                                exportHistory={exportHistory}
                                chartData={chartData} // Pass the full chartData if needed for some share features
                                chartOptions={chartOptions}
                                shareEmail={shareEmail} // Pass shareEmail state
                                setShareEmail={setShareEmail} // Pass setter for shareEmail
                                handleShareEmail={handleShareEmail} // Pass share email function
                                handleExportPDF={handleExportPDF} // Pass raw data PDF export
                                exportAsCSV={exportAsCSV} // Pass CSV export
                                exportAsPDF={exportAsPDF} // Pass chart PDF export
                                exportAsPNG={exportAsPNG} // Pass PNG export
                            />
                        )}

                        {activeTab === "recent" && (
                            <RecentFilesPanel
                                recentFiles={recentFiles}
                                setRecentFiles={setRecentFiles}
                                setExcelData={setExcelData}
                                setColumns={setColumns}
                                setFilename={setFilename}
                                setActiveTab={setActiveTab}
                                darkMode={darkMode}
                            />
                        )}


                    </AnimatePresence>

                    {/* AI Chart Recommendation */}
                    <AIChartRecommendation
                        recommendedChart={recommendedChart}
                        setRecommendedChart={setRecommendedChart}
                        xAxis={xAxis}
                        yAxis={yAxis}
                        filteredData={filteredData}
                        darkMode={darkMode}
                    />

                    {/* Loading Spinner */}
                    {
                        loading && (
                            <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
                                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-yellow-400"></div>
                            </div>
                        )
                    }
                    {/* <VoiceChartAssistant setChartType={setChartType} /> */}

                    {/* Footer */}
                    <footer className={`text-center text-xs mt-12 py-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Excel Analytics • Built by Ravi using React + Tailwind + Chart.js • AI-Powered Insights
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;