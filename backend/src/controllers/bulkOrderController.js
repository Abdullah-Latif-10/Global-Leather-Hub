const BulkOrder = require('../models/BulkOrder');
const { sendBulkOrderNotification } = require('../utils/email');

// POST /api/bulk-orders
const createBulkOrder = async (req, res, next) => {
  try {
    const { products, totalEstimatedValue, currency } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one product is required' });
    }

    const bulkOrder = new BulkOrder({
      user: req.user._id,
      products,
      totalEstimatedValue,
      currency: currency || 'USD',
      status: 'pending'
    });

    await bulkOrder.save();

    // Send notification email to admin
    try {
      await sendBulkOrderNotification(bulkOrder);
    } catch (emailError) {
      console.warn('Bulk order notification email failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Bulk order quotation request submitted successfully',
      data: { bulkOrder }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/bulk-orders (for user to view their requests)
const getUserBulkOrders = async (req, res, next) => {
  try {
    const bulkOrders = await BulkOrder.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'username email');

    res.status(200).json({
      success: true,
      data: { bulkOrders }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/bulk-orders/:id
const getBulkOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bulkOrder = await BulkOrder.findOne({
      _id: id,
      user: req.user._id
    }).populate('user', 'username email');

    if (!bulkOrder) {
      return res.status(404).json({ success: false, message: 'Bulk order not found' });
    }

    res.status(200).json({
      success: true,
      data: { bulkOrder }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBulkOrder,
  getUserBulkOrders,
  getBulkOrder
};