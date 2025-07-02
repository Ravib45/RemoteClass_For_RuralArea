import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, FileText, Upload, LogOut } from 'lucide-react';

const Sidebar = () => {
    const logout = () => {
        localStorage.removeItem('loggedIn');
        window.location.href = '/';

    };

    return (
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-5 hidden md:flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Excel Tools</h2>
                <nav className="flex flex-col gap-4">
                    <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-500">
                        <BarChart3 size={18} /> Dashboard
                    </Link>
                    <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-500">
                        <FileText size={18} /> Reports
                    </Link>
                    <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-500">
                        <Upload size={18} /> Upload
                    </Link>
                </nav>
            </div>
            <button onClick={logout} className="flex items-center gap-2 text-red-600 hover:text-red-700">
                <LogOut size={18} /> Logout
            </button>
        </div>
    );
};

export default Sidebar;
