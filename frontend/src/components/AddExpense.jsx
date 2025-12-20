import React, { useState, useEffect } from 'react';
import api from '../api';
import UserSelect from './UserSelect';

const AddExpense = ({ onExpenseAdded }) => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [paidBy, setPaidBy] = useState('');
    const [splitType, setSplitType] = useState('EQUAL'); // EQUAL, EXACT, PERCENTAGE
    const [groupMembers, setGroupMembers] = useState([]);
    const [splits, setSplits] = useState({}); // Map userId -> value (amount or percentage)

    useEffect(() => {
        api.get('/groups').then(res => setGroups(res.data));
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            api.get(`/groups/${selectedGroup}`).then(res => {
                setGroupMembers(res.data.members);
                // Initialize splits
                const initialSplits = {};
                res.data.members.forEach(m => initialSplits[m._id] = '');
                setSplits(initialSplits);
            });
        }
    }, [selectedGroup]);

    const handleSplitChange = (userId, value) => {
        setSplits(prev => ({ ...prev, [userId]: parseFloat(value) || 0 }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let finalSplits = [];
        const numAmount = parseFloat(amount);

        if (splitType === 'EQUAL') {
            finalSplits = groupMembers.map(m => ({ user: m._id }));
        } else if (splitType === 'EXACT') {
            finalSplits = groupMembers.map(m => ({ user: m._id, amount: splits[m._id] || 0 }));
            const total = finalSplits.reduce((acc, curr) => acc + curr.amount, 0);
            if (Math.abs(total - numAmount) > 0.01) { // Floating point tolerance
                alert(`Total split amount (${total}) must equal expense amount (${numAmount})`);
                return;
            }
        } else if (splitType === 'PERCENTAGE') {
            finalSplits = groupMembers.map(m => ({ user: m._id, percentage: splits[m._id] || 0 }));
            const total = finalSplits.reduce((acc, curr) => acc + curr.percentage, 0);
            if (total !== 100) {
                alert(`Total percentage (${total}%) must equal 100%`);
                return;
            }
        }

        try {
            await api.post('/expenses', {
                description,
                amount: numAmount,
                group: selectedGroup,
                paid_by: paidBy,
                split_type: splitType,
                splits: finalSplits
            });
            alert('Expense added!');
            setAmount('');
            setDescription('');
            if (onExpenseAdded) onExpenseAdded();
        } catch (error) {
            console.error(error);
            alert('Failed to add expense');
        }
    };

    return (
        <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-white text-center">Add New Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <input
                        placeholder="e.g. Dinner at Mario's"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                        className="w-full bg-[#2d2d2d] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Amount ($)</label>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        required
                        className="w-full bg-[#2d2d2d] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Group</label>
                    <div className="relative">
                        <select
                            value={selectedGroup}
                            onChange={e => setSelectedGroup(e.target.value)}
                            required
                            className="w-full bg-[#2d2d2d] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none transition-all"
                        >
                            <option value="" className="bg-[#2d2d2d]">-- Select Group --</option>
                            {groups.map(g => <option key={g._id} value={g._id} className="bg-[#2d2d2d]">{g.name}</option>)}
                        </select>
                    </div>
                </div>

                <UserSelect value={paidBy} onChange={setPaidBy} label="Paid By" />

                {selectedGroup && (
                    <div className="pt-4 border-t border-white/10 mt-4">
                        <label className="block text-sm font-medium text-gray-400 mb-3">Split Type</label>
                        <div className="flex bg-[#2d2d2d] p-1 rounded-lg mb-4">
                            {['EQUAL', 'EXACT', 'PERCENTAGE'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${splitType === type
                                            ? 'bg-emerald-500 text-white shadow-sm'
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                    onClick={() => setSplitType(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        {splitType !== 'EQUAL' && (
                            <div className="bg-[#252525] p-4 rounded-lg border border-white/5 space-y-3">
                                {groupMembers.map(m => (
                                    <div key={m._id} className="flex justify-between items-center group">
                                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{m.name}</span>
                                        <input
                                            type="number"
                                            className="w-24 bg-[#1e1e1e] border border-gray-700 text-white text-right rounded px-2 py-1 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                                            placeholder={splitType === 'PERCENTAGE' ? '%' : '$'}
                                            value={splits[m._id] || ''}
                                            onChange={e => handleSplitChange(m._id, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 mt-4"
                >
                    Add Expense
                </button>
            </form>
        </div>
    );
};

export default AddExpense;
