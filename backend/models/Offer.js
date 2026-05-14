const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    offerType: {
        type: String,
        required: true,
        enum: ['weekly', 'monthly', 'yearly', 'seasonal', 'flash', 'special'],
        default: 'weekly'
    },
    discountType: {
        type: String,
        required: true,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    applyToAll: {
        type: Boolean,
        default: false
    },
    bannerImage: {
        type: String
    },
    backgroundColor: {
        type: String,
        default: '#FFF9F0'
    },
    textColor: {
        type: String,
        default: '#1a1a1a'
    }
}, {
    timestamps: true
});

// Method to check if offer is currently valid
offerSchema.methods.isValid = function () {
    const now = new Date();
    return this.isActive && now >= this.startDate && now <= this.endDate;
};

// Static method to get active offers
offerSchema.statics.getActiveOffers = function (offerType = null) {
    const now = new Date();
    const query = {
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now }
    };

    if (offerType) {
        query.offerType = offerType;
    }

    return this.find(query).populate('products categories');
};

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
