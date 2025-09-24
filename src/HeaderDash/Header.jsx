import { Menu } from "lucide-react";
import FileUpload from "./FileUpload";
import ThemeToggle from "./ThemeToggle";
import UserInfo from "./UserInfo";

export default function Header({
    darkMode, setDarkMode,
    user, setIsSidebarOpen, isSidebarOpen,
    fileInputRef, handleFileUpload,
    sheetNames, handleSheetChange, selectedSheet, filename
}) {
    return (
        <header className={`py-4 px-4 md:py-5 md:px-8 shadow-lg ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} flex justify-between items-center relative z-20 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>

            {/* Sidebar Toggle (Mobile) */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`md:hidden absolute top-1/2 -translate-y-1/2 left-4 p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${darkMode ? 'focus:ring-blue-500 focus:ring-offset-gray-900' : 'focus:ring-blue-400 focus:ring-offset-white'}`}
                aria-label="Toggle Sidebar"
            >
                <Menu size={24} />
            </button>

            {/* Upload + Sheet Selector */}
            {/* Consider wrapping FileUpload in a div if you want to apply specific styles to its container within the header */}
            <FileUpload
                user={user}
                fileInputRef={fileInputRef}
                handleFileUpload={handleFileUpload}
                sheetNames={sheetNames}
                handleSheetChange={handleSheetChange}
                selectedSheet={selectedSheet}
                filename={filename}
                darkMode={darkMode}
            />

            {/* Theme + User */}
            <div className="flex items-center gap-4 md:gap-5">
                <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                <UserInfo user={user} darkMode={darkMode} />
            </div>
        </header>
    );
}