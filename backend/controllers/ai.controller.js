const db = require('../models');
const { Op } = require('sequelize');
const axios = require('axios');

exports.chat = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: "Message is required" });
    }

    try {
        console.log('AI Request:', message);
        console.log('Groq Key Present:', !!process.env.GROQ_API_KEY);

        // 1. Try Groq API (Llama3) - Priority
        if (process.env.GROQ_API_KEY) {
            try {
                const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                    model: "llama3-70b-8192",
                    messages: [
                        { role: "system", content: "You are a helpful shopping assistant for Shop Corner Rwanda. You help users find products, give styling advice, and answer questions. Be polite, concise, and helpful. If asked for a product, mention you can look it up." },
                        { role: "user", content: message }
                    ]
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                const aiResponse = response.data.choices[0].message.content;
                return res.status(200).json({
                    response: aiResponse,
                    source: 'groq'
                });

            } catch (err) {
                console.error('Groq API failed:', err.response?.data || err.message);
                // Fall through to fallback
            }
        }

        // 2. Search Fallback (Robust "Offline Mode")
        const keywords = message.toLowerCase().split(/\s+/); // Split by any whitespace

        // Smart Greeting detection (Word boundary check)
        const greetings = ['hi', 'hello', 'hey', 'greetings', 'morning', 'afternoon', 'evening'];
        // Check if ANY greeting word exists as a whole word in the message
        const isGreeting = greetings.some(g => new RegExp(`\\b${g}\\b`, 'i').test(message));

        if (isGreeting && keywords.length < 5) {
            return res.status(200).json({
                response: "Hello! welcome to Shop Corner Rwanda. I can help you find products like dresses, shirts, or accessories. What are you looking for?",
                source: 'rule-based-greeting'
            });
        }

        // Expanded Stop Words
        const stopWords = ['i', 'im', 'am', 'want', 'to', 'buy', 'a', 'an', 'the', 'search', 'for', 'find', 'me', 'some', 'looking', 'is', 'are', 'do', 'you', 'have', 'please', 'show', 'need', 'check', 'how', 'much', 'cost', 'can', 'help', 'price', 'of', 'in', 'at'];
        const searchTerms = keywords.filter(k => !stopWords.includes(k) && k.length > 1); // Filter short garbage too

        console.log('Search Terms:', searchTerms);

        if (searchTerms.length > 0) {
            // Priority search: First meaningful word
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
                return res.status(200).json({
                    response: `I found these products matching "${searchTerm}": ${productList}.`,
                    products: products,
                    source: 'rule-based-search'
                });
            } else {
                return res.status(200).json({
                    response: `I couldn't find any products matching "${searchTerm}". Try general terms like "shirt", "pant", "shoe", or "dress".`,
                    source: 'rule-based-empty'
                });
            }
        }

        // Identity / Small talk handling fallback
        if (message.toLowerCase().includes('rugero') || message.toLowerCase().includes('who are you')) {
            return res.status(200).json({
                response: "Nice to meet you! I am the Shop Corner AI Assistant.",
                source: 'rule-based-identity'
            });
        }

        // Generic catch-all
        return res.status(200).json({
            response: "I'm not sure I understood that. Could you tell me the name of the product you are looking for? (e.g. 'Red Dress')",
            source: 'rule-based-generic'
        });

    } catch (error) {
        console.error('AI Chat Error:', error);
        return res.status(500).json({ message: "I'm having a temporary connection issue. Please try again." });
    }
};
