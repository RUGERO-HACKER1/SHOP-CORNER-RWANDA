const express = require('express');
const router = express.Router();
const controller = require('../controllers/ai.controller');

router.post('/chat', controller.chat);

module.exports = router;
