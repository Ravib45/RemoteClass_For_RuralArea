import { Upload, ExternalLink } from "lucide-react";

export default function FileUpload({ user, fileInputRef, handleFileUpload, sheetNames, handleSheetChange, selectedSheet, filename, darkMode }) {
    return (
        <div className="flex items-center flex-wrap gap-2 md:gap-4">
            <input
                type="file"
                id="excelFile"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".xlsx, .xls, .csv"
                disabled={!user}
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md flex items-center whitespace-nowrap
          ${user ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                disabled={!user}
            >
                <Upload className="inline-block mr-2" size={18} /> Upload Excel
            </button>

            {sheetNames.length > 0 && (
                <select
                    onChange={(e) => handleSheetChange(e.target.value)}
                    value={selectedSheet}
                    className={`p-2 rounded-lg border text-sm transition-colors duration-200 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                >
                    {sheetNames.map((name, idx) => (
                        <option key={idx} value={name}>{name}</option>
                    ))}
                </select>
            )}

            {filename !== "SmartReport" && (
                <span className={`flex items-center text-sm font-medium italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <ExternalLink size={16} className="mr-1" /> {filename}
                </span>
            )}
        </div>
    );
}
