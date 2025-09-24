import React, { useState, useRef } from "react";
import {
    FileSpreadsheet,
    FileText,
    Trash2,
    XCircle,
    Loader2,
    Edit,
    Pin,
    PinOff,
    Search,
    Info,
    Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2';

// Assuming XLSX is globally available or imported in your parent component
const XLSX = window.XLSX || {}; // Fallback if not globally available

// Helper to format file size
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getFileIcon = (filename) => {
    if (filename.endsWith(".csv")) return <FileText size={20} className="text-emerald-500 flex-shrink-0" />;
    if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) return <FileSpreadsheet size={20} className="text-sky-500 flex-shrink-0" />;
    return <FileText size={20} className="text-gray-500 flex-shrink-0" />;
};

const RecentFilesPanel = ({
    recentFiles = [],
    setRecentFiles,
    setExcelData,
    setColumns,
    filename, // Current active filename (for highlighting)
    setFilename,
    setActiveTab,
    darkMode = false
}) => {
    const [loadingFile, setLoadingFile] = useState(null);
    const [editingFileName, setEditingFileName] = useState(null); // State for inline editing
    const [searchTerm, setSearchTerm] = useState(""); // State for search functionality
    const [infoPopover, setInfoPopover] = useState(null); // For info popover: { file, position }
    const infoIconRef = useRef(null); // Ref for positioning info popover

    // Filter recent files based on search term
    const filteredFiles = recentFiles.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        // Sort: Pinned files first, then by date (most recent first)
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const handleLoadRecentFile = (file, tabToActivate = "data") => {
        setLoadingFile(file.name);
        setInfoPopover(null); // Close any open popovers
        const savedData = localStorage.getItem(file.name);

        setTimeout(() => { // Simulate network/processing delay for visual effect
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    setExcelData(parsed.data);
                    setColumns(parsed.columns);
                    setFilename(file.name); // Set the current active filename
                    setActiveTab(tabToActivate);
                } catch (error) {
                    console.error("Error parsing saved data for file:", file.name, error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Data Corrupted!',
                        text: `Error loading data for "${file.name}". The saved data might be corrupted.`,
                        showCancelButton: true,
                        confirmButtonText: 'Remove from list',
                        cancelButtonText: 'Keep it'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            handleRemoveFile(file.name);
                        }
                    });
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'File Not Found',
                    text: `Data for "${file.name}" is not available in your browser's storage. It might have been cleared or never saved.`,
                    showCancelButton: true,
                    confirmButtonText: 'Remove from list',
                    cancelButtonText: 'Keep it'
                }).then((result) => {
                    if (result.isConfirmed) {
                        handleRemoveFile(file.name);
                    }
                });
            }
            setLoadingFile(null);
        }, 300);
    };

    const handleRemoveFile = async (fileNameToRemove) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Confirm Removal',
            text: `Are you sure you want to remove "${fileNameToRemove}" from recent files? This will also delete its saved data from your browser.`,
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        });

        if (!result.isConfirmed) return;

        localStorage.removeItem(fileNameToRemove);
        const updatedRecentFiles = recentFiles.filter(file => file.name !== fileNameToRemove);
        setRecentFiles(updatedRecentFiles);
        localStorage.setItem("recentFiles", JSON.stringify(updatedRecentFiles));

        if (filename === fileNameToRemove) {
            setExcelData([]);
            setColumns([]);
            setFilename(null);
        }

        Swal.fire({
            icon: 'success',
            title: 'Removed!',
            text: `"${fileNameToRemove}" has been removed.`,
            timer: 2000,
            showConfirmButton: false
        });
    };

    const clearAllRecentFiles = async () => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Clear All Recent Files?',
            text: "Are you sure you want to clear ALL recent files? This will delete all saved file data from your browser's storage permanently.",
            showCancelButton: true,
            confirmButtonText: 'Yes, clear all!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            dangerMode: true,
        });

        if (!result.isConfirmed) return;

        recentFiles.forEach(file => localStorage.removeItem(file.name));
        setRecentFiles([]);
        localStorage.removeItem("recentFiles");

        setExcelData([]);
        setColumns([]);
        setFilename(null);

        Swal.fire({
            icon: 'success',
            title: 'All Cleared!',
            text: 'All recent files have been removed from your storage.',
            timer: 2000,
            showConfirmButton: false
        });
    };

    // --- New Feature Functions ---

    // 1. File Renaming
    const handleRenameFile = async (oldName, newName) => {
        if (!newName || newName.trim() === '' || newName === oldName) {
            setEditingFileName(null);
            return;
        }

        const trimmedNewName = newName.trim();

        // Check for duplicate name
        if (recentFiles.some(f => f.name === trimmedNewName && f.name !== oldName)) {
            Swal.fire({
                icon: 'error',
                title: 'Rename Failed',
                text: `A file named "${trimmedNewName}" already exists. Please choose a different name.`,
            });
            return;
        }

        const result = await Swal.fire({
            icon: 'question',
            title: 'Confirm Rename',
            text: `Rename "${oldName}" to "${trimmedNewName}"?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, rename it!',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) {
            setEditingFileName(null);
            return;
        }

        // Get data from old key, save to new key, then remove old key
        const savedData = localStorage.getItem(oldName);
        if (savedData) {
            localStorage.setItem(trimmedNewName, savedData);
            localStorage.removeItem(oldName);
        }

        const updatedRecent = recentFiles.map(file =>
            file.name === oldName ? { ...file, name: trimmedNewName } : file
        );
        setRecentFiles(updatedRecent);
        localStorage.setItem("recentFiles", JSON.stringify(updatedRecent));

        // If the renamed file was the active one, update its filename state
        if (filename === oldName) {
            setFilename(trimmedNewName);
        }

        setEditingFileName(null);
        Swal.fire({
            icon: 'success',
            title: 'Renamed!',
            text: `File successfully renamed to "${trimmedNewName}".`,
            timer: 2000,
            showConfirmButton: false
        });
    };

    // 2. Pinning Files
    const handleTogglePin = (fileToToggle) => {
        const updatedRecent = recentFiles.map(file =>
            file.name === fileToToggle.name ? { ...file, isPinned: !file.isPinned } : file
        );
        setRecentFiles(updatedRecent);
        localStorage.setItem("recentFiles", JSON.stringify(updatedRecent));

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: fileToToggle.isPinned ? `"${fileToToggle.name}" unpinned.` : `"${fileToToggle.name}" pinned!`,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
        });
    };

    // 4. Download Reconstructed File
    const handleDownloadFile = async (file) => {
        setLoadingFile(file.name); // Show loading spinner
        const savedDataString = localStorage.getItem(file.name);

        if (!savedDataString) {
            Swal.fire({ icon: 'error', title: 'Download Failed', text: `Data for "${file.name}" is not available.` });
            setLoadingFile(null);
            return;
        }

        try {
            const parsedData = JSON.parse(savedDataString);
            const dataToDownload = parsedData.data;

            // --- Reconstruct as CSV for simplicity ---
            if (!dataToDownload || dataToDownload.length === 0) {
                Swal.fire({ icon: 'info', title: 'No Data', text: 'The file contains no data to download.' });
                setLoadingFile(null);
                return;
            }

            // Get headers from first object's keys, or use provided columns if parsedData.columns exists
            const headers = parsedData.columns && parsedData.columns.length > 0
                ? parsedData.columns
                : Object.keys(dataToDownload[0]);

            const csvRows = [];
            csvRows.push(headers.map(header => `"${String(header).replace(/"/g, '""')}"`).join(',')); // Add header row, properly quoting headers

            dataToDownload.forEach(row => {
                const values = headers.map(header => {
                    const value = row[header];
                    // Handle values that might contain commas or quotes
                    if (typeof value === 'string') {
                        // Escape double quotes and wrap in quotes if necessary
                        const escapedValue = value.replace(/"/g, '""');
                        return value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')
                            ? `"${escapedValue}"`
                            : escapedValue;
                    }
                    return value;
                });
                csvRows.push(values.join(','));
            });

            const csvString = csvRows.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${file.name.split('.').slice(0, -1).join('.') || 'download'}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            Swal.fire({
                icon: 'success',
                title: 'Download Started!',
                text: `"${file.name}" has been prepared for download.`,
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });

            // --- If you want to download as XLSX (requires XLSX.js library) ---
            // const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
            // const workbook = XLSX.utils.book_new();
            // XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            // XLSX.writeFile(workbook, `${file.name.split('.').slice(0, -1).join('.') || 'download'}.xlsx`);
            // Swal.fire({ /* ... success message for XLSX */ });

        } catch (error) {
            console.error("Error during download:", error);
            Swal.fire({ icon: 'error', title: 'Download Failed', text: 'Could not prepare file for download.' });
        } finally {
            setLoadingFile(null); // Reset loading state
        }
    };

    // --- Popover logic for file info ---
    const handleInfoHover = async (e, file) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const top = rect.bottom + window.scrollY + 10;
        const left = rect.left + window.scrollX - 100; // Adjust for width

        setInfoPopover({ file, top, left });

        // Load full data to get row/column count if not already in metadata
        if (!file.rows || !file.cols) {
            const savedDataString = localStorage.getItem(file.name);
            if (savedDataString) {
                try {
                    const parsed = JSON.parse(savedDataString);
                    const rows = parsed.data ? parsed.data.length : 0;
                    const cols = parsed.columns ? parsed.columns.length : 0;
                    setInfoPopover(prev => prev ? { ...prev, file: { ...file, rows, cols } } : null);
                } catch (error) {
                    console.error("Error loading data for info popover:", error);
                    setInfoPopover(null); // Close popover on error
                }
            }
        }
    };

    const handleInfoLeave = () => {
        setInfoPopover(null);
    };

    // --- End New Feature Functions ---

    const panelVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.05 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
    };

    const fileItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
    };

    if (recentFiles.length === 0) {
        return (
            <motion.div
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`p-8 mt-8 rounded-xl text-center ${darkMode ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-gray-100 text-gray-600 border border-gray-200'} shadow-lg`}
            >
                <h3 className="text-2xl font-bold mb-3 text-gray-400">No Recent Files</h3>
                <p className="text-md text-gray-500 mb-4">Upload an Excel or CSV file to get started and see it appear here.</p>
                <div className="mt-4 flex items-center justify-center text-yellow-500">
                    <FileSpreadsheet size={32} className="mx-2" />
                    <FileText size={32} />
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`p-6 mt-6 rounded-xl border ${darkMode ? 'border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900' : 'border-gray-200 bg-gradient-to-br from-white to-gray-50'} shadow-2xl relative`}
        >
            <h3 className={`text-xl md:text-2xl font-extrabold mb-5 flex items-center gap-3 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                📁 Recent Files
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${darkMode ? 'bg-blue-800/30 text-blue-300' : 'bg-blue-100 text-blue-800'} border ${darkMode ? 'border-blue-700/50' : 'border-blue-300'}`}>
                    {filteredFiles.length} / {recentFiles.length}
                </span>
            </h3>

            {/* Search Bar */}
            <div className={`mb-5 flex items-center p-3 rounded-xl ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border shadow-inner`}>
                <Search size={20} className={`mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                    type="text"
                    placeholder="Search recent files by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`flex-grow bg-transparent outline-none text-base ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                />
                {searchTerm && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setSearchTerm("")}
                        className={`ml-2 text-gray-400 hover:text-gray-600 ${darkMode ? 'hover:text-white' : ''} transition-colors duration-200`}
                        title="Clear search"
                    >
                        <XCircle size={18} />
                    </motion.button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {filteredFiles.length === 0 && searchTerm !== "" ? (
                    <motion.div
                        key="no-results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-6 text-center rounded-xl ${darkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-700'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-md `}
                    >
                        <p className="text-lg font-medium">No files found matching "<span className="font-bold text-blue-500">{searchTerm}</span>"</p>
                        <p className="text-sm mt-1 text-gray-400">Try a different search term or clear the search.</p>
                    </motion.div>
                ) : (
                    <ul className="space-y-4 text-sm max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredFiles.map((file) => (
                            <motion.li
                                key={file.name}
                                variants={fileItemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                layout // Enable layout animations for smooth reordering on pin
                                className={`flex justify-between items-center p-4 rounded-xl transition-all duration-300 transform
                                    ${darkMode ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' : 'bg-white hover:bg-gray-100 border border-gray-200'}
                                    ${filename === file.name ?
                                        `${darkMode ? 'ring-2 ring-blue-500 bg-blue-900/10 shadow-lg' : 'ring-2 ring-blue-400 bg-blue-50 shadow-lg'}`
                                        : ''
                                    }
                                    ${file.isPinned ? `${darkMode ? 'border-yellow-500/50' : 'border-yellow-300'}` : ''}
                                    hover:shadow-lg relative group // Added group for hover effects on child elements
                                    `}
                            >
                                {file.isPinned && (
                                    <PinOff size={16} className={`absolute top-2 right-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'} opacity-70`} />
                                )}
                                <div className="flex gap-4 items-center flex-grow min-w-0">
                                    {getFileIcon(file.name)}
                                    <div className="flex-grow min-w-0">
                                        {editingFileName === file.name ? (
                                            <input
                                                type="text"
                                                defaultValue={file.name}
                                                onBlur={(e) => handleRenameFile(file.name, e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleRenameFile(file.name, e.target.value);
                                                        e.target.blur(); // Remove focus
                                                    }
                                                    if (e.key === 'Escape') {
                                                        setEditingFileName(null);
                                                    }
                                                }}
                                                className={`w-full p-2 rounded-lg text-base font-semibold
                                                    ${darkMode ? 'bg-gray-600 text-white border-blue-500' : 'bg-white text-gray-900 border-blue-400'} border focus:outline-none focus:ring-2 focus:ring-blue-300`}
                                                autoFocus
                                            />
                                        ) : (
                                            <p
                                                className={`font-bold text-lg truncate cursor-pointer ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-blue-500 transition-colors duration-200`}
                                                onClick={() => handleLoadRecentFile(file, "data")}
                                                title={`Open ${file.name}`}
                                            >
                                                {file.name}
                                                {loadingFile === file.name && (
                                                    <Loader2 size={18} className="animate-spin ml-2 inline-block text-blue-400" />
                                                )}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                            {file.size ? `${formatBytes(file.size)} | ` : ''}
                                            <span className="text-gray-400">Uploaded: {new Date(file.date).toLocaleDateString()}</span>
                                            <span className="text-gray-400 ml-2">{new Date(file.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {/* Info Icon with Popover */}
                                    <div
                                        ref={infoIconRef}
                                        className="relative"
                                        onMouseEnter={(e) => handleInfoHover(e, file)}
                                        onMouseLeave={handleInfoLeave}
                                    >
                                        <button
                                            className={`p-2 rounded-full transition-colors duration-200 ${darkMode ? 'text-gray-400 hover:bg-gray-600 hover:text-white' : 'text-gray-500 hover:bg-gray-200'} focus:outline-none focus:ring-2 focus:ring-gray-300`}
                                            title="File Info"
                                        >
                                            <Info size={18} />
                                        </button>
                                    </div>

                                    {/* Download Button */}
                                    <button
                                        onClick={() => handleDownloadFile(file)}
                                        className={`p-2 rounded-full transition-colors duration-200 ${darkMode ? 'text-blue-400 hover:bg-blue-900/30' : 'text-blue-500 hover:bg-blue-100'} focus:outline-none focus:ring-2 focus:ring-blue-300`}
                                        title="Download File"
                                    >
                                        <Download size={18} />
                                    </button>

                                    {/* Rename Button */}
                                    <button
                                        onClick={() => setEditingFileName(file.name)}
                                        className={`p-2 rounded-full transition-colors duration-200 ${darkMode ? 'text-green-400 hover:bg-green-900/30' : 'text-green-500 hover:bg-green-100'} focus:outline-none focus:ring-2 focus:ring-green-300`}
                                        title="Rename File"
                                    >
                                        <Edit size={18} />
                                    </button>

                                    {/* Pin Button */}
                                    <button
                                        onClick={() => handleTogglePin(file)}
                                        className={`p-2 rounded-full transition-colors duration-200 ${file.isPinned ? `${darkMode ? 'text-yellow-500 hover:bg-yellow-900/30' : 'text-yellow-600 hover:bg-yellow-100'}` : `${darkMode ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-200'}`} focus:outline-none focus:ring-2 focus:ring-yellow-300`}
                                        title={file.isPinned ? "Unpin File" : "Pin File"}
                                    >
                                        {file.isPinned ? <Pin size={18} /> : <PinOff size={18} />}
                                    </button>

                                    <button
                                        className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 shadow-md
                                            ${darkMode ? 'bg-indigo-600 text-indigo-100 hover:bg-indigo-500' : 'bg-indigo-500 text-white hover:bg-indigo-600'} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                                        onClick={() => handleLoadRecentFile(file, "data")}
                                        title="Open in Data Table"
                                    >
                                        📑 Data
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 shadow-md
                                            ${darkMode ? 'bg-purple-600 text-purple-100 hover:bg-purple-500' : 'bg-purple-500 text-white hover:bg-purple-600'} focus:outline-none focus:ring-2 focus:ring-purple-300`}
                                        onClick={() => handleLoadRecentFile(file, "chart")}
                                        title="Open in Chart Visualization"
                                    >
                                        📊 Chart
                                    </button>
                                    <button
                                        onClick={() => handleRemoveFile(file.name)}
                                        className={`p-2 rounded-full transition-colors duration-200 ${darkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-100'} focus:outline-none focus:ring-2 focus:ring-red-300`}
                                        title={`Remove "${file.name}"`}
                                    >
                                        <XCircle size={18} />
                                    </button>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                )}
            </AnimatePresence>

            {/* Info Popover */}
            <AnimatePresence>
                {infoPopover && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.1 }}
                        style={{ top: infoPopover.top, left: infoPopover.left }}
                        className={`absolute z-50 p-4 rounded-xl shadow-2xl min-w-[220px] backdrop-blur-md bg-opacity-80
                            ${darkMode ? 'bg-gray-700 text-gray-200 border border-gray-600' : 'bg-white text-gray-800 border border-gray-300'}`}
                    >
                        <h4 className="font-bold text-base mb-1 truncate text-blue-500">{infoPopover.file.name}</h4>
                        <p className="text-xs text-gray-500 mb-1">
                            Uploaded: {new Date(infoPopover.file.date).toLocaleDateString()} at {new Date(infoPopover.file.date).toLocaleTimeString()}
                        </p>
                        {infoPopover.file.size && (
                            <p className="text-xs text-gray-500 mb-1">Size: {formatBytes(infoPopover.file.size)}</p>
                        )}
                        {typeof infoPopover.file.rows === 'number' && typeof infoPopover.file.cols === 'number' && (
                            <p className="text-xs text-gray-500">Rows: <span className="font-semibold">{infoPopover.file.rows}</span> | Columns: <span className="font-semibold">{infoPopover.file.cols}</span></p>
                        )}
                        {/* Could add more details here, e.g., file type specific info */}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={clearAllRecentFiles}
                className={`mt-8 w-full flex items-center justify-center gap-2 text-md font-semibold px-5 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.01] shadow-lg
                    ${darkMode ? 'bg-red-700 text-red-100 hover:bg-red-600 border border-red-600' : 'bg-red-600 text-white hover:bg-red-700 border border-red-700'}
                    focus:outline-none focus:ring-2 focus:ring-red-300`}
            >
                <Trash2 size={18} /> Clear All Recent Files
            </button>
        </motion.div>
    );
};

export default RecentFilesPanel;