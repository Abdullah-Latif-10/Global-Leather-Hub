const express = require('express');
const router = express.Router();

const {
  createBulkOrder,
  getUserBulkOrders,
  getBulkOrder,
} = require('../controllers/bulkOrderController');

const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createBulkOrder);
router.get('/', getUserBulkOrders);
router.get('/:id', getBulkOrder);

module.exports = router;