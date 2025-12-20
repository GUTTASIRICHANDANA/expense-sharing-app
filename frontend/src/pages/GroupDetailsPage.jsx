import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import AddExpense from '../components/AddExpense';

const GroupDetailsPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const groupRes = await api.get(`/groups/${groupId}`);
            setGroup(groupRes.data);

            const expensesRes = await api.get(`/expenses/group/${groupId}`);
            setExpenses(expensesRes.data);
        } catch (error) {
            console.error(error);
            // navigate('/groups'); // Redirect if invalid
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (groupId) fetchData();
    }, [groupId]);

    const handleExpenseAdded = () => {
        fetchData();
    };

    if (loading) return <div className="text-white text-center mt-10">Loading Group Details...</div>;
    if (!group) return <div className="text-white text-center mt-10">Group not found</div>;

    return (
        <div className="space-y-6">
            <header className="mb-6">
                <button
                    onClick={() => navigate('/groups')}
                    className="text-gray-400 hover:text-white mb-2 flex items-center gap-1 text-sm transition-colors"
                >
                    &larr; Back to Groups
                </button>
                <h1 className="text-3xl font-bold text-white mb-2">{group.name}</h1>
                <p className="text-gray-400">
                    Members: {group.members.map(m => m.name).join(', ')}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Expense Specifically for this Group */}
                {/* We can pre-select the group in AddExpense if we pass it as a prop? 
                    For now, reusing the generic component but user handles selection. 
                    TODO: Enhance AddExpense to accept defaultGroup prop. 
                */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-white">Add Group Expense</h2>
                    <AddExpense onExpenseAdded={handleExpenseAdded} />
                </div>

                {/* Group Expenses List */}
                <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/10 shadow-lg h-fit">
                    <h2 className="text-xl font-semibold mb-6 text-white">Group Expenses</h2>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                        {expenses.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No expenses in this group yet.</p>
                        ) : (
                            expenses.map((expense) => (
                                <div key={expense._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-emerald-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xl">
                                            $
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{expense.description}</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <span>Paid by <span className="text-gray-300">{expense.paid_by?.name || 'Unknown'}</span></span>
                                                <span>•</span>
                                                <span>{new Date(expense.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-white font-bold text-lg block">${expense.amount.toFixed(2)}</span>
                                        <span className="text-xs text-gray-500 uppercase">{expense.split_type}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupDetailsPage;
