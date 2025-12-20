const Expense = require('../models/Expense');
const splitService = require('../services/splitService');

exports.addExpense = async (req, res) => {
    try {
        const { description, amount, group, paid_by, split_type, splits } = req.body;

        // 1. Create Expense Record
        // We pass the raw data first to calculate splits, then save.
        // Actually, let's create the expense object but validate via service first? 
        // Or cleaner: Call service to get final 'splits' array, then save.

        // Let's rely on service to VALIDATE and RETURN formatted splits.
        // But service is also updating balances.
        // Transaction safety: ideally we wrap this in a session. 
        // For this task, we assume sequential success.

        const expenseData = { description, amount, group, paid_by, split_type, splits };

        // This calculates who owes whom and UPDATES balances collection
        const finalSplits = await splitService.handleExpenseSplit(expenseData);

        const expense = await Expense.create({
            description,
            amount,
            group,
            paid_by,
            split_type,
            splits: finalSplits
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getGroupExpenses = async (req, res) => {
    try {
        const { groupId } = req.params;
        const expenses = await Expense.find({ group: groupId })
            .populate('paid_by', 'name')
            .populate('splits.user', 'name')
            .sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find()
            .populate('paid_by', 'name')
            .populate('group', 'name')
            .sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
