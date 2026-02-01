const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models');

dotenv.config();

const app = express();
const http = require('http');
// const { Server } = require('socket.io');
const server = http.createServer(app);
/* const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"]
    }
}); */

const PORT = process.env.PORT || 5000;

// Socket.io connection
/* io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
}); */

// Middleware
app.use(cors());
app.use(express.json());

// Pass io to routes
// app.set('io', io);

// Sync DB and Start Server
db.sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced...');

        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

        // Background Auto-seed
        (async () => {
            try {
                const seed = require('./seed');
                await seed();
            } catch (err) {
                console.error('Auto-seed failed:', err);
            }
        })();
    })
    .catch(err => console.log('Error syncing DB: ' + err));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/ai', require('./routes/ai.routes'));

// Test Route
app.get('/', (req, res) => res.send('API Running'));

// Start Server
// Server started in sync block

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Optional: Log error but keep server running for now to debug
    console.error(err);
});

process.on('uncaughtException', (err) => {
    console.log(`Uncaught Exception: ${err.message}`);
    console.error(err);
    // process.exit(1); // Keep alive to see output in terminal
});

// Keep process alive hack (should not be needed but debugging)
setInterval(() => {
    // heartbeat
}, 10000);
