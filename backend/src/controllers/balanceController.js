const Balance = require('../models/Balance');

exports.getBalances = async (req, res) => {
    try {
        const { userId } = req.params;
        // Find documents where this user is involved
        const balances = await Balance.find({
            $or: [{ user: userId }, { friend: userId }]
        }).populate('user', 'name').populate('friend', 'name');

        // Transform into a friendly format for the user
        // "I owe X" or "X owes me"
        const formatted = balances.map(b => {
            // Logic: Balance stores pair (user, friend) and amount.
            // If amount > 0: user is owed by friend.
            // If amount < 0: user owes friend.

            // We want to return relative to `req.params.userId`.
            // Let's identify if the requestor is `user` or `friend` in the doc.

            const isUserA = b.user._id.toString() === userId;
            const other = isUserA ? b.friend : b.user;
            let amount = isUserA ? b.amount : -b.amount; // Invert if we are the 'friend' perspective

            if (amount === 0) return null; // Settled

            return {
                other_user: other,
                amount: amount, // Positive = You are owed. Negative = You owe.
                status: amount > 0 ? 'owed' : 'owe'
            };
        }).filter(b => b !== null && Math.abs(b.amount) > 0.01); // Filter small floating point diffs

        res.json(formatted);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.settleDues = async (req, res) => {
    try {
        const { user1Id, user2Id } = req.body;
        // Simplest settlement: Clear the balance record
        // Or strict settlement: Pay an amount.
        // Request "Settle dues fully".

        const [u1, u2] = [user1Id, user2Id].sort();

        const balance = await Balance.findOne({ user: u1, friend: u2 });
        if (balance) {
            balance.amount = 0;
            await balance.save();
        }
        res.json({ message: 'Settled up successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
