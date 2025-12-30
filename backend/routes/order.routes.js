const express = require('express');
const router = express.Router();
const db = require('../models');

// Place Order
router.post('/', async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;
        const order = await db.Order.create({
            totalAmount,
            shippingAddress,
            status: 'Processing'
        });
        res.json({ message: 'Order placed successfully', orderId: order.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get My Orders
router.get('/myorders', async (req, res) => {
    try {
        const orders = await db.Order.findAll({
            order: [['createdAt', 'DESC']]
        });
        // if (orders.length === 0) { ... } -> Removed mock data
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get All Orders
router.get('/', async (req, res) => {
    try {
        const orders = await db.Order.findAll({ order: [['createdAt', 'DESC']] });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update Order Status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await db.Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
