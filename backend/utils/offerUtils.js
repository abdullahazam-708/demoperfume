const Offer = require('../models/Offer');

/**
 * Applies active offers to a list of products or a single product.
 * Calculates the best discount (lowest price) for each product.
 */
const applyActiveOffers = async (products) => {
    const isSingle = !Array.isArray(products);
    const productList = isSingle ? [products] : products;

    const now = new Date();
    const activeOffers = await Offer.find({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now }
    });

    if (activeOffers.length === 0) {
        return products;
    }

    const processedProducts = productList.map(product => {
        // Convert to plain object if it's a Mongoose document
        const p = product.toObject ? product.toObject() : { ...product };

        let bestDiscountedPrice = p.price;
        let appliedOffer = null;

        activeOffers.forEach(offer => {
            let isEligible = false;

            if (offer.applyToAll) {
                isEligible = true;
            } else if (offer.products && offer.products.some(id => id.toString() === p._id.toString())) {
                isEligible = true;
            } else if (offer.categories && offer.categories.some(id => id.toString() === p.category?.toString())) {
                // Note: In your model, category is a String, but in Offer categories is ObjectId.
                // If categories are linked, we'd need to populate or handle ID comparison.
                isEligible = true;
            }

            if (isEligible) {
                let currentDiscountedPrice = p.price;
                if (offer.discountType === 'percentage') {
                    currentDiscountedPrice = p.price * (1 - offer.discountValue / 100);
                } else {
                    currentDiscountedPrice = Math.max(0, p.price - offer.discountValue);
                }

                if (currentDiscountedPrice < bestDiscountedPrice) {
                    bestDiscountedPrice = currentDiscountedPrice;
                    appliedOffer = {
                        _id: offer._id,
                        title: offer.title,
                        discountType: offer.discountType,
                        discountValue: offer.discountValue
                    };
                }
            }
        });

        // If a dynamic offer is better than the static discountPrice, use it
        if (p.discountPrice && p.discountPrice < bestDiscountedPrice) {
            bestDiscountedPrice = p.discountPrice;
        }

        return {
            ...p,
            salePrice: bestDiscountedPrice < p.price ? bestDiscountedPrice : null,
            appliedOffer: appliedOffer
        };
    });

    return isSingle ? processedProducts[0] : processedProducts;
};

module.exports = { applyActiveOffers };
