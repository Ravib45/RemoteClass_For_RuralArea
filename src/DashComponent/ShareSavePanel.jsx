import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from 'sweetalert2';
import ChartShareSection from "./ChartShareSection";
import {
    Save,
    FolderOpen,
    Download,
    Share2,
    HardDrive,
    Trash2,
    Edit,
    Link,
    Clock,
    PlusCircle,
    Star,
    Sparkles
} from "lucide-react";

const ShareSavePanel = ({
    darkMode,
    handleSaveTemplate,
    handleLoadTemplate,
    savedTemplates,
    saveSettingsAsJSON,
    exportHistory,
    chartData,
    chartOptions,
    handleDeleteTemplate,
    handleExportAsPDF,
    handleExportAsCSV
}) => {
    const [showExportHistory, setShowExportHistory] = useState(false);

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

    const handlePremiumFeatureClick = (featureName) => {
        Swal.fire({
            icon: 'info',
            title: 'Unlock Pro Features!',
            html: `"${featureName}" is an exclusive **Pro** feature.<br>Upgrade your plan to unlock advanced functionalities and supercharge your dashboards!`,
            showCancelButton: true,
            confirmButtonText: 'Learn More',
            cancelButtonText: 'Maybe Later',
            reverseButtons: true,
            customClass: {
                popup: darkMode ? 'dark-mode-swal' : ''
            }
        }).then((result) => {
            if (result.isConfirmed) {
                window.open('/pricing', '_blank');
            }
        });
    };

    const saveTemplateWithFeedback = async () => {
        const { value: templateName } = await Swal.fire({
            title: 'Name Your Dashboard Template',
            input: 'text',
            inputLabel: 'Template Name',
            inputPlaceholder: 'e.g., Q1 Sales Report Layout',
            showCancelButton: true,
            confirmButtonText: 'Save',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please enter a name for your template!';
                }
                if (savedTemplates.some(t => t.name === value)) {
                    return 'A template with this name already exists. Please choose a different name.';
                }
            },
            customClass: {
                popup: darkMode ? 'dark-mode-swal' : ''
            }
        });

        if (templateName) {
            const success = handleSaveTemplate(templateName);
            if (success) {
                Toast.fire({
                    icon: 'success',
                    title: `Template "${templateName}" saved!`
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Save Failed',
                    text: 'Could not save template. Please try again.',
                    customClass: { popup: darkMode ? 'dark-mode-swal' : '' }
                });
            }
        }
    };

    const loadTemplateWithFeedback = async (templateName) => {
        if (!templateName) return;

        const result = await Swal.fire({
            icon: 'question',
            title: 'Load Template?',
            text: `Are you sure you want to load "${templateName}"? This will overwrite current settings.`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Load It',
            cancelButtonText: 'Cancel',
            customClass: { popup: darkMode ? 'dark-mode-swal' : '' }
        });

        if (result.isConfirmed) {
            const success = handleLoadTemplate(templateName);
            if (success) {
                Toast.fire({
                    icon: 'info',
                    title: `Template "${templateName}" loaded.`
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Load Failed',
                    text: 'Could not load template. It might be corrupted or missing.',
                    customClass: { popup: darkMode ? 'dark-mode-swal' : '' }
                });
            }
        }
    };

    const deleteTemplateWithFeedback = async (templateName) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: `You are about to delete the template "${templateName}". This action cannot be undone.`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'No, Keep It',
            customClass: { popup: darkMode ? 'dark-mode-swal' : '' }
        });

        if (result.isConfirmed) {
            const success = handleDeleteTemplate(templateName);
            if (success) {
                Toast.fire({
                    icon: 'success',
                    title: `Template "${templateName}" deleted.`
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Deletion Failed',
                    text: 'Could not delete template. Please try again.',
                    customClass: { popup: darkMode ? 'dark-mode-swal' : '' }
                });
            }
        }
    };

    return (
        <motion.div
            key="share-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`p-6 rounded-2xl ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-white to-gray-50 text-gray-800"} shadow-xl border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 flex items-center justify-center gap-3 text-yellow-400 border-b pb-4 border-yellow-700/50">
                <Share2 size={36} className="text-yellow-500" /> Advanced Sharing & Storage
            </h2>

            {/* Template Management Section */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300`}>
                <h3 className="text-2xl font-bold mb-5 flex items-center gap-3">
                    <Save className="text-indigo-400" size={24} /> Dashboard Templates
                </h3>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-5`}>
                    Save and load your entire dashboard configuration to quickly resume work or share layouts.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={saveTemplateWithFeedback}
                        className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg flex items-center justify-center font-semibold text-lg"
                    >
                        <PlusCircle size={20} className="mr-2" /> Save Current Layout
                    </motion.button>
                </div>

                {savedTemplates && savedTemplates.length > 0 ? (
                    <div className="mt-6">
                        <label htmlFor="load-template-select" className="block mb-3 text-lg font-semibold flex items-center gap-2">
                            <FolderOpen size={20} className="text-blue-400" /> Load Saved Template
                        </label>
                        <div className="relative">
                            <select
                                id="load-template-select"
                                onChange={(e) => loadTemplateWithFeedback(e.target.value)}
                                className={`w-full p-3 pr-10 rounded-lg border appearance-none transition-colors duration-200 text-lg
                                    ${darkMode ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500' : 'bg-gray-100 text-gray-900 border-gray-300 focus:border-blue-500'}`}
                                value=""
                            >
                                <option value="">--- Select a Template ---</option>
                                {savedTemplates.map((template, idx) => (
                                    <option key={idx} value={template.name}>{template.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.096 6.924 4.682 8.338z" /></svg>
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-4 border-dashed ${darkMode ? 'border-gray-700' : 'border-gray-300'}">
                            <h4 className="font-bold mb-3 text-lg flex items-center gap-2">
                                <HardDrive size={18} className="text-green-400" /> Your Saved Templates
                            </h4>
                            <ul className="space-y-3">
                                {savedTemplates.map((template, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                                        className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors duration-200`}
                                    >
                                        <span className="font-medium text-base">
                                            {template.name}
                                            <span className="text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-3">
                                                (Saved: {new Date(template.timestamp).toLocaleDateString()})
                                            </span>
                                        </span>
                                        <div className="flex gap-2">
                                            {/* <button
                                                onClick={() => handleRenameTemplate(template.name)}
                                                className={`p-2 rounded-full ${darkMode ? 'text-blue-400 hover:bg-blue-900' : 'text-blue-600 hover:bg-blue-100'}`}
                                                title="Rename Template"
                                            >
                                                <Edit size={18} />
                                            </button> */}
                                            {handleDeleteTemplate && (
                                                <button
                                                    onClick={() => deleteTemplateWithFeedback(template.name)}
                                                    className={`p-2 rounded-full ${darkMode ? 'text-red-400 hover:bg-red-900' : 'text-red-600 hover:bg-red-100'}`}
                                                    title="Delete Template"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className={`${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"} p-5 rounded-lg text-center`}>
                        <Sparkles size={28} className="mx-auto mb-3 text-yellow-500" />
                        <p className="font-semibold text-lg">No templates saved yet!</p>
                        <p className="text-sm mt-1">Click "Save Current Layout" to get started.</p>
                    </div>
                )}
            </div>

            {/* Export & Download Section */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300`}>
                <h3 className="text-2xl font-bold mb-5 flex items-center gap-3">
                    <Download className="text-teal-400" size={24} /> Export Options
                </h3>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-5`}>
                    Download your chart settings or data in various formats.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={saveSettingsAsJSON}
                        className="flex items-center justify-center bg-teal-600 text-white px-5 py-3 rounded-lg hover:bg-teal-700 transition-all duration-300 shadow font-semibold"
                    >
                        Export Settings (JSON)
                    </motion.button>
                    {/* Premium/Pro Export Options */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleExportAsPDF || (() => handlePremiumFeatureClick("Export as PDF"))}
                        className={`flex items-center justify-center px-5 py-3 rounded-lg transition-all duration-300 shadow font-semibold relative
                            ${handleExportAsPDF ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-gray-400 text-gray-800 cursor-not-allowed'}
                        `}
                    >
                        Export Report (PDF)
                        {!handleExportAsPDF && (
                            <span className="absolute top-1 right-1 bg-yellow-500 text-gray-900 text-[0.6rem] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Star size={10} /> PRO
                            </span>
                        )}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleExportAsCSV || (() => handlePremiumFeatureClick("Export Data as CSV"))}
                        className={`flex items-center justify-center px-5 py-3 rounded-lg transition-all duration-300 shadow font-semibold relative
                            ${handleExportAsCSV ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-gray-400 text-gray-800 cursor-not-allowed'}
                        `}
                    >
                        Export Raw Data (CSV)
                        {!handleExportAsCSV && (
                            <span className="absolute top-1 right-1 bg-yellow-500 text-gray-900 text-[0.6rem] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Star size={10} /> PRO
                            </span>
                        )}
                    </motion.button>
                </div>

                {exportHistory && exportHistory.length > 0 && (
                    <div className="mt-6">
                        <button
                            onClick={() => setShowExportHistory(!showExportHistory)}
                            className={`flex items-center gap-2 text-sm font-semibold mb-3 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-800'}`}
                        >
                            <Clock size={16} /> {showExportHistory ? "Hide" : "Show"} Export History ({exportHistory.length})
                        </button>
                        {showExportHistory && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} overflow-hidden`}
                            >
                                <h4 className="font-bold mb-2">Recent Exports</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                    {exportHistory.map((item, idx) => (
                                        <li key={idx} className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                            <strong>{item.type}</strong> &mdash; {item.filename || 'Untitled'} (<span className="text-xs">{new Date(item.time).toLocaleString()}</span>)
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>

            {/* Share Charts Section - Using ChartShareSection component */}
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg border ${darkMode ? "border-gray-700" : "border-gray-200"} transition-all duration-300`}>
                <h3 className="text-2xl font-bold mb-5 flex items-center gap-3">
                    <Link className="text-purple-400" size={24} /> Share Your Visualizations
                </h3>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-5`}>
                    Effortlessly share individual charts via email or generate unique, shareable web links.
                </p>
                <ChartShareSection
                    darkMode={darkMode}
                    chartData={chartData || { labels: [], datasets: [] }}
                    chartOptions={chartOptions}
                />
            </div>
        </motion.div>
    );
};

export default ShareSavePanel;