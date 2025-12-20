const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    friend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        default: 0
    } // Positive: user is owed by friend. Negative: user owes friend.
}, { timestamps: true });

// Ensure unique pair of user and friend to avoid duplicate records? 
// Simplification: We will strictly manage pairs such that user < friend ID sorting or just handle both directions.
// Better: Store directed edges or "net" balance. 
// Plan: `amount` represents how much `friend` owes `user`. 
// If positive: friend owes user. If negative: user owes friend.
// We should probably ensure we only store one record per pair to avoid A->B: 10 and B->A: -10 confusion.
// Strategy: Always store with sorting logic in Service, or query both ways.

module.exports = mongoose.model('Balance', balanceSchema);
