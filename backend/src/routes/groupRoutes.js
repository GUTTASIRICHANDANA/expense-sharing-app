const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.post('/', groupController.createGroup);
router.post('/:id/members', groupController.addMember);
router.get('/:id', groupController.getGroup);
router.get('/', groupController.getAllGroups);

module.exports = router;
