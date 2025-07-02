import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        alert('Dummy registration successful! Now login with the dummy credentials.');
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <form onSubmit={handleRegister} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Register</h2>
                <input
                    type="email"
                    placeholder="Email (use user@example.com)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 px-4 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
                    required
                />
                <input
                    type="password"
                    placeholder="Password (use 123456)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-6 px-4 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
