const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false
    })
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: 'postgres',
            logging: false
        }
    );

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'customer' }, // 'customer', 'admin'
    address: { type: DataTypes.JSONB } // { street, city, state, zip, phone }
});

const Product = sequelize.define('Product', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    originalPrice: { type: DataTypes.DECIMAL(10, 2) },
    image: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    sizes: { type: DataTypes.ARRAY(DataTypes.STRING) }
});

const Order = sequelize.define('Order', {
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    shippingAddress: { type: DataTypes.JSONB }
});

// Relations
User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, { through: 'OrderItems' });
Product.belongsToMany(Order, { through: 'OrderItems' });

const Review = sequelize.define('Review', {
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT },
});

User.hasMany(Review);
Review.belongsTo(User);

Product.hasMany(Review);
Review.belongsTo(Product);

const ContactMessage = sequelize.define('ContactMessage', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'New' }, // New, Read, Replied
    adminReply: { type: DataTypes.TEXT }
});

const db = {
    sequelize,
    User,
    Product,
    Order,
    Order,
    Review,
    ContactMessage
};

module.exports = db;
