const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/', expenseController.addExpense);
router.get('/', expenseController.getAllExpenses);
router.get('/group/:groupId', expenseController.getGroupExpenses);

module.exports = router;
