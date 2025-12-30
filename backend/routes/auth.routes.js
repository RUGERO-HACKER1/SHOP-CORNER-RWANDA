const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await db.User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.User.create({ email, password: hashedPassword, name: name || email.split('@')[0] });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        // Start: Fixed to include role
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
        // End: Fixed to include role
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        // Start: Fixed to include role
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
        // End: Fixed to include role
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Profile
router.put('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        // Decode token to get user ID (In prod use middleware)
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.id) return res.status(401).json({ message: 'Invalid Token' });

        const user = await db.User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { address, name } = req.body;
        if (address) user.address = address;
        if (name) user.name = name;

        await user.save();

        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            address: user.address
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get All Users
router.get('/', async (req, res) => {
    try {
        const users = await db.User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Delete User
router.delete('/:id', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.decode(token);
        const requestor = await db.User.findByPk(decoded.id);

        if (!requestor || requestor.role !== 'admin') {
            return res.status(403).json({ message: 'Require Admin Role' });
        }

        const userToDelete = await db.User.findByPk(req.params.id);
        if (!userToDelete) return res.status(404).json({ message: 'User not found' });

        await userToDelete.destroy();
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
