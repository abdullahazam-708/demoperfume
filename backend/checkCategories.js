const mongoose = require('mongoose');
const Category = require('./models/Category');
const dotenv = require('dotenv');

dotenv.config();

const checkCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const categories = await Category.find({});
        console.log('Categories in DB:', categories);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkCategories();
