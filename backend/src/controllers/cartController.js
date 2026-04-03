const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name pricingTiers');
    const totalAmount = cart ? cart.items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0) : 0;

    res.status(200).json({
      success: true,
      data: {
        items: cart?.items || [],
        totalAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive number' });
    }

    const product = await Product.findOne({ _id: productId, status: 'active' }).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found or not active' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += qty;
    } else {
      cart.items.push({
        product: product._id,
        productName: product.name,
        quantity: qty,
        pricePerUnit: product.pricingTiers?.[0]?.pricePerUnit ?? 0,
      });
    }

    await cart.save();

    const totalAmount = cart.items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: {
        items: cart.items,
        totalAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/item/:productId
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    const totalAmount = cart.items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: { items: cart.items, totalAmount },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: { items: cart.items, totalAmount: 0 },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
