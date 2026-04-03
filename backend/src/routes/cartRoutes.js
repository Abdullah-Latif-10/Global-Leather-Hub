const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');

router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/item/:productId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
