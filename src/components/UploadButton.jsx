import React from 'react';
import { UploadCloud } from 'lucide-react';

const UploadButton = () => {
    const handleUpload = () => {
        alert('Upload feature coming soon!');
    };

    return (
        <button
            onClick={handleUpload}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all"
        >
            <UploadCloud size={18} /> Upload File
        </button>
    );
};

export default UploadButton;
