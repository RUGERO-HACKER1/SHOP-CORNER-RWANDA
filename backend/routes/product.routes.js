const express = require('express');
const router = express.Router();
const db = require('../models');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { dHashFromUrl, dHashFromImageRef, hammingDistanceHex64 } = require('../utils/imageHash');

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

// Admin: Create Product with Images (main + optional extra)
router.post('/', verifyAdmin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), async (req, res) => {
    try {
        const { title, description, price, originalPrice, category, sizes } = req.body;
        const files = req.files || {};
        const primaryFile = files.image && files.image[0];
        const secondaryFile = files.image2 && files.image2[0];

        const imageUrl = primaryFile ? primaryFile.path : null;
        const extraImages = [];
        if (secondaryFile) extraImages.push(secondaryFile.path);

        const allImages = imageUrl ? [imageUrl, ...extraImages] : extraImages;
        const imageHash = imageUrl ? await dHashFromUrl(imageUrl) : null;

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
            image: imageUrl,
            images: allImages,
            imageHash
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update Product (supports updating images)
router.put('/:id', verifyAdmin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const { title, description, price, originalPrice, category, sizes } = req.body;

        const files = req.files || {};
        const primaryFile = files.image && files.image[0];
        const secondaryFile = files.image2 && files.image2[0];

        const imageUrl = primaryFile ? primaryFile.path : product.image; // Keep old main image if no new one
        const existingImages = Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []);
        const extraImages = [];
        if (secondaryFile) extraImages.push(secondaryFile.path);

        const allImages = primaryFile
            ? [imageUrl, ...extraImages]
            : (existingImages.length ? existingImages : [imageUrl, ...extraImages].filter(Boolean));

        const imageHash = primaryFile ? await dHashFromUrl(imageUrl) : product.imageHash;

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
            image: imageUrl,
            images: allImages,
            imageHash
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

// Admin: Update only stock quantity (inventory quick actions)
router.put('/:id/stock', verifyAdmin, async (req, res) => {
    try {
        const { stockQuantity } = req.body;
        const product = await db.Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const newQty = Number(stockQuantity);
        if (!Number.isFinite(newQty) || newQty < 0) {
            return res.status(400).json({ message: 'Invalid stock quantity' });
        }

        product.stockQuantity = newQty;
        await product.save();

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public: Visual search by uploaded image (find similar products)
// Usage: multipart/form-data with field "image"
router.post('/visual-search', upload.single('image'), async (req, res) => {
    try {
        if (!req.file?.path) {
            return res.status(400).json({ message: 'Image file is required (field: "image")' });
        }

        const queryImageUrl = req.file.path;
        const queryHash = await dHashFromUrl(queryImageUrl);

        // Opportunistic backfill: compute missing hashes in small batches to avoid "always empty" results
        // (Existing catalogs may predate this feature.)
        const missing = await db.Product.findAll({
            where: {
                image: { [Op.not]: null },
                imageHash: { [Op.is]: null }
            },
            limit: 60,
            attributes: ['id', 'image']
        });

        for (const p of missing) {
            try {
                const hash = await dHashFromImageRef(p.image);
                await db.Product.update({ imageHash: hash }, { where: { id: p.id } });
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error('Failed hashing product image', p.id, e.message);
            }
        }

        // Grab candidates with hashes; compute distance in JS (fast enough for small/medium catalogs)
        const candidates = await db.Product.findAll({
            where: {
                imageHash: { [Op.not]: null }
            },
            attributes: ['id', 'title', 'price', 'image', 'category', 'imageHash']
        });

        const ranked = candidates
            .map(p => {
                const distance = hammingDistanceHex64(queryHash, p.imageHash);
                return {
                    id: p.id,
                    title: p.title,
                    price: p.price,
                    image: p.image,
                    category: p.category,
                    distance
                };
            })
            .filter(x => Number.isFinite(x.distance))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 12);

        return res.status(200).json({
            query: {
                image: queryImageUrl,
                hash: queryHash
            },
            results: ranked
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Admin: Backfill missing product image hashes (useful after enabling visual search)
router.post('/reindex-image-hashes', verifyAdmin, async (req, res) => {
    try {
        const products = await db.Product.findAll({
            where: {
                image: { [Op.not]: null },
                imageHash: { [Op.is]: null }
            }
        });

        let updated = 0;
        for (const p of products) {
            try {
                const hash = await dHashFromImageRef(p.image);
                await p.update({ imageHash: hash });
                updated++;
            } catch (e) {
                // skip bad images but continue
                // eslint-disable-next-line no-console
                console.error('Failed hashing product image', p.id, e.message);
            }
        }

        res.json({ message: 'Reindex complete', updated, totalMissing: products.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
