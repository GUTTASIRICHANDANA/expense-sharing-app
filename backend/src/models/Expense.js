const mongoose = require('mongoose');

const splitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number, // Only for percentage split
        default: null
    }
}, { _id: false });

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    paid_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    split_type: {
        type: String,
        enum: ['EQUAL', 'EXACT', 'PERCENTAGE'],
        required: true
    },
    splits: [splitSchema],
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
