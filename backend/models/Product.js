const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        default: 0
    },
    onSale: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
    weight: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    images: [String],
    seoTitle: {
        type: String,
        default: ''
    },
    seoDescription: {
        type: String,
        default: ''
    },
    seoKeywords: {
        type: String,
        default: ''
    },
    variants: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        discountPrice: { type: Number, default: 0 },
        countInStock: { type: Number, required: true, default: 0 },
        weight: { type: Number, required: true, default: 0 }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
