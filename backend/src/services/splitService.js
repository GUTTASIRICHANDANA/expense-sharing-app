const Balance = require('../models/Balance');
const Expense = require('../models/Expense');

/**
 * Calculates splits based on type and updates balances.
 * @param {Object} expenseData - The expense object.
 */
const handleExpenseSplit = async (expenseData) => {
    const { paid_by, group, splits, split_type, amount } = expenseData;

    // 1. Validate splits
    let finalSplits = [];
    if (split_type === 'EQUAL') {
        const count = splits.length; // assuming splits contains all users involved
        const share = amount / count;
        // Handle repeating decimals by putting remainder on first person or similar? 
        // For simplicity, we just divide. 
        // Better: use cents/integers. Here using floats.
        finalSplits = splits.map(s => ({ ...s, amount: parseFloat(share.toFixed(2)) }));

        // Adjust for floating point errors
        const total = finalSplits.reduce((acc, curr) => acc + curr.amount, 0);
        if (total !== amount) {
            const diff = amount - total;
            finalSplits[0].amount += diff;
        }

    } else if (split_type === 'EXACT') {
        const total = splits.reduce((acc, s) => acc + s.amount, 0);
        if (total !== amount) {
            throw new Error(`Split amounts (${total}) do not equal total amount (${amount})`);
        }
        finalSplits = splits;

    } else if (split_type === 'PERCENTAGE') {
        const totalPercent = splits.reduce((acc, s) => acc + s.percentage, 0);
        if (totalPercent !== 100) {
            throw new Error('Percentages must add up to 100%');
        }
        finalSplits = splits.map(s => ({
            ...s,
            amount: (amount * s.percentage) / 100
        }));
    }

    // 2. Update Balances
    // Payer is 'paid_by'. Each split user 'owes' 'paid_by' the split amount.
    // Exception: If payer is in the split, they don't owe themselves.

    for (const split of finalSplits) {
        if (split.user.toString() === paid_by.toString()) continue;

        await updatePairBalance(paid_by, split.user, split.amount);
    }

    return finalSplits;
};

/**
 * Updates balance between two users.
 * Logic: User A (payer) is owed `amount` by User B (borrower).
 * We store localized pairs to avoid duplicates.
 */
const updatePairBalance = async (userA, userB, amount) => {
    // Determine order to ensure consistent storage
    // Convention: User1 < User2
    const [u1, u2] = [userA, userB].sort();

    let balance = await Balance.findOne({ user: u1, friend: u2 });

    if (!balance) {
        balance = new Balance({ user: u1, friend: u2, amount: 0 });
    }

    // If u1 is the payer (userA), u1 is OWED money. So balance increases.
    // If u1 is the borrower (userB), u1 OWES money. So balance decreases.

    if (u1.toString() === userA.toString()) {
        balance.amount += amount;
    } else {
        balance.amount -= amount;
    }

    await balance.save();
};

module.exports = {
    handleExpenseSplit
};
