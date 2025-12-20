const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceController');

router.get('/:userId', balanceController.getBalances);
router.post('/settle', balanceController.settleDues); // Body: user1Id, user2Id

module.exports = router;
