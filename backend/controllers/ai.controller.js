const db = require('../models');
const { Op } = require('sequelize');
const axios = require('axios');
const googleTTS = require('google-tts-api');

// We now support only English, but keep the helpers for clarity.
function normalizeLang() {
    return 'en';
}

function getSystemPrompt() {
    // English-only system prompt with a friendly, slightly funny "beauty girl" personality.
    return "You are a stylish, funny, warm female-sounding AI shopping assistant for Shop Corner Rwanda. "
        + "You always respond in natural, conversational English. Help users find products, give outfit and styling ideas, "
        + "and answer general questions clearly. Keep a light, playful tone (like a fashionable best friend), "
        + "but stay respectful and professional. If the user is looking for products, proactively suggest relevant items from the catalog.";
}

function t(key, vars = {}) {
    const dict = {
        greeting: "Hello, gorgeous! Welcome to Shop Corner Rwanda. I can help you find dresses, shirts, shoes, accessories and more — and I can show you actual product images from the shop. What are you shopping for today?",
        empty: (term) => `I couldn’t find any products matching “${term}”. Try something a bit more general like “shirt”, “pants”, “shoes”, or “dress” and I’ll do my magic again.`,
        found: (term, list) => `Here’s what I found for “${term}”: ${list}. I’ve also pulled some pieces with images below so you can quickly scan the vibe. Tell me if you want something more specific or a different style.`,
        identity: "Nice to meet you! I’m the Shop Corner AI stylist — think of me as your always-awake shopping bestie in English.",
        generic: "I’m not totally sure I caught that. Tell me the product or style you’re after — for example, “red party dress”, “white sneakers for everyday”, or just say “show me images of summer dresses” and I’ll bring options with pictures.",
        voiceEmpty: "Hmm, I couldn’t really hear anything in that voice note. Could you try again, just a bit closer or a little louder?",
    };
    const value = dict[key];
    if (typeof value === 'function') return value(vars.term, vars.list);
    return value || key;
}

async function searchProductsFromMessage(message) {
    const lower = String(message || '').toLowerCase();
    const keywords = lower.split(/\s+/).filter(Boolean);

    const stopWords = [
        'i', 'im', 'am', 'want', 'to', 'buy', 'a', 'an', 'the', 'search', 'for', 'find', 'me',
        'some', 'looking', 'is', 'are', 'do', 'you', 'have', 'please', 'show', 'need', 'check',
        'how', 'much', 'cost', 'can', 'help', 'price', 'of', 'in', 'at',
        // extra generic words that shouldn’t become product keywords
        'today', 'tonight', 'tomorrow', 'something', 'anything', 'recommend', 'recommendation', 'recommendations'
    ];

    const terms = keywords
        .map(k => k.replace(/[^\p{L}\p{N}]+/gu, '').trim())
        .filter(k => k.length > 2 && !stopWords.includes(k))
        .slice(0, 2);

    if (!terms.length) return [];

    const results = [];
    for (const term of terms) {
        const found = await db.Product.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${term}%` } },
                    { description: { [Op.iLike]: `%${term}%` } },
                    { category: { [Op.iLike]: `%${term}%` } }
                ]
            },
            limit: 6,
            attributes: ['title', 'price', 'id', 'image']
        });
        for (const p of found) results.push(p);
    }

    // uniq by id
    const byId = new Map();
    for (const p of results) byId.set(p.id, p);
    return Array.from(byId.values()).slice(0, 6);
}

async function generateAssistantReply(message) {
    const lang = normalizeLang();
    console.log('AI Request:', message);
    console.log('Groq Key Present:', !!process.env.GROQ_API_KEY);

    // 1) Try Groq Chat Completions (Online)
    if (process.env.GROQ_API_KEY) {
        try {
            const primaryModel = process.env.GROQ_MODEL || "llama-3.1-70b-versatile";
            const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                model: primaryModel,
                messages: [
                    { role: "system", content: getSystemPrompt() },
                    { role: "user", content: message }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const aiResponse = response.data.choices?.[0]?.message?.content;
            if (aiResponse) {
                const products = await searchProductsFromMessage(message, lang);
                return { response: aiResponse, source: 'groq', ...(products.length ? { products } : {}) };
            }
        } catch (err) {
            console.error('Groq API failed:', err.response?.data || err.message);
            // Retry once with a smaller commonly-available model if a model was deprecated/decommissioned
            const msg = err.response?.data?.error?.message || '';
            if (msg.toLowerCase().includes('decommission') || msg.toLowerCase().includes('deprecated')) {
                try {
                    const retryResponse = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                        model: "llama-3.1-8b-instant",
                        messages: [
                            { role: "system", content: getSystemPrompt() },
                            { role: "user", content: message }
                        ]
                    }, {
                        headers: {
                            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    const aiResponse = retryResponse.data.choices?.[0]?.message?.content;
                    if (aiResponse) {
                        const products = await searchProductsFromMessage(message, lang);
                        return { response: aiResponse, source: 'groq', ...(products.length ? { products } : {}) };
                    }
                } catch (retryErr) {
                    console.error('Groq retry failed:', retryErr.response?.data || retryErr.message);
                }
            }
        }
    }

    // 2) Search Fallback (Offline Mode)
    const keywords = message.toLowerCase().split(/\s+/);
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'morning', 'afternoon', 'evening'];
    const isGreeting = greetings.some(g => new RegExp(`\\b${g}\\b`, 'i').test(message));

    if (isGreeting && keywords.length < 5) {
        return {
            response: t('greeting'),
            source: 'rule-based-greeting'
        };
    }

    const stopWords = [
        'i', 'im', 'am', 'want', 'to', 'buy', 'a', 'an', 'the', 'search', 'for', 'find', 'me',
        'some', 'looking', 'is', 'are', 'do', 'you', 'have', 'please', 'show', 'need', 'check',
        'how', 'much', 'cost', 'can', 'help', 'price', 'of', 'in', 'at',
        'today', 'tonight', 'tomorrow', 'something', 'anything', 'recommend', 'recommendation', 'recommendations'
    ];
    const searchTerms = keywords.filter(k => !stopWords.includes(k) && k.length > 1);

    console.log('Search Terms:', searchTerms);

    if (searchTerms.length > 0) {
        const searchTerm = searchTerms[0];
        console.log(`Searching DB for: ${searchTerm}`);

        const products = await db.Product.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${searchTerm}%` } },
                    { description: { [Op.iLike]: `%${searchTerm}%` } },
                    { category: { [Op.iLike]: `%${searchTerm}%` } }
                ]
            },
            limit: 3,
            attributes: ['title', 'price', 'id', 'image']
        });

        if (products.length > 0) {
            const productList = products.map(p => `${p.title} ($${p.price})`).join(', ');
            return {
                    response: t('found', { term: searchTerm, list: productList }),
                products,
                source: 'rule-based-search'
            };
        }
        return {
            response: t('empty', { term: searchTerm }),
            source: 'rule-based-empty'
        };
    }

    if (message.toLowerCase().includes('rugero') || message.toLowerCase().includes('who are you')) {
        return {
            response: t('identity'),
            source: 'rule-based-identity'
        };
    }

    return {
        response: t('generic'),
        source: 'rule-based-generic'
    };
}

exports.chat = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: "Message is required" });
    }

    try {
        const result = await generateAssistantReply(message);
        return res.status(200).json(result);
    } catch (error) {
        console.error('AI Chat Error:', error);
        return res.status(500).json({ message: "I'm having a temporary connection issue. Please try again." });
    }
};

exports.voice = async (req, res) => {
    try {
        const lang = normalizeLang();
        if (!req.file?.buffer) {
            return res.status(400).json({ message: 'Audio file is required (field: "audio")' });
        }
        if (!process.env.GROQ_API_KEY) {
            return res.status(400).json({ message: 'GROQ_API_KEY is required for voice messages' });
        }

        const sttModel = process.env.GROQ_STT_MODEL || 'whisper-large-v3';
        const audioBlob = new Blob([req.file.buffer], { type: req.file.mimetype || 'audio/webm' });
        const form = new FormData();
        form.append('file', audioBlob, req.file.originalname || 'voice.webm');
        form.append('model', sttModel);
        // Hint transcription language when known (Kinyarwanda: "rw")
        form.append('language', lang);

        const sttResp = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: form
        });

        const sttJson = await sttResp.json().catch(() => null);
        if (!sttResp.ok) {
            return res.status(502).json({
                message: 'Voice transcription failed',
                error: sttJson || null
            });
        }

        const transcript = sttJson?.text?.trim() || '';
        if (!transcript) {
            return res.status(200).json({
                transcript: '',
                response: t('voiceEmpty'),
                source: 'voice-empty'
            });
        }

        const result = await generateAssistantReply(transcript);
        return res.status(200).json({
            transcript,
            ...result
        });
    } catch (error) {
        console.error('AI Voice Error:', error);
        return res.status(500).json({ message: "I'm having a temporary connection issue. Please try again." });
    }
};

exports.tts = async (req, res) => {
    try {
        const { text } = req.body || {};
        const content = String(text || '').trim();
        if (!content) {
            return res.status(400).json({ message: 'text is required' });
        }

        const url = googleTTS.getAudioUrl(content, {
            lang: 'en',
            slow: false,
            host: 'https://translate.google.com',
        });

        const audioResp = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            },
            timeout: 20000
        });

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).send(Buffer.from(audioResp.data));
    } catch (error) {
        console.error('AI TTS Error:', error.response?.data || error.message);
        return res.status(500).json({ message: "TTS failed. Please try again." });
    }
};
