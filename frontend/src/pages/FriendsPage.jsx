import React, { useState, useEffect } from 'react';
import CreateUser from '../components/CreateUser';
import api from '../api';

const FriendsPage = () => { // Renaming to Friends for better UI context, mapping to 'users'
    const [users, setUsers] = useState([]);

    const fetchUsers = () => {
        api.get('/users').then(res => setUsers(res.data)).catch(err => console.error(err));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Friends</h1>
                <p className="text-gray-400">Add friends to start sharing expenses.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create User Section */}
                <div>
                    <CreateUser onUserCreated={fetchUsers} />
                </div>

                {/* Users List Section */}
                <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/10">
                    <h2 className="text-xl font-semibold mb-6 text-white">All Friends</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {users.map(user => (
                            <div key={user._id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-medium text-white truncate">{user.name}</h3>
                                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FriendsPage;
