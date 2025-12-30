const express = require('express');
const router = express.Router();
const db = require('../models');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });
const jwt = require('jsonwebtoken');

// Middleware to check Admin
const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await db.User.findByPk(decoded.id);

        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Require Admin Role' });
        }
    } catch (err) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};

router.get('/', async (req, res) => {
    try {
        const products = await db.Product.findAll();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Create Product with Image
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, description, price, originalPrice, category, sizes } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        // Handle sizes if sent as string or array
        let sizesArray = sizes;
        if (typeof sizes === 'string') {
            // Try parsing if it's JSON string, else split by comma
            try {
                sizesArray = JSON.parse(sizes);
            } catch (e) {
                sizesArray = sizes.split(',').map(s => s.trim());
            }
        }

        const product = await db.Product.create({
            title,
            description,
            price,
            originalPrice,
            category,
            sizes: sizesArray,
            image: imageUrl
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update Product
router.put('/:id', verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const { title, description, price, originalPrice, category, sizes } = req.body;
        const imageUrl = req.file ? req.file.path : product.image; // Keep old image if no new one

        let sizesArray = sizes;
        if (typeof sizes === 'string') {
            try {
                sizesArray = JSON.parse(sizes);
            } catch (e) {
                // If it's a comma-separated string, keep it as array
                sizesArray = sizes.split(',').map(s => s.trim());
            }
        }

        await product.update({
            title,
            description,
            price,
            originalPrice,
            category,
            sizes: sizesArray,
            image: imageUrl
        });

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Delete Product
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
