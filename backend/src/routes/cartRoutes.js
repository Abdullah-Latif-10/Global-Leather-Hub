const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart, createStripeCheckoutSession } = require('../controllers/cartController');

router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.patch('/item/:productId', updateCartItem);
router.delete('/item/:productId', removeFromCart);
router.delete('/', clearCart);
router.post('/checkout-session', createStripeCheckoutSession);

module.exports = router;
