const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    shopName: {
        type: String,
        required: true,
        default: 'Perfume Store'
    },
    contactEmail: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        default: ''
    },
    favicon: {
        type: String,
        default: ''
    },
    currency: {
        type: String,
        required: true,
        default: 'USD'
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    facebook: {
        type: String,
        default: ''
    },
    instagram: {
        type: String,
        default: ''
    },
    twitter: {
        type: String,
        default: ''
    },
    youtube: {
        type: String,
        default: ''
    },
    whatsapp: {
        type: String,
        default: ''
    },
    heroImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1595425970377-c97037db6271?w=1200'
    },
    heroBanners: {
        type: [String],
        default: ['https://images.unsplash.com/photo-1595425970377-c97037db6271?w=1200']
    },
    heritageLabel: {
        type: String,
        default: 'Our Heritage'
    },
    heritageTitle: {
        type: String,
        default: 'The Art of Olfactory Seduction'
    },
    heritageSubtitle: {
        type: String,
        default: 'The Art of Olfactory Excellence'
    },
    heritageDescription1: {
        type: String,
        default: 'Founded on the belief that a fragrance is the most intimate form of expression, The Velvet Collection merges centuries-old tradition with avant-garde chemistry. Every bottle is a culmination of thousands of hours of research, rare botanicals, and the relentless pursuit of the perfect note.'
    },
    heritageDescription2: {
        type: String,
        default: 'We do not simply sell perfume; we capture moments in glass. From the fields of Grasse to the modern laboratories of Paris, our journey is one of obsession—an obsession with the invisible architecture of scent.'
    },
    heritageImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1547637589-f54c34f5d7a4?w=800'
    },
    heritageStats: [
        {
            value: { type: String, default: '15+' },
            label: { type: String, default: 'Rare Extracts' }
        },
        {
            value: { type: String, default: '100%' },
            label: { type: String, default: 'Pure Essence' }
        },
        {
            value: { type: String, default: '24h' },
            label: { type: String, default: 'Lasting Sillage' }
        }
    ],
    openAiApiKey: {
        type: String,
        default: ''
    },
    shippingRules: [
        {
            minWeight: { type: Number, required: true },
            maxWeight: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
