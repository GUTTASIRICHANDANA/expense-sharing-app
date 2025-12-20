import React, { useState } from 'react';
import CreateUser from './CreateUser';
import CreateGroup from './CreateGroup';
import AddExpense from './AddExpense';
import BalanceView from './BalanceView';

const Dashboard = () => {
    // We can use keys to force refresh certain components when data changes
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleDataUpdate = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="container">
            <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem', background: '-webkit-linear-gradient(45deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Expense Share
            </h1>

            <div className="flex justify-between" style={{ gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <BalanceView key={refreshTrigger} />
                    <div style={{ marginTop: '2rem' }}>
                        <AddExpense onExpenseAdded={handleDataUpdate} />
                    </div>
                </div>

                <div style={{ flex: 1, minWidth: '300px' }}>
                    <CreateUser onUserCreated={handleDataUpdate} />
                    <CreateGroup onGroupCreated={handleDataUpdate} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
