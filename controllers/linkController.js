const { Link } = require('../models/model');

// @desc    Get all active links (for public display)
// @route   GET /api/links
// @access  Public
const getLinks = async (req, res) => {
  try {
    const links = await Link.find({ active: true }).sort('order');
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all links (admin)
// @route   GET /api/links/all
// @access  Private/Admin
const getAllLinks = async (req, res) => {
  try {
    const links = await Link.find().sort('order');
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a link
// @route   POST /api/links
// @access  Private/Admin
const createLink = async (req, res) => {
  try {
    const link = new Link(req.body);
    const created = await link.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a link
// @route   PUT /api/links/:id
// @access  Private/Admin
const updateLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (link) {
      Object.assign(link, req.body);
      const updated = await link.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Link not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a link
// @route   DELETE /api/links/:id
// @access  Private/Admin
const deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (link) {
      await link.deleteOne();
      res.json({ message: 'Link removed' });
    } else {
      res.status(404).json({ message: 'Link not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLinks, getAllLinks, createLink, updateLink, deleteLink };