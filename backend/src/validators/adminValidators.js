const { body, param, query } = require('express-validator');
const { parsePricingTiersPayload, normalizePricingTiers } = require('../utils/pricingTiers');

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
    .custom((value, { req }) => {
      const { tiers, error } = parsePricingTiersPayload(value);
      if (error) {
        throw new Error(error);
      }

      const { error: normalizeError } = normalizePricingTiers(tiers, {
        basePrice: req?.body?.basePrice,
      });
      if (normalizeError) {
        throw new Error(normalizeError);
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
    .custom((value, { req }) => {
      const { tiers, error } = parsePricingTiersPayload(value);
      if (error) {
        throw new Error(error);
      }

      const { error: normalizeError } = normalizePricingTiers(tiers, {
        basePrice: req?.body?.basePrice,
      });
      if (normalizeError) {
        throw new Error(normalizeError);
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
    .withMessage('Invalid order status. Must be one of: pending, confirmed, processing, shipped, delivered, cancelled'),
];

const mongoIdParam = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];


module.exports = {
  productValidator,
  updateProductValidator,
  orderStatusValidator,
  
  mongoIdParam,
};
