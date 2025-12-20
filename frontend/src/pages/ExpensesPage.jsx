import React, { useState, useEffect } from 'react';
import AddExpense from '../components/AddExpense';
import api from '../api';

const ExpensesPage = () => {
    const [expenses, setExpenses] = useState([]);

    const fetchExpenses = () => {
        api.get('/expenses')
            .then(res => setExpenses(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleExpenseAdded = () => {
        fetchExpenses();
    };

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Expenses</h1>
                <p className="text-gray-400">Manage your group expenses and history.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Expense Form Section */}
                <div>
                    <AddExpense onExpenseAdded={handleExpenseAdded} />
                </div>

                {/* Expense History Section */}
                <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/10 shadow-lg h-fit">
                    <h2 className="text-xl font-semibold mb-6 text-white">Expense History</h2>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                        {expenses.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No expenses yet.</p>
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
                                            {expense.group && (
                                                <span className="text-xs text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded mt-1 inline-block">
                                                    {expense.group.name}
                                                </span>
                                            )}
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

export default ExpensesPage;
