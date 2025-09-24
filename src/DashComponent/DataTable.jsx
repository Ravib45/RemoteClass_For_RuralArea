import React, { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import {
    Search,
    ListFilter, // Added ListFilter for potential future use or general filter icon
    TableProperties, // Added for density control icon
    ChevronDown,
    ChevronUp,
    Download, // Added for export buttons
    Eye, // For column visibility
    EyeOff, // For column visibility (less common, but can be used)
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
    XCircle // For clear search input
} from "lucide-react"; // Importing specific icons

const DataTable = ({
    darkMode,
    density,
    setDensity, // Function to set density (e.g., 'compact', 'standard', 'loose')
    searchTerm,
    setSearchTerm,
    columns,
    sortedData, // This should be the data after search and sort applied
    loading,
    excelData, // Original full data, used for 'All' rows per page and total count
    sortConfig,
    setSortConfig,
}) => {
    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page

    // State for column visibility
    const [visibleColumns, setVisibleColumns] = useState(columns); // Initialize with all columns visible
    const [showColumnVisibilityDropdown, setShowColumnVisibilityDropdown] = useState(false);

    // Calculate pagination details
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow); // Slice data for current page

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    // Determine table cell padding based on density prop
    const getTableCellPaddingClass = () => {
        switch (density) {
            case 'compact':
                return 'px-2 py-1 text-xs';
            case 'standard':
                return 'px-3 py-2 text-sm';
            case 'loose':
                return 'px-4 py-3 text-base';
            default:
                return 'px-3 py-2 text-sm'; // Default to standard if density is not recognized
        }
    };

    // Toggle column visibility
    const toggleColumnVisibility = (columnName) => {
        if (visibleColumns.includes(columnName)) {
            // If column is currently visible, hide it
            setVisibleColumns(visibleColumns.filter(col => col !== columnName));
        } else {
            // If column is currently hidden, show it
            setVisibleColumns([...visibleColumns, columnName].sort((a, b) => columns.indexOf(a) - columns.indexOf(b))); // Maintain original order
        }
    };

    // Handle export to PDF
    const handleExportPDF = () => {
        const doc = new jsPDF("landscape");
        const tableColumn = visibleColumns; // Export only currently visible columns
        const tableRows = sortedData.map((row) =>
            visibleColumns.map((col) => row[col]?.toString() || "") // Map only visible column data
        );

        doc.text("Excel Raw Data", 14, 15);
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 8 },
            margin: { top: 20 },
            theme: "striped", // Using striped theme
            // Custom styles for dark mode compatibility in PDF
            headStyles: { fillColor: darkMode ? [55, 65, 81] : [243, 244, 246], textColor: darkMode ? [255, 255, 255] : [0, 0, 0] },
            bodyStyles: { fillColor: darkMode ? [31, 41, 55] : [255, 255, 255], textColor: darkMode ? [209, 213, 219] : [0, 0, 0] },
            alternateRowStyles: { fillColor: darkMode ? [17, 24, 39] : [249, 250, 251] },
        });

        doc.save("ExcelDataTable.pdf");

        Swal.fire({
            icon: "success",
            title: "PDF Exported!",
            text: "Your data table has been downloaded as a PDF.",
            confirmButtonColor: "#facc15", // yellow-400
            customClass: {
                popup: darkMode ? 'dark-mode-swal' : '' // Apply dark mode class to SweetAlert popup
            }
        });
    };

    // Handle export to CSV
    const handleExportCSV = () => {
        const headers = visibleColumns.join(','); // Get headers from visible columns
        const rows = sortedData.map(row =>
            visibleColumns.map(col => `"${(row[col]?.toString() || "").replace(/"/g, '""')}"`).join(',') // Format and join visible column data
        ).join('\n');

        const csvContent = `${headers}\n${rows}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'ExcelDataTable.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Swal.fire({
            icon: "success",
            title: "CSV Exported!",
            text: "Your data table has been downloaded as a CSV.",
            confirmButtonColor: "#facc15",
            customClass: {
                popup: darkMode ? 'dark-mode-swal' : ''
            }
        });
    };

    // Memoize the rendered table rows for performance optimization
    const MemoizedTableRows = useMemo(() => {
        return currentRows.map((row, idx) => (
            <tr
                key={idx}
                className={`${darkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-50"
                    } transition-colors duration-100`}
            >
                {columns.map((col, j) => (
                    // Only render table data cell if the column is currently visible
                    visibleColumns.includes(col) && (
                        <td
                            key={j}
                            className={`${getTableCellPaddingClass()} whitespace-nowrap ${darkMode ? "text-gray-300" : "text-gray-800"
                                }`}
                        >
                            {row[col]?.toString() || ""}
                        </td>
                    )
                ))}
            </tr>
        ));
    }, [currentRows, visibleColumns, columns, darkMode, density]); // Dependencies for memoization

    return (
        <div
            className={`${darkMode ? "bg-gray-900" : "bg-white"
                } p-4 md:p-5 rounded-xl shadow-md border ${darkMode ? "border-gray-700" : "border-gray-200"
                }`}
        >
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <h3 className="text-lg md:text-xl font-semibold text-yellow-400 flex items-center gap-2">
                    📄 Data Preview
                </h3>

                <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 w-full md:w-auto">
                    {/* Search Box */}
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search data..."
                            className={`pl-9 pr-3 py-1.5 rounded-lg border text-sm w-full transition-colors duration-200 ${darkMode
                                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-yellow-500 focus:ring-yellow-500"
                                : "bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                                }`}
                        />
                        <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                        {searchTerm && ( // Show clear button only if search term exists
                            <button
                                onClick={() => setSearchTerm("")}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}
                                title="Clear search"
                            >
                                <XCircle size={16} />
                            </button>
                        )}
                    </div>

                    {/* Rows Per Page Input */}
                    <div className="flex items-center gap-1">
                        <label htmlFor="rowsPerPage" className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Rows:</label>
                        <select
                            id="rowsPerPage"
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1); // Reset to first page when rows per page changes
                            }}
                            className={`w-20 px-2 py-1.5 rounded-lg border text-sm transition-colors duration-200 ${darkMode
                                ? "bg-gray-700 text-white border-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
                                : "bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                }`}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={excelData.length}>All</option> {/* Option to show all rows */}
                        </select>
                    </div>

                    {/* Column Visibility Toggle */}
                    <div className="relative">
                        <button
                            onClick={() => setShowColumnVisibilityDropdown(!showColumnVisibilityDropdown)}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${darkMode ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600" : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"}`}
                            title="Toggle column visibility"
                        >
                            <Eye size={18} /> Columns <ChevronDown size={16} className={`${showColumnVisibilityDropdown ? 'rotate-180' : ''} transition-transform`} />
                        </button>
                        {showColumnVisibilityDropdown && (
                            <div className={`absolute z-10 top-full mt-2 right-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-xl p-3 max-h-60 overflow-y-auto`}>
                                {columns.map((col, i) => (
                                    <label key={i} className={`flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'}`}>
                                        <input
                                            type="checkbox"
                                            checked={visibleColumns.includes(col)}
                                            onChange={() => toggleColumnVisibility(col)}
                                            className={`form-checkbox h-4 w-4 ${darkMode ? 'text-yellow-500 bg-gray-600 border-gray-500' : 'text-blue-600 border-gray-300'}`}
                                        />
                                        {col}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Density Control Button */}
                    <div className="relative">
                        <button
                            onClick={() => setDensity(density === 'compact' ? 'standard' : density === 'standard' ? 'loose' : 'compact')} // Cycle through densities
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${darkMode ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600" : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"}`}
                            title="Toggle table density"
                        >
                            <TableProperties size={18} /> Density: {density.charAt(0).toUpperCase() + density.slice(1)} {/* Display current density */}
                        </button>
                    </div>

                    {/* Export Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleExportPDF}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg shadow transition-all flex items-center gap-1"
                            title="Export to PDF"
                        >
                            <Download size={16} /> PDF
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg shadow transition-all flex items-center gap-1"
                            title="Export to CSV"
                        >
                            <Download size={16} /> CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Display Area */}
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-400"></div>
                </div>
            ) : excelData.length === 0 ? (
                <p className="text-center text-gray-500 mt-4">
                    No data loaded. Please upload an Excel file to view its content.
                </p>
            ) : (
                <>
                    <div className="overflow-x-auto max-w-full border rounded-lg">
                        <div className="min-w-[768px]"> {/* Ensures table is at least this wide for small screens */}
                            <table
                                className={`w-full divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"
                                    }`}
                            >
                                <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                    <tr>
                                        {columns.map((col, i) => (
                                            // Only render table header if the column is currently visible
                                            visibleColumns.includes(col) && (
                                                <th
                                                    key={i}
                                                    className={`${getTableCellPaddingClass()} text-left font-semibold whitespace-nowrap ${darkMode ? "text-gray-200" : "text-gray-700"
                                                        } cursor-pointer hover:bg-opacity-80 transition-colors duration-100`}
                                                    onClick={() =>
                                                        setSortConfig({
                                                            key: col,
                                                            direction:
                                                                sortConfig.key === col && sortConfig.direction === "asc"
                                                                    ? "desc"
                                                                    : "asc",
                                                        })
                                                    }
                                                >
                                                    <div className="flex items-center gap-1">
                                                        {col}{" "}
                                                        {sortConfig.key === col && (
                                                            sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                                        )}
                                                    </div>
                                                </th>
                                            )
                                        ))}
                                    </tr>
                                </thead>
                                <tbody
                                    className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"
                                        }`}
                                >
                                    {MemoizedTableRows} {/* Render memoized rows */}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {sortedData.length > rowsPerPage && ( // Only show pagination if there's more data than rowsPerPage
                        <div className={`flex flex-col sm:flex-row justify-between items-center mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-2 sm:mb-0`}>
                                Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, sortedData.length)} of {sortedData.length} entries
                            </span>
                            <nav className="flex items-center space-x-1">
                                <button
                                    onClick={goToFirstPage}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    title="First page"
                                >
                                    <ChevronsLeft size={16} />
                                </button>
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    title="Previous page"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {/* Dynamic page numbers with ellipses */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    // Logic to show a limited number of page buttons around the current page
                                    if (
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 2 && page <= currentPage + 2)
                                    ) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => paginate(page)}
                                                className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === page
                                                    ? 'bg-yellow-500 text-white'
                                                    : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    }
                                    // Add ellipses for skipped pages
                                    if ((page === currentPage - 3 && currentPage > 4) || (page === currentPage + 3 && currentPage < totalPages - 3)) {
                                        return <span key={page} className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>...</span>;
                                    }
                                    return null; // Don't render other page numbers
                                })}
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    title="Next page"
                                >
                                    <ChevronRight size={16} />
                                </button>
                                <button
                                    onClick={goToLastPage}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    title="Last page"
                                >
                                    <ChevronsRight size={16} />
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DataTable;