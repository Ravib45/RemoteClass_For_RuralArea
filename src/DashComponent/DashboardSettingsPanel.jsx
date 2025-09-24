import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Sun, Moon, Monitor, LineChart, RefreshCw, Sliders, Calendar,
    Download, Upload, Save, XCircle, Settings, Info, Bell
} from "lucide-react"; // Assuming you have lucide-react installed

const DashboardSettingsPanel = ({
    darkMode, // This prop now represents the current theme, not just dark mode
    setTheme, // New prop to set theme ('light', 'dark', 'system')
    enableAnimation,
    setEnableAnimation,
    autoRefresh,
    setAutoRefresh,
    autoRefreshInterval, // New prop for refresh interval
    setAutoRefreshInterval, // New prop setter for refresh interval
    yAxis, // Assumed to be the current Y-axis label
    minValue,
    setMinValue,
    maxValue,
    setMaxValue,
    dateFilterStart,
    setDateFilterStart,
    dateFilterEnd,
    setDateFilterEnd,
    dataPointLimit, // New prop for limiting data points
    setDataPointLimit, // New prop setter for limiting data points
    onResetSettings, // Function to call when resetting settings
    onExportSettings, // Function to call for exporting settings
    onImportSettings, // Function to call for importing settings
}) => {
    const [showExportImportConfirmation, setShowExportImportConfirmation] = useState(false);
    const [importFile, setImportFile] = useState(null);

    const handleImportFileChange = (e) => {
        if (e.target.files.length > 0) {
            setImportFile(e.target.files[0]);
        } else {
            setImportFile(null);
        }
    };

    const handleImportClick = () => {
        if (importFile) {
            onImportSettings(importFile);
            setImportFile(null); // Clear file input after import
            setShowExportImportConfirmation(false);
        }
    };

    return (
        <motion.div
            key="settings-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`p-6 rounded-xl ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
        >
            <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-yellow-400 border-b pb-4 border-yellow-700/50">
                <Settings size={32} /> Dashboard Preferences
            </h2>

            {/* General Settings */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="text-xl md:text-2xl font-bold mb-5 flex items-center gap-2">
                    <Sliders size={22} className="text-yellow-500" /> General
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Theme Selector */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                            <Sun size={16} /> Theme:
                        </label>
                        <div className="flex items-center space-x-3">
                            {['light', 'dark', 'system'].map((themeOption) => (
                                <button
                                    key={themeOption}
                                    onClick={() => setTheme(themeOption)}
                                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                        ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                                        ${darkMode && themeOption === darkMode ? 'bg-yellow-600 text-white shadow-md' :
                                            !darkMode && themeOption === 'light' ? 'bg-yellow-500 text-white shadow-md' :
                                                'bg-transparent'
                                        }`}
                                >
                                    {themeOption === 'light' && <Sun size={18} className="mr-2" />}
                                    {themeOption === 'dark' && <Moon size={18} className="mr-2" />}
                                    {themeOption === 'system' && <Monitor size={18} className="mr-2" />}
                                    {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Enable Animation */}
                    <div>
                        <label htmlFor="animation-toggle" className="block text-sm font-medium mb-2 flex items-center gap-1">
                            <LineChart size={16} /> Chart Animation:
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer group">
                            <input
                                id="animation-toggle"
                                type="checkbox"
                                className="sr-only peer"
                                checked={enableAnimation}
                                onChange={() => setEnableAnimation(!enableAnimation)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
                            <span className={`ml-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'} group-hover:text-yellow-500 transition-colors`}>
                                {enableAnimation ? 'Enabled' : 'Disabled'}
                            </span>
                            <Info size={14} className="ml-2 text-gray-400 cursor-help" title="Toggle smooth transitions for charts." />
                        </label>
                    </div>

                    {/* Auto Refresh */}
                    <div>
                        <label htmlFor="refresh-toggle" className="block text-sm font-medium mb-2 flex items-center gap-1">
                            <RefreshCw size={16} /> Auto Refresh Data:
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer group">
                            <input
                                id="refresh-toggle"
                                type="checkbox"
                                className="sr-only peer"
                                checked={autoRefresh}
                                onChange={() => setAutoRefresh(!autoRefresh)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
                            <span className={`ml-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'} group-hover:text-yellow-500 transition-colors`}>
                                {autoRefresh ? 'Enabled' : 'Disabled'}
                            </span>
                        </label>
                        {autoRefresh && (
                            <div className="mt-2">
                                <label htmlFor="refresh-interval" className="block text-xs font-medium text-gray-500 mb-1">Interval (seconds):</label>
                                <input
                                    id="refresh-interval"
                                    type="number"
                                    min="5"
                                    step="5"
                                    value={autoRefreshInterval}
                                    onChange={(e) => setAutoRefreshInterval(Math.max(5, parseInt(e.target.value) || 30))}
                                    className={`p-2 rounded-lg border w-24 text-sm
                                        ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}
                                        focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                />
                            </div>
                        )}
                    </div>

                    {/* Data Point Limit */}
                    <div>
                        <label htmlFor="data-limit" className="block text-sm font-medium mb-2 flex items-center gap-1">
                            <Sliders size={16} /> Data Points Limit:
                        </label>
                        <input
                            id="data-limit"
                            type="number"
                            min="10"
                            step="10"
                            value={dataPointLimit}
                            onChange={(e) => setDataPointLimit(Math.max(10, parseInt(e.target.value) || 100))}
                            placeholder="e.g., 100"
                            className={`p-3 rounded-lg border w-full transition-colors duration-200
                                ${darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'}
                                focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Limits the number of data points displayed on charts to improve performance.
                        </p>
                    </div>
                </div>
            </div>

            {/* Data Filtering & Input */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="text-xl md:text-2xl font-bold mb-5 flex items-center gap-2">
                    <Sliders size={22} className="text-yellow-500" /> Data Filtering
                </h3>

                {/* Range filter */}
                {yAxis && (
                    <div className="mb-6 p-4 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}">
                        <label className="block text-base font-semibold mb-3 flex items-center gap-2">
                            Filter <span className="text-yellow-500 font-bold">{yAxis}</span> Range
                            <Info size={14} className="text-gray-400 cursor-help" title={`Adjust the visible range for the '${yAxis}' axis.`} />
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="min-value" className="block text-sm font-medium mb-1">Min Value:</label>
                                <input
                                    id="min-value"
                                    type="number"
                                    value={minValue}
                                    onChange={(e) => setMinValue(e.target.value)}
                                    placeholder="e.g., 0"
                                    className={`p-3 rounded-lg border w-full transition-colors duration-200
                                        ${darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'}
                                        focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                />
                            </div>
                            <div>
                                <label htmlFor="max-value" className="block text-sm font-medium mb-1">Max Value:</label>
                                <input
                                    id="max-value"
                                    type="number"
                                    value={maxValue}
                                    onChange={(e) => setMaxValue(e.target.value)}
                                    placeholder="e.g., 100"
                                    className={`p-3 rounded-lg border w-full transition-colors duration-200
                                        ${darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'}
                                        focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Date filter */}
                <div className="p-4 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}">
                    <label className="block text-base font-semibold mb-3 flex items-center gap-2">
                        <Calendar size={18} /> Filter by Date Range (Conceptual)
                        <Info size={14} className="text-gray-400 cursor-help" title="Applies a filter based on a 'Date' column in your dataset." />
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="start-date" className="block text-sm font-medium mb-1">Start Date:</label>
                            <input
                                id="start-date"
                                type="date"
                                value={dateFilterStart}
                                onChange={(e) => setDateFilterStart(e.target.value)}
                                className={`p-3 rounded-lg border w-full transition-colors duration-200
                                    ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}
                                    focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                aria-label="Start date filter"
                            />
                        </div>
                        <div>
                            <label htmlFor="end-date" className="block text-sm font-medium mb-1">End Date:</label>
                            <input
                                id="end-date"
                                type="date"
                                value={dateFilterEnd}
                                onChange={(e) => setDateFilterEnd(e.target.value)}
                                className={`p-3 rounded-lg border w-full transition-colors duration-200
                                    ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}
                                    focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                aria-label="End date filter"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        This filter is conceptual and assumes a 'Date' column exists and is parsable within your data.
                    </p>
                </div>
            </div>

            {/* Actions Section (Reset, Export, Import) */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="text-xl md:text-2xl font-bold mb-5 flex items-center gap-2">
                    <Save size={22} className="text-yellow-500" /> Manage Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Reset Settings */}
                    <button
                        onClick={onResetSettings}
                        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-300
                            ${darkMode ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}
                            focus:outline-none focus:ring-2 focus:ring-red-400`}
                    >
                        <XCircle size={20} /> Reset All Settings
                    </button>

                    {/* Export Settings */}
                    <button
                        onClick={onExportSettings}
                        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-300
                            ${darkMode ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}
                            focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    >
                        <Download size={20} /> Export Settings
                    </button>

                    {/* Import Settings */}
                    <div className="relative">
                        <input
                            type="file"
                            id="import-settings-file"
                            className="sr-only"
                            accept=".json"
                            onChange={handleImportFileChange}
                        />
                        <label
                            htmlFor="import-settings-file"
                            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300
                                ${darkMode ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}
                                focus:outline-none focus:ring-2 focus:ring-green-400`}
                        >
                            <Upload size={20} /> Import Settings
                        </label>
                        {importFile && (
                            <div className={`mt-2 p-3 text-sm rounded-lg flex items-center justify-between gap-2
                                ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                                <span>File selected: **{importFile.name}**</span>
                                <button
                                    onClick={handleImportClick}
                                    className={`px-3 py-1 rounded-md text-xs font-semibold
                                        ${darkMode ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
                                >
                                    Confirm Import
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Conceptual Info Section */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
                    <Info size={22} className="text-blue-500" /> Information & Tips
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed`}>
                    This panel allows you to customize your dashboard experience. Adjust animation settings for visual preference,
                    configure auto-refresh for real-time data updates, and fine-tune data filters for precise analysis.
                    Remember to export your settings to easily transfer them between devices or sessions!
                </p>
                <ul className={`list-disc list-inside mt-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li className="mb-2 flex items-start gap-2">
                        <Bell size={16} className="mt-1 text-yellow-500 flex-shrink-0" />
                        **Auto Refresh:** Setting a lower interval (e.g., 5 seconds) can increase server load. Use wisely!
                    </li>
                    <li className="flex items-start gap-2">
                        <Info size={16} className="mt-1 text-blue-500 flex-shrink-0" />
                        **Data Filters:** These inputs directly influence the data displayed on your charts. Empty values remove the filter.
                    </li>
                </ul>
            </div>
        </motion.div>
    );
};

export default DashboardSettingsPanel;