import React from "react";
import { UserCircle, LayoutDashboard, FileText, Settings, Share2, Lightbulb, LogOut } from "lucide-react";

const Sidebar = ({ darkMode, isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab, resetDashboard, user, handleLogout }) => {
    const navItems = [
        { id: "chart", icon: LayoutDashboard, label: "Dashboard" },
        { id: "data", icon: FileText, label: "Data" },
        { id: "analytics", icon: Lightbulb, label: "Analytics" },
        { id: "settings", icon: Settings, label: "Settings" },
        { id: "share", icon: Share2, label: "Share & Export" },
        { id: "plugins", icon: Lightbulb, label: "Plugins" }, // Assuming a plugins tab
        { id: "recent", icon: FileText, label: "Recent Files" },
    ];

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-40 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out ${darkMode ? 'bg-gray-800 text-white border-r border-gray-700' : 'bg-white text-gray-900 border-r border-gray-200'} p-4 flex flex-col`}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-500">Menu</h2>
                <button
                    className="md:hidden p-2 text-gray-600 dark:text-gray-300"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close Sidebar"
                >
                    {/* <X size={24} /> */} Close Icon
                </button>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2">
                    {navItems.map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                                className={`flex items-center w-full p-3 rounded-lg text-left transition-colors ${activeTab === item.id ? (darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700') : (darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700')} font-medium`}
                            >
                                <item.icon size={20} className="mr-3" />
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto pt-4 border-t border-dashed border-gray-700">
                {user && (
                    <div className={`flex items-center p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'} mb-3`}>
                        <UserCircle size={24} className="mr-3" />
                        <span>{user.name} ({user.plan})</span>
                    </div>
                )}
                <button
                    onClick={resetDashboard}
                    className="flex items-center w-full p-3 rounded-lg text-left transition-colors bg-red-600 hover:bg-red-700 text-white font-medium mb-2"
                >
                    {/* <RefreshCw size={20} className="mr-3" /> */} Reset Dashboard
                </button>
                {user && (
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-3 rounded-lg text-left transition-colors bg-gray-600 hover:bg-gray-700 text-white font-medium"
                    >
                        <LogOut size={20} className="mr-3" />
                        Logout
                    </button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;