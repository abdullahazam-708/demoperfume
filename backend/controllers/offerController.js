const Offer = require('../models/Offer');
const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all offers
// @route   GET /api/offers
// @access  Public
const getOffers = async (req, res) => {
    try {
        const { offerType, active } = req.query;
        let query = {};

        if (offerType) {
            query.offerType = offerType;
        }

        if (active === 'true') {
            const now = new Date();
            query.isActive = true;
            query.startDate = { $lte: now };
            query.endDate = { $gte: now };
        }

        const offers = await Offer.find(query)
            .populate('products', 'name price image')
            .populate('categories', 'name')
            .sort({ createdAt: -1 });

        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single offer
// @route   GET /api/offers/:id
// @access  Public
const getOfferById = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id)
            .populate('products', 'name price image')
            .populate('categories', 'name');

        if (offer) {
            res.json(offer);
        } else {
            res.status(404).json({ message: 'Offer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active offers by type
// @route   GET /api/offers/active/:type
// @access  Public
const getActiveOffersByType = async (req, res) => {
    try {
        const offers = await Offer.getActiveOffers(req.params.type);
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private/Admin
const createOffer = async (req, res) => {
    try {
        const {
            title,
            description,
            offerType,
            discountType,
            discountValue,
            startDate,
            endDate,
            isActive,
            products,
            categories,
            applyToAll,
            bannerImage,
            backgroundColor,
            textColor
        } = req.body;

        const offer = new Offer({
            title,
            description,
            offerType,
            discountType,
            discountValue,
            startDate,
            endDate,
            isActive,
            products: products || [],
            categories: categories || [],
            applyToAll: applyToAll || false,
            bannerImage,
            backgroundColor,
            textColor
        });

        const createdOffer = await offer.save();
        res.status(201).json(createdOffer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
const updateOffer = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);

        if (offer) {
            offer.title = req.body.title || offer.title;
            offer.description = req.body.description || offer.description;
            offer.offerType = req.body.offerType || offer.offerType;
            offer.discountType = req.body.discountType || offer.discountType;
            offer.discountValue = req.body.discountValue !== undefined ? req.body.discountValue : offer.discountValue;
            offer.startDate = req.body.startDate || offer.startDate;
            offer.endDate = req.body.endDate || offer.endDate;
            offer.isActive = req.body.isActive !== undefined ? req.body.isActive : offer.isActive;
            offer.products = req.body.products !== undefined ? req.body.products : offer.products;
            offer.categories = req.body.categories !== undefined ? req.body.categories : offer.categories;
            offer.applyToAll = req.body.applyToAll !== undefined ? req.body.applyToAll : offer.applyToAll;
            offer.bannerImage = req.body.bannerImage || offer.bannerImage;
            offer.backgroundColor = req.body.backgroundColor || offer.backgroundColor;
            offer.textColor = req.body.textColor || offer.textColor;

            const updatedOffer = await offer.save();
            res.json(updatedOffer);
        } else {
            res.status(404).json({ message: 'Offer not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
const deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);

        if (offer) {
            await offer.deleteOne();
            res.json({ message: 'Offer removed' });
        } else {
            res.status(404).json({ message: 'Offer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle offer active status
// @route   PATCH /api/offers/:id/toggle
// @access  Private/Admin
const toggleOfferStatus = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);

        if (offer) {
            offer.isActive = !offer.isActive;
            const updatedOffer = await offer.save();
            res.json(updatedOffer);
        } else {
            res.status(404).json({ message: 'Offer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getOffers,
    getOfferById,
    getActiveOffersByType,
    createOffer,
    updateOffer,
    deleteOffer,
    toggleOfferStatus
};
