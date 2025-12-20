import React, { useState, useEffect } from 'react';
import api from '../api';

const CreateGroup = ({ onGroupCreated }) => {
    const [name, setName] = useState('');
    const [members, setMembers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);

    useEffect(() => {
        // Fetch users to add to group
        api.get('/users').then(res => setAvailableUsers(res.data));
    }, []);

    const toggleMember = (id) => {
        if (members.includes(id)) {
            setMembers(members.filter(m => m !== id));
        } else {
            setMembers([...members, id]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/groups', { name, members });
            alert('Group created!');
            setName('');
            setMembers([]);
            if (onGroupCreated) onGroupCreated();
        } catch (error) {
            alert('Error creating group');
        }
    };

    return (
        <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-white text-center">Create New Group</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Group Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="e.g. Goa Trip"
                        className="w-full bg-[#2d2d2d] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Add Members</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-[#2d2d2d] rounded-lg border border-gray-700 custom-scrollbar">
                        {availableUsers.map(u => (
                            <div key={u._id}
                                onClick={() => toggleMember(u._id)}
                                className={`
                                    cursor-pointer px-3 py-2 rounded-md text-sm font-medium text-center transition-all border
                                    ${members.includes(u._id)
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                                        : 'bg-transparent text-gray-400 border-transparent hover:bg-white/5 hover:text-gray-200'}
                                `}
                            >
                                {u.name}
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                    Create Group
                </button>
            </form>
        </div>
    );
};

export default CreateGroup;
