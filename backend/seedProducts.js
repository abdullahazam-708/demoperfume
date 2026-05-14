const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
    {
        name: 'Chanel No. 5',
        brand: 'Chanel',
        price: 120,
        description: 'An iconic fragrance with a timeless floral bouquet',
        image: '/images/chanel-no5.jpg',
        category: 'Women',
        countInStock: 15,
        rating: 4.8,
        numReviews: 245
    },
    {
        name: 'Dior Sauvage',
        brand: 'Dior',
        price: 95,
        description: 'A fresh and woody fragrance for the modern man',
        image: '/images/dior-sauvage.jpg',
        category: 'Men',
        countInStock: 20,
        rating: 4.7,
        numReviews: 189
    },
    {
        name: 'Tom Ford Black Orchid',
        brand: 'Tom Ford',
        price: 150,
        description: 'A luxurious and sensual oriental fragrance',
        image: '/images/black-orchid.jpg',
        category: 'Unisex',
        countInStock: 10,
        rating: 4.9,
        numReviews: 156
    },
    {
        name: 'Versace Eros',
        brand: 'Versace',
        price: 85,
        description: 'A passionate and powerful fragrance for men',
        image: '/images/versace-eros.jpg',
        category: 'Men',
        countInStock: 25,
        rating: 4.6,
        numReviews: 203
    },
    {
        name: 'Yves Saint Laurent Black Opium',
        brand: 'YSL',
        price: 110,
        description: 'A seductive coffee and vanilla fragrance',
        image: '/images/black-opium.jpg',
        category: 'Women',
        countInStock: 18,
        rating: 4.8,
        numReviews: 312
    },
    {
        name: 'Gucci Bloom',
        brand: 'Gucci',
        price: 105,
        description: 'A natural floral scent celebrating femininity',
        image: '/images/gucci-bloom.jpg',
        category: 'Women',
        countInStock: 12,
        rating: 4.5,
        numReviews: 178
    }
];

const seedProducts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB Connected');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Existing products cleared');

        // Insert sample products
        await Product.insertMany(sampleProducts);
        console.log('Sample products added successfully!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
