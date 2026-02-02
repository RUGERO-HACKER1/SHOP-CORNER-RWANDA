const express = require('express');
const router = express.Router();
const controller = require('../controllers/ai.controller');
const multer = require('multer');

// Voice notes: keep in memory; forward to transcription provider
const uploadAudio = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

router.post('/chat', controller.chat);
router.post('/voice', uploadAudio.single('audio'), controller.voice);
router.post('/tts', controller.tts);

module.exports = router;
