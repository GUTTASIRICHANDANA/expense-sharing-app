import React, { useState } from 'react';
import api from '../api';

const CreateUser = ({ onUserCreated }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', { name, email });
            alert('User created!');
            setName('');
            setEmail('');
            if (onUserCreated) onUserCreated();
        } catch (error) {
            alert('Error creating user');
        }
    };

    return (
        <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-white text-center">Create New Friend</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                    <input
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="w-full bg-[#2d2d2d] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="e.g. john@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full bg-[#2d2d2d] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                    Create User
                </button>
            </form>
        </div>
    );
};

export default CreateUser;
