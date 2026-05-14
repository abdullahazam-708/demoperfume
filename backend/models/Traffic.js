const mongoose = require('mongoose');

const trafficSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['impression', 'click'],
        required: true
    },
    path: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false
    },
    visitorId: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Traffic', trafficSchema);
