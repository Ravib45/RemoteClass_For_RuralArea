import { useEffect, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BarChart,
    FileText,
    GitCompare,
    Settings,
    Share2,
    Bookmark,
    XCircle,
    LogOut,
    Sparkles, // Added for a more premium look on the "Pro" badge
    // LayoutDashboard // If you plan to use this, uncomment it.
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define sidebar tabs outside the component to prevent re-creation on re-renders.
const SIDEBAR_TABS = [
    { key: "chart", label: "Chart View", icon: <BarChart size={20} /> },
    { key: "data", label: "Data Table", icon: <FileText size={20} /> },
    { key: "analytics", label: "Analytics", icon: <GitCompare size={20} /> },
    { key: "settings", label: "Settings", icon: <Settings size={20} /> },
    { key: "share", label: "Share & Export", icon: <Share2 size={20} /> },
    { key: "recent", label: "Recent Files", icon: <Bookmark size={20} /> },
    // { key: "plugins", label: "Plugins", icon: <LayoutDashboard size={20} /> },
];

/**
 * Sidebar component for navigation and user actions.
 * Handles responsive behavior and integrates with Framer Motion for animations.
 */
export default function Sidebar({
    darkMode,
    isSidebarOpen,
    setIsSidebarOpen,
    activeTab,
    setActiveTab,
    resetDashboard,
    user,
    setUser,
    setShowLogin,
}) {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false); // Initialize with false, update in useEffect

    // Use useCallback for handleLogout to prevent unnecessary re-renders of children if passed down
    const handleLogout = useCallback(() => {
        // A more user-friendly confirmation dialog might be a custom modal
        // For now, keeping the native confirm for simplicity as per original.
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem("currentUser");
            localStorage.removeItem("recentFiles");
            localStorage.removeItem("savedDashboardTemplates");
            setUser(null);
            setShowLogin(true);
            navigate("/"); // Redirect to landing page
        }
    }, [setUser, setShowLogin, navigate]);

    useEffect(() => {
        // Set initial mobile state once on mount
        setIsMobile(window.innerWidth < 768);

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Tailwind CSS classes are constructed dynamically for readability.
    const sidebarStyles = `
    w-64 h-full p-5 flex flex-col justify-between z-50
    ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"}
    transition-colors duration-300 ease-in-out
  `; // Adjusted colors and added transition

    return (
        <>
            {/* Overlay for mobile sidebar */}
            {isMobile && isSidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }} // Faster transition for overlay
                    className="fixed inset-0 bg-black/50 z-40" // Slightly darker overlay
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {isMobile ? (
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            // Adjusted spring properties for a smoother, slightly bouncier feel
                            transition={{ type: "spring", stiffness: 250, damping: 28, mass: 0.8 }}
                            className={`fixed top-0 left-0 ${sidebarStyles} shadow-2xl`} // More prominent shadow for mobile
                        >
                            <SidebarContent
                                isMobile={true}
                                setIsSidebarOpen={setIsSidebarOpen}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                darkMode={darkMode}
                                user={user}
                                resetDashboard={resetDashboard}
                                handleLogout={handleLogout}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            ) : (
                // Desktop sidebar
                <div
                    className={`${sidebarStyles} border-r ${darkMode ? "border-gray-700" : "border-gray-200" // Lighter border for light mode
                        }`}
                >
                    <SidebarContent
                        isMobile={false}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        darkMode={darkMode}
                        user={user}
                        resetDashboard={resetDashboard}
                        handleLogout={handleLogout}
                    />
                </div>
            )}
        </>
    );
}

/**
 * Inner content of the sidebar, extracted for clarity and reusability.
 * Uses React.memo to optimize rendering as its props are mostly stable.
 */
const SidebarContent = memo(function SidebarContent({
    isMobile,
    setIsSidebarOpen, // Only present when isMobile is true
    activeTab,
    setActiveTab,
    darkMode,
    user,
    resetDashboard,
    handleLogout,
}) {
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-8"> {/* Increased bottom margin */}
                <div className="text-2xl font-extrabold text-yellow-500 select-none tracking-tight"> {/* Slightly bolder, more vibrant yellow, tighter tracking */}
                    SmartDashboard<span className="text-sm">™</span> {/* Added a subtle trademark */}
                </div>
                {isMobile && (
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-gray-400 hover:text-yellow-500 p-1 rounded-full
                       focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-70
                       transition-colors duration-200" // Added padding and smoother transition
                        aria-label="Close sidebar"
                    >
                        <XCircle size={24} />
                    </button>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow overflow-y-auto px-1 -mx-1 custom-scrollbar"> {/* Added horizontal padding to nav, adjusted negative margin to offset scrollbar */}
                <ul className="space-y-2">
                    {SIDEBAR_TABS.map((tab) => (
                        <li key={tab.key}>
                            <button
                                onClick={() => {
                                    setActiveTab(tab.key);
                                    if (isMobile && setIsSidebarOpen) setIsSidebarOpen(false);
                                }}
                                className={`
                  flex items-center w-full p-3 rounded-lg text-lg font-medium relative overflow-hidden
                  transition-all duration-300 ease-in-out
                  group // Added group for hover effects on children
                  ${activeTab === tab.key
                                        ? "bg-yellow-400 text-gray-900 shadow-lg" // Stronger shadow for active, darker text
                                        : darkMode
                                            ? "text-gray-300 hover:bg-gray-700 hover:text-white" // Brighter hover text
                                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900" // Lighter hover background, darker hover text
                                    }
                  focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-70
                `}
                                aria-current={activeTab === tab.key ? "page" : undefined}
                            >
                                {/* Active tab indicator - a subtle swipe effect */}
                                {activeTab === tab.key && (
                                    <motion.div
                                        layoutId="sidebar-active-tab-indicator" // Ensures smooth animation between active tabs
                                        className="absolute inset-0 bg-yellow-300/20 rounded-lg -z-10" // Subtle background for active state
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="mr-3 transform group-hover:scale-110 transition-transform duration-200">{tab.icon}</span>{" "}
                                <span className="relative z-10">{tab.label}</span> {/* Ensure text is above indicator */}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Pro Label */}
            {user?.plan === "pro" && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900
                     px-4 py-2 rounded-lg shadow-xl font-bold text-center mt-6 text-sm
                     flex items-center justify-center gap-2 transform hover:scale-[1.03] transition-transform duration-200 cursor-pointer" // Enhanced styling
                >
                    <Sparkles size={16} className="text-white animate-spin-slow" /> {/* New icon and subtle animation */}
                    Pro Access Enabled
                    <Sparkles size={16} className="text-white animate-spin-slow" />
                </motion.div>
            )}

            {/* Reset & Logout Buttons */}
            {/* <div className="mt-6 space-y-2 border-t pt-4 border-gray-300 dark:border-gray-700"> 
                <button
                    onClick={resetDashboard}
                    className={`
            w-full py-2 rounded-lg font-semibold shadow-md flex items-center justify-center gap-2
            transition duration-300 transform hover:scale-[1.01]
            ${darkMode ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"}
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-70
          `}
                >
                    Reset All
                </button>
                <button
                    onClick={handleLogout}
                    className={`
            w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2
            transition duration-300 transform hover:scale-[1.01]
            ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-300 hover:bg-gray-400 text-gray-800"}
            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-70
          `}
                >
                    <LogOut size={18} /> Logout
                </button>
            </div> */}
        </div>
    );
});