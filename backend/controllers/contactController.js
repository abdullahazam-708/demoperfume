const Contact = require('../models/Contact');
const Settings = require('../models/Settings');
const nodemailer = require('nodemailer');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        const contact = await Contact.create({
            name,
            email,
            phone,
            message
        });

        // Fetch settings for email notification
        const settings = await Settings.findOne({});
        const adminEmail = settings?.contactEmail || process.env.EMAIL_USER;
        const shopName = settings?.shopName || 'Perfume Store';

        // Optional: Send email notification to admin
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS && adminEmail) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: adminEmail,
                subject: `New Contact Form Submission from ${name} - ${shopName}`,
                text: `
                    Name: ${name}
                    Email: ${email}
                    Phone: ${phone || 'N/A'}
                    Message: ${message}
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Email error:', error);
                }
            });
        }

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: contact
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res) => {
    try {
        const messages = await Contact.find({}).sort('-createdAt');
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContactMessage = async (req, res) => {
    try {
        const message = await Contact.findById(req.params.id);

        if (message) {
            await message.deleteOne();
            res.json({ message: 'Message removed' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports = {
    submitContactForm,
    getContactMessages,
    deleteContactMessage
};
