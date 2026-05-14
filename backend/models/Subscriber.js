const mongoose = require('mongoose');

const subscriberSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        status: {
            type: String,
            enum: ['active', 'unsubscribed'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;
