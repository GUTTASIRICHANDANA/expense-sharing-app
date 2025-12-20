import React, { useEffect, useState } from 'react';
import api from '../api';

const UserSelect = ({ value, onChange, label = "Select User" }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get('/users').then(res => setUsers(res.data));
    }, []);

    return (
        <div className="flex flex-col space-y-1 mb-4">
            <label className="text-sm font-medium text-gray-400">{label}</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-[#2d2d2d] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none transition-all"
                >
                    <option value="" className="bg-[#2d2d2d] text-gray-400">-- Choose User --</option>
                    {users.map(u => (
                        <option key={u._id} value={u._id} className="bg-[#2d2d2d] text-white">
                            {u.name} ({u.email})
                        </option>
                    ))}
                </select>
                {/* Custom arrow could go here */}
            </div>
        </div>
    );
};

export default UserSelect;
