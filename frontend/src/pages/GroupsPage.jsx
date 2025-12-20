import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateGroup from '../components/CreateGroup';
import api from '../api';

const GroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    const fetchGroups = () => {
        api.get('/groups').then(res => setGroups(res.data)).catch(err => console.error(err));
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Groups</h1>
                <p className="text-gray-400">Create and manage your expense groups.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Group Section */}
                <div>
                    <CreateGroup onGroupCreated={fetchGroups} />
                </div>

                {/* Groups List Section */}
                <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/10 shadow-lg">
                    <h2 className="text-xl font-semibold mb-6 text-white">Your Groups</h2>
                    <div className="space-y-4">
                        {groups.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No groups found.</p>
                        ) : (
                            groups.map(group => (
                                <div key={group._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-emerald-500/50 transition-colors">
                                    <div>
                                        <h3 className="font-medium text-white">{group.name}</h3>
                                        <p className="text-sm text-gray-400">{group.members?.length || 0} members</p>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/groups/${group._id}`)}
                                        className="text-emerald-400 text-sm font-medium hover:text-emerald-300"
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupsPage;
