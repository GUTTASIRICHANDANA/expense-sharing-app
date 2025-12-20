import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import BalanceView from '../components/BalanceView';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        // Fetch recent expenses
        api.get('/expenses')
            .then(res => setRecentActivity(res.data.slice(0, 5))) // Get top 5
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400">Welcome back! Here's your expense summary.</p>
                </div>
                <button
                    onClick={() => navigate('/expenses')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20"
                >
                    + Add Quick Expense
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BalanceView />

                <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/10 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                        <button onClick={() => navigate('/expenses')} className="text-sm text-emerald-400 hover:text-emerald-300">View All</button>
                    </div>

                    <div className="space-y-4">
                        {recentActivity.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                                <p>No recent activity</p>
                            </div>
                        ) : (
                            recentActivity.map(expense => (
                                <div key={expense._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-lg">
                                            $
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{expense.description}</p>
                                            <p className="text-xs text-gray-400">
                                                Paid by <span className="text-gray-300">{expense.paid_by?.name || 'Unknown'}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-medium">${expense.amount.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(expense.date).toLocaleDateString()}
                                        </p>
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

export default DashboardPage;
