const express = require('express');
const router = express.Router();
const db = require('../models');
const jwt = require('jsonwebtoken');

// Place Order
router.post('/', async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        let userId = null;
        if (token) {
            try {
                const decoded = jwt.decode(token);
                userId = decoded?.id;
            } catch (e) { console.error('Token decode failed', e); }
        }

        // Stock Reduction Logic
        if (items && Array.isArray(items)) {
            for (const item of items) {
                const product = await db.Product.findByPk(item.id);
                if (product) {
                    // Reduce base stock
                    product.stockQuantity = Math.max(0, (product.stockQuantity || 0) - (item.quantity || 1));

                    // Reduce variant stock if size/color specified
                    if (product.variants && (item.size || item.selectedSize)) {
                        const targetSize = item.size || item.selectedSize;
                        const variantIndex = product.variants.findIndex(v => v.size === targetSize);
                        if (variantIndex !== -1) {
                            const updatedVariants = [...product.variants];
                            updatedVariants[variantIndex].stock = Math.max(0, (updatedVariants[variantIndex].stock || 0) - (item.quantity || 1));
                            product.variants = updatedVariants;
                        }
                    }
                    await product.save();
                }
            }
        }

        const initialStatus = 'Processing';
        const order = await db.Order.create({
            totalAmount,
            shippingAddress,
            status: initialStatus,
            UserId: userId,
            trackingInfo: [
                { status: initialStatus, time: new Date(), message: 'Your order has been received and is being processed.' }
            ]
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
        const { status, message } = req.body;
        const order = await db.Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const history = order.trackingInfo || [];
        const newEntry = {
            status,
            time: new Date(),
            message: message || `Order status updated to ${status}`
        };

        order.status = status;
        order.trackingInfo = [...history, newEntry];
        await order.save();

        // Socket Emission
        /* const io = req.app.get('io');
        if (io) {
            io.emit('orderUpdate', order);
            if (order.UserId) {
                io.to(order.UserId.toString()).emit('notification', {
                    title: 'Order Update',
                    message: `Your order #${order.id} status is now ${status}`,
                    orderId: order.id,
                    type: 'order'
                });
            }
            console.log(`Socket events emitted for order ${order.id}`);
        } */

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
