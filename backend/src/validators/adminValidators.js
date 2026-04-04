const { body, param, query } = require('express-validator');

const productValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['leather-jackets', 'leather-belts', 'leather-wallets'])
    .withMessage('Category must be leather-jackets, leather-belts, or leather-wallets'),

  body('moq')
    .notEmpty()
    .withMessage('Minimum order quantity is required')
    .isInt({ min: 1 })
    .withMessage('MOQ must be a positive integer'),

  body('status')
    .optional()
    .isIn(['active', 'draft', 'archived'])
    .withMessage('Status must be active, draft, or archived'),

  body('pricingTiers')
    .notEmpty()
    .withMessage('At least one pricing tier is required')
    .custom((value) => {
      let tiers;
      if (typeof value === 'string') {
        try {
          tiers = JSON.parse(value);
        } catch {
          throw new Error('Pricing tiers must be valid JSON');
        }
      } else {
        tiers = value;
      }

      if (!Array.isArray(tiers) || tiers.length === 0) {
        throw new Error('At least one pricing tier is required');
      }

      for (let i = 0; i < tiers.length; i++) {
        const tier = tiers[i];
        if (!tier.minQuantity || tier.minQuantity < 1) {
          throw new Error(`Tier ${i + 1}: minQuantity must be at least 1`);
        }
        if (!tier.pricePerUnit || tier.pricePerUnit <= 0) {
          throw new Error(`Tier ${i + 1}: pricePerUnit must be greater than 0`);
        }
        if (tier.maxQuantity !== null && tier.maxQuantity !== undefined && tier.maxQuantity < tier.minQuantity) {
          throw new Error(`Tier ${i + 1}: maxQuantity cannot be less than minQuantity`);
        }
      }
      return true;
    }),
];

const updateProductValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),

  body('category')
    .optional()
    .trim()
    .isIn(['leather-jackets', 'leather-belts', 'leather-wallets'])
    .withMessage('Category must be leather-jackets, leather-belts, or leather-wallets'),

  body('moq')
    .optional()
    .isInt({ min: 1 })
    .withMessage('MOQ must be a positive integer'),

  body('status')
    .optional()
    .isIn(['active', 'draft', 'archived'])
    .withMessage('Status must be active, draft, or archived'),

  body('pricingTiers')
    .optional()
    .custom((value) => {
      let tiers;
      if (typeof value === 'string') {
        try {
          tiers = JSON.parse(value);
        } catch {
          throw new Error('Pricing tiers must be valid JSON');
        }
      } else {
        tiers = value;
      }

      if (!Array.isArray(tiers) || tiers.length === 0) {
        throw new Error('At least one pricing tier is required');
      }

      for (let i = 0; i < tiers.length; i++) {
        const tier = tiers[i];
        if (!tier.minQuantity || tier.minQuantity < 1) {
          throw new Error(`Tier ${i + 1}: minQuantity must be at least 1`);
        }
        if (!tier.pricePerUnit || tier.pricePerUnit <= 0) {
          throw new Error(`Tier ${i + 1}: pricePerUnit must be greater than 0`);
        }
        if (tier.maxQuantity !== null && tier.maxQuantity !== undefined && tier.maxQuantity < tier.minQuantity) {
          throw new Error(`Tier ${i + 1}: maxQuantity cannot be less than minQuantity`);
        }
      }
      return true;
    }),
];

const orderStatusValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID'),

  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
];

const mongoIdParam = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

const orderTrackingValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID'),
  body('number')
    .trim()
    .notEmpty()
    .withMessage('Tracking number is required'),
  body('carrier')
    .optional()
    .trim(),
  body('url').optional().trim(),
];

const bulkOrderPatchValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid bulk order ID'),
  body('status')
    .optional()
    .isIn(['pending', 'quoted', 'accepted', 'rejected', 'completed'])
    .withMessage('Invalid status'),
  body('adminNotes')
    .optional()
    .trim(),
];

module.exports = {
  productValidator,
  updateProductValidator,
  orderStatusValidator,
  orderTrackingValidator,
  bulkOrderPatchValidator,
  mongoIdParam,
};
