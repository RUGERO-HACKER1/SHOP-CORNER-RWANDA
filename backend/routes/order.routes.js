const express = require('express');
const router = express.Router();
const db = require('../models');
const jwt = require('jsonwebtoken');

// Helper: require admin for sensitive routes
async function requireAdmin(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });
        const decoded = jwt.decode(token);
        if (!decoded?.id) return res.status(401).json({ message: 'Invalid token' });
        const user = await db.User.findByPk(decoded.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Require Admin Role' });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

// Place Order (Pay on Delivery)
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

        const incomingItems = Array.isArray(items) ? items : [];
        const enrichedItems = [];

        // Stock Reduction Logic + enrich items with product data
        if (incomingItems.length) {
            for (const item of incomingItems) {
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

                    enrichedItems.push({
                        id: product.id,
                        title: product.title,
                        image: product.image,
                        price: item.price ?? product.price,
                        quantity: item.quantity || 1,
                        size: item.size || item.selectedSize || 'ONE_SIZE'
                    });
                }
            }
        }

        const initialStatus = 'Processing';
        const order = await db.Order.create({
            totalAmount,
            shippingAddress,
            status: initialStatus,
            UserId: userId,
            items: enrichedItems,
            trackingInfo: [
                { status: initialStatus, time: new Date(), message: 'Your order has been received and is being processed.' }
            ]
        });
        res.json({ message: 'Order placed successfully', orderId: order.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get My Orders (for logged-in customer)
router.get('/myorders', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.decode(token);
        if (!decoded?.id) return res.status(401).json({ message: 'Invalid token' });

        const orders = await db.Order.findAll({
            where: { UserId: decoded.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get All Orders
router.get('/', requireAdmin, async (req, res) => {
    try {
        const orders = await db.Order.findAll({ order: [['createdAt', 'DESC']] });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update Order Status
router.put('/:id/status', requireAdmin, async (req, res) => {
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

        // Socket emission can be plugged back in if needed
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update Order Location (Live Tracking)
router.put('/:id/location', requireAdmin, async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const order = await db.Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.currentLocation = { lat, lng, timestamp: new Date() };
        await order.save();

        // Optional: Emit socket event for real-time tracking if socket was enabled
        // req.app.get('io')?.emit('orderLocationUpdate', { id: order.id, location: order.currentLocation });

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Customer: Cancel own order (if still processing)
router.put('/:id/cancel', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });
        const decoded = jwt.decode(token);
        if (!decoded?.id) return res.status(401).json({ message: 'Invalid token' });

        const order = await db.Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.UserId !== decoded.id) return res.status(403).json({ message: 'Not allowed to cancel this order' });
        if (order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'cancelled') {
            return res.status(400).json({ message: 'Order cannot be cancelled' });
        }

        const history = order.trackingInfo || [];
        const newEntry = {
            status: 'Cancelled',
            time: new Date(),
            message: 'Order cancelled by customer before delivery.'
        };

        order.status = 'Cancelled';
        order.trackingInfo = [...history, newEntry];
        await order.save();

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
