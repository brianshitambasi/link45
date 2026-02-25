const { Product } = require('../models/model');
const { uploadToCloudinary } = require('../utils/cloudinary');

// @desc    Get all products (with optional category filter)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.featured) {
      filter.isFeatured = req.query.featured === 'true';
    }
    const products = await Product.find(filter).populate('category', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (with optional image upload)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      discountedPrice: req.body.discountedPrice ? parseFloat(req.body.discountedPrice) : undefined,
      category: req.body.category,
      images: imageUrl ? [imageUrl] : [],
      stock: parseInt(req.body.stock) || 0,
      isFeatured: req.body.isFeatured === 'true',
      tags: req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [],
    };

    const product = new Product(productData);
    const created = await product.save();
    res.status(201).json(created);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product (with optional new image)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields from body
    if (req.body.name) product.name = req.body.name;
    if (req.body.description) product.description = req.body.description;
    if (req.body.price) product.price = parseFloat(req.body.price);
    if (req.body.discountedPrice) product.discountedPrice = parseFloat(req.body.discountedPrice);
    if (req.body.category) product.category = req.body.category;
    if (req.body.stock) product.stock = parseInt(req.body.stock);
    if (req.body.isFeatured !== undefined) product.isFeatured = req.body.isFeatured === 'true';
    if (req.body.tags) product.tags = req.body.tags.split(',').map(t => t.trim());

    // Handle new image upload
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      product.images = [imageUrl]; // replace existing images
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    console.error('Update product error:', error);
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

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};