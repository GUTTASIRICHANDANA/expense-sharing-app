const Group = require('../models/Group');
const User = require('../models/User');

exports.createGroup = async (req, res) => {
    try {
        const { name, members } = req.body; // members is array of userIds
        const group = await Group.create({ name, members });
        res.status(201).json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.addMember = async (req, res) => {
    try {
        const { userId } = req.body;
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ error: 'Group not found' });

        if (!group.members.includes(userId)) {
            group.members.push(userId);
            await group.save();
        }
        res.json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate('members', 'name email');
        if (!group) return res.status(404).json({ error: 'Group not found' });
        res.json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find().populate('members', 'name');
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
