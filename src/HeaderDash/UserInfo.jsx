// components/UserInfo.jsx
import { UserCircle, LogOut, Settings, BarChart2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Swal from 'sweetalert2';
import UserProfileModal from "./UseProfileModal"; // Corrected typo: UseProfileModal -> UserProfileModal
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function UserInfo({ user, darkMode, setUser }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const navigate = useNavigate(); // Initialize useNavigate hook

    // Close the menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef, buttonRef]);

    const handleLogout = async () => {
        setIsMenuOpen(false);

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out of your account.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log me out!',
            background: darkMode ? '#1F2937' : '#ffffff',
            color: darkMode ? '#F9FAFB' : '#111827',
            customClass: {
                popup: 'border ' + (darkMode ? 'border-gray-700' : 'border-gray-200'),
                confirmButton: darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
                cancelButton: darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
            }
        });

        if (result.isConfirmed) {
            console.log("User confirmed logout. Performing logout logic...");

            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            if (setUser) {
                setUser(null); // Clear user state in parent
            }

            await Swal.fire({
                title: 'Logged Out!',
                text: 'You have been successfully logged out.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                background: darkMode ? '#1F2937' : '#ffffff',
                color: darkMode ? '#F9FAFB' : '#111827',
                customClass: {
                    popup: 'border ' + (darkMode ? 'border-gray-700' : 'border-gray-200'),
                    confirmButton: darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
                }
            });

            window.location.href = '/'; // Still using window.location for full page refresh on logout
        }
    };

    const handleProfileView = () => {
        setIsMenuOpen(false);
        setIsProfileModalOpen(true);
    };

    const handleUserUpdate = async (updatedUserData) => {
        console.log("Attempting to update user:", updatedUserData);
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

            if (setUser) {
                setUser(updatedUserData);
            } else {
                console.warn("setUser prop not provided to UserInfo. User state might not update globally.");
            }
            console.log("User data updated successfully!");
        } catch (error) {
            console.error("Error updating user data:", error);
            throw error;
        }
    };

    const handleSettings = () => {
        setIsMenuOpen(false); // Close the dropdown menu
        navigate('/settings'); // Navigate to the /settings route
    };

    const handleAnalytics = () => {
        setIsMenuOpen(false); // Close the dropdown menu
        navigate('/analytics'); // Navigate to the /analytics route
    };

    return (
        
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all duration-200 ease-in-out
                           ${darkMode ? 'bg-gray-700 text-white border border-gray-600 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'}
                           focus:outline-none focus:ring-2 focus:ring-offset-2 ${darkMode ? 'focus:ring-blue-500 focus:ring-offset-gray-900' : 'focus:ring-blue-400 focus:ring-offset-white'}`}
                aria-haspopup="true"
                aria-expanded={isMenuOpen ? "true" : "false"}
                aria-label="User menu"
            >
                <UserCircle size={24} className="text-blue-400" />
                <span className="font-medium">{user?.name || "Guest"}</span>
            </button>

            {isMenuOpen && (
                <div
                    ref={menuRef}
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl overflow-hidden z-30
                               ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
                >
                    <ul className="py-1">
                        <li className="flex items-center px-4 py-2 text-sm hover:bg-opacity-80 cursor-pointer
                                       ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}"
                            onClick={handleProfileView}>
                            <UserCircle size={18} className="mr-2" />
                            Profile View
                        </li>
                        <li className="flex items-center px-4 py-2 text-sm hover:bg-opacity-80 cursor-pointer
                                       ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}"
                            onClick={handleSettings}>
                            <Settings size={18} className="mr-2" />
                            Settings
                        </li>
                        <li className="flex items-center px-4 py-2 text-sm hover:bg-opacity-80 cursor-pointer
                                       ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}"
                            onClick={handleAnalytics}>
                            <BarChart2 size={18} className="mr-2" />
                            Analytics
                        </li>
                        <hr className={`my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                        <li className="flex items-center px-4 py-2 text-sm hover:bg-opacity-80 cursor-pointer
                                       ${darkMode ? 'text-red-300 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'}"
                            onClick={handleLogout}>
                            <LogOut size={18} className="mr-2" />
                            Logout
                        </li>
                    </ul>
                </div>
            )}

            {isProfileModalOpen && (
                <UserProfileModal
                    user={user}
                    onClose={() => setIsProfileModalOpen(false)}
                    darkMode={darkMode}
                    onUpdateUser={handleUserUpdate}
                />
            )}
        </div>
    );
}