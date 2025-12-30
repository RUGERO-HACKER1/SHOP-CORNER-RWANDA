const express = require('express');
const router = express.Router();
const db = require('../models');

// POST /api/contact - Public
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const newMessage = await db.ContactMessage.create({
            name,
            email,
            message
        });
        res.status(201).json(newMessage);
    } catch (err) {
        console.error("Contact Error:", err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// GET /api/contact - Admin Only (simplified auth for now, or use middleware)
router.get('/', async (req, res) => {
    try {
        // ideally check for admin role here
        const messages = await db.ContactMessage.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

module.exports = router;
