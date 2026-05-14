const Subscriber = require('../models/Subscriber');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribeNewsletter = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const subscriberExists = await Subscriber.findOne({ email });

        if (subscriberExists) {
            if (subscriberExists.status === 'unsubscribed') {
                subscriberExists.status = 'active';
                await subscriberExists.save();
                return res.status(200).json({ message: 'Welcome back! You have been re-subscribed.' });
            }
            return res.status(400).json({ message: 'You are already subscribed!' });
        }

        const subscriber = await Subscriber.create({ email });

        if (subscriber) {
            res.status(201).json({
                message: 'Subscribed successfully!',
            });
        } else {
            res.status(400).json({ message: 'Invalid subscriber data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all subscribers
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find({ status: 'active' }).sort('-createdAt');
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Blast newsletter for a product
// @route   POST /api/newsletter/blast/:id
// @access  Private/Admin
const blastNewsletter = async (req, res) => {
    try {
        const subscribers = await Subscriber.find({ status: 'active' });

        if (subscribers.length === 0) {
            return res.status(400).json({ message: 'No active subscribers found.' });
        }

        // In a real app, you would use an email service like SendGrid or Nodemailer here.
        // For this demonstration, we simulate the 'blast'

        res.json({
            message: `Product launch notification sent to ${subscribers.length} subscribers!`,
            count: subscribers.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    subscribeNewsletter,
    getSubscribers,
    blastNewsletter
};
