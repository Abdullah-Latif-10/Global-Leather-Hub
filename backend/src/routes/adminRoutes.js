const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
  getDashboardAnalytics,
  getAllProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderTracking,
  getAllBulkOrders,
  updateBulkOrder,
  getAllCustomers,
} = require('../controllers/adminController');

const {
  productValidator,
  updateProductValidator,
  orderStatusValidator,
  orderTrackingValidator,
  bulkOrderPatchValidator,
  mongoIdParam,
} = require('../validators/adminValidators');

const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');


router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);
router.get('/dashboard/analytics', getDashboardAnalytics);

// Products
router.get('/products', getAllProductsAdmin);
router.get('/products/:id', mongoIdParam, validate, getProductById);
router.post('/products', uploadImage.array('images', 5), productValidator, validate, createProduct);
router.put('/products/:id', uploadImage.array('images', 5), updateProductValidator, validate, updateProduct);
router.delete('/products/:id', mongoIdParam, validate, deleteProduct);

// Orders
router.get('/orders', getAllOrders);
router.get('/orders/:id', mongoIdParam, validate, getOrderById);
router.patch('/orders/:id/status', orderStatusValidator, validate, updateOrderStatus);
router.patch('/orders/:id/tracking', orderTrackingValidator, validate, updateOrderTracking);

// Bulk quotation requests
router.get('/bulk-orders', getAllBulkOrders);
router.patch('/bulk-orders/:id', bulkOrderPatchValidator, validate, updateBulkOrder);

// Customers
router.get('/customers', getAllCustomers);

module.exports = router;
