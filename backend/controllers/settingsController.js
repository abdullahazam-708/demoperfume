const Settings = require('../models/Settings');

// @desc    Get shop settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            // Create default settings if none exist
            settings = await Settings.create({
                shopName: 'Perfume Store',
                contactEmail: 'admin@example.com',
                currency: 'USD',
                whatsapp: ''
            });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update shop settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (settings) {
            settings.shopName = req.body.shopName || settings.shopName;
            settings.contactEmail = req.body.contactEmail || settings.contactEmail;
            settings.currency = req.body.currency || settings.currency;
            settings.address = req.body.address !== undefined ? req.body.address : settings.address;
            settings.phone = req.body.phone !== undefined ? req.body.phone : settings.phone;
            settings.facebook = req.body.facebook !== undefined ? req.body.facebook : settings.facebook;
            settings.instagram = req.body.instagram !== undefined ? req.body.instagram : settings.instagram;
            settings.twitter = req.body.twitter !== undefined ? req.body.twitter : settings.twitter;
            settings.youtube = req.body.youtube !== undefined ? req.body.youtube : settings.youtube;
            settings.heroImage = req.body.heroImage !== undefined ? req.body.heroImage : settings.heroImage;
            settings.heroBanners = req.body.heroBanners !== undefined ? req.body.heroBanners : settings.heroBanners;
            settings.logo = req.body.logo !== undefined ? req.body.logo : settings.logo;
            settings.favicon = req.body.favicon !== undefined ? req.body.favicon : settings.favicon;
            settings.whatsapp = req.body.whatsapp !== undefined ? req.body.whatsapp : settings.whatsapp;
            settings.shippingRules = req.body.shippingRules !== undefined ? req.body.shippingRules : settings.shippingRules;

            // Heritage Fields
            settings.heritageLabel = req.body.heritageLabel !== undefined ? req.body.heritageLabel : settings.heritageLabel;
            settings.heritageTitle = req.body.heritageTitle !== undefined ? req.body.heritageTitle : settings.heritageTitle;
            settings.heritageSubtitle = req.body.heritageSubtitle !== undefined ? req.body.heritageSubtitle : settings.heritageSubtitle;
            settings.heritageDescription1 = req.body.heritageDescription1 !== undefined ? req.body.heritageDescription1 : settings.heritageDescription1;
            settings.heritageDescription2 = req.body.heritageDescription2 !== undefined ? req.body.heritageDescription2 : settings.heritageDescription2;
            settings.heritageImage = req.body.heritageImage !== undefined ? req.body.heritageImage : settings.heritageImage;
            settings.heritageStats = req.body.heritageStats !== undefined ? req.body.heritageStats : settings.heritageStats;
            settings.openAiApiKey = req.body.openAiApiKey !== undefined ? req.body.openAiApiKey : settings.openAiApiKey;

            const updatedSettings = await settings.save();
            res.json(updatedSettings);
        } else {
            const newSettings = await Settings.create(req.body);
            res.json(newSettings);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
