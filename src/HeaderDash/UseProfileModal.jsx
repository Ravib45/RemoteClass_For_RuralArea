// components/UserProfileModal.jsx
import { X, Mail, User, Edit, Save, XCircle } from "lucide-react"; // Added Edit, Save, XCircle
import { useState, useEffect } from "react"; // Added useState, useEffect
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function UserProfileModal({ user, onClose, darkMode, onUpdateUser }) {
    // State to manage the form fields
    const [editedUser, setEditedUser] = useState(user);
    // State to control edit mode
    const [isEditing, setIsEditing] = useState(false);
    // State for loading indicator during save
    const [isSaving, setIsSaving] = useState(false);
    // State for form validation errors
    const [errors, setErrors] = useState({});

    // Update editedUser state if the user prop changes (e.g., after a save)
    useEffect(() => {
        setEditedUser(user);
    }, [user]);

    if (!user) return null;

    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
        // Clear error for the field being edited
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!editedUser.name || editedUser.name.trim() === '') {
            newErrors.name = 'Name cannot be empty.';
        }
        if (!editedUser.email || editedUser.email.trim() === '') {
            newErrors.email = 'Email cannot be empty.';
        } else if (!/\S+@\S+\.\S+/.test(editedUser.email)) {
            newErrors.email = 'Email is invalid.';
        }
        // Add more validation rules as needed
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please correct the errors in the form.',
                background: darkMode ? '#1F2937' : '#ffffff',
                color: darkMode ? '#F9FAFB' : '#111827',
                customClass: {
                    popup: 'border ' + (darkMode ? 'border-gray-700' : 'border-gray-200'),
                }
            });
            return;
        }

        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

            // Pass the updated user data to the parent component
            if (onUpdateUser) {
                await onUpdateUser(editedUser); // Wait for the parent to handle the update
            }

            Swal.fire({
                icon: 'success',
                title: 'Profile Updated!',
                text: 'Your profile has been successfully updated.',
                background: darkMode ? '#1F2937' : '#ffffff',
                color: darkMode ? '#F9FAFB' : '#111827',
                customClass: {
                    popup: 'border ' + (darkMode ? 'border-gray-700' : 'border-gray-200'),
                }
            });
            setIsEditing(false); // Exit edit mode on success
        } catch (error) {
            console.error("Failed to save profile:", error);
            Swal.fire({
                icon: 'error',
                title: 'Save Failed',
                text: 'There was an error updating your profile. Please try again.',
                background: darkMode ? '#1F2937' : '#ffffff',
                color: darkMode ? '#F9FAFB' : '#111827',
                customClass: {
                    popup: 'border ' + (darkMode ? 'border-gray-700' : 'border-gray-200'),
                }
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedUser(user); // Revert changes
        setIsEditing(false); // Exit edit mode
        setErrors({}); // Clear any validation errors
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className={`relative rounded-lg shadow-xl p-6 w-full max-w-md mx-auto transform transition-all duration-300 ease-out
                           ${darkMode ? 'bg-gray-800 text-gray-100 border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'}`}
                onClick={handleModalContentClick}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className={`absolute top-3 right-3 p-2 rounded-full
                               ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                               transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${darkMode ? 'focus:ring-blue-500 focus:ring-offset-gray-800' : 'focus:ring-blue-400 focus:ring-offset-white'}`}
                    aria-label="Close profile modal"
                >
                    <X size={20} />
                </button>

                <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    User Profile
                </h2>

                <div className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <User size={20} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <p className="text-sm font-medium">Name</p>
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={editedUser.name || ''}
                                onChange={handleChange}
                                className={`w-full p-2 rounded border focus:outline-none focus:ring-2
                                            ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-400'}
                                            ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                        ) : (
                            <p className="text-lg font-semibold">{editedUser.name || 'N/A'}</p>
                        )}
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Mail size={20} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <p className="text-sm font-medium">Email</p>
                        </div>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={editedUser.email || ''}
                                onChange={handleChange}
                                className={`w-full p-2 rounded border focus:outline-none focus:ring-2
                                            ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-400'}
                                            ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                        ) : (
                            <p className="text-lg font-semibold">{editedUser.email || 'N/A'}</p>
                        )}
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Add more editable fields as needed, following the same pattern */}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleCancel}
                                className={`px-4 py-2 rounded-md transition-colors duration-200
                                           ${darkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                                disabled={isSaving}
                            >
                                <XCircle size={18} className="inline-block mr-1" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className={`px-4 py-2 rounded-md transition-colors duration-200
                                           ${isSaving ? 'bg-blue-400 cursor-not-allowed' : (darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600')}`}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : <><Save size={18} className="inline-block mr-1" /> Save</>}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className={`px-4 py-2 rounded-md transition-colors duration-200
                                       ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        >
                            <Edit size={18} className="inline-block mr-1" />
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}