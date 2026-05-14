const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB Connected');

        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@perfumeshop.com' });

        if (adminExists) {
            console.log('Admin user already exists!');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@perfumeshop.com',
            password: 'admin123',
            isAdmin: true
        });

        console.log('Admin user created successfully!');
        console.log('Email: admin@perfumeshop.com');
        console.log('Password: admin123');
        console.log('Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
