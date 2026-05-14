const Product = require('../models/Product');
const { applyActiveOffers } = require('../utils/offerUtils');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        const processedProducts = await applyActiveOffers(products);
        res.json(processedProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            const processedProduct = await applyActiveOffers(product);
            res.json(processedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, brand, price, description, image, images, category, countInStock, weight, isFeatured, onSale, discountPrice, seoTitle, seoDescription, seoKeywords, variants } = req.body;

        const product = await Product.create({
            name,
            brand,
            price,
            description,
            image,
            images,
            category,
            countInStock,
            weight: weight || 0,
            isFeatured,
            onSale,
            discountPrice,
            seoTitle,
            seoDescription,
            seoKeywords,
            variants: variants || []
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const { name, brand, price, description, image, images, category, countInStock, weight, isFeatured, onSale, discountPrice, seoTitle, seoDescription, seoKeywords, variants } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.brand = brand || product.brand;
            product.price = price !== undefined ? price : product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.images = images || product.images;
            product.category = category || product.category;
            product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
            product.weight = weight !== undefined ? weight : product.weight;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.onSale = onSale !== undefined ? onSale : product.onSale;
            product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
            product.seoTitle = seoTitle !== undefined ? seoTitle : product.seoTitle;
            product.seoDescription = seoDescription !== undefined ? seoDescription : product.seoDescription;
            product.seoKeywords = seoKeywords !== undefined ? seoKeywords : product.seoKeywords;
            product.variants = variants !== undefined ? variants : product.variants;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct
};
