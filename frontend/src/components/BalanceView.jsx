import React, { useEffect, useState } from 'react';
import api from '../api';
import UserSelect from './UserSelect';

const BalanceView = () => {
    const [selectedUser, setSelectedUser] = useState('');
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedUser) {
            setBalances([]);
            return;
        }
        setLoading(true);
        api.get(`/balances/${selectedUser}`)
            .then(res => setBalances(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [selectedUser]);

    const handleSettle = async (otherUserId) => {
        if (!confirm('Are you sure you want to settle up fully?')) return;
        try {
            await api.post('/balances/settle', {
                user1Id: selectedUser,
                user2Id: otherUserId
            });
            // Refresh
            const res = await api.get(`/balances/${selectedUser}`);
            setBalances(res.data);
        } catch (error) {
            alert('Failed to settle');
        }
    };

    return (
        <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-white">Your Balances</h2>
            <UserSelect value={selectedUser} onChange={setSelectedUser} label="View balances for:" />

            {loading && <p className="text-gray-400 text-center py-4">Loading balances...</p>}

            {!loading && selectedUser && balances.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-emerald-400 font-medium text-lg">You are all settled up! 🎉</p>
                    <p className="text-gray-500 text-sm mt-1">No outstanding debts found.</p>
                </div>
            )}

            {!selectedUser && (
                <p className="text-gray-500 text-center py-8">Select a user to view their balances.</p>
            )}

            <div className="space-y-4 mt-4">
                {balances.map((b, idx) => (
                    <div key={idx} className={`
                        flex justify-between items-center p-4 rounded-lg bg-[#2d2d2d] border-l-4 transition-all hover:translate-x-1
                        ${b.status === 'owed' ? 'border-emerald-500' : 'border-red-500'}
                    `}>
                        <div>
                            <strong className="text-white block text-lg">{b.other_user.name}</strong>
                            <span className="text-sm text-gray-400">
                                {b.status === 'owed' ? 'owes you' : 'you owe'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`text-xl font-bold ${b.status === 'owed' ? 'text-emerald-400' : 'text-red-400'}`}>
                                ₹{Math.abs(b.amount).toFixed(2)}
                            </span>
                            <button
                                onClick={() => handleSettle(b.other_user._id)}
                                className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-300 border border-gray-600 rounded hover:bg-gray-700 hover:text-white transition-colors"
                            >
                                Settle
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BalanceView;
