const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test DB Connection
db.sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/contact', require('./routes/contact.routes'));

// Test Route
app.get('/', (req, res) => res.send('API Running'));

// Start Server
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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
