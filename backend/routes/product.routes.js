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
        let imageHash = null;
        if (imageUrl) {
            try {
                imageHash = await dHashFromUrl(imageUrl);
            } catch (e) {
                console.error("Image hashing failed", e);
            }
        }

        // Handle sizes (optional now)
        let sizesArray = [];
        if (sizes) {
            if (typeof sizes === 'string') {
                if (sizes.trim()) {
                    try {
                        sizesArray = JSON.parse(sizes);
                    } catch (e) {
                        sizesArray = sizes.split(',').map(s => s.trim());
                    }
                }
            } else if (Array.isArray(sizes)) {
                sizesArray = sizes;
            }
        }

        // Helper to parse numbers safely
        const parseNum = (val) => {
            if (val === '' || val === null || val === undefined) return null;
            const n = Number(val);
            return Number.isFinite(n) ? n : null;
        };

        const safePrice = parseNum(price);
        const safeOriginalPrice = parseNum(originalPrice);

        if (safePrice === null) {
            return res.status(400).json({ message: 'Invalid or missing price' });
        }

        const product = await db.Product.create({
            title,
            description,
            price: safePrice,
            originalPrice: safeOriginalPrice,
            category: category || 'General', // Default category if missing
            sizes: sizesArray,
            image: imageUrl,
            images: allImages,
            imageHash,
            stockQuantity: 100, // Default stock for simplified flow
            variants: []
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update Product (supports updating images)
router.put('/:id', verifyAdmin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const { title, description, price, originalPrice, category, sizes, existingImages } = req.body;

        const files = req.files || {};
        // New main image if uploaded
        const newMainFile = files.image && files.image[0];
        // New gallery images
        const newGalleryFiles = files.images || [];

        // Determine Main Image
        const imageUrl = newMainFile ? newMainFile.path : product.image;

        // Determine Full Gallery
        // 1. Start with existing images (parsed from body, which might be a JSON string or array)
        let keptImages = [];
        if (existingImages) {
            if (Array.isArray(existingImages)) keptImages = existingImages;
            else if (typeof existingImages === 'string') {
                try { keptImages = JSON.parse(existingImages); } catch (e) { keptImages = [existingImages]; }
            }
        } else {
            // If not sent, assume we keep what we have (unless we want to support clearing all)
            // But usually frontend will send the list of what to keep.
            // If frontend sends nothing, maybe it means strictly add? 
            // Let's default to: if 'existingImages' is undefined, we use product.images. 
            // IF it is sent (even empty), we use it.
            if (existingImages === undefined) {
                keptImages = product.images || [];
            }
        }

        const newImagePaths = newGalleryFiles.map(f => f.path);

        // Combine: kept images + new gallery images
        // Also ensure the main 'imageUrl' is in the list if desired, or keep it separate.
        // Usually 'images' array contains ALL views.
        let allImages = [...keptImages, ...newImagePaths];

        // Ensure the main image is also in the list if the list is empty? 
        // Or just let it be. Shein style usually has main image as part of the gallery.
        // Let's ensure 'imageUrl' is at least somewhere if allImages is empty.
        if (allImages.length === 0 && imageUrl) {
            allImages = [imageUrl];
        }

        const imageHash = newMainFile ? await dHashFromUrl(imageUrl) : product.imageHash;

        // Helper to parse numbers safely
        const parseNum = (val) => {
            if (val === '' || val === null || val === undefined) return null;
            const n = Number(val);
            return Number.isFinite(n) ? n : null;
        };

        const safePrice = parseNum(price);
        const safeOriginalPrice = parseNum(originalPrice);

        // Sanitize sizes
        let sizesArray = sizes;
        if (typeof sizes === 'string') {
            if (!sizes.trim()) {
                sizesArray = [];
            } else {
                try {
                    sizesArray = JSON.parse(sizes);
                } catch (e) {
                    sizesArray = sizes.split(',').map(s => s.trim());
                }
            }
        }

        await product.update({
            title,
            description,
            price: safePrice,
            originalPrice: safeOriginalPrice,
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
